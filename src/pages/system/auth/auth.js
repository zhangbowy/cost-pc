

import React from 'react';
import { Button, Table, Divider, Popconfirm, message, Tooltip } from 'antd';
import { connect } from 'dva';
import AddAuth from './components/AddAuth';

@connect(({ loading, auth, session }) => ({
  loading: loading.effects['auth/list'] || false,
  list: auth.list,
  query: auth.query,
  total: auth.total,
  userInfo: session.userInfo,
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
    this.onQuery({...query});
  }

  onOk = () => {
    const {
      query,
    } = this.props;
    this.onQuery({
      ...query
    });
  }

  onLink = (id) => {
    this.props.onLink(id);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'auth/list',
      payload,
    });
  }

  onDelete = (id) => {
    const {
      query,
      dispatch,
    } = this.props;
    dispatch({
      type: 'auth/del',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({
        ...query
      });
    });
  }

  render() {
    const {
      visible,
    } = this.state;
    const {
      list,
      query,
      total,
      loading,
      userInfo,
    } = this.props;
    const columns = [{
      title: '角色名称',
      dataIndex: 'roleName',
    }, {
      title: '角色简介',
      dataIndex: 'note',
      width: 560,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            !record.isSupperAdmin ?
              <Popconfirm
                title="确认删除该角色吗?"
                onConfirm={() => this.onDelete(record.id)}
              >
                <span className="deleteColor">删除</span>
              </Popconfirm>
              :
              <span className="fs-14 c-black-45">删除</span>
          }
          <Divider type="vertical" />
          <AddAuth isSupperAdmin={record.isSupperAdmin} onOk={this.onOk} data={record} visible={visible}>
            {
              record.isSupperAdmin === 1 ||
              (record.isSupperAdmin === 2 && userInfo.adminType !== 1) ?
                <a>查看</a>
              :
                <a>编辑</a>
            }
          </AddAuth>
          <Divider type="vertical" />
          {
            userInfo.adminType === 1 ||
            (userInfo.adminType === 2 && (record.isSupperAdmin !== 1)) ||
            !record.isSupperAdmin ?
              <a onClick={() => this.onLink(record.id)}>设置人员</a>
              :
              <span className="fs-14 c-black-45">设置人员</span>
          }
        </span>
      ),
      width: '190px',
      className: 'fixCenter'
    }];
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <AddAuth onOk={this.onOk} visible={visible}>
              <Button type="primary">新增角色</Button>
            </AddAuth>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey="id"
          pagination={{
            current: query.pageNo,
            total,
            showTotal: () => (`共${total}条数据`),
            onChange: (pageNumber) => {
              this.onQuery({
                pageNo: pageNumber,
                pageSize: query.pageSize
              });
            },
            size:'small',
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (cur, size) => {
              this.onQuery({
                pageNo: cur,
                pageSize: size
              });
            }
          }}
        />
      </div>
    );
  }
}

export default Auth;
