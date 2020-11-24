import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Popconfirm, Divider, Button, message, Tooltip } from 'antd';
import AddModal from './components/AddModal';

@connect(({ auth, loading }) => ({
  loading: loading.effects['auth/approveList'] || false,
  list: auth.approveList,
  query: auth.approveQuery,
  total: auth.approveTotal,
}))
class ApproveIndex extends Component {
  static propTypes = {
    list: PropTypes.array,
    query: PropTypes.object,
    total: PropTypes.number,
  }

  state = {
    visible: false,
  }

  componentDidMount() {
    this.onQuery({
      pageNo:1,
      pageSize: 10,
    });
  }

  onOk = () => {
    const { query } = this.props;
    this.onQuery({
      ...query,
    });
  }

  onDelete = (id) => {
    const {
      query,
      dispatch,
    } = this.props;
    dispatch({
      type: 'auth/approveDel',
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

  onLink = (id) => {
    this.props.onLink(id);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'auth/approveList',
      payload,
    });
  }

  render() {
    const {
      list,
      total,
      query,
      loading,
    } = this.props;
    const { visible } = this.state;
    const columns = [{
      title: '角色名称',
      dataIndex: 'approveRoleName',
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
            !record.isDefault &&
            <Popconfirm
              title="确认删除该角色吗?"
              onConfirm={() => this.onDelete(record.id)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          }
          {
            !record.isDefault &&
            <Divider type="vertical" />
          }
          <AddModal title="edit" isSupperAdmin={record.isDefault} onOk={this.onOk} detail={record} visible={visible}>
            {
              record.isDefault ?
                <a>查看</a>
              :
                <a>编辑</a>
            }
          </AddModal>
          <Divider type="vertical" />
          <a onClick={() => this.onLink(record.id)}>设置人员</a>
        </span>
      ),
      width: '190px',
      className: 'fixCenter'
    }];
    return (
      <div className="content-dt">
        <AddModal title="add" onOk={this.onOk} detail={{}}>
          <Button type="primary" className="m-b-16">新增</Button>
        </AddModal>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
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

export default ApproveIndex;

