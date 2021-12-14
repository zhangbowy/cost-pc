import React from 'react';
import { message, Modal, Divider, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Tags from '@/components/Tags';
import PayTemp from '../invoicePay/components/PayTemp';
import { JsonParse } from '../../../utils/common';
import { getArrayValue, accountType, filterAccount } from '../../../utils/constants';
import PayModal from '../invoicePay/components/PayModal';
import ConfirmPay from '../invoicePay/components/ConfirmPay';
import { ddPreviewImage } from '../../../utils/ddApi';
import TableImg from '../../../components/LittleCmp/TableImg';

const { confirm } = Modal;
@connect(({ loading, borrowPay, costGlobal }) => ({
  loading: loading.effects['borrowPay/list'] || false,
  list: borrowPay.list,
  query: borrowPay.query,
  total: borrowPay.total,
  isViewVoucher: borrowPay.isViewVoucher,
  recordList: borrowPay.recordList,
  recordPage: borrowPay.recordPage,
  recordTotal: borrowPay.recordTotal,
  officeListAndRole: costGlobal.officeListAndRole,
}))
class BorrowPay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      searchList: [{
        type: 'rangeTime',
        label: '提交时间',
        placeholder: '请选择',
        key: ['startTime', 'endTime'],
        id: 'startTime',
        out: 1
      },
      {
        type: 'search',
        label: '外部选择',
        placeholder: '单号、事由、收款人',
        key: 'searchContent',
        id: 'searchContent',
        out: 1
      }],
      visibleConfirm: false,
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.getOffice();
    this.onQuery({
      ...query,
      status: 2,
    });
  }

  onChangeSearch = (val,callback) => {
    this.setState({
        searchList: val
    }, () => {
        if (callback) callback();
      }
    );
  }

  onOk = (val) => {
    const {
      query,
    } = this.props;
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      });
    }
    const { status } = this.state;
    const obj = {
      pageSize: query.pageSize,
      pageNo: 1,
      status,
    };
    this.onQuery(obj);
  }

  onQuery = (payload) => {
    if (payload.status) {
      Object.assign(payload, {
        status: Number(payload.status) === 1 ? 2 : payload.status,
        isSign: Number(payload.status) === 1,
      });
    }
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value
        });
      }
    });
    this.props.dispatch({
      type: 'borrowPay/list',
      payload: {
        ...payload,
        accountTypes: payload.accountTypes || []
      },
    });
  }

  // 拒绝
  handleRefuse = (val) => {
    confirm({
      title: '确认拒绝该单据？',
      onOk: () => {
        this.props.dispatch({
          type: 'borrowPay/refuse',
          payload: {
            invoiceSubmitIds: [val.id],
            rejectNote: val.rejectNote,
            templateType: 1,
          }
        }).then(() => {
          // callback();
          message.success('拒绝成功');
          this.onOk();
        });
      }
    });
  }

  onChangeStatus = (val) => {
    this.setState({
      status: val,
    });
  }

  onConfirm = () => {
    this.onOk();
    console.log('确认一下');
    this.setState({
      visibleConfirm: true,
    });
  }

  onChangeVisible = () => {
    this.setState({
      visibleConfirm: false,
    });
  }

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: [arr],
      index,
    });
  }

  operationSign = (payload, callback) => {
    this.props.dispatch({
      type: 'borrowPay/operationSign',
      payload,
    }).then(() => {
      message.success(payload.isSign ? '已完成票签' : '已退回签收人重新签收');
      if (callback) {
        callback();
      }
    });
  }

  onRecord = (payload, callback) => {
    Object.assign(payload, {
      templateType: 1,
    });
    this.props.dispatch({
      type: 'borrowPay/record',
      payload,
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }

  onSign = (payload) => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'borrowPay/operationSign',
        payload,
      }).then(() => {
        message.success(payload.isSign ? '已完成票签' : '已退回签收人重新签收');
        this.onOk();
        resolve(true);
      });
    });
  }

  getOffice = () => {
    this.props.dispatch({
      type: 'costGlobal/officeListAndRole',
      payload: {},
    }).then(() => {
      const { searchList } = this.state;
      const arr = [...searchList];
      const { officeListAndRole } = this.props;
      if (officeListAndRole.length) {
        arr.splice(1,0,{
          type: 'select',
          label: '分公司',
          placeholder: '请选择',
          key: 'officeIds',
          id: 'officeIds',
          options: officeListAndRole,
          fileName: {
            key: 'id',
            name: 'officeName'
          },
          out: 1
        });
      }
      console.log('🚀 ~ file: index.js ~ line 404 ~ Payment ~ arr', arr);
      this.setState({
        searchList: arr,
      });
    });
  }

  render() {
    const {
      list,
      query,
      total,
      loading,
      batchDetails,
      dispatch,
      isViewVoucher,
      recordList,
      recordPage,
      recordTotal,
    } = this.props;
    const {
      status,
      visibleConfirm,
      selectedRowKeys,
      selectedRows,
      searchList,
    } = this.state;
    const columns = [{
      title: '借款事由',
      dataIndex: 'reason',
      width: 140,
      render: (_, record) => (
        <span style={{display: 'flex'}}>
          <Tooltip placement="topLeft" title={record.reason || ''}>
            <span className="eslips-2 m-r-8">{record.reason}</span>
          </Tooltip>
          {
            record.isModify &&
              <Tags color='rgba(0, 199, 149, 0.08)'>改单</Tags>
          }
        </span>
      ),
    }, {
      title: '借款金额(元)',
      dataIndex: 'loanSum',
      render: (text) => (
        <span>{text ? text/100 : ''}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 130,
    }, {
      title: '账户类型',
      dataIndex: 'accountType',
      filters: filterAccount,
      width: 80,
      render: (text) => (
        <span>{`${text}` ? getArrayValue(text, accountType) : '-'}</span>
      ),
      className: 'moneyCol',
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 120,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '收款账户名称',
      dataIndex: 'receiptName',
      width: 120,
      render: (_, record) => {
        let name = record.receiptName;
        if (record.supplierAccountVo && record.supplierAccountVo.supplierAccountName) {
          name = record.supplierAccountVo.supplierAccountName;
        }
        return (
          <span>{name || '-'}</span>
        );
      }
    }, {
      title: '个人/供应商收款账户',
      dataIndex: 'receiptNameJson',
      render: (_, record) => {
        let account = record.receiptNameJson && JsonParse(record.receiptNameJson);
        if (record.supplierAccountVo && record.supplierAccountVo.supplierAccountName) {
          account = [{
            ...record.supplierAccountVo,
            type: record.supplierAccountVo.accountType,
            account: record.supplierAccountVo.supplierAccount,
          }];
        }
        return (
          <span>
            {account && account[0] && account[0].type ? getArrayValue(account[0].type, accountType) : ''}
            { account && account[0] && account[0].bankName }
            { account && account[0] && account[0].account }
            {!account && '-'}
          </span>
        );
      },
      width: 140,
    }, {
      title: '提交人',
      dataIndex: 'createName',
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '预计还款日期',
      dataIndex: 'repaymentTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            Number(status) === 2 &&
              <PayModal
                onOk={(val) => this.onOk(val)}
                data={record}
                templateType={1}
                selectKey={[record]}
                confirms={() => this.onConfirm()}
              >
                <a>发起支付</a>
              </PayModal>
          }
          {
            Number(status) === 2 &&
            <Divider type="vertical" />
          }
          <InvoiceDetail
            id={record.invoiceId}
            templateId={record.invoiceTemplateId}
            canRefuse={Number(record.status) === 2}
            refuse={this.handleRefuse}
            templateType={1}
            allow="modify"
            onCallback={() => this.onOk()}
            signCallback={this.onSign}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 140,
      fixed: 'right',
      className: 'fixCenter'
    }];
    if(Number(status) !== 2) {
      columns.splice(8, 0, {
        title: '发放人',
        dataIndex: 'payUserName',
        width: 100,
      }, {
        title: '付款时间',
        dataIndex: 'payTime',
        render: (text) => (
          <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
        ),
        width: 100,
      }, {
        title: '付款账户',
        dataIndex: 'payNameJson',
        render: (_, record) => {
          const account = record.payNameJson && JsonParse(record.payNameJson);
          return (
            <span>
              {account && account[0] && account[0].type ? getArrayValue(account[0].type, accountType) : ''}
              <span className="m-r-8">{ account && account[0] && account[0].bankName }</span>
              { account && account[0] && account[0].account }
            </span>
          );
        },
        width: 140,
      }, {
        title: '付款账户名称',
        dataIndex: 'payName',
        render: (_, record) => {
          const account = record.payNameJson && JsonParse(record.payNameJson);
          return (
            <span>
              { account && account[0] && account[0].name }
            </span>
          );
        },
        width: 140,
      });
    };
    if (isViewVoucher) {
      columns.splice(12, 0, {
        title: '付款凭证',
        dataIndex: 'payVoucher',
        width: 100,
        render: (_, record) => (
          <>
            {
              record.payVoucher && record.payVoucher.length ?
                <TableImg imgUrl={record.payVoucher} />
                :
                '-'
            }
          </>
        )
      });
    }
    return (
      <>
        <PayTemp
          {...this.props}
          list={list}
          query={query}
          total={total}
          loading={loading}
          templateType={1}
          columns={columns}
          onQuerys={val => this.onQuery(val)}
          onChangeStatus={(val) => this.onChangeStatus(val)}
          namespace="borrowPay"
          confirm={() => this.onConfirm()}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          operationSign={this.operationSign}
          recordList={recordList}
          recordPage={{...recordPage, total: recordTotal}}
          onRecord={this.onRecord}
          searchList={searchList}
          onChangeSearch={this.onChangeSearch}
        />
        <ConfirmPay
          batchDetails={batchDetails}
          visible={visibleConfirm}
          onOk={() => this.props.onOk()}
          onCancels={() => this.onCancel()}
          dispatch={dispatch}
          gotoPay={() => this.onChangeVisible()}
        />
      </>
    );
  }
}

export default BorrowPay;
