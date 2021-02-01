import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Popconfirm, Divider, Button, message, Tooltip, Modal } from 'antd';
import ddImg from '@/assets/img/dingding.png';
import AddModal from './components/AddModal';

const { confirm } = Modal;
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

  again = () => {
    confirm({
      title: '确认将钉钉已设置好的审批角色，同步至鑫支出吗？',
      content: '如角色名称重复，同步后，会覆盖现有角色名称、人员、管理范围',
      okText: '继续同步',
      onOk: () => {
        this.props.dispatch({
          type: 'auth/syncApproveRole',
          payload: {}
        }).then(() => {
          message.success('数据同步中，请稍后查看');
          const { query } = this.props;
          this.onQuery({
            pageNo: 1,
            pageSize: query.pageSize
          });
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
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
      render: (_, record) => (
        <span>
          {record.approveRoleName}
          {
            record.isDing &&
              <img src={ddImg} className="m-l-8" alt="钉钉" style={{width: '16px', height: '16px'}} />
          }
        </span>
      )
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
          <Button type="primary" className="m-b-16 m-r-8">新增</Button>
        </AddModal>
        <Button type="default" onClick={() => this.again()}>同步钉钉审批角色</Button>
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

