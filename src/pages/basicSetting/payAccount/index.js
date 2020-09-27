import React, { Component } from 'react';
import { Table, Divider, Button, Tag, message, Modal, Tooltip } from 'antd';
import { connect } from 'dva';
import { accountType, getArrayValue } from '@/utils/constants';
import AddAccount from './components/AddModal';
import { signStatus } from '../../../utils/constants';

const { confirm } = Modal;
@connect(({ loading, account, session }) => ({
  loading: loading.effects['account/list'] || false,
  list: account.list,
  query: account.query,
  userInfo: session.userInfo,
  total: account.total,
  check: account.check,
  signRes: account.signRes,
}))
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { query } = this.props;
    this.onQuery({ ...query });
  }

  onQuery = (payload) => {
    const { userInfo } = this.props;
    Object.assign(payload, { companyId: userInfo.companyId || '' });
    this.props.dispatch({
      type: 'account/list',
      payload,
    });
  }

  onDelete = (id) => {
    const { userInfo, query } = this.props;
    this.props.dispatch({
      type: 'account/del',
      payload: {
        id,
        companyId: userInfo.companyId || ''
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({
        ...query,
      });
    });
  }

  handleVisibleChange = (id) => {
    const _this = this;
    this.props.dispatch({
      type: 'account/delPer',
      payload: {
        id,
      }
    }).then(() => {
      if (this.props.check) {
        confirm({
          title: '请确认是否删除?',
          content: '删除不能恢复',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.onDelete(id);
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      } else {
        message.error('已关联提报单据，无法删除');
      }
    });
  }

  onOk = () => {
    const { query } = this.props;
    this.onQuery({ ...query });
  }

  sign = (alipayAccount) => {
    this.props.dispatch({
      type: 'account/sign',
      payload: {
        alipayAccount
      }
    }).then(() => {
      const { signRes } = this.props;
      if (signRes) {
        window.location.href = signRes;
      }
    });
  }

  render() {
    const { list, query, total, loading } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      render: (_, record) => (
        <span>
          <span style={{ marginRight: '8px' }}>{record.name}</span>
          { record.isDefault && <Tag color="blue">默认</Tag> }
          { record.status === 0 && <Tag color="red">已停用</Tag> }
        </span>
      ),
      width: 140
    }, {
      title: '账户类型',
      dataIndex: 'type',
      render: (_, record) => (
        <span>{getArrayValue(record.type, accountType)}</span>
      ),
      width: 100
    }, {
      title: '签约状态',
      dataIndex: 'signStatus',
      render: (_, record) => (
        <>
          {
            record.type === 1 ?
              <span>{getArrayValue(record.signStatus, signStatus)}</span>
              :
              '-'
          }
        </>
      ),
      width: 100
    }, {
      title: '备注',
      dataIndex: 'note',
      width: 160,
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
          <span className="deleteColor" onClick={() => this.handleVisibleChange(record.id)}>删除</span>
          <Divider type="vertical" />
          <AddAccount title="edit" record={record} onOk={() => this.onOk()}>
            <a>编辑</a>
          </AddAccount>
          {
            record.type === 1 && !record.signStatus &&
            <>
              <Divider type="vertical" />
              <a onClick={() => this.sign(record.account)}>签约</a>
            </>
           }
        </span>
      ),
      width: 100,
      className: 'fixCenter'
    }];
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <AddAccount onOk={this.onOk} title="add">
              <Button type="primary">新增付款账户</Button>
            </AddAccount>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{
            current: query.pageNo,
            total,
            onChange: (pageNumber) => {
              this.onQuery({
                pageNo: pageNumber,
                pageSize: query.pageSize
              });
            },
            size: 'small',
            showTotal: () => (`共${total}条数据`),
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

export default Account;
