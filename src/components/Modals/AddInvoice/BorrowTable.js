import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';

class BorrowTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: props.list || []
     };
  }

  componentDidUpdate(prevProps){
    if (prevProps.list !== this.props.list) {
      if(this.props.list){
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          lists: this.props.list,
        });
      }
    }
  }

  onDelete = (id) => {
    const list = this.state.lists;
    const newArr = list.filter(it => it.id !== id) || [];
    this.props.onChangeData(newArr);
  }

  render() {
    const { list } = this.props;
    const columns = [{
      title: '事由',
      dataIndex: 'reason',
    }, {
      title: '借款单号',
      dataIndex: 'invoiceNo',
    }, {
      title: '本次核销',
      dataIndex: 'money',
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record ? `${moment(Number(record.createTime)).format('YYYY-MM-DD')}` : '-'}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          <span className="deleteColor" onClick={() => this.onDelete(record.id)}>删除</span>
        </span>
      ),
    }];
    // if (list && list[0].expandCostDetailFieldVos) {
    //   const arr = [];
    //   list[0].expandCostDetailFieldVos.forEach(it => {
    //     arr.push({
    //       title: it.name,
    //       dataIndex: it.field,
    //     });
    //   });
    //   columns.splice(2, 1, ...arr);
    // }
    return (
      <div style={{ marginTop: '24px' }}>
        <Table
          dataSource={list}
          columns={columns}
          scroll={{x: list.length > 6 ? '1200px' : '1000px'}}
          rowKey="field"
          pagination={false}
        />
      </div>
    );
  }
}

export default BorrowTable;