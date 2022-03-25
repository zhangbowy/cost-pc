import React from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Button,
  message,
  Switch,
  Checkbox,
  Cascader,
  DatePicker
} from 'antd';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import {
  formItemLayout,
  accountType,
  defaultTitle,
  bankList
} from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import { compare } from '../../../../utils/common';
import styles from './index.scss';

const labelInfo = {
  type: '账户类型',
  name: '名称',
  account: '银行卡号',
  note: '备注',
  defaultStatus: '启用',
  status: '启用',
  bankNameBranch: '开户支行',
  awAreas: '开户省市',
  initialDate: '初始日期',
  initialAmount: '初始金额'
};
const { Option } = Select;
@Form.create()
@connect(({ loading, session, account, costGlobal }) => ({
  userInfo: session.userInfo,
  loading:
    loading.effects['account/add'] || loading.effects['account/edit'] || false,
  detail: account.detail,
  areaCode: costGlobal.areaCode
}))
class AddAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
      visible: false,
      treeList: [],
      isShowInput: ''
    };
  }

  onShow = () => {
    const { record } = this.props;
    let type = '0';
    this.props
      .dispatch({
        type: 'costGlobal/area',
        payload: {}
      })
      .then(() => {
        const { areaCode } = this.props;
        console.log('AddAccount -> onShow -> areaCode', areaCode);
        const treeList = treeConvert(
          {
            rootId: 0,
            pId: 'pid',
            name: 'areaName',
            id: 'areaCode',
            tName: 'label',
            tId: 'value'
          },
          areaCode
        );
        if (record) {
          ({ type } = record);
          this.props
            .dispatch({
              type: 'account/detail',
              payload: {
                id: record.id
              }
            })
            .then(() => {
              const { detail } = this.props;
              const isInput =
                detail.bankName &&
                (bankList.findIndex(it => it === detail.bankName) === -1 ||
                  detail.bankName === '其他银行');
              this.setState({
                visible: true,
                type,
                isShowInput: isInput,
                data: {
                  ...detail,
                  awAreas: detail.awAreas
                    ? detail.awAreas
                        .sort(compare('level'))
                        .map(it => it.areaCode)
                    : undefined,
                  bankName: isInput ? '其他银行' : detail.bankName,
                  bankName1:
                    isInput && detail.bankName !== '其他银行'
                      ? detail.bankName
                      : ''
                },
                treeList
              });
            });
        } else {
          this.setState({
            visible: true,
            type,
            treeList
          });
        }
      });
  };

  onRest = () => {
    this.props.form.resetFields();
    this.setState({
      type: '0',
      isShowInput: false
    });
  };

  handleOk = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      onOk,
      detail,
      userInfo,
      title,
      areaCode
    } = this.props;

    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const payload = {
          ...value,
          awAreas: value.awAreas
            ? value.awAreas.map(it => {
                const items = areaCode.filter(item => item.areaCode === it)[0];
                return { ...items };
              })
            : [],
          companyId: userInfo.companyId || '',
          type: Number(value.type),
          status: value.status ? 1 : 0
        };
        let action = 'account/add';
        if (title === 'edit') {
          action = 'account/edit';
          Object.assign(payload, {
            id: detail.id
          });
        }
        dispatch({
          type: action,
          payload: {
            ...payload,
            bankName:
              payload.bankName === '其他银行'
                ? value.bankName1
                : payload.bankName
          }
        }).then(() => {
          this.onRest();
          message.success('操作成功');
          this.setState({
            visible: false
          });
          onOk();
        });
      }
    });
  };

  onChange = value => {
    this.setState(
      {
        type: value,
        isShowInput: false
      },
      () => {
        if (Number(value) === 0) {
          console.log('走了吗');
          this.props.form.setFieldsValue({
            bankName: null
          });
        }
      }
    );
  };

  onChangeAccount = val => {
    this.props.form.setFieldsValue({
      bankName1: ''
    });
    this.setState({
      isShowInput: val === '其他银行'
    });
  };

  check = (rule, value, callback) => {
    if (!value && this.state.type === 0) {
      callback('请选择开户行');
    } else {
      callback();
    }
  };

  render() {
    const {
      children,
      form: { getFieldDecorator },
      title
    } = this.props;
    const { type, visible, loading, data, treeList, isShowInput } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={title && `${defaultTitle[title]}付款账户`}
          visible={visible}
          bodyStyle={{ height: '470px', overflowY: 'scroll' }}
          onCancel={() => {
            this.onRest();
            this.setState({ visible: false });
          }}
          className={styles.addAccountPop}
          maskClosable={false}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                this.onRest();
                this.setState({ visible: false });
              }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              loading={loading}
            >
              保存
            </Button>
          ]}
        >
          <Form {...formItemLayout} className="formItem">
            <Form.Item label={labelInfo.type}>
              {getFieldDecorator('type', {
                initialValue: Number(type)
              })(
                <Select onChange={this.onChange}>
                  {accountType.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={labelInfo.name}>
              {getFieldDecorator('name', {
                initialValue: data && data.name,
                rules: [
                  { required: true, message: '请输入名称' },
                  { max: 20, message: '不超过20个字' }
                ]
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label={labelInfo.initialAmount}>
              {getFieldDecorator('initialAmount', {
                rules: [{ required: true, message: '请输入初始金额' }],
                initialValue: (data && data.initialAmount) || 0
              })(
                <InputNumber min={0} step={0.01} placeholder="请输入初始金额" />
              )}
            </Form.Item>
            <Form.Item label={labelInfo.initialDate}>
              {getFieldDecorator('initialDate', {
                rules: [{ required: true, message: '请输入初始日期' }],
                initialValue: data && data.initialDate
              })(<DatePicker placeholder="请输入初始日期" />)}
            </Form.Item>
            {Number(type) !== 2 && Number(type) !== 4 && (
              <Form.Item
                label={Number(type) === 0 ? labelInfo.account : '账号'}
              >
                {getFieldDecorator('account', {
                  initialValue: data && data.account,
                  rules: [
                    {
                      required: Number(type) !== 2 && Number(type) !== 4,
                      message: `请输入${
                        Number(type) === 0 ? labelInfo.account : '账号'
                      }`
                    }
                  ]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            )}
            {Number(type) === 0 && (
              <Form.Item label="开户行">
                {getFieldDecorator('bankName', {
                  initialValue: (data && data.bankName) || undefined,
                  rules: [
                    {
                      required: Number(type) === 0,
                      message: '请选择开户行'
                    }
                  ]
                })(
                  <Select
                    showSearch
                    placeholder="请选择"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    onChange={e => this.onChangeAccount(e)}
                  >
                    {bankList.map(it => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Option key={it}>{it}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
            {isShowInput && Number(type) === 0 && (
              <Form.Item label="开户行名称">
                {getFieldDecorator('bankName1', {
                  initialValue: data && data.bankName1,
                  rules: [
                    {
                      required: !!(Number(type) === 0),
                      message: '请输入开户行'
                    }
                  ]
                })(<Input placeholder="请输入开户行" />)}
              </Form.Item>
            )}
            {Number(type) === 0 && (
              <Form.Item label={labelInfo.awAreas}>
                {getFieldDecorator('awAreas', {
                  initialValue: (data && data.awAreas) || [],
                  rules: [{ required: Number(type) === 0, message: '请选择' }]
                })(
                  <Cascader
                    options={treeList}
                    placeholder={`请选择${labelInfo.awAreas}`}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  />
                )}
              </Form.Item>
            )}
            {Number(type) === 0 && (
              <Form.Item label={labelInfo.bankNameBranch}>
                {getFieldDecorator('bankNameBranch', {
                  initialValue: data && data.bankNameBranch,
                  rules: [{ required: Number(type) === 0, message: '请输入' }]
                })(<Input placeholder={`请输入${labelInfo.bankNameBranch}`} />)}
              </Form.Item>
            )}
            <Form.Item label={labelInfo.note}>
              {getFieldDecorator('note', {
                initialValue: data && data.note
              })(<TextArea placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label={labelInfo.status}>
              <div>
                {getFieldDecorator('status', {
                  initialValue:
                    !!(data && data.status === 1) || title === 'add',
                  valuePropName: 'checked'
                })(<Switch />)}
              </div>
              {getFieldDecorator('isDefault', {
                initialValue: data && data.isDefault,
                valuePropName: 'checked'
              })(<Checkbox>设为默认</Checkbox>)}
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddAccount;
