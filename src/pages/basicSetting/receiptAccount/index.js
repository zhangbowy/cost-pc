import React, { Component } from 'react';
import { Button,  message, Modal,Empty} from 'antd';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import AddAccount from './components/AddModal';
import AccountCart from '@/components/Account/';

const { confirm } = Modal;
@connect(({ loading, receiptAcc, session }) => ({
  loading: loading.effects['receiptAcc/list'] || false,
  list: receiptAcc.list,
  query: receiptAcc.query,
  userInfo: session.userInfo,
  total: receiptAcc.total,
  check: receiptAcc.check,
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
      type: 'receiptAcc/list',
      payload,
    });
  }

  onDelete = (id) => {
    const { userInfo, query } = this.props;
    this.props.dispatch({
      type: 'receiptAcc/del',
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
      type: 'receiptAcc/delPer',
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
    console.log('缺少必要参数',query);
    this.onQuery({ ...query });
  }
  // 删除账户

  delchange = (id) => {
    this.handleVisibleChange(id);
  }

  render() {
    const { list } = this.props;
    console.log(list,'个人收款账户list');
    // const onChange = (pageNumber) => {
    //   this.onQuery({
    //     pageNo: pageNumber,
    //     pageSize: query.pageSize
    //   });
    // };
    // const onShowSizeChange = (cur, size) => {
    //   this.onQuery({
    //     pageNo: cur,
    //     pageSize: size
    //   });
    // };
    return (
      <div>
        <PageHead title="个人收款账户设置" />
        <div className="content-dt content-add" style={{backgroundColor: '#F7F8FA'}}>
          <div className="cnt-header m-b-20">
            <div className="head_lf">
              <AddAccount onOk={this.onOk} title="add">
                <Button type="primary">新增收款账户</Button>
              </AddAccount>
            </div>
          </div>
          {/* 放置卡片 */}
          <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            {list.map((item) => {
             return <AccountCart personal='true' key={item.id} item={item} delCart={(c) => this.delchange(c)} onOk={() => this.onOk()}/>;
            })}
            {list.length % 3 === 2 && (
            <AccountCart
              personal='true'
              hidden
              item={list[0]}
              key={list[0].id}
              style={{ display: 'none', visibility: 'hidden' }}
              delCart={c => this.delchange(c)}
              onOk={() => this.onOk()}
            />
             )}
          </div>
          {/* 内容为空时 */}
          {list.length?null:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无收款账户" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>}
          {/* <Pagination
            style={{margin:'16px 0',position:'absolute',right:'32px'}}
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
            showTotal={() => (`共${total}条数据`)}
          /> */}
        </div>
      </div>
    );
  }
}

export default Account;
