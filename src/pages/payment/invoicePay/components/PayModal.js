import React from 'react';
import { Form, Select, DatePicker, Button, message, Tooltip, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getArrayValue, signStatus } from '../../../../utils/constants';
import UploadImg from '../../../../components/UploadImg';
import ModalTemp from '../../../../components/ModalTemp';
import style from './payModal.scss';

const { Option } = Select;
const accountType = [{
  key: '1',
  value: '标记已付'
}, {
  key: '2',
  value: '线上支付'
}];
@Form.create()
@connect(({ global, session, loading, costGlobal }) => ({
  payAccount: global.payAccount,
  userInfo: session.userInfo,
  getAliAccounts: global.getAliAccounts,
  batchDetails: global.batchDetails,
  alipayUrl: global.alipayUrl,
  paymentMethod: costGlobal.paymentMethod,
  loading: loading.effects['global/addBatch'] || loading.effects['global/send'] || false,
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
      fee: 0,
      prod: '已选单据有非支付宝收款账户，不支持线上支付',
      imgUrl: [],
    };
  }

  onShow = () => {
    const { userInfo, selectKey } = this.props;
    this.props.dispatch({
      type: 'global/getAliAccounts',
      payload: {}
    });
    this.props.dispatch({
      type: 'costGlobal/paymentMethod',
      payload: {}
    }).then(() => {
      this.props.dispatch({
        type: 'global/payAccount',
        payload: {
          companyId: userInfo.companyId,
          pageNo: 1,
          pageSize: 100,
        }
      }).then(() => {
        const { payAccount, paymentMethod } = this.props;
        const accountList = payAccount.filter(it => (Number(it.status) === 1));
        const defaultAccount = accountList.filter(it => it.isDefault);
        let acc = '';
        let cout = 1;
        let flags = false;
        let amount = 0;
        let prod = '已选单据有非支付宝/银行卡收款账户，不支持线上支付';
        let fee = 0;
        // const feeArr = [];
        if (defaultAccount && defaultAccount.length > 0) {
          acc = defaultAccount[0].id;
        }
        if (selectKey) {
          if(selectKey.length === 0) {
            message.error('请至少选择一个发起支付');
            return;
          }
          cout = selectKey.length;
          selectKey.forEach(item => {
            if (item.submitSum) amount+=item.submitSum;
            if (item.accountType !== 1 && item.accountType !== 0) {
              flags = true;
            }
            if (item.accountType === 0 && item.submitSum >= 100) {
              let feeAmount = item.submitSum/1000 > 10 ? Number((item.submitSum/1000).toFixed(0)) : 10;
              if (feeAmount > 2500) feeAmount = 2500;
              fee += feeAmount;
            };
          });
          // eslint-disable-next-line eqeqeq
          if (Number(amount) < 100) {
            flags = true;
            prod='已选单据付款金额小于1元，请线下支付并标记';
          }
        }
        console.log(flags, paymentMethod);
        this.setState({
          visible: true,
          defAcc: acc,
          count: cout,
          amount,
          flag: flags,
          prod,
          fee,
          status: !flags && paymentMethod ? '2' : '1',
        }, () => {
          if (acc) {
            this.props.form.setFieldsValue({
              account: acc,
            });
          }
        });
      });
    });

  }

  onCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      account: '',
    });
    this.setState({
      visible: false,
      status: '1',
      prod: '已选单据有非支付宝/银行卡收款账户，不支持线上支付'
    });
  }

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
          'payId': values.account,
          'payJson': JSON.stringify(payList),
          'payName': payList[0].name,
          'payTime': moment(values.time).format('x'),
          templateType
        };
        if (status !== '1') {
          params = {
            invoiceIds,
            'account': payList[0].account,
            'payId': values.account,
            templateType
          };
        } else {
          params = {
            ...params,
            payVoucherList: imgUrl.length ? imgUrl.map(it => it.imgUrl) : [],
          };
        }
        dispatch({
          type: url,
          payload: {
            ...params,
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
            visible: false,
          });
        });
      }
    });

  }

  onChange = (e) => {
    const { payAccount, getAliAccounts } = this.props;
    this.props.form.setFieldsValue({
      account: '',
    });
    if (e.target.value === '1') {
      const accountList = payAccount.filter(it => (Number(it.status) === 1));
      const defaultAccount = accountList.filter(it => it.isDefault);
      if (defaultAccount && defaultAccount.length) {
        this.props.form.setFieldsValue({
          account: defaultAccount[0].id,
        });
      }
    } else {
      const defa = getAliAccounts.filter(it => it.isDefault);
      if (defa && defa.length) {
        this.props.form.setFieldsValue({
          account: defa[0].payId,
        });
      }
    }
    this.setState({
      status: e.target.value,
    });
  }

  check = (rule, value, callback) => {
    if (value) {
      const { getAliAccounts } = this.props;
      const arr = getAliAccounts.filter(it => it.payId === value);
      if (arr && arr.length && arr[0].status !== 3) {
        callback('请先对公司付款支付宝账户签约授权');
      }
      callback();
    } else {
      callback('请选择付款账户');
    }
  }

  onChangeImg = (val) => {
    this.setState({
      imgUrl: val,
    });
  }

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator },
      getAliAccounts,
      loading,
      userInfo,
      paymentMethod,
    } = this.props;
    const { visible, defAcc, count, amount, flag, status, prod, imgUrl, fee } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <ModalTemp
          title='发起支付'
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={[<Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>,
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">确认</Button>
          ]}
          size="small"
          newBodyStyle={{
            minHeight: '274px',
            maxHeight: '454px',
            height: 'auto'
          }}
          newDivStyle={{
            minHeight: '274px',
            maxHeight: '454px',
            height: 'auto'
          }}
        >
          <>
            <p className="c-black-45 fs-14 m-b-30">
              <span>已选
                <span className="fw-500 fs-14 c-black-85 m-l-6 m-r-6">{count}</span>张单据，共计
                <span className="fw-500 fs-14 c-black-85 m-l-6 m-r-6">¥{amount/100}</span>
              </span>
              {
                fee > 0 && status !== '1' &&
                <span className="errorColor fs-12">(付款成功时扣除手续费{fee/100}元）</span>
              }
            </p>
            {/* <h1 className="fs-24 c-black-85 m-b-16 m-l-16">发起支付</h1> */}
            <Form className="formItem">

              <Form.Item label="付款方式" {...formItemLayout}>
                {
                  getFieldDecorator('accountType', {
                    initialValue: !flag && paymentMethod ? '2' : '1',
                  })(
                    <Radio.Group onChange={e => this.onChange(e)}>
                      {
                        accountType.map(it => (
                          <Radio key={it.key} value={it.key} disabled={flag && it.key === '2'}>{it.value}</Radio>
                        ))
                      }
                    </Radio.Group>
                  )
                }
                {
                  flag &&
                  <Tooltip title={prod}>
                    <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45" style={{ marginLeft: '-5px' }} />
                  </Tooltip>
                }
              </Form.Item>
              {
                status === '1' &&
                <Form.Item label="付款账户" {...formItemLayout}>
                  {
                    getFieldDecorator('account', {
                      initialValue: defAcc || '',
                      rules: [{ required: true, message: '请选择付款账户' }]
                    })(
                      <Select placeholder="请选择" showSearch optionFilterProp="label">
                        {
                          payAccount.map(item => (
                            <Option key={item.id} label={item.name}>{item.name}</Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              }
              {
                status === '2' &&
                <Form.Item label={(<span className="isRequired">付款账户</span>)} {...formItemLayout}>
                  {
                    getFieldDecorator('account', {
                      initialValue: defAcc || '',
                      rules: [
                        { validator: this.check }
                      ]
                    })(
                      <Select
                        notFoundContent={(<span>请先添加公司付款支付宝账户，并签约授权</span>)}
                        placeholder="请选择"
                        showSearch
                        optionFilterProp="label"
                      >
                        {
                          getAliAccounts.map(item => (
                            <Option key={item.payId} label={item.account}>
                              {item.account}
                              (<span>{getArrayValue(item.status, signStatus)}</span>)
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              }
              {
                status === '1' &&
                <Form.Item label="付款时间" {...formItemLayout}>
                  {
                    getFieldDecorator('time', {
                      initialValue: moment(new Date(), 'YYYY-MM-DD'),
                      rules: [{ required: true, message: '请选择付款时间' }]
                    })(
                      <DatePicker />
                    )
                  }
                </Form.Item>
              }
              {
                status === '1' &&
                <Form.Item label="付款凭证" {...formItemLayout}>
                  <UploadImg
                    onChange={(val) => this.onChangeImg(val)}
                    imgUrl={imgUrl}
                    userInfo={userInfo}
                  />
                </Form.Item>
              }
            </Form>
            <div className={style.pro}>
              <p>1. 线上支付仅支持收款账户为支付宝和银行卡的单据；</p>
              <p>2. 线上支付到支付宝，免收手续费；</p>
              <p>3. 线上支付到卡，支付宝将按笔收费，每笔代发金额0.1%收费，每笔封顶25元。</p>
            </div>
          </>
        </ModalTemp>
      </span>
    );
  }
}

export default PayModal;
