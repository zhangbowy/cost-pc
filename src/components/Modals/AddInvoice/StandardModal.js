import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { formItemLayout } from '../../../utils/constants';

@Form.create()
class StandardModal extends PureComponent {

  getFormItem = () => {
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        this.props.callback(val);
        this.props.form.resetFields();
      }
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
  }

  render() {
    const { visible, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        visible={visible}
        title="填写超标理由"
        onOk={this.getFormItem}
        onCancel={() => this.onCancel()}
        width="580px"
        bodyStyle={{
          height: '212px'
        }}
      >
        <Form>
          <Form.Item label="超标理由" {...formItemLayout}>
            {
              getFieldDecorator('exceedReason', {
                rules: [{ required: true, message: '请输入' }]
              })(
                <TextArea />
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default StandardModal;
