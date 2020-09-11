import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import moment from 'moment';
import InvoiceDetail from '.';

function Borrow(props) {
  const columns = [{
    title: '类型',
    dataIndex: 'typeStr',
    width: 130
  }, {
    title: '核销金额（元）',
    dataIndex: 'categoryName',
    render: (_, record) => (
      <span>
        <i className={`iconfont icon${record.icon}`} />
        <span>{record.categoryName}</span>
      </span>
    ),
    width: 130
  }, {
    title: '备注/事由',
    dataIndex: 'categoryName',
    render: (_, record) => (
      <span>
        {
          record.invoiceSubmitId ?
            <InvoiceDetail>
              <a>查看</a>
            </InvoiceDetail>
          :
            <span>{record.note}</span>
        }
      </span>
    ),
    width: 130
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
    width: 130
  }];
  return (
    <div>
      <Table
        dataSource={props.list}
        columns={columns}
      />
    </div>
  );
}

Borrow.propTypes = {
  list: PropTypes.array,
};

export default Borrow;

