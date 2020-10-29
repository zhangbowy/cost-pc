import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';
import moment from 'moment';

function Apply(props) {

  const columns = [{
    title: '事由',
    dataIndex: 'reason',
    render: (text) => (
      <span>
        <Tooltip placement="topLeft" title={text || ''}>
          <span className="eslips-2">{text}</span>
        </Tooltip>
      </span>
    ),
  },
  {
    title: '申请单号',
    dataIndex: 'invoiceNo',
  },
  {
    title: '金额（元）',
    dataIndex: 'applicationSum',
    render: (text) => (
      <span>{text ? text/100 : 0}</span>
    )
  },{
    title: '提交时间',
    dataIndex: 'createTime',
    render: (text) => (
      <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
    )
  }];
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

