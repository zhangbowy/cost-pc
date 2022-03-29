import React, { Component } from 'react';
import { Button, message, Modal, Pagination, Empty, Tooltip } from 'antd';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import AddAccount from './components/AddModal';
import AccountCart from '@/components/Account/';
import style from './index.scss';

const { confirm } = Modal;
@connect(({ loading, account, session }) => ({
  loading: loading.effects['account/list'] || false,
  list: account.list,
  query: account.query,
  userInfo: session.userInfo,
  total: account.total,
  check: account.check,
  signRes: account.signRes,
  amountMap: account.amountMap
}))
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { query } = this.props;
    this.onQuery({ ...query });
    this.getAmountStats();
  }

  getAmountStats() {
    this.props.dispatch({
      type: 'account/getAmountMap',
      payload: {}
    });
  }

  onQuery = payload => {
    const { userInfo } = this.props;
    Object.assign(payload, { companyId: userInfo.companyId || '' });
    this.props.dispatch({
      type: 'account/list',
      payload
    });
  };

  onDelete = id => {
    const { userInfo, query } = this.props;
    this.props
      .dispatch({
        type: 'account/del',
        payload: {
          id,
          companyId: userInfo.companyId || ''
        }
      })
      .then(() => {
        message.success('删除成功');
        this.onQuery({
          ...query
        });
      });
  };

  handleVisibleChange = id => {
    const _this = this;
    this.props
      .dispatch({
        type: 'account/delPer',
        payload: {
          id
        }
      })
      .then(() => {
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
            }
          });
        } else {
          message.error('已关联提报单据，无法删除');
        }
      });
  };

  onOk = () => {
    const { query } = this.props;
    this.onQuery({ ...query });
  };

  sign = alipayAccount => {
    this.props
      .dispatch({
        type: 'account/sign',
        payload: {
          alipayAccount
        }
      })
      .then(() => {
        const { signRes } = this.props;
        if (signRes) {
          window.location.href = signRes;
        }
      });
  };
  // 删除账户

  delchange = id => {
    this.handleVisibleChange(id);
  };
  // 签约

  signChange = account => {
    this.sign(account);
  };

  render() {
    const { list, query, total, loading, amountMap } = this.props;
    console.log(list, query, total, loading, '666666');
    const onChange = pageNumber => {
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
      <div className={style.payAccountWarp}>
        <PageHead title="公司资金账户设置" />
        <div className={style.accountStatsWarp}>
          <div className={style.accountStat}>
            <div className="total-amount">
              <span className={style.text}>
                账户余额
                <Tooltip title="账户余额 = 所有账户初始金额 + 流入 - 流出">
                  <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
                </Tooltip>
              </span>
              <span className={style.num}>{amountMap.amountSumStr}</span>
            </div>
            <div className="income">
              <span className={style.text}>流入金额（元）</span>
              <span className={style.num}>{amountMap.incomeSumStr}</span>
            </div>
            <div className="pay">
              <span className={style.text}>流出金额（元）</span>
              <span className={style.num}>{amountMap.costSumStr}</span>
            </div>
          </div>
          <div className="head_lf">
            <AddAccount onOk={this.onOk} title="add">
              <Button type="primary">新增资金账户</Button>
            </AddAccount>
          </div>
        </div>
        <div
          className="content-dt content-add"
          style={{ backgroundColor: '#F7F8FA' }}
        >
          {/* 放置卡片 */}
          <div className={style.cardList}>
            {list.map(item => {
              return (
                <AccountCart
                  key={item.id}
                  item={item}
                  delCart={c => this.delchange(c)}
                  signChange={c => this.signChange(c)}
                  onOk={() => this.onOk()}
                />
              );
            })}
            {list.length % 3 === 2 && (
              <AccountCart
                hidden
                item={list[0]}
                key={1}
                style={{ display: 'none', visibility: 'hidden' }}
                delCart={c => this.delchange(c)}
                signChange={c => this.signChange(c)}
                onOk={() => this.onOk()}
              />
            )}
          </div>
          {list.length ? null : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无付款账户"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)'
              }}
            />
          )}
          <Pagination
            style={{ margin: '16px 0', position: 'absolute', right: '32px' }}
            loading={loading}
            size="small"
            current={query.pageNo}
            total={total}
            showQuickJumper
            showSizeChanger
            hideOnSinglePage
            defaultCurrent={2}
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
            showTotal={() => `共${total}条数据`}
          />
        </div>
      </div>
    );
  }
}

export default Account;
