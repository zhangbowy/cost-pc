import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Popconfirm, Divider, Button, message } from 'antd';
import SubHeader from '@/components/SubHeader';
import AddModal from './components/AddModal';

@connect(({ approveIndex, loading }) => ({
  loading: loading.effects['approveIndex/list'] || false,
  list: approveIndex.list,
  query: approveIndex.query,
  total: approveIndex.total,
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
      type: 'approveIndex/del',
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
    this.props.history.push(`/system/approve/${id}`);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'approveIndex/list',
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
      render: (text) => (
        <span>{ text || '-' }</span>
      )
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
      <div>
        <SubHeader
          type="role"
          content={{
            roleName: '审批角色',
            note: '支持将多个相同审批职能的人设置为同一个角色，用于审批流中按对应管理条件审批',
          }}
          {...this.props}
        />
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
      </div>
    );
  }
}

export default ApproveIndex;

