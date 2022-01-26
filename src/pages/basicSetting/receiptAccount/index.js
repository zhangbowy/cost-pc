import React, { Component } from 'react';
import { Table,  Button,  message, Modal} from 'antd';
import { connect } from 'dva';
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
    this.onQuery({ ...query });
  }
  // 删除账户

  delchange = (id) => {
    this.handleVisibleChange(id);
  }
  // 编辑账户

  editchange = () => {
    this.onOk();
  }

  render() {
    const { list, query, total, loading } = this.props;
    const columns = [   {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <AddAccount title="edit" record={record} onOk={() => this.onOk()}>
            <a>编辑</a>
          </AddAccount>
        </span>
      ),
      width: 80,
      className: 'fixCenter'
    }];

    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <AddAccount onOk={this.onOk} title="add">
              <Button type="primary">新增收款账户</Button>
            </AddAccount>
          </div>
        </div>
        {/* 放置卡片 */}
        <div style={{ display: 'flex', flexWrap: 'wrap'}}>
          {list.map((item) => {
             return <AccountCart key={item.id} item={item} delCart={(c) => this.delchange(c)} editCart={(c) => this.editchange(c)}/>;
            })}
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
