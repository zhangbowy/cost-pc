import React from 'react';
import { Form, Select, DatePicker, Button, message, Tooltip, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getArrayValue, signStatus } from '../../../../utils/constants';
import ConfirmPay from '../../invoicePay/components/ConfirmPay';
import UploadImg from '../../../../components/UploadImg';
import costGlobal from '../../../../models/costGlobal';
import ModalTemp from '../../../../components/ModalTemp';
import style from './index.scss';

const { Option } = Select;
const accountType = [{
  key: '1',
  value: '标记已付'
}, {
  key: '2',
  value: '线上支付'
}];
@Form.create()
@connect(({ global, session, loading }) => ({
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
      visibleConfirm: false,
      imgUrl: [],
      fee: 0,
    };
  }

  onShow = () => {
    const { userInfo, selectKey } = this.props;
    this.props.dispatch({
      type: 'global/getAliAccounts',
      payload: {}
    });

    let count = 1;
    let amount = 0;
    let fee = 0;
    console.log('selectKey======',selectKey);
    if(selectKey && selectKey[0]){
      count = selectKey[0].failCount;
      amount = selectKey[0].failTransAmount;
      fee = selectKey[0].commission;
    }
    this.props.dispatch({
      type: 'global/payAccount',
      payload: {
        companyId: userInfo.companyId,
        pageNo: 1,
        pageSize: 100,
      }
    }).then(() => {
      const { payAccount } = this.props;
      const accountList = payAccount.filter(it => (Number(it.status) === 1));
      const defaultAccount = accountList.filter(it => it.isDefault);
      let acc = '';
      // let cout = 1;
      // let amount = 0;
      if (defaultAccount && defaultAccount.length > 0) {
        acc = defaultAccount[0].id;
      }
      // if (selectKey) {
      //   if(selectKey.length === 0) {
      //     message.error('请至少选择一个标记已付');
      //     return;
      //   }
      //   cout = selectKey.length;
      //   selectKey.forEach(item => {
      //     if (item.submitSum) amount+=item.submitSum;
      //     if (item.accountType !== 1) {
      //       flags = true;
      //     }
      //   });
      // }

      this.setState({
        visible: true,
        defAcc: acc,
        count,
        amount,
        flag: true,
        fee,
      });
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      imgUrl: [],
    });
  }

  onChangeImg = (val) => {
    this.setState({
      imgUrl: val,
    });
  }

  onSubmit = () => {
    const {
      dispatch,
      selectKey,
      form,
      payAccount,
      onOk,
      templateType,
      getAliAccounts
    } = this.props;
    const { status, imgUrl } = this.state;
    // const _this = this;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let payList = payAccount.filter(it => it.id === values.account);
        if (status !== '1') {
          payList = getAliAccounts.filter(it => it.account === values.account);
        }
        const url = status !== '1' ? 'global/reCreate' : 'batch/rePayment';
        console.log('payList======',payList);
        let params = {
          outBatchNo: selectKey[0].outBatchNo,
          'payId': values.account,
          'payJson': JSON.stringify(payList),
          'payName': payList[0].name,
          'payTime': moment(values.time).format('x'),
          templateType
        };
        if (status !== '1') {
          params = {
            'account': values.account,
            outBatchNo: selectKey[0].outBatchNo,
            payId: payList[0] && payList[0].payId
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
          },
        }).then(() => {
          if (status !== '1') {
            message.success('批量下单成功');
            this.setState({
              visibleConfirm: true,
            });
          } else {
            message.success('标记已付成功');
            onOk();
          }
        });
      }
    });

  }

  onChange = (e) => {
    this.setState({
      status: e.target.value,
    });
  }

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator },
      getAliAccounts,
      dispatch,
      loading,
      userInfo
    } = this.props;
    const { visible, defAcc, count, amount,
      flag, status, visibleConfirm, imgUrl, fee } = this.state;
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
          title="发起支付"
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          size="small"
          newBodyStyle={{
            minHeight: '274px',
            maxHeight: '470px',
            height: 'auto'
          }}
          newDivStyle={{
            minHeight: '274px',
            maxHeight: '470px',
            height: 'auto'
          }}
          footer={[
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">确认</Button>,
            <Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>
          ]}
        >
          <div>
            <p className="c-black-45 fs-14 m-b-30">
              <span>已选
                <span className="fw-500 fs-14 c-black-85 m-l-6 m-r-6">{count}</span>张单据，共计
                <span className="fw-500 fs-14 c-black-85 m-l-6 m-r-6">¥{Number(status) !== 1 ? (amount + fee)/100 : amount/100}</span>
              </span>
              {
                fee > 0 && Number(status) !== 1 &&
                <span className="errorColor fs-12">(付款成功时扣除手续费{fee/100}元）</span>
              }
            </p>
            <Form className="formItem">
              <Form.Item label="付款方式" {...formItemLayout}>
                {
                  getFieldDecorator('accountType', {
                    initialValue: '1',
                  })(
                    <Radio.Group onChange={e => this.onChange(e)}>
                      {
                        accountType.map(it => (
                          <Radio key={it.key} value={it.key} disabled={(flag && it.key === '2')}>{it.value}</Radio>
                        ))
                      }
                    </Radio.Group>
                  )
                }
                {
                  flag &&
                  <Tooltip title={`已失败的${count}条单据收款账户有误，请线下支付`} >
                    <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
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
                      <Select showSearch optionFilterProp="label">
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
                <Form.Item label="付款账户" {...formItemLayout}>
                  {
                    getFieldDecorator('account', {
                      initialValue: defAcc || '',
                      rules: [{ required: true, message: '请选择付款账户' }]
                    })(
                      <Select
                        notFoundContent={(<span>请先添加公司付款支付宝账户，并签约授权</span>)}
                        showSearch
                        optionFilterProp="label"
                      >
                        {
                          getAliAccounts.map(item => (
                            <Option key={item.account} label={item.account}>
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
            {
              status !== '1' &&
              <div className={style.pro}>
                <p>1. 线上支付仅支持收款账户为支付宝和银行卡的单据；</p>
                <p>2. 线上支付到支付宝，免收手续费；</p>
                <p>3. 线上支付到卡，支付宝将按笔收费，每笔代发金额0.1%收费，每笔封顶25元。</p>
              </div>
            }
          </div>
        </ModalTemp>
        <ConfirmPay
          visible={visibleConfirm}
          batchDetails={this.props.batchDetails}
          onOk={() => this.props.onOk()}
          dispatch={dispatch}
        />
      </span>
    );
  }
}

export default PayModal;
