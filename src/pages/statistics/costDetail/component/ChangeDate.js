import React, { Component } from 'react';
import { Modal, Form, DatePicker } from 'antd';
import { formItemLayout } from '../../../../utils/constants';
import style from './index.scss';

@Form.create()
class ChangeDate extends Component {
  state={
    visible: false
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

  onClose = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;
    const { children, form: { getFieldDecorator } } = this.props;

    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="修改所属期"
          visible={visible}
          onCancel={this.onClose}
          width="480px"
          bodyStyle={{
            height: '212px'
          }}
        >
          <Form style={{width: '100%'}}>
            <Form.Item {...formItemLayout}>
              <div className={style.price}>
                <p className="c-black-85">该明细金额：</p>
                <span className={style.money}>$1233</span>
                <p className="c-black-85">，目前所属期为：</p>
                <span className={style.money}>$1233</span>
              </div>
            </Form.Item>
            <Form.Item label="修改所属月份" {...formItemLayout}>
              {
                getFieldDecorator('month', {
                  rules: [{ required: true, message: '请选择日期' }]
                })(
                  <DatePicker placeholder="请选择" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default ChangeDate;
