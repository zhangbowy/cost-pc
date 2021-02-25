/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import { connect } from 'dva';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import style from './index.scss';
import { sortBy } from '../../../utils/common';

// const labelInfo = {
//   costName: '支出类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@connect(({ workbench }) => ({
  associateLists: workbench.associateLists,
  waitLoanSum: workbench.waitLoanSum,
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
    this.props.dispatch({
      type: 'workbench/associateLists',
      payload: {
        pageNo: 1,
        pageSize: 1000,
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
    const { details, selectedRowKeys } = this.state;
    const newArr = details.sort(sortBy('createTime', true));
    this.props.onAddBorrow(newArr.map((it, index)=> { return {...it, sort: index}; }),selectedRowKeys);
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
