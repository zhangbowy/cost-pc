import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import InvoiceDetail from '.';

function Borrow(props) {

  let columns = [{
    title: '类型',
    dataIndex: 'typeStr',
  }, {
    title: '核销金额（元）',
    dataIndex: 'repaySum',
    render: (_, record) => (
      <span>{record.repaySum ? record.repaySum/100 : ''}</span>
    ),
    className: 'moneyCol',
    width: '180px'
  }, {
    title: '备注/事由',
    dataIndex: 'note',
    render: (text) => (
      <span>
        <Tooltip placement="topLeft" title={text || ''}>
          <span className="eslips-2">{text}</span>
        </Tooltip>
      </span>
    ),
  }, {
    title: '操作人',
    dataIndex: 'createName',
  }, {
    title: '操作日期',
    dataIndex: 'createTime',
    render: (_, record) => (
      <span>
        {record.createTime && moment(record.createTime).format('YYYY-MM-DD')}
      </span>
    ),
  }];
  if (props.type) {
    columns = [{
      title: '事由',
      dataIndex: 'reason',
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '借款单号',
      dataIndex: 'invoiceNo',
    }, {
      title: '本次核销',
      dataIndex: 'waitAssessSum',
      render: (_, record) => (
        <span>{record.waitAssessSum ? record.waitAssessSum/100 : ''}</span>
      ),
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>
          {record.createTime && moment(record.createTime).format('YYYY-MM-DD')}
        </span>
      ),
    }, {
      title: '查看',
      dataIndex: 'operate',
      render: (_, record) => (
        <span>
          <InvoiceDetail id={record.loanId} templateType={1}>
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
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

Borrow.propTypes = {
  list: PropTypes.array,
  type: PropTypes.number,
};

export default Borrow;

