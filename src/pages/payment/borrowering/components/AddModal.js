import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, Divider, message } from 'antd';
import { connect } from 'dva';
import { formItemLayout } from '@/utils/constants';
import style from '../index.scss';

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
      detail,
    } = this.props;
    if (loading) return;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, {
          loanId: detail.loanId,
          repaySum: Number((values.repaySum*100).toFixed(0))
        });
        if(values.repaySum*1>detail.waitAssessSum){
          message.error('还款金额需小于核销金额');
          return;
        }
        dispatch({
          type: 'borrowering/repaySum',
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
      detail,
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title='还款'
          width="550px"
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={this.handleOk} type="primary" disabled={loading}>确认</Button>
          ]}
          onCancel={this.onCancel}
          visible={visible}
        >
          <div className={style.tit}>
            <span className={style.h2}>借款金额：</span><span className={style.num}>¥{detail.loanSum/100}</span>
            <Divider type="vertical" />
            <span className={style.h2}>已还款：</span><span className={style.num}>¥{(detail.loanSum - detail.waitLoanSum )/100 }</span>
            <Divider type="vertical" />
            <span className={style.h2}>待核销：</span><span className={style.num}>¥{detail.waitAssessSum/100}</span>
          </div>
          <Form>
            <Form.Item
              label="本次还款金额"
              {...formItemLayout}
            >
              {
                getFieldDecorator('repaySum', {
                  initialValue: detail.repaySum,
                  rules: [
                    { required: true, message: '请输入正确的还款金额',
                    pattern: new RegExp(/^\d*\.{0,1}\d{0,2}$/, 'g'),
                  }]
                })(
                  <Input min={0} placeholder="还款金额需小于待核销金额" />
                )
              }
            </Form.Item>
            <Form.Item
              label="备注"
              {...formItemLayout}
            >
              {
                getFieldDecorator('note', {
                  initialValue: detail.note,
                  rules: [{ max: 128, message: '备注不能超过128个字，请修改' }]
                })(
                  <TextArea placeholder="请输入备注，不能超过128个字" max={128} />
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
