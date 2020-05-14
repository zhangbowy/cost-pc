import React, { Component } from 'react';
import { Table } from 'antd';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const columns = [{
      title: '字段',
      dataIndex: '',
    }, {
      title: '是否启用',
      dataIndex: '',
    }, {
      title: '是否必填',
      dataIndex: '',
    }, {
      title: '备注（选填）',
      dataIndex: '',
    }, {
      title: '其他操作',
      dataIndex: '',
    }];
    return (
      <div style={{ padding: '32px 19px 0 29px', width: '100%' }}>
        <Table
          columns={columns}
        />
      </div>
    );
  }
}

export default Field;
