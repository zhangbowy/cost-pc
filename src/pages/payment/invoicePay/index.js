import React from 'react';
import { message, Form, Modal, Divider, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
// import Search from 'antd/lib/input/Search';
import { rowSelect } from '@/utils/common';
import constants from '@/utils/constants';
import Tags from '@/components/Tags';
import PayTemp from './components/PayTemp';
import PayModal from './components/PayModal';
import { JsonParse } from '../../../utils/common';
import { getArrayValue, accountType, filterAccount } from '../../../utils/constants';
import ConfirmPay from './components/ConfirmPay';
import { ddPreviewImage } from '../../../utils/ddApi';
import TableImg from '../../../components/LittleCmp/TableImg';
import treeConvert from '../../../utils/treeConvert';

const { confirm } = Modal;
const { APP_API } = constants;
@Form.create()
@connect(({ loading, payment, global, costGlobal }) => ({
  loading: loading.effects['payment/list'] || false,
  list: payment.list,
  query: payment.query,
  total: payment.total,
  isViewVoucher: payment.isViewVoucher,
  batchDetails: global.batchDetails,
  recordList: payment.recordList,
  recordPage: payment.recordPage,
  recordTotal: payment.recordTotal,
  officeListAndRole: costGlobal.officeListAndRole,
}))
class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
      selectedRows: [],
      visibleConfirm: false,
      visible: false,
      officeList: [],
    };
  }

  componentDidMount() {
    this.getOffice();
  }

  handleClick = e => {
    const { query } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { searchContent } = this.state;
    this.setState({
      status: e.key,
      selectedRowKeys: [],
      selectedRows: [],
      sumAmount: 0,
    });
    this.onQuery({
      ...query,
      status: e.key,
      searchContent,
      startTime,
      endTime,
      pageNo: 1,
    });
  };

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
    });
  };

  onSelect = (record, selected) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onSelect(this.state, record, selected);
      console.log(selectedRowKeys);
      let amount = 0;
      selectedRows.forEach(item => {
        amount+=item.submitSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount,
      });
  };

  onDelete = (id) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
      let amount = 0;
      selectedRows.forEach(item => {
        amount+=item.submitSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount,
      });
  };

  onOk = (val) => {
    const {
      query,
    } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
        sumAmount: 0,
      });
    }
    const { status, searchContent } = this.state;
    const obj = {
      pageSize: query.pageSize,
      pageNo: 1,
      status,
      startTime,
      endTime,
      searchContent,
    };
    this.onQuery({ ...obj });
  }

  handChange = (date) => {
    if (!date) {
      const { status, searchContent } = this.state;
      const {
        query,
      } = this.props;
      this.onQuery({
        ...query,
        status,
        searchContent,
      });
    }
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    if (payload.status) {
      Object.assign(payload, {
        status: Number(payload.status) === 1 ? 2 : payload.status,
        isSign: Number(payload.status) === 1,
      });
    }
    this.props.dispatch({
      type: 'payment/list',
      payload: {
        ...payload,
        accountTypes: payload.accountTypes || []
      },
    });
  }

  onChange = (rows, keys) => {
    let amount = 0;
    keys.forEach(item => {
      if (item.submitSum) {
        amount+=item.submitSum;
      }
    });
    this.setState({
      selectKey: keys,
      count: keys.length,
      sumAmount: amount/100,
    });
  }

  onSearch = (val) => {
    const { query } = this.props;
    const { status } = this.state;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    this.setState({
      searchContent: val,
    });
    this.onQuery({
      ...query,
      searchContent: val,
      status,
      startTime,
      endTime,
    });
  }

  export = (key) => {
    const { selectedRowKeys, status, searchContent } = this.state;
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let params = {};
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    let url = 'payment/exporting';
    if (key === '1') {
      params = {
        ids: selectedRowKeys
      };
    } else if (key === '2') {
      params = {
        searchContent,
        startTime,
        endTime,
      };
    }
    if(Number(status) !== 2) {
      url = 'payment/exported';
    }
    this.props.dispatch({
      type: url,
      payload: {
        ...params,
      }
    }).then(() => {
      message.success('导出成功');
    });
  }

  print = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 1) {
      message.error('只支持打印一条数据');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${selectedRowKeys[0]}`;
  }

  // 拒绝
  handleRefuse = (val) => {
    confirm({
      title: '确认拒绝该单据？',
      onOk: () => {
        this.props.dispatch({
          type: 'payment/refuse',
          payload: {
            invoiceSubmitIds: [val.id],
            rejectNote: val.rejectNote,
            templateType: 0,
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
      type: 'payment/operationSign',
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
      templateType: 0,
    });
    this.props.dispatch({
      type: 'payment/record',
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
        type: 'payment/operationSign',
        payload,
      }).then(() => {
        message.success(payload.isSign ? '已完成票签' : '已退回签收人重新签收');
        this.onOk();
        resolve(true);
      });
    });
  }

  getOffice = () => {
    console.log('这里是分公司列表');
    this.props.dispatch({
      type: 'costGlobal/officeListAndRole',
      payload: {},
    }).then(() => {
      const { officeListAndRole } = this.props;
      console.log('🚀 ~ file: index.js ~ line 375 ~ Payment ~ officeListAndRole', officeListAndRole);
      const list = treeConvert({
        rootId: 0,
        pId: 'parentId',
        name: 'officeName',
        tName: 'title',
        tId: 'value',
        otherKeys: ['parentId']
      }, officeListAndRole);
      this.setState({
        officeList: list,
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
    const { status, visibleConfirm, selectedRowKeys, selectedRows, officeList } = this.state;
    const columns = [{
      title: '报销事由',
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
      title: '付款金额(元)',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      width: 100,
      className: 'moneyCol',
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 130,
    }, {
      title: '账户类型',
      dataIndex: 'accountType',
      width: 80,
      filters: filterAccount,
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
            {
              account && account[0] && account[0].qrUrl &&
              <img
                src={account[0].qrUrl}
                onClick={() => this.previewImage(account[0].qrUrl, 0)}
                alt="二维码"
                style={{ width: '40px', height: '40px', borderRadius: '4px', marginLeft: '4px' }}
              />
            }
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
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            Number(record.status) === 2 &&
              <PayModal onOk={(val) => this.onOk(val)} data={record} templateType={0} selectKey={[record]} confirms={() => this.onConfirm()}>
                <a>发起支付</a>
              </PayModal>
          }
          {
            Number(record.status) === 2 &&
            <Divider type="vertical" />
          }
          <InvoiceDetail
            id={record.invoiceId}
            canRefuse={Number(record.status) === 2}
            refuse={this.handleRefuse}
            templateId={record.invoiceTemplateId}
            templateType={0}
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
          namespace="payment"
          list={list}
          query={query}
          total={total}
          loading={loading}
          templateType={0}
          onQuerys={val => this.onQuery(val)}
          columns={columns}
          onChangeStatus={(val) => this.onChangeStatus(val)}
          confirm={() => this.onConfirm()}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          operationSign={this.operationSign}
          recordList={recordList}
          recordPage={{...recordPage, total: recordTotal}}
          onRecord={this.onRecord}
          officeList={officeList}
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
