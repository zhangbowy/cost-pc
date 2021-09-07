import React, { Component } from 'react';
import { Table, Tooltip, Popconfirm, message, Badge } from 'antd';
import moment from 'moment';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { getArrayValue, invoiceStatus, getArrayColor } from '../../../../utils/constants';
import { rowSelect } from '../../../../utils/common';

const statusStr = {
  1: '该单据审批中，可让发起人自行撤销',
  2: '该单据待发放，可让发放人执行拒绝操作',
  3: '该单据待还款，请将欠款核销后再行删除',
  4: '该单据已撤销，可让发起人自行删除',
  55: '该单据已审批拒绝，可让发起人自行删除',
  52: '该单据已发放拒绝，可让发起人自行删除',
};
class SummaryCmp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: props.selectedRowKeys || [],
      selectedRows: props.selectedRows || [],
      sumAmount: props.sumAmount || 0,
    };
  }

  componentDidUpdate(prev) {
    if (prev.selectedRowKeys !== this.props.selectedRowKeys) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectedRowKeys: this.props.selectedRowKeys,
        selectedRows: this.props.selectedRows,
        sumAmount: this.props.sumAmount,
      });
    }
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount+=item.money;
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
      amount+=item.money;
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

  onDelete = (id) => {
    const { templateType, query, searchContent } = this.props;
    this.props.onDelInvoice({
      id,
      templateType: Number(templateType) === 4 ? 0 : templateType,
      isAlitrip: Number(templateType) === 4,
    }, () => {
      message.success('删除成功');
      this.props.onQuery({
        pageNo: query.pageNo,
        pageSize: query.pageSize,
        content: searchContent,
      });
    });
  }

  render () {
    const { selectedRowKeys } = this.state;
    const { list, loading, templateType,
      query, total, searchContent, userInfo } = this.props;
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
    }, {
      title: '单据状态',
      dataIndex: 'statusStr',
      width: 120,
      render: (_, record) => (
        <span>
          <Badge
            color={
              getArrayColor(`${record.status}`, invoiceStatus) === '-' ?
              'rgba(255, 148, 62, 1)' : getArrayColor(`${record.status}`, invoiceStatus)
            }
            text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
          />
        </span>
      ),
      fixed: 'right'
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
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (_, record) => (
          <span>{record.repaymentTime ? moment(record.repaymentTime).format('YYYY-MM-DD') : '-'}</span>
        ),
        width: 150,
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
      }, {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-' ?
                'rgba(255, 148, 62, 1)' : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
            />
          </span>
        ),
        fixed: 'right'
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
          title: '是否关联',
          dataIndex: 'hasRelevance',
          render: (_, record) => (
            <span>{record.hasRelevance ? '是' : '否'}</span>
          ),
          width: 150,
        }, {
          title: '单据状态',
          dataIndex: 'statusStr',
          width: 120,
          render: (_, record) => (
            <span>
              <Badge
                color={
                  getArrayColor(`${record.status}`, invoiceStatus) === '-' ?
                  'rgba(255, 148, 62, 1)' : getArrayColor(`${record.status}`, invoiceStatus)
                }
                text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
              />
            </span>
          ),
          fixed: 'right'
        }];
        const colmn = [{
          title: '事由',
            dataIndex: 'reason',
            width: 150,
            render: (_, record) => (
              <InvoiceDetail id={record.id} templateType={3}>
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
            dataIndex: 'salaryAmount',
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
            width: 120,
            render: (_, record) => (
              <span>
                <Badge
                  color={
                    getArrayColor(`${record.status}`, invoiceStatus) === '-' ?
                    'rgba(255, 148, 62, 1)' : getArrayColor(`${record.status}`, invoiceStatus)
                  }
                  text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
                />
              </span>
            ),
            fixed: 'right'
          }];
          const third = [{
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
              title: '关联申请单',
              dataIndex: 'relevanceInvoiceNo',
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
              width: 120,
              render: (_, record) => (
                <span>
                  <Badge
                    color={
                      getArrayColor(`${record.status}`, invoiceStatus) === '-' ?
                      'rgba(255, 148, 62, 1)' : getArrayColor(`${record.status}`, invoiceStatus)
                    }
                    text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
                  />
                </span>
              ),
              fixed: 'right'
            }];
        let newColumns = columns;
      if (templateType === 1) {
        newColumns = column;
      } else if (templateType === 2) {
        newColumns = colum;
      } else if (templateType === 3) {
        newColumns = colmn;
      } else if (templateType === 4) {
        newColumns = third;
      }
      if (userInfo.isSupperAdmin) {
        newColumns.push({
          title: '操作',
          dataIndex: 'operate',
          render: (_, record) => {
            const { status, approveStatus } = record;
            console.log(status);
            return (
              <>
                {
                  (status === 3 && templateType === 3) ||
                  (status === 3 && templateType === 0) ||
                  (templateType === 1 && status === 6) ||
                  (templateType === 2 && status === 2) ||
                  (templateType === 4 && status === 3) ?
                    <Popconfirm
                      title="确认删除该单据吗？此操作不可恢复，需谨慎"
                      onConfirm={() => this.onDelete(record.id)}
                      placement="topRight"
                    >
                      <a>删单</a>
                    </Popconfirm>
                    :
                    <Tooltip
                      title={status === 5 ? statusStr[`${status}${approveStatus}`] : statusStr[status]}
                      placement="topRight"
                    >
                      <span style={{ cursor: 'pointer',color: 'rgba(0,0,0,0.25)' }}>删单</span>
                    </Tooltip>
                }
              </>
            );
          },
          width: 80,
          fixed: 'right',
          className: 'fixCenter'
        });
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

