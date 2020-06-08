import React from 'react';
import { Modal, Form, Select, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formItemLayout } from '@/utils/constants';

const { Option } = Select;
@Form.create()
@connect(({ global, session }) => ({
  payAccount: global.payAccount,
  userInfo: session.userInfo,
}))
class PayModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defAcc: '',
      count: 1,
      amount: 0,
    };
  }

  onShow = () => {
    const { userInfo, selectKey, data } = this.props;
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
      let amount = (data && data.submitSum) || 0;
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
            if (item.submitSum)
            amount+=item.submitSum;
          });
      }
      this.setState({
        visible: true,
        defAcc: acc,
        count: cout,
        amount,
      });
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onSubmit = () => {
    const {
      data,
      dispatch,
      selectKey,
      form,
      payAccount,
      onOk
    } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(moment(values.time).format('x'));
        let invoiceIds = [];
        if (selectKey) {
          invoiceIds = selectKey.map(it => it.invoiceId);
        } else {
          invoiceIds = [data.invoiceId];
        }
        const payList = payAccount.filter(it => it.id === values.account);
        dispatch({
          type: 'payment/send',
          payload: {
            invoiceIds,
            'payId': values.account,
            'payJson': JSON.stringify(payList),
            'payName': payList[0].name,
            'payTime': moment(values.time).format('x')
          }
        }).then(() => {
          this.setState({
            visible: false,
          });
          message.success('标记已付成功');
          onOk();
        });
      }
    });

  }

  render() {
    const {
      children,
      payAccount,
      form: { getFieldDecorator }
    } = this.props;
    const { visible, defAcc, count, amount } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="标记已付"
          maskClosable={false}
          visible={visible}
          onCancel={() => this.onCancel()}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="save" onClick={() => this.onSubmit()} type="primary">保存</Button>
          ]}
        >
          <Form className="formItem">
            <p className="c-black-85 fs-14">已选 {count}张单据，共计 <span className="fw-500 fs-20">¥{amount/100}</span></p>
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
          </Form>
        </Modal>
      </span>
    );
  }
}

export default PayModal;
