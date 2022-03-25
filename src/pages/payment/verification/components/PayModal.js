import React from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Tooltip,
  Table,
  InputNumber
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cs from 'classnames';
import UploadImg from '../../../../components/UploadImg';
import styles from './index.scss';
import { rowSelect } from '../../../../utils/common';

const { Option } = Select;
@Form.create()
@connect(({ global, session, loading, costGlobal }) => ({
  payAccount: global.payAccount,
  userInfo: session.userInfo,
  getAliAccounts: global.getAliAccounts,
  batchDetails: global.batchDetails,
  alipayUrl: global.alipayUrl,
  paymentMethod: costGlobal.paymentMethod,
  loading:
    loading.effects['global/addBatch'] ||
    loading.effects['global/send'] ||
    false
}))
class PayModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defAcc: '',
      count: 1,
      amount: 0,
      flag: false,
      status: '1',
      prod: '已选单据有非支付宝收款账户，不支持线上支付',
      imgUrl: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  }

  onShow = () => {
    const { userInfo, selectKey } = this.props;
    this.props.dispatch({
      type: 'global/getAliAccounts',
      payload: {}
    });
    this.props
      .dispatch({
        type: 'costGlobal/paymentMethod',
        payload: {}
      })
      .then(() => {
        this.props
          .dispatch({
            type: 'global/payAccount',
            payload: {
              companyId: userInfo.companyId,
              pageNo: 1,
              pageSize: 100
            }
          })
          .then(() => {
            const { payAccount, paymentMethod } = this.props;
            const accountList = payAccount.filter(
              it => Number(it.status) === 1
            );
            const defaultAccount = accountList.filter(it => it.isDefault);
            let acc = '';
            let cout = 1;
            let flags = false;
            let amount = 0;
            let prod = '已选单据有非支付宝收款账户，不支持线上支付';
            if (defaultAccount && defaultAccount.length > 0) {
              acc = defaultAccount[0].id;
            }
            if (selectKey) {
              if (selectKey.length === 0) {
                message.error('请至少选择一个发起收款');
                return;
              }
              cout = selectKey.length;
              selectKey.forEach(item => {
                if (item.submitSum) amount += item.submitSum;
                if (item.accountType !== 1) {
                  flags = true;
                }
              });
              // eslint-disable-next-line eqeqeq
              if (Number(amount) < 100) {
                flags = true;
                prod = '已选单据付款金额小于1元，请线下支付并标记';
              }
            }
            console.log(flags, paymentMethod);
            this.setState(
              {
                visible: true,
                defAcc: acc,
                count: cout,
                amount,
                flag: flags,
                prod,
                status: !flags && paymentMethod ? '2' : '1'
              },
              () => {
                if (acc) {
                  this.props.form.setFieldsValue({
                    account: acc
                  });
                }
              }
            );
          });
      });
  };

  onCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      account: ''
    });
    this.setState({
      visible: false,
      status: '1',
      prod: '已选单据有非支付宝收款账户，不支持线上支付'
    });
  };

  onSubmit = () => {
    const {
      data,
      dispatch,
      selectKey,
      form,
      payAccount,
      onOk,
      templateType,
      getAliAccounts,
      confirms
    } = this.props;
    const { status, imgUrl } = this.state;
    // const _this = this;
    form.validateFieldsAndScroll((err, values) => {
      console.log(err);
      if (!err) {
        console.log(moment(values.time).format('x'));
        let invoiceIds = [];
        if (selectKey) {
          invoiceIds = selectKey.map(it => it.invoiceId);
        } else {
          invoiceIds = [data.invoiceId];
        }
        let payList = payAccount.filter(it => it.id === values.account);
        if (status !== '1') {
          payList = getAliAccounts.filter(it => it.payId === values.account);
        }
        const url = status !== '1' ? 'global/addBatch' : 'global/send';
        let params = {
          invoiceIds,
          payId: values.account,
          payJson: JSON.stringify(payList),
          payName: payList[0].name,
          payTime: moment(values.time).format('x'),
          templateType
        };
        if (status !== '1') {
          params = {
            invoiceIds,
            account: payList[0].account,
            payId: values.account,
            templateType
          };
        } else {
          params = {
            ...params,
            payVoucherList: imgUrl.length ? imgUrl.map(it => it.imgUrl) : []
          };
        }
        dispatch({
          type: url,
          payload: {
            ...params
          }
        }).then(() => {
          if (status !== '1') {
            message.success('批量下单成功');
            confirms();
          } else {
            message.success('标记已付成功');
          }
          this.onCancel();
          onOk(true);
          this.setState({
            visible: false
          });
        });
      }
    });
  };

  onChange = e => {
    const { payAccount, getAliAccounts } = this.props;
    this.props.form.setFieldsValue({
      account: ''
    });
    if (e.target.value === '1') {
      const accountList = payAccount.filter(it => Number(it.status) === 1);
      const defaultAccount = accountList.filter(it => it.isDefault);
      if (defaultAccount && defaultAccount.length) {
        this.props.form.setFieldsValue({
          account: defaultAccount[0].id
        });
      }
    } else {
      const defa = getAliAccounts.filter(it => it.isDefault);
      if (defa && defa.length) {
        this.props.form.setFieldsValue({
          account: defa[0].payId
        });
      }
    }
    this.setState({
      status: e.target.value
    });
  };

  check = (rule, value, callback) => {
    if (value) {
      const { getAliAccounts } = this.props;
      const arr = getAliAccounts.filter(it => it.payId === value);
      if (arr && arr.length && arr[0].status !== 3) {
        callback('请先对公司收款支付宝账户签约授权');
      }
      callback();
    } else {
      callback('请选择收款账户');
    }
  };

  onChangeImg = val => {
    this.setState({
      imgUrl: val
    });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(
      this.state,
      selected,
      changeRows,
      'key'
    );
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    this.setState({
      selectedRowKeys,
      selectedRows: _selectedRows
    });
  };

  onSelect = (record, selected) => {
    const { selectedRows, selectedRowKeys } = rowSelect.onSelect(
      this.state,
      record,
      selected,
      'key'
    );
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator },
      loading,
      userInfo,
    } = this.props;
    const {
      visible,
      defAcc,
      count,
      amount,
      status,
      imgUrl,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'invoiceNo',
        width: 60,
        render: () => <span style={{ display: 'flex' }} />
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: 130,
        render: (_, record) => (
          <span style={{ display: 'flex' }}>
            <Tooltip placement="topLeft" title={record.invoiceNo || ''}>
              <span className="eslips-2 m-r-8">{record.invoiceNo}</span>
            </Tooltip>
          </span>
        )
      },
      {
        title: '业务员',
        dataIndex: 'invoiceNo',
        width: 100
      },
      {
        title: '部门',
        dataIndex: 'invoiceNo',
        width: 100
      },
      {
        title: '应收金额(元)',
        dataIndex: 'submitSum',
        render: text => <span>{text / 100}</span>,
        width: 100
      },
      {
        title: '已收金额(元)',
        dataIndex: '2',
        render: text => <span>{text / 100}</span>,
        width: 100
      },
      {
        title: '本次核销(元)',
        dataIndex: '3',
        render: (_, record) => {
          return (
            <Form>
              <Form.Item className={styles.verifyMoney}>
                {getFieldDecorator(`shareAmount[${record.key}]`, {
                  initialValue: record.shareAmount,
                  rules: [{ validator: this.check }]
                })(
                  <InputNumber
                    className={styles.verifyMoneyInput}
                    placeholder="请输入核销金额"
                    min={0}
                    onChange={val => this.onInputAmount(val, record.key)}
                  />
                )}
              </Form.Item>
            </Form>
          );
        },
        width: 120
      }
    ];

    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="发起收款"
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={
            <div style={{ marginLeft: '12.5%' }}>
              <span
                className={cs(styles.chooseRowCount, 'fs-14 m-b-47 m-l-16')}
              >
                已选<span className="c-black-85 m-r-3 m-l-4">{count}</span>
                张单据，核销总计{' '}
                <span className={cs(styles.totalAmount, 'm-r-7')}>
                  ¥{amount / 100}
                </span>
              </span>
              <Button
                key="cancel"
                onClick={() => this.onCancel()}
                className="m-l-8"
              >
                取消
              </Button>
              <Button
                key="save"
                onClick={() => this.onSubmit()}
                loading={loading}
                disabled={loading}
                type="primary"
              >
                确认核销
              </Button>
            </div>
          }
          width="936px"
          bodyStyle={{
            height: '612px'
          }}
          className={styles.verifyPopWrap}
        >
          {/* <h1 className="fs-24 c-black-85 m-b-16 m-l-16">发起收款</h1> */}
          <Form className="formItem">
            {status === '1' && (
              <Form.Item
                label="收款账户"
                style={{ width: 306, display: 'inline-block', marginRight: 84 }}
              >
                {getFieldDecorator('account', {
                  initialValue: defAcc || '',
                  rules: [{ required: true, message: '请选择收款账户' }]
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="label"
                  >
                    {payAccount.map(item => (
                      <Option key={item.id} label={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
            {status === '1' && (
              <Form.Item
                label="收款时间"
                style={{ width: 306, display: 'inline-block' }}
              >
                {getFieldDecorator('time', {
                  initialValue: moment(new Date(), 'YYYY-MM-DD'),
                  rules: [{ required: true, message: '请选择收款时间' }]
                })(<DatePicker />)}
              </Form.Item>
            )}
            {status === '1' && (
              <Form.Item label="收款凭证">
                <UploadImg
                  onChange={val => this.onChangeImg(val)}
                  imgUrl={imgUrl}
                  userInfo={userInfo}
                />
              </Form.Item>
            )}
          </Form>
          <Table
            columns={columns}
            dataSource={[{}]}
            pagination={false}
            rowSelection={rowSelection}
            rowKey="key"
          />
        </Modal>
      </span>
    );
  }
}

export default PayModal;
