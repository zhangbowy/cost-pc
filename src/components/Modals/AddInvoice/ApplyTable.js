import React, { Component } from 'react';
import { Table, Divider, Tooltip } from 'antd';
import moment from 'moment';
import InvoiceDetail from '../InvoiceDetail';

class ApplyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: props.list || []
     };
  }

  componentDidUpdate(prevProps){
    if (prevProps.list !== this.props.list) {
      if(this.props.list){
      // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          lists: this.props.list,
        });
      }
    }
  }

  onDelete = (id) => {
    const list = this.state.lists;
    const newArr = list.filter(it => it.id !== id) || [];
    this.props.onChangeData(newArr);
  }

  render() {
    const { list, modify } = this.props;
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
    }, {
      title: '借款单号',
      dataIndex: 'invoiceNo',
    }, {
      title: '金额（元）',
      dataIndex: 'applicationSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      )
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record ? `${moment(Number(record.createTime)).format('YYYY-MM-DD')}` : '-'}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          {
            !modify &&
              <span
                className="deleteColor"
                onClick={() => this.onDelete(record.id)}
              >
                删除
              </span>
          }
          {
            !modify &&
              <Divider type="vertical" />
          }
          <InvoiceDetail id={record.applicationId || record.id} templateType={2}>
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
    }];
    return (
      <div style={{ marginTop: '24px' }}>
        <Table
          dataSource={list}
          columns={columns}
          scroll={{x: list.length > 6 ? '1200px' : '1000px'}}
          rowKey="id"
          pagination={false}
        />
      </div>
    );
  }
}

export default ApplyTable;
