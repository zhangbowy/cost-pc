import React, { Component } from 'react';
import { Button,  message, Modal,Pagination} from 'antd';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import AddAccount from './components/AddModal';
import AccountCart from '@/components/Account/';

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
    const { list, query, total, loading } = this.props;
    const onChange = (pageNumber) => {
      this.onQuery({
        pageNo: pageNumber,
        pageSize: query.pageSize
      });
    };
    const onShowSizeChange = (cur, size) => {
      this.onQuery({
        pageNo: cur,
        pageSize: size
      });
    };
    return (
      <div>
        <PageHead title="公司付款账户设置" />
        <div className="content-dt" style={{padding:'0px'}}>
          <div className="cnt-header">
            <div className="head_lf">
              <AddAccount onOk={this.onOk} title="add">
                <Button type="primary">新增付款账户</Button>
              </AddAccount>
            </div>
          </div>
          {/* 放置卡片 */}
          <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            {list.map((item) => {
              return <AccountCart key={item.id} item={item} delCart={(c) => this.delchange(c)} onOk={() => this.onOk()} signCart={(c) => this.signChange(c)}/>;
            })}
          </div>
          {/* 分页 */}
          <Pagination
            style={{float:'right',margin:'16px 0'}}
            loading={loading}
            size="small"
            current={query.pageNo}
            total={total}
            showQuickJumper
            showSizeChanger
            defaultCurrent={2}
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
            showTotal={() => (`共${total}条数据`)}
          />
        </div>
      </div>
    );
  }
}

export default Account;
