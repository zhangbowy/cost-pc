import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button } from 'antd';
import { connect } from 'dva';
import { formItemLayout, defaultTitle } from '../../../../utils/constants';

const { TextArea } = Input;
@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['approveIndex/add'] ||
           loading.effects['approveIndex/edit'] || false,
}))
class AddModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    detail: PropTypes.object,
  }

  state = {
    visible: false,
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const {
      form,
      dispatch,
      onOk,
      loading,
      title,
      detail,
    } = this.props;
    if (loading) return;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (title === 'edit') {
          Object.assign(values, {
            id: detail.id,
          });
        }
        dispatch({
          type: `approveIndex/${title}`,
          payload: {
            ...values,
          }
        }).then(() => {
          this.onCancel();
          onOk();
        });
      }
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      title,
      detail,
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title={`${defaultTitle[title]}审批角色`}
          width="550px"
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={this.handleOk} type="primary" disabled={loading}>保存</Button>
          ]}
          bodyStyle={{
            height: '470px',
            overflowY: 'scroll'
          }}
          onCancel={this.onCancel}
          visible={visible}
        >
          <Form>
            <Form.Item
              label="角色名称"
              {...formItemLayout}
            >
              {
                getFieldDecorator('approveRoleName', {
                  initialValue: detail.approveRoleName,
                  rules: [
                    { required: true, message: '请输入角色名称' },
                    { max: 16, message: '角色名称不能超过16个字，请修改' }
                  ]
                })(
                  <Input placeholder="请输入角色名称" />
                )
              }
            </Form.Item>
            <Form.Item
              label="描述"
              {...formItemLayout}
            >
              {
                getFieldDecorator('note', {
                  initialValue: detail.note,
                  rules: [{ max: 128, message: '描述不能超过128个字，请修改' }]
                })(
                  <TextArea placeholder="请输入描述，不能超过128个字" max={128} />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddModal;
