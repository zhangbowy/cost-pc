import React, { Component } from 'react';
import { Table } from 'antd';

class CostTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { list, status } = this.props;
    const columns = [{  
      title: '序号',
      dataIndex: 'xh',
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 200
    }, {
      title: '付款金额',
      dataIndex: 'amount',
      render(text){
        return text/100;
      }
    }, {
      title: '事由',
      dataIndex: 'reason',
    }, {
      title: '提交人',
      dataIndex: 'submitterName',
    }];
    console.log(status);
    if(status === 2){
      columns.splice(1,0,{
        title: '失败原因',
        dataIndex: 'failReason',
      });
    }else{
      columns.splice(1,0,{
        title: '发放状态',
        dataIndex: 'status',
        render(text){
          return text===1?'已发放':'未发放';
        }
      });
    }
    
    return (
      <div style={{ padding: '24px 32px' }}>
        <Table
          dataSource={list}
          columns={columns}
          scroll={{x: list.length > 6 ? '1200px' : '1000px'}}
          rowKey="invoiceId"
          pagination={false}
        />
      </div>
    );
  }
}

export default CostTable;
