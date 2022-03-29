import React, { Component } from 'react';
import { Badge, Divider, message, Popconfirm, Table, Tooltip } from 'antd';
import moment from 'moment';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';
import {
  getArrayColor,
  getArrayValue,
  invoiceStatus
} from '../../../../utils/constants';
import { rowSelect } from '../../../../utils/common';
import style from './index.scss';
import xzcLogo from '@/assets/img/aliTrip/xzcLogo.png';
import znxcLogo from '@/assets/img/aliTrip/znxcLogo.png';
import ChangeDate from '../../costDetail/component/ChangeDate';

const statusStr = {
  1: '该单据审批中，可让发起人自行撤销',
  2: '该单据待发放，可让发放人执行拒绝操作',
  3: '该单据待还款，请将欠款核销后再行删除',
  4: '该单据已撤销，可让发起人自行删除',
  55: '该单据已审批拒绝，可让发起人自行删除',
  52: '该单据已发放拒绝，可让发起人自行删除'
};
const dateStr = {
  1: '该单据审批中，无法修改',
  4: '已终止的无效单据',
  55: '已终止的无效单据',
  52: '已终止的无效单据'
};
class SummaryCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: props.selectedRowKeys || [],
      selectedRows: props.selectedRows || [],
      sumAmount: props.sumAmount || 0
    };
  }

  componentDidUpdate(prev) {
    if (prev.selectedRowKeys !== this.props.selectedRowKeys) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectedRowKeys: this.props.selectedRowKeys,
        selectedRows: this.props.selectedRows,
        sumAmount: this.props.sumAmount
      });
    }
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount += item.money;
    });
    this.setState(
      {
        selectedRows: _selectedRows,
        selectedRowKeys,
        sumAmount: amount
      },
      () => {
        this.props.onSelect({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount
        });
      }
    );
  };

  onSelect = (record, selected) => {
    const { selectedRows, selectedRowKeys } = rowSelect.onSelect(
      this.state,
      record,
      selected
    );
    let amount = 0;

    selectedRows.forEach(item => {
      amount += item.money;
    });
    this.setState(
      {
        selectedRows,
        selectedRowKeys,
        sumAmount: amount
      },
      () => {
        this.props.onSelect({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount
        });
      }
    );
  };

  onDelete = (id, type, isAliTrip) => {
    const { templateType, query, searchContent } = this.props;
    this.props.onDelInvoice(
      {
        id,
        templateType: Number(templateType) === 4 ? type : templateType,
        isAlitrip: Number(templateType) === 4 && isAliTrip
      },
      () => {
        message.success('删除成功');
        this.props.onQuery({
          pageNo: query.pageNo,
          pageSize: query.pageSize,
          content: searchContent
        });
      }
    );
  };

  // 修改所属期限
  onOk = (payload, callback) => {
    this.props.editBelongDate({ payload, callback });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {
      list,
      loading,
      templateType,
      query,
      total,
      searchContent,
      userInfo,
      statisticsDimension,
      current
    } = this.props;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };
    const spanStyle = {
      width: '150px',
      overflow: 'hidden',
      textWrap: 'word-break',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      maxHeight: '54px'
    };
    const columns = [
      {
        title: '事由',
        dataIndex: 'reason',
        width: 150,
        // ellipsis: true,
        textWrap: 'word-break',
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={0}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      },
      {
        title: '金额(元)',
        dataIndex: 'submitSum',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 160
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        render: (_, record) =>
          record?.thirdPlatformType === 2 || record?.thirdPlatformType === 3 ? (
            <>
              <span>{record.invoiceNo}</span>
              <img
                src={record?.thirdPlatformType === 2 ? xzcLogo : znxcLogo}
                alt="鑫资产"
                style={{
                  width: '16px',
                  height: '16px',
                  marginLeft: '8px',
                  verticalAlign: 'text-bottom'
                }}
              />
            </>
          ) : (
            <span>{record.invoiceNo}</span>
          ),
        width: list?.thirdPlatformType === 2 || list?.thirdPlatformType === 3
            ? 230
            : 160
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 160
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        render: (_, record) => (
          <span>
            {record.payTime ? moment(record.payTime).format('YYYY-MM-DD') : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '发放人',
        dataIndex: 'payUserName',
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];
    const column = [
      {
        title: '事由',
        dataIndex: 'reason',
        width: 150,
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={1}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      },
      {
        title: '借款金额(元)',
        dataIndex: 'loanSum',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 160
      },
      {
        title: '待核销金额(元)',
        dataIndex: 'waitAssessSum',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 140
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 160
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 160
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '预计还款日期',
        dataIndex: 'repaymentTime',
        render: (_, record) => (
          <span>
            {record.repaymentTime
              ? moment(record.repaymentTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        render: (_, record) => (
          <span>
            {record.payTime ? moment(record.payTime).format('YYYY-MM-DD') : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '发放人',
        dataIndex: 'payUserName',
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];
    const colum = [
      {
        title: '事由',
        dataIndex: 'reason',
        width: 150,
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={2}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      },
      {
        title: '金额(元)',
        dataIndex: 'applicationSum',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 140
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 160
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 160
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '是否关联',
        dataIndex: 'hasRelevance',
        render: (_, record) => <span>{record.hasRelevance ? '是' : '否'}</span>,
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];
    const colmn = [
      {
        title: '事由',
        dataIndex: 'reason',
        width: 150,
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={3}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      },
      {
        title: '金额(元)',
        dataIndex: 'salaryAmount',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 140
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 160
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 160
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];
    const third = [
      {
        title: '事由',
        dataIndex: 'reason',
        width: 150,
        render: (_, record) => (
          <InvoiceDetail id={record.id} templateType={record.templateType}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={record.reason || ''}>
                <a className="eslips-2">{record.reason}</a>
              </Tooltip>
            </span>
          </InvoiceDetail>
        ),
        fixed: 'left'
      },
      {
        title: '金额(元)',
        dataIndex: 'submitSum',
        render: text => <span>{text && text / 100}</span>,
        className: 'moneyCol',
        width: 140
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 160
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 160
      },
      {
        title: '关联申请单',
        dataIndex: 'relevanceInvoiceNo',
        width: 150
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 120,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];
    // 收款单的字段
    const income = [
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        render: (_, record) => (
          <IncomeInvoiceDetail id={record.id} templateType={20}>
            <span className={style.reasonSpan} style={spanStyle}>
              <Tooltip placement="topLeft" title={_ || ''}>
                <a className="eslips-2">{_}</a>
              </Tooltip>
            </span>
          </IncomeInvoiceDetail>
        ),
        width: 160
      },
      {
        title: '应收金额(元)',
        dataIndex: 'receiptSum',
        render: text => <span>{text && text / 100}</span>,
        width: 140
      },
      {
        title: '实收金额(元)',
        dataIndex: 'assessSum',
        render: text => <span>{text && text / 100}</span>,
        width: 140
      },
      {
        title: '待收金额(元)',
        dataIndex: 'waitAssessSum',
        render: text => <span>{text && text / 100}</span>,
        width: 140
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        render: (projectName) => <span>{projectName || '-'}</span>,
        width: 140
      },
      {
        title: '业务员',
        dataIndex: 'userName',
        render: (userName) => <span>{userName || '-'}</span>,
        width: 140
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '收款时间',
        dataIndex: '5',
        render: (_, record) => (
          <span>
            {record.receiveTime
              ? moment(record.receiveTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
        width: 150
      },
      {
        title: '收款核销人',
        dataIndex: 'receiptName',
        render: (receiptName) => <span>{receiptName || '-'}</span>,
        width: 150
      },
      {
        title: '单据状态',
        dataIndex: 'statusStr',
        width: 140,
        render: (_, record) => (
          <span>
            <Badge
              color={
                getArrayColor(`${record.status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${record.status}`, invoiceStatus)
              }
              text={
                record.statusStr || getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        ),
        fixed: 'right'
      }
    ];

    let newColumns = columns;
    if (templateType === 1) {
      newColumns = column;
    } else if (templateType === 2) {
      newColumns = colum;
    } else if (templateType === 3) {
      newColumns = colmn;
    } else if (templateType === 4) {
      newColumns = third;
    } else if (templateType === 20) {
      newColumns = income;
    }
    console.log(templateType, '---');
    if (userInfo.isSupperAdmin && templateType !== 20) {
      newColumns.push({
        title: '操作',
        dataIndex: 'operate',
        render: (_, record) => {
          const { status, approveStatus } = record;
          return (
            <>
              {(status === 3 && templateType === 3) ||
              (status === 3 && templateType === 0) ||
              (templateType === 1 && status === 6) ||
              (templateType === 2 && status === 2) ||
              (record.templateType === 2 && status === 2) ||
              (templateType === 4 && status === 3) ? (
                <Popconfirm
                  title="确认删除该单据吗？此操作不可恢复，需谨慎"
                  onConfirm={() =>
                    this.onDelete(
                      record.id,
                      record.templateType,
                      record.isEnterpriseAlitrip ||
                        record.isHistoryImport ||
                        record.isAssetsImport
                    )}
                  placement="topRight"
                >
                  <a>删单</a>
                </Popconfirm>
              ) : (
                <Tooltip
                  title={
                    status === 5
                      ? statusStr[`${status}${approveStatus}`]
                      : statusStr[status]
                  }
                  placement="topRight"
                >
                  <span
                    style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
                  >
                    删单
                  </span>
                </Tooltip>
              )}
              {current === '0' &&
                (statisticsDimension !== 2 ? (
                  <>
                    <Divider type="vertical" />
                    {dateStr[status] || dateStr[`${status}${approveStatus}`] ? (
                      <Tooltip
                        title={
                          dateStr[status] ||
                          dateStr[`${status}${approveStatus}`]
                        }
                        placement="topRight"
                      >
                        <span
                          style={{
                            cursor: 'pointer',
                            color: 'rgba(0,0,0,0.25)'
                          }}
                        >
                          修改所属期
                        </span>
                      </Tooltip>
                    ) : (
                      <ChangeDate
                        month={record.happenTime}
                        money={record.money}
                        onOK={this.onOk}
                        id={record.id}
                      >
                        <a>修改所属期</a>
                      </ChangeDate>
                    )}
                  </>
                ) : (
                  <>
                    <Divider type="vertical" />
                    <Tooltip
                      title="你的统计维度为‘费用发生日期’，一个单据可能存在多个归属时间，请至‘支出明细’修改"
                      placement="topRight"
                    >
                      <span
                        style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
                      >
                        修改所属期
                      </span>
                    </Tooltip>
                  </>
                ))}
            </>
          );
        },
        width: current === '0' ? 150 : 80,
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
            onChange: pageNumber => {
              this.props.onQuery({
                pageNo: pageNumber,
                pageSize: query.pageSize,
                content: searchContent
              });
            },
            total,
            size: 'small',
            showTotal: () => `共${total}条数据`,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (cur, size) => {
              this.props.onQuery({
                pageNo: 1,
                pageSize: size,
                content: searchContent
              });
            }
          }}
        />
      </div>
    );
  }
}

export default SummaryCmp;
