import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

@Form.create()
class AddTravelForm extends Component {
  state = {
    visible: false,
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

  render () {
    const {
      children,
      form: { getFieldDecorator }
    } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <span onClick={() =>this.onShow()}>{children}</span>
        <Modal
          visible={visible}
        >
          <Form>
            <Form.Item>
              {
                getFieldDecorator('names')(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddTravelForm;
