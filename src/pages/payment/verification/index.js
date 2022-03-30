import React from 'react';
import { message, Modal, Divider, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';
import PayTemp from './components/PayTemp';
import PayModal from './components/PayModal';
import ConfirmPay from './components/ConfirmPay';
import { ddPreviewImage } from '../../../utils/ddApi';
import imgs from '../../../assets/img/refuse.png';
import style from './index.scss';

const { confirm } = Modal;
@connect(({ loading,verification, costGlobal }) => ({
  loading: loading.effects['verification/list'] || false,
  list: verification.list,
  query: verification.query,
  total: verification.total,
  isViewVoucher: verification.isViewVoucher,
  batchDetails: verification.batchDetails,
  recordList: verification.recordList,
  recordPage: verification.recordPage,
  recordTotal: verification.recordTotal,
  isModifyInvoice: costGlobal.isModifyInvoice,
  officeListAndRole: costGlobal.officeListAndRole
}))
class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      selectedRows: [],
      visibleConfirm: false,
      searchList: [
        {
          type: 'search',
          label: '外部选择',
          placeholder: '单号、事由、收款人',
          key: 'searchContent',
          id: 'searchContent',
          out: 1
        },
        {
          type: 'rangeTime',
          label: '提交时间',
          placeholder: '请选择',
          key: ['startTime', 'endTime'],
          id: 'startTime',
          out: 1
        },
        {
          type: 'deptAndUser',

          label: '提交部门/人',
          placeholder: '请选择',
          key: ['users', 'depts'],
          id: 'userVOS',
          out: 1
        }
      ],
      isShow: true
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'costGlobal/queryModifyOrder',
      payload: {}
    });
    this.getOffice();
  }

  onChangeSearch = (val, callback) => {
    this.setState(
      {
        searchList: val
      },
      () => {
        if (callback) callback();
      }
    );
  };

  onOk = val => {
    const { query } = this.props;
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: []
      });
    }
    const { status } = this.state;
    const obj = {
      pageSize: query.pageSize,
      pageNo: 1,
      status
    };
    this.onQuery({ ...obj });
  };

  onQuery = payload => {
    if (payload.status) {
      Object.assign(payload, {
        status: Number(payload.status) === 1 ? 2 : payload.status,
        // isSign: Number(payload.status) === 1
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
      type: 'verification/list',
      payload: {
        ...payload,
      }
    });
  };

  // 拒绝
  handleRefuse = val => {
    confirm({
      title: '确认拒绝该单据？',
      onOk: () => {
        this.props
          .dispatch({
            type: 'verification/refuse',
            payload: {
              invoiceIds: [val.id],
              rejectNote: val.rejectNote,
              templateType: 20
            }
          })
          .then(() => {
            // callback();
            message.success('拒绝成功');
            this.onOk();
          });
      }
    });
  };

  onChangeStatus = val => {
    this.setState({
      status: val
    });
  };

  onConfirm = () => {
    this.onOk();
    console.log('确认一下');
    this.setState({
      visibleConfirm: true
    });
  };

  onChangeVisible = () => {
    this.setState({
      visibleConfirm: false
    });
  };

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: [arr],
      index
    });
  };

  operationSign = (payload, callback) => {
    this.props
      .dispatch({
        type: 'verification/operationSign',
        payload
      })
      .then(() => {
        message.success(payload.isSign ? '已完成票签' : '已退回签收人重新签收');
        if (callback) {
          callback();
        }
      });
  };

  onRecord = (payload, callback) => {
    Object.assign(payload, {
      templateType: 0
    });
    this.props
      .dispatch({
        type: 'verification/record',
        payload
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  };

  onSign = payload => {
    return new Promise(resolve => {
      this.props
        .dispatch({
          type: 'payment/operationSign',
          payload
        })
        .then(() => {
          message.success(
            payload.isSign ? '已完成票签' : '已退回签收人重新签收'
          );
          this.onOk();
          resolve(true);
        });
    });
  };

  getOffice = () => {
    this.props
      .dispatch({
        type: 'costGlobal/officeListAndRole',
        payload: {}
      })
      .then(() => {
        const { searchList } = this.state;
        const arr = [...searchList];
        const { officeListAndRole } = this.props;
        if (officeListAndRole.length) {
          arr.splice(1, 0, {
            type: 'select',
            label: '分公司',
            placeholder: '请选择',
            key: 'officeId',
            id: 'officeId',
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
          searchList: arr
        });
      });
  };

  render() {
    const {
      list,
      query,
      total,
      loading,
      batchDetails,
      dispatch,
      recordList,
      recordPage,
      recordTotal,
      officeListAndRole
    } = this.props;
    const {
      status,
      visibleConfirm,
      selectedRowKeys,
      selectedRows,
      searchList,
      isShow
    } = this.state;
    const refuse = localStorage.getItem('refuseShow');
    const columns = [
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 140,
        render: (_, record) => (
          <span style={{ display: 'flex' }}>
            <Tooltip placement="topLeft" title={record.invoiceNo || ''}>
              <span className="eslips-2 m-r-8">{record.invoiceNo}</span>
            </Tooltip>
          </span>
        )
      },
      {
        title: '收款单金额(元)',
        dataIndex: 'originIncomeSum',
        render: text => <span>{text / 100}</span>,
        width: 100
      },
      {
        title: '业务员',
        dataIndex: 'userName',
        render: text => (
          <span>{ text || '-'}</span>
        ),
        width: 120
      },
      {
        title: '单据类型',
        dataIndex: 'incomeTemplateName',
        width: 120,
        render: text => <span>{text || '-'}</span>
      },
      {
        title: '收款账户名称',
        dataIndex: 'receiptName',
        width: 120,
        render: (_, record) => {
          let name = record.receiptName;
          if (
            record.supplierAccountVo &&
            record.supplierAccountVo.supplierAccountName
          ) {
            name = record.supplierAccountVo.supplierAccountName;
          }
          return <span>{name || '-'}</span>;
        }
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: text => (
          <span>{text && moment(text).format('YYYY-MM-DD')}</span>
        ),
        width: 120
      },
      {
        title: '操作',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {Number(record.status) === 2 && (
              <PayModal
                onOk={val => this.onOk(val)}
                data={record}
                templateType={0}
                selectKey={[record]}
                confirms={() => this.onConfirm()}
              >
                <a>发起收款</a>
              </PayModal>
            )}
            {Number(record.status) === 2 && <Divider type="vertical" />}
            <IncomeInvoiceDetail
              id={record.invoiceId}
              refuse={this.handleRefuse}
              templateId={record.invoiceTemplateId}
              templateType={20}
              allow="modify"
              onCallback={() => this.onOk()}
              signCallback={this.onSign}
              title="收款单详情"
            >
              <a>查看</a>
            </IncomeInvoiceDetail>
          </span>
        ),
        width: 135,
        fixed: 'right',
        className: 'fixCenter'
      }
    ];

    if (Number(status) === 5) {
      columns.splice(
        1,
        0,
        {
          title: '拒绝理由',
          dataIndex: 'refuseReason',
          width: 120
        },
        {
          title: '拒绝时间',
          dataIndex: 'refuseTime',
          width: 100,
          render: text => (
            <span>{text && moment(text).format('YYYY-MM-DD')}</span>
          )
        }
      );
    }
    return (
      <>
        {!refuse && isShow && (
          <div
            className={style.mask}
            onClick={() => {
              localStorage.setItem('refuseShow', '1');
              this.setState({ isShow: false });
            }}
          >
            <img src={imgs} alt="遮罩" />
          </div>
        )}
        <PayTemp
          {...this.props}
          namespace="payment"
          list={list}
          query={query}
          total={total}
          loading={loading}
          templateType={0}
          onQuerys={val => this.onQuery(val)}
          columns={columns}
          onChangeStatus={val => this.onChangeStatus(val)}
          confirm={() => this.onConfirm()}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          operationSign={this.operationSign}
          recordList={recordList}
          recordPage={{ ...recordPage, total: recordTotal }}
          onRecord={this.onRecord}
          officeList={officeListAndRole}
          onChangeSearch={this.onChangeSearch}
          searchList={searchList}
          isModifyInvoice={this.props.isModifyInvoice}
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

export default Payment;
