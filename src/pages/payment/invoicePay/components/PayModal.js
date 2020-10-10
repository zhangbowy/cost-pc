import React from 'react';
import { Modal, Form, Select, DatePicker, Button, message, Tooltip, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getArrayValue, signStatus } from '../../../../utils/constants';

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
      prod: '已选单据有非支付宝收款账户，不支持线上支付',
    };
  }

  onShow = () => {
    const { userInfo, selectKey } = this.props;
    this.props.dispatch({
      type: 'global/getAliAccounts',
      payload: {}
    });
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
      let cout = 1;
      let flags = false;
      let amount = 0;
      let prod = '已选单据有非支付宝收款账户，不支持线上支付';
      if (defaultAccount && defaultAccount.length > 0) {
        acc = defaultAccount[0].id;
      }
      if (selectKey) {
        if(selectKey.length === 0) {
          message.error('请至少选择一个标记已付');
          return;
        }
        cout = selectKey.length;
        selectKey.forEach(item => {
          if (item.submitSum) amount+=item.submitSum;
          if (item.accountType !== 1) {
            flags = true;
          }
        });
        // eslint-disable-next-line eqeqeq
        if (Number(amount) < 100) {
          flags = true;
          prod='已选单据付款金额小于1元，请线下支付并标记';
        }
      }

      this.setState({
        visible: true,
        defAcc: acc,
        count: cout,
        amount,
        flag: flags,
        prod,
      }, () => {
        if (acc) {
          this.props.form.setFieldsValue({
            account: acc,
          });
        }
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
      prod: '已选单据有非支付宝收款账户，不支持线上支付'
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
    const { status } = this.state;
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

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator },
      getAliAccounts,
      loading
    } = this.props;
    const { visible, defAcc, count, amount, flag, status, prod } = this.state;
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
                    <Select placeholder="请选择">
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
                    rules: [
                      { validator: this.check }
                    ]
                  })(
                    <Select
                      notFoundContent={(<span>请先添加公司付款支付宝账户，并签约授权</span>)}
                      placeholder="请选择"
                    >
                      {
                        getAliAccounts.map(item => (
                          <Option key={item.payId}>
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
            <Button key="save" onClick={() => this.onSubmit()} loading={loading} disabled={loading} type="primary">确认</Button>
            <Button key="cancel" onClick={() => this.onCancel()} className="m-l-8">取消</Button>
          </div>
        </Modal>
      </span>
    );
  }
}

export default PayModal;
