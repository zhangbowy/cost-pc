import React, { Component } from 'react';
import { Table, Button } from 'antd';
import moment from 'moment';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';

class BorrowTable extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const { list } = this.props;
    console.log('list=============', list);
    const columns = [{
      title: '类型',
      dataIndex: 'typeStr',
    }, {
      title: '提交人',
      dataIndex: 'createName',
    }, {
      title: '金额',
      dataIndex: 'repaySum',
      render: (text) => (
        <span>{text/100}</span>
      )
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? `${moment(Number(record.createTime)).format('YYYY-MM-DD')}` : ''}</span>
      )
    }, {
      title: '关联单据',
      dataIndex: 'bchx',
      render: (_, record) => (
        <span>
          {
            record.invoiceSubmitId? (
              <InvoiceDetail id={record.invoiceSubmitId} templateType={0} >
                <Button type='link' >查看</Button>
              </InvoiceDetail>
            ) : <span>-</span>
          }
        </span>
      )
    }, {
      title: '还款备注',
      dataIndex: 'note',
    }, {
      title: '收款账户',
      dataIndex: 'accountVo',
    }];
    return (
      <div style={{ marginTop: '24px' }}>
        <Table
          dataSource={list}
          columns={columns}
          scroll={{x: list.length > 6 ? '1200px' : '1000px'}}
          rowKey="invoiceSubmitId"
          pagination={false}
        />
      </div>
    );
  }
}

export default BorrowTable;
