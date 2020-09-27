/**
 * @param {object} data 编辑时传入的数据, 新增W不填即可
 * @param {function} callback 完成填写后的回调
 * @param {string} action 操作类型: 编辑/新增
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import { formItemLayout, bankList } from '@/utils/constants';

const { Option } = Select;
const formLabel = {
  type: '账户类型',
  name: '名称',
  card: '银行卡号',
  alipay: '账号',
  bankName: '开户行'
};
const accountType = [
  {
    value: 0,
    text: '银行卡'
  },
  {
    value: 1,
    text: '支付宝'
  },
  {
    value: 2,
    text: '现金'
  }
];

@Form.create()
class AccountSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: { type: 0 }
    };
  }

  // 显示modal
  show = () => {
    const { data = {} } = this.props;
    if (!data.type) {
      data.type = 0;
    }
    const datas = { ...data };



    this.setState({
      visible: true,
      data: datas
    });
  }

  closeModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  onSave = () => {
    const {form: { validateFields }, callback } = this.props;
    const { data } = this.state;
    const val = { ...data };
    validateFields((err, values) => {
      if(!err) {
        Object.assign(val, {...values});
        callback(val, this.checkResult);
      }
    });
  }

  // 名字重复
  checkResult = (type) => {
    if(type === 'repeat') {
      this.props.form.setFields({
        name: {
          errors: [new Error('名字重复')]
        }
      });
    } else {
      this.closeModal();
    }
  }

  changeType = (e) => {
    const { data } = this.state;
    data.type = e;
    this.props.form.resetFields();
    this.setState({ data });
  }

  render() {
    const { visible, data } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <span>
        <span onClick={() => this.show()}>{this.props.children}</span>
        <Modal
          title="供应商账户"
          visible={visible}
          onCancel={() => this.closeModal()}
          onOk={() => this.onSave()}
          footer={[
            <Button key="cancel" onClick={() => this.closeModal()}>取消</Button>,
            <Button key="save" type="primary" onClick={e => this.onSave(e)}>保存</Button>
          ]}
        >
          <Form className="formItem" {...formItemLayout}>
            {/* 账户类型 */}
            <Form.Item key="type" label={formLabel.type}>
              {
                getFieldDecorator('type', {
                  initialValue: data.type
                })(
                  <Select onChange={this.changeType}>
                    {accountType.map(item => (
                      <Option key={item.value} value={item.value}>{item.text}</Option>
                    ))}
                  </Select>
                )
              }
            </Form.Item>
            {/* 账户名称 */}
            <Form.Item key="name" label={formLabel.name}>
              {
                getFieldDecorator('name', {
                  initialValue: data.name,
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  },{
                    max: 20,
                    message: '长度不能超过20个字符'
                  }]
                })(
                  <Input placeholder={data.type === 1 ? '请输入与账号匹配的已实名姓名' : '请输入'} />
                )
              }
            </Form.Item>
            {data.type === 0 ? (
              <>
                {/* 银行卡号 */}
                <Form.Item key="account" label={formLabel.card}>
                  {
                    getFieldDecorator('account', {
                      initialValue: data.account,
                      rules: [{
                        required: true,
                        message: '请输入银行卡号'
                      },{
                        max: 20,
                        message: '长度不能超过20个字符'
                      }]
                    })(
                      <Input placeholder="请输入卡号" />
                    )
                  }
                </Form.Item>
                {/* 开户行 */}
                <Form.Item key="bankName" label={formLabel.bankName}>
                  {
                    getFieldDecorator('bankName', {
                      initialValue: data.bankName,
                      rules: [{
                        required: true,
                        message: '请选择开户行'
                      }]
                    })(
                      <Select placeholder="请选择开户行">
                        {bankList.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    )
                  }
                </Form.Item>
              </>
            ) : null}
            {data.type === 1 ? (
              <Form.Item key="account" label={formLabel.alipay}>
                {
                  getFieldDecorator('account', {
                    initialValue: data.account,
                    rules: [{
                      required: true,
                      message: '请输入支付宝账号',
                    },{
                      max: 32,
                      message: '长度不能超过20个字符'
                    }]
                  })(
                    <Input placeholder="请输入账号" />
                  )
                }
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AccountSetting;
