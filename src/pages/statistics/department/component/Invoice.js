import React, { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Tooltip } from 'antd';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { getArrayValue, invoiceStatus } from '../../../../utils/constants';

function Invoice({ children, lists, onQuery, deptId }) {
  const [visible, setVisible] = useState(false);
  const columns = [{
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => (
        <span>
          {index+1}
        </span>
      ),
    }, {
    title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail id={record.invoiceTemplateId} templateType={0}>
          <span>
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">{record.reason}</a>
            </Tooltip>
          </span>
        </InvoiceDetail>
      ),
    }, {
      title: '金额(元)',
      dataIndex: 'submitSum',
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
      dataIndex: 'createName',
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
      <span onClick={() => { onQuery({ pageNo: 1, pageSize: 10, deptId }); setVisible(true);  }}>{ children }</span>
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
