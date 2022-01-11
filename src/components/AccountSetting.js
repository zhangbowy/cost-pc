/* eslint-disable no-param-reassign */
/**
 * @param {object} data 编辑时传入的数据, 新增W不填即可
 * @param {function} callback 完成填写后的回调
 * @param {string} action 操作类型: 编辑/新增
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Input, Button, Cascader, message } from 'antd';
import { connect } from 'dva';
import { formItemLayout, bankList } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import UploadImg from '@/components/UploadImg';
import { compare } from '../utils/common';

const { Option } = Select;
const formLabel = {
  type: '账户类型',
  name: '收款人名称',
  card: '银行卡号',
  alipay: '账号',
  bankName: '开户行',
  bankNameBranch: '开户支行',
  awAreas: '开户省市'
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
@connect(({ costGlobal, session }) => ({
  areaCode: costGlobal.areaCode,
  userInfo: session.userInfo
}))
class AccountSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: { type: 0 },
      treeList: [],
      imgUrl: [],
      isShowInput: false,
    };
  }

  // 显示modal
  show = () => {
    const { data = {} } = this.props;
    const datas = { ...data };
    if (!datas.type) {
      datas.type = 0;
    }
    this.props.dispatch({
      type: 'costGlobal/area',
      payload: {}
    }).then(() => {
      const { areaCode } = this.props;
      console.log('AddAccount -> onShow -> areaCode', areaCode);
      const treeList = treeConvert({
        rootId: 0,
        pId: 'pid',
        name: 'areaName',
        id: 'areaCode',
        tName: 'label',
        tId: 'value'
      }, areaCode);
      const isInput = data.bankName &&
      (bankList.findIndex(it => it === data.bankName) === -1 || data.bankName === '其他银行');
      this.setState({
        visible: true,
        isShowInput: isInput,
        data: {
          ...datas,
          awAreas: datas.awAreas ?
          datas.awAreas.sort(compare('level')).map(it => it.areaCode) : undefined,
          bankName: isInput ? '其他银行' : data.bankName,
          bankName1: isInput ? data.bankName : '',
        },
        imgUrl: datas.qrUrl ? [{ imgUrl: datas.qrUrl }] : [],
        treeList
      });
    });
  }

  closeModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  onSave = () => {
    const {form: { validateFields }, callback, areaCode } = this.props;
    const { data, imgUrl } = this.state;
    const val = { ...data };
    validateFields((err, values) => {
      if(!err) {
        const awAreas = [];
        if (values.awAreas) {
          values.awAreas.forEach(it => {
            const items = areaCode.filter(item => item.areaCode === it)[0];
            awAreas.push(items);
          });
        }
        if (imgUrl && imgUrl.length) {
          Object.assign(val, {
            ...values,
            qrUrl: imgUrl[0].imgUrl
          });
        }
        if (values.img) {
          delete values.img;
        }
        Object.assign(val, {
          ...values,
          awAreas,
          bankName: values.bankName === '其他银行' ? values.bankName1 : values.bankName,
        });
        console.log('开户省市区', awAreas);
        callback(val, this.checkResult);
      }
    });
  }

  // 名字重复
  checkResult = (type) => {
    console.log('娇艳');
    if(type === 'repeat') {
      this.props.form.setFields({
        name: {
          errors: [new Error('名字重复')]
        }
      });
    } else if(type === 'repeatAccount') {
      message.error('账号重复');
    } else {
      this.closeModal();
    }
  }

  changeType = (e) => {
    const { data } = this.state;
    data.type = e;
    this.props.form.resetFields();
    this.setState({ data, imgUrl: [], isShowInput: false }, () => {
      if (Number(e) === 0) {
        console.log('走了吗');
        this.props.form.setFieldsValue({
          bankName: null,
        });
      }
    });
  }

  onChangeImg = val => {
    console.log('AddAccount -> val', val);
    this.setState({
      imgUrl: val,
    });
  }

  onChangeAccount = (val) => {
    this.props.form.setFieldsValue({
      bankName1: '',
    });
    this.setState({
      isShowInput: val === '其他银行',
    });
  }

  render() {
    const { visible, data, treeList, imgUrl, isShowInput } = this.state;
    const { form: { getFieldDecorator }, userInfo } = this.props;
    return (
      <span>
        <span onClick={() => this.show()}>{this.props.children}</span>
        <Modal
          title="供应商账户"
          visible={visible}
          onCancel={() => this.closeModal()}
          onOk={() => this.onSave()}
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
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
                    max: 30,
                    message: '长度不能超过30个字符'
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
                        max: 50,
                        message: '长度不能超过50个字符'
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
                      initialValue: data && data.bankName,
                      rules: [{
                        required: true,
                        message: '请选择开户行'
                      }]
                    })(
                      <Select placeholder="请选择开户行" onChange={this.onChangeAccount}>
                        {bankList.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    )
                  }
                </Form.Item>
                {
                  isShowInput &&
                  <Form.Item label="开户行名称">
                    {
                      getFieldDecorator('bankName1', {
                        initialValue: data.bankName1 || '',
                        rules: [{
                          required: true,
                          message: '请输入开户行'
                        }]
                      })(
                        <Input placeholder="请输入开户行" />
                      )
                    }
                  </Form.Item>
                }
                <Form.Item label={formLabel.awAreas} key="awAreas">
                  {
                    getFieldDecorator('awAreas', {
                      initialValue: (data && data.awAreas) || [],
                      rules: [{ required: true, message: `请选择${formLabel.awAreas}` }]
                    })(
                      <Cascader
                        options={treeList}
                        placeholder={`请选择${formLabel.awAreas}`}
                      />
                    )
                  }
                </Form.Item>
                <Form.Item label={formLabel.bankNameBranch} key="bankNameBranch">
                  {
                    getFieldDecorator('bankNameBranch', {
                      initialValue: (data && data.bankNameBranch) || '',
                      rules: [{ required: true, message: `请输入${formLabel.bankNameBranch}` }]
                    })(
                      <Input placeholder={`请输入${formLabel.bankNameBranch}`} />
                    )
                  }
                </Form.Item>
              </>
            ) : null}
            {data.type === 1 ? (
              <>
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
                <Form.Item
                  label="收款码"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('img', {
                      initialValue: imgUrl.length ? imgUrl : null,
                    })(
                      <UploadImg
                        onChange={(val) => this.onChangeImg(val)}
                        imgUrl={imgUrl}
                        userInfo={userInfo}
                        maxLen={1}
                      />
                    )
                  }
                </Form.Item>
              </>
            ) : null}
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AccountSetting;
