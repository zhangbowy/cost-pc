/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React from 'react';
import { Button, Table, Divider } from 'antd';
import { connect } from 'dva';
import AddAuth from './components/AddAuth';

@connect(({ loading, auth }) => ({
  loading: loading.effects['auth/list'] || false,
  list: auth.list,
  query: auth.query,
}))
class Auth extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    console.log(query);
    this.onQuery({...query});
  }

  onOk = () => {
    this.setState({
      visible: false,
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'auth/list',
      payload,
    });
  }

  render() {
    const {
      visible,
    } = this.state;
    const {
      list,
      query,
    } = this.props;
    console.log(list);
    const columns = [{
      title: '角色名称',
      dataIndex: 'roleName',
    }, {
      title: '角色简介',
      dataIndex: 'note',
      render: (text) => (
        <span>{ text || '-' }</span>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <a className="deleteColor">删除</a>
          <Divider type="vertical" />
          <AddAuth onOk={this.onOk} data={record} visible={visible}>
            <a>编辑</a>
          </AddAuth>
        </span>
      )
    }];
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <AddAuth onOk={this.onOk} visible={visible}>
              <Button type="primary">新增角色</Button>
            </AddAuth>
          </div>
          <div className="head_rg">
            <span>排序</span>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            current: query.pageNo,
          }}
        />
      </div>
    );
  }
}

export default Auth;
