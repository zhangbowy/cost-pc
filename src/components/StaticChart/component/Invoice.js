import React, { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Tooltip } from 'antd';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import { getArrayValue, invoiceStatus } from '../../../utils/constants';

function Invoice({ children, lists, onQuery, id, query, total, projectType }) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const columns = [{
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => (
        <span>
          {index+1}
        </span>
      ),
      fixed: 'left',
    }, {
    title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail id={record.invoiceSubmitId} templateType={0}>
          <span>
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">{record.reason}</a>
            </Tooltip>
          </span>
        </InvoiceDetail>
      ),
      fixed: 'left',
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
    const onSearch = (e) => {
      setSearch(e);
      onQuery({ pageNo: 1, pageSize: 10, id, projectType, searchContent: e });
    };
  return (
    <span>
      <span onClick={() => { onQuery({ pageNo: 1, pageSize: 10, id, projectType }); setVisible(true);  }}>{ children }</span>
      <Modal
        title="单据列表"
        visible={visible}
        onCancel={() => { setSearch('');setVisible(false); }}
        footer={null}
        width="980px"
        bodyStyle={{height: '470px', overflowY: 'scroll'}}
      >
        <Search
          placeholder="请输入单号、事由、收款账户名称"
          style={{ width: '292px',marginRight:'20px', marginBottom: '16px' }}
          onSearch={(e) => onSearch(e)}
          value={search}
          onInput={e => setSearch(e.target.value)}
        />
        <Table
          dataSource={lists}
          columns={columns}
          rowKey="invoiceSubmitId"
          scroll={{y: '280px', x: '1090px'}}
          pagination={{
            current: query.pageNo,
            hideOnSinglePage: true,
            onChange: (pageNumber) => {
              console.log('onChange');
              onQuery({
                pageNo: pageNumber,
                pageSize: query.pageSize,
                id,
                projectType
              });
            },
            total,
            size: 'small',
            showTotal: () => (`共${total}条数据`),
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (cur, size) => {
              console.log('翻页');
              onQuery({
                pageNo: cur,
                pageSize: size,
                id,
                projectType
              });
            }
          }}
        />
      </Modal>
    </span>
  );
}

export default Invoice;
