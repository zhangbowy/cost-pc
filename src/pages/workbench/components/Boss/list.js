import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import InvoiceDetail from '../../../../components/Modals/InvoiceDetail';

export default {
  0: {
    title: '计划待付',
    columns: [
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
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ]
  },
  1: {
    title: '应付',
    columns: [
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
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ]
  },
  2: {
    title: '已付',
    columns: [
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
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ]
  },
  3: {
    title: '借款待还',
    columns: [
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
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ]
  }
};
