/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import { connect } from 'dva';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
import style from './index.scss';
import { sortBy } from '../../../utils/common';

// const labelInfo = {
//   costName: '支出类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@connect(({ workbench, costGlobal }) => ({
  associateLists: workbench.associateLists,
  waitLoanSum: workbench.waitLoanSum,
  checkFolderList: costGlobal.checkFolderList
}))
@Form.create()
class AddApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      details: props.list || [], // 详细信息
      money:0,
      selectedRowKeys:[],
      selectedRows: [],
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
    const { officeId } = this.props;
    this.props.dispatch({
      type: 'workbench/associateLists',
      payload: {
        pageNo: 1,
        pageSize: 1000,
        officeId: officeId || ''
      }
    }).then(() => {
      console.log(this.props.associateLists);
      const { list } = this.props;
      console.log('list', list);
      this.setState({
        visible: true,
        selectedRowKeys: list.map(it => it.id) || [],
        selectedRows: list || [],
        details: list,
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
    const { details } = this.state;
    const newArr = details.sort(sortBy('createTime', true));
    const showArrs = newArr.filter(it => it.isAlitrip && !it.hasAlitripOrder);
    if (showArrs.length) {
      Modal.confirm({
        title: '该行程还未获得对应的发票，请获取对应发票之后再进行提交',
        okText: '稍后再提',
        cancelText: '仍要提交',
        onOk: () => {
          console.log('稍后再提交');
          this.onCancel();
        },
        onCancel: () => {
          this.changeErr(newArr);
        }
      });
    } else {
      this.changeErr(newArr);
      // this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
      // this.onCancel();
    }
  }

  changeErr = (newArr) => {
    const { selectedRowKeys } = this.state;
    const ids = newArr.filter(it => it.isAlitrip && it.hasAlitripOrder);
    if (ids && ids.length) {
      this.props.dispatch({
        type: 'costGlobal/checkFolderAlc',
        payload: {
          list: ids.map(it => it.applicationId),
        }
      }).then(() => {
        const { checkFolderList, costList } = this.props;
        const newCheckList = [];
        checkFolderList.forEach(it => {
          const costDetailShareVOS = [];
          const obj = {
            ...it,
            key: it.id,
            folderType: 'folder',
            costSum: it.costSum/100,
            detailFolderId: it.id,
          };
          if (it.costDetailShareVOS) {
            it.costDetailShareVOS.forEach(item => {
              costDetailShareVOS.push({
                ...item,
                shareAmount: item.shareAmount/100,
              });
            });
          }
          newCheckList.push({
            ...obj,
            costDetailShareVOS,
            currencyId: it.currencyId || '-1',
          });
        });
        const checkIds = costList.map(it => it.id || it.detailFolderId);
        let arrs = [];
        console.log('没有对比的数据', costList);
        if (costList && costList.length) {
          newCheckList.forEach(item => {
            if (!checkIds.includes(item.id || item.detailFolderId)) {
              arrs.push(item);
            }
          });
        } else {
          arrs = [...newCheckList];
        }
        console.log('对比之后的arr', arrs);
        if (arrs.length) {
          Modal.confirm({
            title: '是否导入该申请单所有行程的支出明细',
            okText: '同步导入',
            cancelText: '自行添加',
            onOk: () => {
              const costs = [...costList, ...arrs];
              this.props.onAddCost(costs);
              this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
              this.onCancel();
            },
            onCancel: () => {
              this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
              this.onCancel();
            }
          });
        } else {
          this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
          this.onCancel();
        }
      });
    } else {
      this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
      this.onCancel();
    }

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
      type: 'workbench/associateLists',
      payload: {
        pageSize: 100,
        pageNo: 1,
        search: e,
      }
    });
  }

  render() {
    const {
      children,
      associateLists,
      // waitLoanSum
    } = this.props;
    const {
      visible,
      selectedRowKeys,
    } = this.state;
    const columns = [
      {
        title: '事由',
        dataIndex: 'reason',
        render: (text) => (
          <span>
            <Tooltip placement="topLeft" title={text || ''}>
              <span className="eslips-2">{text}</span>
            </Tooltip>
          </span>
        ),
      },
      {
        title: '申请单号',
        dataIndex: 'invoiceNo',
        render: (_, record) => (
          <span>
            <span>{record.invoiceNo}</span>
            {
              record.isAlitrip &&
              <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
            }
          </span>
        )
      },
      {
        title: '金额（元）',
        dataIndex: 'applicationSum',
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },{
        title: '提交时间',
        dataIndex: 'createTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };

    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="选择申请单"
          visible={visible}
          width="880px"
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
            {/* 待核销金额总计：¥{waitLoanSum.waitAssessSumAll ? waitLoanSum.waitAssessSumAll/100 : 0} */}
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={associateLists}
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

export default AddApply;
