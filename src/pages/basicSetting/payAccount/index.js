import React, { Component } from 'react';
import { Button, message, Modal } from 'antd';
import { connect } from 'dva';
// import { accountType, getArrayValue } from '@/utils/constants';
import PageHead from '@/components/pageHead';
import AddAccount from './components/AddModal';
import style from './index.scss';
// import { signStatus } from '../../../utils/constants';

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
  // 删除账户

  delchange = (id) => {
    this.handleVisibleChange(id);
  }
  // 签约

  signChange = (account) => {
    this.sign(account);
  }

  render() {
    // const { list, query, total, loading } = this.props;
    // const columns = [{
    //   title: '名称',
    //   dataIndex: 'name',
    //   render: (_, record) => (
    //     <span>
    //       <span style={{ marginRight: '8px' }}>{record.name}</span>
    //       { record.isDefault && <Tag color="blue">默认</Tag> }
    //       { record.status === 0 && <Tag color="red">已停用</Tag> }
    //     </span>
    //   ),
    //   width: 220
    // }, {
    //   title: '账户类型',
    //   dataIndex: 'type',
    //   render: (_, record) => (
    //     <span>{getArrayValue(record.type, accountType)}</span>
    //   ),
    //   width: 100
    // }, {
    //   title: '签约状态',
    //   dataIndex: 'signStatus',
    //   render: (_, record) => (
    //     <>
    //       {
    //         record.type === 1 ?
    //           <span>{getArrayValue(record.signStatus, signStatus)}</span>
    //           :
    //           '-'
    //       }
    //     </>
    //   ),
    //   width: 100
    // }, {
    //   title: '备注',
    //   dataIndex: 'note',
    //   width: 160,
    //   render: (text) => (
    //     <span>
    //       <Tooltip placement="topLeft" title={text || ''}>
    //         <span className="eslips-2">{text}</span>
    //       </Tooltip>
    //     </span>
    //   ),
    // }, {
    //   title: '操作',
    //   dataIndex: 'ope',
    //   render: (_, record) => (
    //     <span style={{ width: '120px', display: 'inline-block', textAlign: 'left' }}>
    //       <span className="deleteColor" onClick={() => this.handleVisibleChange(record.id)}>删除</span>
    //       <Divider type="vertical" />
    //       <AddAccount title="edit" record={record} onOk={() => this.onOk()}>
    //         <a>编辑</a>
    //       </AddAccount>
    //       {
    //         record.type === 1 && !record.signStatus &&
    //         <>
    //           <Divider type="vertical" />
    //           <a onClick={() => this.sign(record.account)}>签约</a>
    //         </>
    //        }
    //     </span>
    //   ),
    //   width: '120px',
    //   className: 'fixCenter',
    //   fix: 'right'
    // }];
    return (
      <div>
        <PageHead title="公司付款账户设置" />
        <div className={style.content}>
          <div className="cnt-header">
            <div className="head_lf">
              <AddAccount onOk={this.onOk} title="add">
                <Button type="primary">新增付款账户</Button>
              </AddAccount>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
