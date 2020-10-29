import React from 'react';
import { Modal, Form, Input, Select, Button, message, Switch, Checkbox } from 'antd';
import { formItemLayout, accountType, defaultTitle, bankList } from '@/utils/constants';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';

const labelInfo = {
  type: '账户类型',
  name: '名称',
  account: '银行卡号',
  note: '备注',
  defaultStatus: '启用',
  status: '启用'
};
const {Option} = Select;
@Form.create()
@connect(({ loading, session, account }) => ({
  userInfo: session.userInfo,
  loading: loading.effects['account/add'] || loading.effects['account/edit'] || false,
  detail: account.detail,
}))
class AddAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
      visible: false,
    };
  }

  onShow = () => {
    const { record } = this.props;
    let type = '0';
    if (record) {
      ({ type } = record);
      this.props.dispatch({
        type: 'account/detail',
        payload: {
          id: record.id
        }
      }).then(() => {
        const { detail } = this.props;
        this.setState({
          visible: true,
          type,
          data: detail,
        });
      });
    } else {
      this.setState({
        visible: true,
        type,
      });
    }

  }

  onRest = () => {
    this.props.form.resetFields();
    this.setState({
      type: '0'
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    const {
      dispatch,
      form,
      onOk,
      detail,
      userInfo,
      title,
    } = this.props;

    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const payload = {
          ...value,
          companyId: userInfo.companyId || '',
          type: Number(value.type),
          status: value.status ? 1 : 0,
        };
        let action = 'account/add';
        if (title === 'edit') {
          action = 'account/edit';
          Object.assign(payload, {
            id: detail.id,
          });
        }
        dispatch({
          type: action,
          payload,
        }).then(() => {
          this.onRest();
          message.success('操作成功');
          this.setState({
            visible: false,
          });
          onOk();
        });
      }
    });
  }

  onChange = (value) => {
    this.setState({
      type: value,
    });
  }

  check = (rule, value, callback) => {
    if (!value && (this.state.type === 0) ) {
      callback('请选择开户行');
    } else {
      callback();
    }
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      title,
    } = this.props;
    const {
      type,
      visible,
      loading,
      data,
    } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{ children }</span>
        <Modal
          title={title && `${defaultTitle[title]}付款账户`}
          visible={visible}
          onCancel={() => {
                this.onRest();
                this.setState({ visible: false });
          }}
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
              {
                getFieldDecorator('type', {
                  initialValue: Number(type),
                })(
                  <Select
                    onChange={this.onChange}
                  >
                    {
                      accountType.map(item => (
                        <Option key={item.key} value={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label={labelInfo.name}>
              {
                getFieldDecorator('name', {
                  initialValue: data && data.name,
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 30, message: '不超过30个字' }
                  ]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            {
              Number(type) !== 2 &&
              <Form.Item label={Number(type) === 0 ? labelInfo.account : '账号'}>
                {
                  getFieldDecorator('account', {
                    initialValue: data && data.account,
                    rules: [{ required: (Number(type) !== 2), message: `请输入${Number(type) === 0 ? labelInfo.account : '账号'}` }]
                  })(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            }
            {
              Number(type) === 0 &&
              <Form.Item label="开户行">
                {
                  getFieldDecorator('bankName', {
                    initialValue: (data && data.bankName) || '',
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
                    >
                      {
                        bankList.map((it) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Option key={it}>{it}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            }
            <Form.Item label={labelInfo.note}>
              {
                getFieldDecorator('note', {
                  initialValue: data && data.note,
                })(
                  <TextArea placeholder="请输入" />
                )
              }
            </Form.Item>
            <Form.Item label={labelInfo.status}>
              <div>
                {
                  getFieldDecorator('status', {
                    initialValue: !!((data && data.status === 1)),
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )
                }
              </div>
              {
                getFieldDecorator('isDefault', {
                  initialValue: data && data.isDefault,
                  valuePropName: 'checked'
                })(
                  <Checkbox>设为默认</Checkbox>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddAccount;
