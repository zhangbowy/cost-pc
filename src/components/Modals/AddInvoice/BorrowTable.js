import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';

class BorrowTable extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  onDelete = (index) => {
    const { list, selectedRowKeys } = this.props;
    list.splice(index, 1);
    selectedRowKeys.splice(index, 1);
    this.props.onChangeData(list);
  }

  render() {
    const { list } = this.props;
    const columns = [{
      title: '事由',
      dataIndex: 'shiyou',
    }, {
      title: '借款单号',
      dataIndex: 'jkdh',
    }, {
      title: '本次核销',
      dataIndex: 'bchx',
    }, {
      title: '提交时间',
      dataIndex: 'tjsj',
      render: (_, record) => (
        <span>{record ? `-${moment(Number(record)).format('YYYY-MM-DD hh-mm-ss')}` : ''}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record, index) => (
        <span>
          <span className="deleteColor" onClick={() => this.onDelete(index)}>删除</span>
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
