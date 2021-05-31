import React from 'react';
import { Modal, Form, Input, Button, message, Radio } from 'antd';
import { formItemLayout, defaultTitle, invoiceStatus } from '@/utils/constants';
import { connect } from 'dva';

const labelItem = {
  costName: '名称',
  parentId: '所属分组',
  type: '类型选择'
};
const urlObj = {
  add: 'invoice/addGroup',
  edit: 'invoice/editGroup',
  copy: 'invoice/copyGroup'
};
@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['invoice/addGroup'] ||
  loading.effects['invoice/editGroup'] ||
  loading.effects['invoice/copyGroup'] || false,
  allList: invoiceStatus.allList,
}))
class AddGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: null,
    };
  }

  onShow = () => {
    const {
      data,
      title,
    } = this.props;
    const datas = data && { ...data };
    if (title === 'copy') {
      Object.assign(datas, {
        name: `${data.name}的副本`
      });
    }
    this.props.dispatch({
      type: 'invoice/allList',
      payload: {}
    }).then(() => {
      this.setState({
        visible: true,
        data: datas,
      });
    });

  }

  handleOk = () => {
    const {
      data,
      form,
      onOk,
      title,
      dispatch,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = { ...values };
        if (title !== 'edit') {
          Object.assign(payload, {
            id: data.id,
          });
        }
        if (title === 'copy') {
          Object.assign(payload, {
            isGroup: 1,
            templateName: values.name,
          });
        }
        dispatch({
          type: urlObj[title],
          payload,
        }).then(() => {
          message.success(`${defaultTitle[title]}成功`);
          onOk();
          this.onRest();
          this.onCancel();
        });
      }
    });
  }

  onCancel = () => {
    this.onRest();
    this.setState({
      visible: false,
    });
  }

  onRest = () => {
    this.props.form.resetFields();
  }

  render() {
    const {
      children,
      title,
      loading,
      form: { getFieldDecorator }
    } = this.props;
    const { data } = this.state;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={title && `${defaultTitle[title]}分组`}
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" type="primary" onClick={this.handleOk} loading={loading}>保存</Button>
          ]}
        >
          <Form>
            <Form.Item
              key="name"
              label={labelItem.costName}
              {...formItemLayout}
            >
              {
                getFieldDecorator('name', {
                  initialValue: data && data.name,
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 20, message: '最多只能输入20字' }
                  ]
                })(
                  <Input
                    placeholder="请输入名称"
                    style={{width: '280px'}}
                  />
                )
              }
            </Form.Item>
            {
              title !== 'edit' &&
              <Form.Item
                key="templateType"
                label={labelItem.type}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('templateType', {
                    initialValue: (data && data.templateType) || 0,
                  })(
                    <Radio.Group disabled={title === 'copy'}>
                      <Radio value={0}>报销单</Radio>
                      <Radio value={1}>借款单</Radio>
                      <Radio value={2}>申请单</Radio>
                    </Radio.Group>
                  )
                }
              </Form.Item>
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddGroup;
