import React from 'react';
import { Modal, Form, Select, DatePicker, Button, message, Tooltip, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getArrayValue, signStatus } from '../../../../utils/constants';
import ConfirmPay from '../../invoicePay/components/ConfirmPay';

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
    console.log('selectKey======',selectKey);
    if(selectKey && selectKey[0]){
      count = selectKey[0].failCount;
      amount = selectKey[0].failTransAmount;
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
      const flags = false;
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
        flag: flags,
      });
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
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
    const { status } = this.state;
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
      loading
    } = this.props;
    const { visible, defAcc, count, amount, flag, status, visibleConfirm } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={null}
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={null}
          width="680px"
          bodyStyle={{
            height: '450px',
            padding: '40px'
          }}
        >
          <h1 className="fs-24 c-black-85 m-b-16">发起支付</h1>
          <Form className="formItem">
            <p className="c-black-85 fs-14 m-b-47">已选 {count}张单据，共计 <span className="fw-500 fs-20">¥{amount/100}</span></p>
            <Form.Item label="付款方式" {...formItemLayout}>
              {
                getFieldDecorator('accountType', {
                  initialValue: '1',
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
                <Tooltip title="已选单据有非支付宝收款账户，不支持线上支付">
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
                    <Select>
                      {
                        payAccount.map(item => (
                          <Option key={item.id}>{item.name}</Option>
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
                    >
                      {
                        getAliAccounts.map(item => (
                          <Option key={item.account}>
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
          </Form>
          <div style={{ marginLeft: '12.5%' }}>
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">保存</Button>
            <Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>
          </div>
        </Modal>
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
