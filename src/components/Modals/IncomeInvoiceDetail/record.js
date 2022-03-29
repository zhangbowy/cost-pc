import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import moment from 'moment';

function Apply(props) {

  const columns = [
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

