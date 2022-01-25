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
        ellipsis: true,
        textWrap: 'word-break',
        render: (_,record) => (
          <span>
            <InvoiceDetail templateType={record.templateType} id={record.id}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <span className="eslips-2 ope-btn" style={{ cursor: 'pointer' }}>{record.reason}</span>
              </Tooltip>
            </InvoiceDetail>
          </span>
        ),
        fixed: 'left'
      },
      {
        title: '金额（元）',
        dataIndex: 'sum',
        className: 'moneyCol',
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
        title: '提交人',
        dataIndex: 'createName',
      }, {
        title: '单据状态',
        dataIndex: 'statusStr',
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
            <InvoiceDetail templateType={record.templateType} id={record.id}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <span className="eslips-2 ope-btn" style={{ cursor: 'pointer' }}>{record.reason}</span>
              </Tooltip>
            </InvoiceDetail>
          </span>
        ),
        fixed: 'left'
      },
      {
        title: '金额（元）',
        dataIndex: 'sum',
        className: 'moneyCol',
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
        title: '提交人',
        dataIndex: 'createName',
      }, {
        title: '单据状态',
        dataIndex: 'statusStr',
      },
    ]
  },
  2: {
    title: '审核中',
    columns: [
      {
        title: '事由',
        dataIndex: 'reason',
        ellipsis: true,
        textWrap: 'word-break',
        width: 100,
        render: (_,record) => (
          <span>
            <InvoiceDetail templateType={record.templateType} id={record.id}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <span className="eslips-2 ope-btn spanStyle" style={{ cursor: 'pointer' }}>{record.reason}</span>
              </Tooltip>
            </InvoiceDetail>
          </span>
        ),
        fixed: 'left'
      },
      {
        title: '金额（元）',
        dataIndex: 'sum',
        className: 'moneyCol',
        width: 100,
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 100,
      }, {
        title: '提交时间',
        dataIndex: 'createTime',
        width: 100,
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      }, {
        title: '提交人',
        width: 100,
        dataIndex: 'createName',
      }, {
        title: '单据状态',
        width: 100,
        dataIndex: 'statusStr',
      }]
  },
  3: {
    title: '借款待还',
    columns: [
      {
        title: '事由',
        dataIndex: 'reason',
        ellipsis: true,
        textWrap: 'word-break',
        width: 100,
        render: (_,record) => (
          <span>
            <InvoiceDetail templateType={record.templateType} id={record.id}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <span className="eslips-2 ope-btn spanStyle" style={{ cursor: 'pointer' }}>{record.reason}</span>
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
        width: 100,
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        ),
      },
      {
        title: '待核销金额（元）',
        dataIndex: 'waitAssessSum',
        className: 'moneyCol',
        width: 100,
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        ),
      },
      {
        title: '提交人',
        dataIndex: 'createName',
        width: 100,
        render: (text) => (
          <span>{text || '-'}</span>
        )
      },
      {
        title: '提交人部门',
        dataIndex: 'deptName',
        width: 100,
        render: (text) => (
          <span>{text || '-'}</span>
        )
      },
      {
        title: '核销中金额(元)',
        dataIndex: 'freezeSum',
        width: 100,
        className: 'moneyCol',
        render: (text) => (
          <span>{text ? text/100 : 0}</span>
        )
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 100,
      }, {
        title: '提交时间',
        dataIndex: 'createTime',
        width: 100,
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      }, {
        title: '预计还款日期',
        width: 100,
        dataIndex: 'repaymentTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
        )
      },
    ]
  },
  list: [{
    key: 0,
    value: '计划待付',
    id: 'paymentSumPlan',
  }, {
    key: 1,
    value: '应付',
    id: 'payingSum'
  }, {
    key: 2,
    value: '已付',
    id: 'payedSum'
  }, {
    key: 3,
    value: '借款待还',
    id: 'repaymentSum'
  }]
};
