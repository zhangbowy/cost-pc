/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Table, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import { connect } from 'dva';
import cs from 'classnames';
import style from './index.scss';
import InvoiceDetail from '../../InvoiceDetail';

// const labelInfo = {
//   costName: '费用类别',
//   costSum: '金额(元)',
//   costNote: '费用备注',
//   imgUrl: '图片',
//   happenTime: '发生日期'
// };
@connect(({ costGlobal }) => ({
  loanList: costGlobal.loanList,
  waitLoanSumAll: costGlobal.waitLoanSumAll,
}))
@Form.create()
class LoanTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onShow = async() => {
    this.props.dispatch({
      type: 'costGlobal/loanList',
      payload: {
        pageNo: 1,
        pageSize: 1000,
      }
    }).then(() => {
      console.log(this.props.waitList);
      const { list } = this.props;
      console.log('list', list);
      this.setState({
        visible: true,
      });
    });

  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onSearch = (e) => {
    this.props.dispatch({
      type: 'costGlobal/loanList',
      payload: {
        pageSize: 100,
        pageNo: 1,
        searchContent: e,
      }
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'costGlobal/loanList',
      payload,
    });
  }

  render() {
    const {
      children,
      loanList,
      waitLoanSumAll
    } = this.props;
    const {
      visible,
    } = this.state;
    const columns = [
      {
        title: '事由',
        dataIndex: 'reason',
        render: (_,record) => (
          <span>
            <InvoiceDetail templateType={1} id={record.loanId}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <span className="eslips-2 ope-btn" style={{ cursor: 'pointer' }}>{record.reason}</span>
              </Tooltip>
            </InvoiceDetail>
          </span>
        ),
        fixed: 'left'
      },
      {
        title: '借款金额（元）',
        dataIndex: 'loanSum',
        className: 'moneyCol',
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },
      {
        title: '待核销金额（元）',
        dataIndex: 'waitAssessSum',
        className: 'moneyCol',
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },
      {
        title: '核销中金额',
        dataIndex: 'freezeSum',
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
      }, {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      }, {
        title: '预计还款时间',
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ];

    return (
      <span className={cs('formItem', style.addCost)}>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="待还款单据"
          visible={visible}
          width="880px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={this.onCancel}
          maskClosable={false}
          footer={null}
        >
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
            <Search
              placeholder="请输入单号、事由、收款账户"
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => this.onSearch(e)}
            />
            待核销共计¥{waitLoanSumAll.waitAssessSumAll ? waitLoanSumAll.waitAssessSumAll/100 : 0}，
            借款共计¥{waitLoanSumAll.loanSumAll ? waitLoanSumAll.loanSumAll/100 : 0}
          </div>
          <div className={style.addCosts}>
            <div className={style.addTable}>
              <Table
                columns={columns}
                dataSource={loanList}
                pagination={false}
                rowKey="id"
                scroll={{ x: '1100px' }}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default LoanTable;
