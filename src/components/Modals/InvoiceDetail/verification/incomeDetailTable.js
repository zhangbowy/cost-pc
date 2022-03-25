import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import moment from 'moment';

function IncomeDetailTable(props) {
  const columns = [
    {
      title: '收入类别',
      dataIndex: 'reason',
      render: text => <span />
    },
    {
      title: '金额(元)',
      dataIndex: 'invoiceNo'
    },
    {
      title: '发生日期',
      dataIndex: 'applicationSum',
      render: text => <span>{text ? text / 100 : 0}</span>
    },
    {
      title: '备注',
      dataIndex: 'createTime',
      render: text => (
        <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
      )
    },
    {
      title: '图片',
      dataIndex: 'img',
      render: (_, record) => <span />
    }
  ];
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

IncomeDetailTable.propTypes = {
  list: PropTypes.array
};

export default IncomeDetailTable;
