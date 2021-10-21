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
    // this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const { visible, form: { getFieldDecorator }, note } = this.props;
    return (
      <Modal
        visible={visible}
        title="填写超标理由"
        onOk={this.getFormItem}
        onCancel={() => this.onCancel()}
        width="580px"
        bodyStyle={{
          height: '212px',
          paddingTop: '40px'
        }}
      >
        <Form>
          <Form.Item label="超标理由" {...formItemLayout}>
            {
              getFieldDecorator('exceedReason', {
                rules: [
                  { required: true, message: '请输入' },
                  { max: 128, message: '最多128个文案' },
                ]
              })(
                <TextArea placeholder={note || '请输入超标理由'} rows={4} />
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default StandardModal;
