import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';


const { TextArea } = Input;
export default class AddComp extends Component {
  static propTypes = {

  }

  render() {
    const {
      children,
      form: { getFieldDecorator }
    } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span>{children}</span>
        <Modal
          title="新增公司"
          visible={visible}
        >
          <Form>
            <Form.Item label="公司名称">
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入公司名称'
                  }, {
                    max: 32, message: '最多32字'
                  }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            <Form.Item label="上级公司">
              {
                getFieldDecorator('parent', {
                  rules: [{
                    required: true, message: '请输入公司名称'
                  }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            <Form.Item label="关联部门/人">
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入公司名称'
                  }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            <Form.Item label="备注">
              {
                getFieldDecorator('note', {
                  rules: [{
                    required: true, message: '请输入公司名称',
                  }, {
                    max: 128, message: '最多128字'
                  }]
                })(
                  <TextArea placeholder="请输入备注" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}
