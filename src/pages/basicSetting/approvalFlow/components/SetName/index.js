import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { formItemLayout } from '@/utils/constants';
import { connect } from 'dva';

const labelItem = {
  costName: '名称',
  parentId: '所属分组'
};
@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['approvalFlow/edit'] || false,
}))
class SetName extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name: '',
    };
  }

  onShow = () => {
    const {
      uniqueMark,
      approvePersonList
    } = this.props;
    let name = '';
    approvePersonList.forEach(item => {
      if (item.uniqueMark === uniqueMark) {
        name = item.templateName;
      }
    });
    this.setState({
      name,
      visible: true
    });
  }

  handleOk = () => {
    const {
      form,
      onOk,
      dispatch,
      uniqueMark,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = { ...values, uniqueMark };
        const action = 'approvalFlow/edit';
        dispatch({
          type: action,
          payload,
        }).then(() => {
          message.success('修改名称成功');
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
      loading,
      form: { getFieldDecorator }
    } = this.props;
    const { name } = this.state;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="审批流设置"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" type="primary" onClick={this.handleOk} loading={loading}>保存</Button>
          ]}
        >
          <Form
            layout="inline"
            {...formItemLayout}
          >
            <Form.Item
              key="name"
              label={labelItem.costName}
            >
              {
                getFieldDecorator('name', {
                  initialValue: name || '',
                  rules: [
                    { required: true, message: '请输入名称' },
                    { max: 16, message: '最多只能输入20字' }
                  ]
                })(
                  <Input
                    placeholder="请输入名称"
                    style={{width: '280px'}}
                  />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default SetName;
