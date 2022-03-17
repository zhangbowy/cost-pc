import React, { Component } from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
// import { formItemLayout } from '../../../../utils/constants';
import style from './index.scss';
import ModalTemp from '../../../../components/ModalTemp';

const { MonthPicker } = DatePicker;
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

  onConfirm = () => {
    const { form: { validateFields }, onOK, id } = this.props;
    validateFields((err, val) => {
      if (!err) {
        console.log(val);
        new Promise(resolve => {
          onOK({
            id,
            month: moment(val.month).format('x'),
          }, resolve);
        }).then(() => {
          this.onClose();
        });
      }
    });

  }

  render() {
    const { visible } = this.state;
    const { children, form: { getFieldDecorator }, month, money } = this.props;

    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <ModalTemp
          title="修改所属期"
          visible={visible}
          onCancel={this.onClose}
          size="small"
          onOk={this.onConfirm}
          newBodyStyle={{
            height: '290px',
            padding: '16px 0px 0px 32px'
          }}
          unset='true'
        >
          <Form style={{width: '100%'}}>
            <Form.Item>
              <div className={style.price}>
                <p className="c-black-85">该明细金额：</p>
                <span>¥{money ? money/100 : '-'}</span>
                <p className="c-black-85">，目前所属期为：</p>
                <span className={style.money}>{month ? moment(month).format('YYYY[年]MM[日]') : '-'}</span>
              </div>
            </Form.Item>
            <Form.Item label="修改后所属月份">
              {
                getFieldDecorator('month', {
                  rules: [{ required: true, message: '请选择日期' }]
                })(
                  <MonthPicker placeholder="请选择" style={{ width: '320px' }} />
                )
              }
            </Form.Item>
          </Form>
        </ModalTemp>
      </span>
    );
  }
}

export default ChangeDate;
