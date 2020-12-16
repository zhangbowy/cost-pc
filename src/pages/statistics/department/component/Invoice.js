import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Modal, Table, Tooltip } from 'antd';
import { getArrayValue, invoiceStatus } from '../../../../utils/constants';

function Invoice({ children, lists, onQuery }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    onQuery({
      pageNo: 1,
      pageSize: 10,
    });
  }, [lists]);
  const columns = [{
    title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '金额(元)',
      dataIndex: 'loanSum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 140,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 160,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 160,
    }, {
      title: '提交人',
      dataIndex: 'createUserName',
      width: 150,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 150,
    }, {
      title: '单据状态',
      dataIndex: 'statusStr',
      width: 100,
      render: (_, record) => (
        <span>{record.statusStr || getArrayValue(record.status, invoiceStatus)}</span>
      )
    }];
  return (
    <span>
      <span onClick={() => { onQuery({ pageNo: 1, pageSize: 10 }); setVisible(true);  }}>{ children }</span>
      <Modal
        title="单据列表"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="980px"
        bodyStyle={{height: '470px', overflowY: 'scroll'}}
      >
        <Table
          dataSource={lists}
          pagination={false}
          columns={columns}
        />
      </Modal>
    </span>
  );
}

export default Invoice;
