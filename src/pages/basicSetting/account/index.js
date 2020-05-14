import React, { Component } from 'react';
import { Table, Divider } from 'antd';
import AddAccount from './components/AddModal';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: ''
    }, {
      title: '',
      dataIndex: '账户类型'
    }, {
      title: '',
      dataIndex: '备注'
    }, {
      title: '',
      dataIndex: '操作',
      render: (_, record) => (
        <div>
          <AddAccount data={record}>
            <a>编辑</a>
          </AddAccount>
          <Divider />
          <a>删除</a>
        </div>
      )
    }];
    return (
      <div>
        <Table
          columns={columns}
        />
      </div>
    );
  }
}

export default Account;
