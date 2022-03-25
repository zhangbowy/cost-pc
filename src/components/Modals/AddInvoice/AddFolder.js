/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Tooltip, Tag, Popover, message } from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import { connect } from 'dva';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
import style from './index.scss';
import { getArrayColor, classifyIcon } from '../../../utils/constants';
import { ddPreviewImage } from '../../../utils/ddApi';

@connect(({ costGlobal, global }) => ({
  listFolder: costGlobal.folderList,
  expenseList: global.expenseList,
  folderSum: costGlobal.folderSum,
  userDeps: costGlobal.userDeps,
  currencyList: global.currencyList,
  checkLinkCost: costGlobal.checkLinkCost,
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
      searchContent: '',
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
    const { officeId, isShowToast } = this.props;
    if (isShowToast && !officeId) {
      message.error('请先填写所在公司');
      return;
    }
    await this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageNo: 1,
        pageSize: 1000,
        officeId: officeId || ''
      }
    });
    await this.props.dispatch({
      type: 'global/expenseList',
      payload: {
        id: this.props.invoiceId
      }
    }).then(() => {
      const { expenseList, listFolder, list } = this.props;
      console.log('AddFolder -> onShow -> list', list);
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
      const newList = [...list];
      const newArr = [];
      newList.forEach(it => {
        let obj = {
          ...it,
          costSum: ((it.costSum * 1000)/10).toFixed(0)-0,
        };
        const newCost = [];
        if (it.costDetailShareVOS) {
          it.costDetailShareVOS.forEach(its => {
            newCost.push({
              ...its,
              shareAmount: ((its.shareAmount * 1000)/10).toFixed(0)-0,
            });
          });
        }
        obj = {
          ...obj,
          costDetailShareVOS: newCost,
        };
        if (it.id) {
          newArr.push(obj);
        }
      });
      const keys = list.map(it => it.detailFolderId) || [];
      this.setState({
        visible: true,
        selectedRowKeys: Array.from(new Set(keys)) || [],
        selectedRows: newArr.filter(it => it.detailFolderId),
        details: list,
        folderList: arr,
      });
    });

  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
      searchContent: ''
    });
  }

  //  提交
  handleOk = () => {
    const { selectedRows } = this.state;
    // const { currencyList } = this.props;
    // const newArrs = [...selectedRows];
    const arrs = [];
    selectedRows.forEach(it => {
      arrs.push({
        id: it.id,
        applicationInvoiceId: it.applicationInvoiceId
      });
    });
    this.props.dispatch({
      type: 'costGlobal/checkLinkCost',
      payload: {
        list: arrs,
      }
    }).then(() => {
      const { checkLinkCost } = this.props;
      if (checkLinkCost.unassociatedCount) {
        Modal.confirm({
          title: `该申请单还有${checkLinkCost.unassociatedCount}条明细，是否同步导入`,
          okText: '是',
          cancelText: '否',
          onOk: () => {
            console.log('OK');
            const { folders } = checkLinkCost;
            const oldIds = selectedRows.map(it => it.id);
            const newArr = [...selectedRows];
            folders.forEach(it => {
              if (!oldIds.includes(it.id)) {
                newArr.push({
                  ...it,
                });
              }
            });
            this.handleHis(newArr);
          },
          onCancel: () => {
            this.handleHis(selectedRows);
          },
        });
      } else {
        this.handleHis(selectedRows);
      }
    });

  }

  handleHis = (selectedRows) => {
    const arr = [];
    const { currencyList } = this.props;
    console.log('🚀 ~ file: AddFolder.js ~ line 178 ~ AddFolder ~ selectedRows', selectedRows);
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
    console.log('🚀 ~ file: AddFolder.js ~ line 212 ~ AddFolder ~ arr', arr);
    if (arr && arr.length) {
      this.props.onAddCost(arr);
    }
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

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  onSearch = (e) => {
    this.setState({
      searchContent: e,
    });
    const { officeId, expenseList } = this.props;
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageSize: 100,
        pageNo: 1,
        searchContent: e,
        officeId: officeId || ''
      }
    }).then(() => {
      const { listFolder } = this.props;
      const ids = expenseList.map(it => it.id);
      const arr = [];
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
      this.setState({
        folderList: arr,
      });
    });
  }

  render() {
    const {
      children,
      folderSum,
      invoiceName,
    } = this.props;
    const {
      visible,
      selectedRowKeys,
      folderList,
      searchContent
    } = this.state;
    const columns = [{
      title: '支出类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={style.cateNames}>
          {
            record.disabled ?
              <Tooltip title={`【${invoiceName}】不支持该支出类别`} placement="bottomLeft">
                <i
                  className={`iconfont icon${record.icon}`}
                  style={{
                    color: getArrayColor(record.icon, classifyIcon[0]),
                    fontSize: '24px',
                    marginRight: '4px',
                    opacity: 0.25,
                  }}
                />
                <span style={{opacity: 0.25}}>{record.categoryName}</span>
                {
                  record.showAlitripIcon &&
                  <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
                }
              </Tooltip>
              :
              <>
                <i
                  className={`iconfont icon${record.icon}`}
                  style={{
                    color: getArrayColor(record.icon, classifyIcon[0]),
                    fontSize: '24px',
                    marginRight: '4px'
                  }}
                />
                <span>{record.categoryName}</span>
                {
                  record.showAlitripIcon &&
                  <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
                }
              </>
          }
        </span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span className={record.disabled ? style.disabled : ''}>{record.currencySumStr ?  `${record.costSumStr}(${record.currencySumStr})`: record.costSumStr}</span>
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
        <span className={record.disabled ? style.disabled : ''}>
          <span>{record.startTime ? moment(Number(record.startTime)).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(Number(record.endTime)).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      )
    }, {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: '100px',
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.note || ''}>
          <span className={record.disabled ? style.disabled : ''}>{record.note}</span>
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
    },
  ];
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
          title="账本导入"
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
              placeholder="请输入支出类别名称搜索"
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
              value={searchContent}
              onInput={e => this.setState({ searchContent: e.target.value })}
            />
            <span>未报销支出共计 {folderSum.totalCount}笔，{folderSum.costSumStr}</span>
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={folderList}
                pagination={false}
                rowKey="id"
                scroll={{ y: 332 }}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddFolder;
