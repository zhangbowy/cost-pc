import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { getArrayValue, invoiceStatus } from '../../../../utils/constants';
import { rowSelect } from '../../../../utils/common';

class SummaryCmp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount+=item.submitSum;
    });
    this.setState({
        selectedRows: _selectedRows,
        selectedRowKeys,
        sumAmount: amount,
    }, () => {
      this.props.onSelect({
        selectedRows,
        selectedRowKeys,
        sumAmount: amount,
      });
    });
  };

  onSelect = (record, selected) => {
    const {
        selectedRows,
        selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    let amount = 0;
    selectedRows.forEach(item => {
      amount+=item.submitSum;
    });
    this.setState({
        selectedRows,
        selectedRowKeys,
        sumAmount: amount,
    }, () => {
      this.props.onSelect({
        selectedRows,
        selectedRowKeys,
        sumAmount: amount,
      });
    });
  };

  render () {
    const { selectedRowKeys } = this.state;
    const { list, loading, templateType, query, total, searchContent } = this.props;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };
    const columns = [{
    title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail id={record.id} templateType={0}>
          <span>
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">{record.reason}</a>
            </Tooltip>
          </span>
        </InvoiceDetail>
      ),
      fixed: 'left'
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
      title: '项目名称',
      dataIndex: 'projectName',
      width: 150,
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
    }, {
      title: '支付时间',
      dataIndex: 'payTime',
      render: (_, record) => (
        <span>{record.payTime ? moment(record.payTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 150,
    }, {
      title: '发放人',
      dataIndex: 'payUserName',
      width: 150,
    }];
    const column = [{
      title: '事由',
        dataIndex: 'reason',
        width: 150,
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={1}>
            <span>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      }, {
        title: '借款金额(元)',
        dataIndex: 'loanSum',
        render: (text) => (
          <span>{text && text / 100}</span>
        ),
        className: 'moneyCol',
        width: 140,
      }, {
        title: '待核销金额(元)',
        dataIndex: 'waitAssessSum',
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
        title: '项目名称',
        dataIndex: 'projectName',
        width: 150,
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
        title: '预计还款时间',
        dataIndex: 'repaymentTime',
        render: (_, record) => (
          <span>{record.repaymentTime ? moment(record.repaymentTime).format('YYYY-MM-DD') : '-'}</span>
        ),
        width: 150,
      }, {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 100,
        render: (_, record) => (
          <span>{record.statusStr || getArrayValue(record.status, invoiceStatus)}</span>
        )
      }, {
        title: '支付时间',
        dataIndex: 'payTime',
        render: (_, record) => (
          <span>{record.payTime ? moment(record.payTime).format('YYYY-MM-DD') : '-'}</span>
        ),
        width: 150,
      }, {
        title: '发放人',
        dataIndex: 'payUserName',
        width: 150,
      }];
      const colum = [{
        title: '事由',
          dataIndex: 'reason',
          width: 150,
          render: (_, record) => (
            <InvoiceDetail id={record.id} templateType={2}>
              <span>
                <Tooltip placement="topLeft" title={record.reason || ''}>
                  <a className="eslips-2">{record.reason}</a>
                </Tooltip>
              </span>
            </InvoiceDetail>
          ),
          fixed: 'left'
        }, {
          title: '金额(元)',
          dataIndex: 'applicationSum',
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
          title: '项目名称',
          dataIndex: 'projectName',
          width: 150,
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
        }, {
          title: '是否关联',
          dataIndex: 'hasRelevance',
          render: (_, record) => (
            <span>{record.hasRelevance ? '是' : '否'}</span>
          ),
          width: 150,
        }];
        let newColumns = columns;
      if (templateType === 1) {
        newColumns = column;
      } else if (templateType === 2) {
        newColumns = colum;
      }
    return (
      <div>
        <Table
          columns={newColumns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          rowKey="id"
          scroll={{ x: '1500px' }}
          pagination={{
            current: query.pageNo,
            onChange: (pageNumber) => {
              this.props.onQuery({
                pageNo: pageNumber,
                pageSize: query.pageSize,
                content: searchContent,
              });
            },
            total,
            size: 'small',
            showTotal: () => (`共${total}条数据`),
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (cur, size) => {
              this.props.onQuery({
                pageNo: 1,
                pageSize: size,
                content: searchContent,
              });
            }
          }}
        />
      </div>
    );
  }
}

export default SummaryCmp;

