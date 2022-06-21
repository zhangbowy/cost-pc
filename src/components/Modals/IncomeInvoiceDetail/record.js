import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import moment from 'moment';
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';

function Apply(props) {

  let columns = [
    {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 160,
      fixed: 'left',
      render: (_, record) => (
        <IncomeInvoiceDetail
          id={record.loanId}
          // refuse={this.handleRefuse}
          templateId={record.incomeTemplateId}
          templateType={20}
          // allow="modify"
          // onCallback={() => this.onOk()}
          // signCallback={this.onSign}
          title="收款详情"
          hidden={props.hidden}
        >
          <a>{record.number}</a>
        </IncomeInvoiceDetail>
      )
    },
  {
    title: '收款单金额（元）',
    dataIndex: 'repaySum',
    render: (repaySum) => (
      <span>{repaySum ? repaySum / 100 : '-'}</span>
    )
  },
    {
      title: '已收金额（元）',
      dataIndex: 'receivedMoney',
      render: (receivedMoney) => (
        <span>{receivedMoney ?  receivedMoney / 100 : ''}</span>
      )
    },   {
      title: '收款单时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      )
    }];

  if (props.templateType === 20) {
    columns = [
      {
        title: '收款时间',
        dataIndex: 'createTime',
        render: (text) => (
          <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        )
      },
      {
        title: '金额（元）',
        dataIndex: 'assessSumStr',
        render: (assessSumStr) => (
          <span>{assessSumStr}</span>
        )
      }];
  }
  return (
    <div>
      <Table
        dataSource={props.list}
        columns={columns}
        pagination={false}
        scroll={{y: '500px'}}
      />
    </div>
  );
}

Apply.propTypes = {
  list: PropTypes.array,
};

export default Apply;

