import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Divider, message } from 'antd';
import { connect } from 'dva';
import style from '../index.scss';
import BorrowTable from './BorrowTable';

@Form.create()
@connect(({ loading, borrowering }) => ({
  loading: loading.effects['approveIndex/add'] ||
           loading.effects['approveIndex/edit'] || false,
  recordList: borrowering.recordList
}))
class RecordModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    detail: PropTypes.object,
  }

  state = {
    visible: false
  }

  onShow = () => {
    const { detail, dispatch } = this.props;
    dispatch({
      type: 'borrowering/repayRecord',
      payload: {
        loanId:detail.loanId,
        pageNo:1,
        pageSize:100
      }
    });
    
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
          id: detail.loanId,
        });
        if(values.repaySum*1>detail.waitAssessSum/100){
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
      detail,
    } = this.props;
    const { visible } = this.state;
    return (
      <div style={{display:'inline-block'}}>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title='借还记录'
          width="980px"
          footer={[
            <Button key="cancel" onClick={this.onCancel}>关闭</Button>,
          ]}
          onCancel={this.onCancel}
          visible={visible}
        >
          <div className={style.tit}>
            <span className={style.h2}>借款金额：</span><span className={style.num}>¥{detail.loanSum/100}</span>
            <Divider type="vertical" />
            <span className={style.h2}>已还款：</span><span className={style.num}>¥{(detail.loanSum - detail.waitLoanSum)/100 }</span>
            <Divider type="vertical" />
            <span className={style.h2}>待核销：</span><span className={style.num}>¥{detail.waitAssessSum/100}</span>
            <Divider type="vertical" />
            <span className={style.h2}>核销中：</span><span className={style.num}>¥{(detail.waitLoanSum - detail.waitAssessSum)/100 }</span>
          </div>
          <BorrowTable list={this.props.recordList} />
        </Modal>
      </div>
    );
  }
}

export default RecordModal;
