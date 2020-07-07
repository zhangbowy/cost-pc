

import React from 'react';
import { Button, Table, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import AddAuth from './components/AddAuth';

@connect(({ loading, auth }) => ({
  loading: loading.effects['auth/list'] || false,
  list: auth.list,
  query: auth.query,
  total: auth.total,
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
    this.props.history.push(`/system/auth/${id}`);
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
    } = this.props;
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
          {
            !record.isSupperAdmin &&
            <Popconfirm
              title="确认删除该角色吗?"
              onConfirm={() => this.onDelete(record.id)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          }
          {
            !record.isSupperAdmin &&
            <Divider type="vertical" />
          }
          <AddAuth isSupperAdmin={record.isSupperAdmin} onOk={this.onOk} data={record} visible={visible}>
            {
              record.isSupperAdmin ?
                <a>查看</a>
              :
                <a>编辑</a>
            }
          </AddAuth>
          <Divider type="vertical" />
          <a onClick={() => this.onLink(record.id)}>设置人员</a>
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
          {/* <div className="head_rg">
            <span>排序</span>
          </div> */}
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
