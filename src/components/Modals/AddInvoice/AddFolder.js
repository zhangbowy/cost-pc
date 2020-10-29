/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Tooltip, Divider, Tag, Popover } from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import { connect } from 'dva';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import style from './index.scss';
import AddCost from './AddCost';
import { getArrayColor, classifyIcon } from '../../../utils/constants';

// const labelInfo = {
//   costName: '费用类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@connect(({ costGlobal, global }) => ({
  listFolder: costGlobal.folderList,
  expenseList: global.expenseList,
  folderSum: costGlobal.folderSum,
  userDeps: costGlobal.userDeps,
  currencyList: global.currencyList,
}))
@Form.create()
class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      details: props.list || [], // 详细信息
      money:0,
      selectedRowKeys:[],
      selectedRows: [],
      folderList: [], // 列表
    };
  }

  componentDidUpdate(prevProps){
    if (prevProps.list !== this.props.list) {
      if(this.props.list){
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          details: this.props.list,
        });
      }
    }
  }

  onShow = async() => {
    await this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageNo: 1,
        pageSize: 1000,
      }
    });
    await this.props.dispatch({
      type: 'global/expenseList',
      payload: {
        id: this.props.invoiceId
      }
    }).then(() => {
      const { expenseList, listFolder } = this.props;
      console.log('AddFolder -> onShow -> listFolder', listFolder);
      const ids = expenseList.map(it => it.id);
      const arr = [];
      console.log(listFolder);
      listFolder.forEach(item => {
        if (!ids.includes(item.categoryId)) {
          arr.push({
            ...item,
            disabled: true,
          });
        } else {
          arr.push({
            ...item
          });
        }
      });
      const { list } = this.props;
      this.setState({
        visible: true,
        selectedRowKeys: list.map(it => it.detailFolderId) || [],
        selectedRows: list.filter(it => it.detailFolderId) || [],
        details: list,
        folderList: arr,
      });
    });

  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  //  提交
  handleOk = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    const { currencyList } = this.props;
    console.log(selectedRowKeys);
    console.log(selectedRows);
    const arr = [];
    selectedRows.forEach(it => {
      let currency = {};
      const costDetailShareVOS = [];
      if (it.currencyId && it.currencyId !== '-1') {
        // eslint-disable-next-line prefer-destructuring
        currency = currencyList.filter(its => its.id === it.currencyId)[0];
      }
      const obj = {
        ...it,
        key: it.id,
        folderType: 'folder',
        costSum: currency.id ? it.currencySum/100 : it.costSum/100,
        detailFolderId: it.id,
      };
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach(item => {
          costDetailShareVOS.push({
            ...item,
            shareAmount: currency.id ? item.currencySum/100 : item.shareAmount/100,
          });
        });
      }
      arr.push({
        ...obj,
        costDetailShareVOS,
        currencyId: it.currencyId || '-1',
        currencyName: currency.name || '',
        exchangeRate: currency.exchangeRate || 1,
        currencySymbol: currency.currencySymbol || '¥',
      });
    });
    this.props.onAddCost(arr);
    this.onCancel();
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    const money = _selectedRows.reduce((acc, cur) => {
      return acc+cur.waitAssessSum/100;
    }, 0);
    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
      details: _selectedRows,
      money,
    });
  };

  onSelect = (record, selected) => {
    const {
      selectedRows,
      selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    const money = selectedRows.reduce((acc, cur) => {
      return acc+cur.waitAssessSum/100;
    }, 0);
    this.setState({
      selectedRows,
      selectedRowKeys,
      details: selectedRows,
      money,
    });
  };

  onDelete = (id) => {
      const {
        selectedRows,
        selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
      this.setState({
        selectedRows,
        selectedRowKeys,
      });
  };

  onSearch = (e) => {
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageSize: 100,
        pageNo: 1,
        searchContent: e,
      }
    });
  }

  render() {
    const {
      children,
      invoiceId,
      userInfo,
      folderSum,
    } = this.props;
    const {
      visible,
      selectedRowKeys,
      folderList
    } = this.state;
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={style.cateNames}>
          <i
            className={`iconfont icon${record.icon}`}
            style={{
              color: getArrayColor(record.icon, classifyIcon),
              fontSize: '24px',
              marginRight: '4px'
            }}
          />
          <span>{record.categoryName}</span>
        </span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>{record.currencySumStr ?  `${record.costSumStr}(${record.currencySumStr})`: record.costSumStr}</span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">分摊明细：金额 ¥{record.costSum/100}{record.currencySumStr ? `(${record.currencySumStr})` : ''}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>¥{it.shareAmount/100}{it.currencySumStr ? `(${it.currencySumStr})` : ''}</span>
                      </p>
                    ))
                  }
                </div>
              )}
            >
              <Tag>分摊明细</Tag>
            </Popover>
          }
        </span>
      ),
      width: '250px'
    }, {
      title: '发生日期',
      dataIndex: 'happenTime',
      render: (_, record) => (
        <span>
          <span>{record.startTime ? moment(Number(record.startTime)).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(Number(record.endTime)).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      )
    }, {
      title: '费用备注',
      dataIndex: 'note',
      ellipsis: true,
      width: '100px',
      render: (text) => (
        <Tooltip placement="topLeft" title={text || ''}>
          <span>{text}</span>
        </Tooltip>
      )
    }, {
      title: '图片',
      dataIndex: 'imgUrl',
      render: (_, record) => (
        <span className={record.imgUrl && (record.imgUrl.length > 0) ? style.imgScroll : style.imgUrlTable}>
          {record.imgUrl && record.imgUrl.map((it, index) => (
            <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
              <img alt="图片" src={it.imgUrl} className={style.images} />
            </div>
          ))}
        </span>
      ),
      textWrap: 'word-break',
      width: '140px'
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          <span className="deleteColor" onClick={() => this.onDelete(record.id)}>删除</span>
          <Divider type="vertical" />
          <AddCost
            costType={1}
            id={record.id}
            detail={record}
            invoiceId={invoiceId}
            userInfo={userInfo}
            onAddCost={this.addCost}
            expandField={record.expandCostDetailFieldVos}
          >
            <a>编辑</a>
          </AddCost>
        </span>
      ),
      className: 'fixCenter',
      fixed: 'right'
    }];
    const rowSelection = {
      type: 'checkbox',
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };

    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="费用夹导入"
          visible={visible}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          onOk={() => this.handleOk()}
        >
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
            <Search
              placeholder="请输入单号、事由"
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
            />
            <span>未报销费用共计 {folderSum.totalCount}笔，{folderSum.costSumStr}</span>
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={folderList}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddFolder;
