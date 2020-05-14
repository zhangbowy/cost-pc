import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import constants, { formItemLayout } from '@/utils/constants';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';

const labelInfo = {
  type: '账户类型',
  name: '名称',
  account: '银行卡号',
  note: '备注',
  defaultStatus: '启用',
};
const {Option} = Select;
@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['account/add'] || loading.effects['account/edit'] || false,
}))
class AddAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
      visible: false,
    };
  }

  handleOk = (e) => {
    e.preventDefault();
    const {
      dispatch,
      form,
      onOk,
      data,
    } = this.props;

    form.validator((err, value) => {
      if (!err) {
        const payload = { ...value };
        let action = 'listFetch/add';
        if (data) {
          action = 'listFetch/update';
          Object.assign(payload, {
            id: data.id,
          });
        }
        dispatch({
          type: action,
          payload,
        }).then(() => {
          message.success('操作成功');
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

  render() {
    const {
      children,
      form: { getFieldDecorator }
    } = this.props;
    const {
      type,
      visible,
      loading,
    } = this.state;
    return (
      <span>
        <span onClick={() => this.setState({ visible: !visible })}>{ children }</span>
        <Modal
          title="新增付款账户"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button key="submit" onClick={this.handleOk} loading={loading}>保存</Button>,
            <Button key="cancel" onClick={() => this.setState({ visible: false })}>取消</Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item label={labelInfo.type}>
              {
                getFieldDecorator('type')(
                  <Select
                    value={type}
                    onChange={this.onChange}
                  >
                    {
                      constants.account.map(item => (
                        <Option key={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label={labelInfo.name}>
              {
                getFieldDecorator('type', {
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 20, message: '不超过20个字' }
                  ]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            {
              type !== '2' &&
              <Form.Item label={labelInfo.account}>
                {
                  getFieldDecorator('account')(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            }
            {
              type === '0' &&
              <Form.Item label={labelInfo.account}>
                {
                  getFieldDecorator('account')(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            }
            <Form.Item label={labelInfo.note}>
              {
                getFieldDecorator('note')(
                  <TextArea placeholder="请输入" />
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
