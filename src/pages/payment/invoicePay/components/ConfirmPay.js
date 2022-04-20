import { Button } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { ddOpenLink } from '@/utils/ddApi';
import style from './index.scss';
import ModalTemp from '../../../../components/ModalTemp';

@connect(({ global, loading }) => ({
  batchDetails: global.batchDetails,
  alipayUrl: global.alipayUrl,
  loading: loading.effects['global/batchPay'] || false,
}))
class ConfirmPay extends Component {

  state = {
    visible: this.props.visible || false,
  }

  componentDidUpdate(prev) {
    if (prev.visible !== this.props.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        visible: this.props.visible
      });
    }
  }

  onSave = () => {
    const { batchDetails } = this.props;
    this.props.dispatch({
      type: 'global/batchPay',
      payload: {
        fundBatchOrderId: batchDetails && batchDetails.batchOrderId,
        returnUrl: `${window.location.href}/_aliPayConfirms`,
      }
    }).then(() => {
      const { alipayUrl, gotoPay } = this.props;
      // const urls = decodeURIComponent(alipayUrl);
      // const returnUrl = urls.substring();
      if (gotoPay) {
        gotoPay();
      }
      // this.onCancel();
      if (alipayUrl) {
        // ddOpenLink(`${alipayUrl}`);
        const url = window.location.href.replace('/payment/invoicePay','/redirect').replace('/payment/borrowPay','/redirect');
        ddOpenLink(`${url  }?ddtab=true&redirect=${  alipayUrl}`);
        // window.location.href = `${alipayUrl}&ddtab=true`;
      }
    });
  }

  onCancel = () => {
    const { gotoPay } =this.props;
    this.setState({ visible: false });
    if (gotoPay) gotoPay();
  }

  render() {
    const { batchDetails, loading } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <ModalTemp
          title="确认支付"
          footer={[
            <Button key="save" onClick={() => this.onSave()} loading={loading} disabled={loading} type="primary">去支付</Button>
          ]}
          size="small"
          visible={visible}
          onCancel={() => this.onCancel()}
          newBodyStyle={{
            height: '450px',
            padding: '16px 32px 0'
          }}
        >
          <div className={style.confirm}>
            <div className={style.content}>
              <div className={style.alert}>
                <i className="iconfont iconinfo-cirlce fs-20 sub-color m-r-8 m-l-16" style={{marginTop: '1px'}} />
                <span className="c-black-65">
                  支付完成后可返回
                  <span className="c-black-85" style={{fontWeight: 'bold'}}>对账批次页面</span>
                  查看支付结果
                </span>
              </div>
              <div className="m-l-32 m-t-18 m-b-47">
                <p className="c-black-65 m-b-24">付款批次：{batchDetails && batchDetails.batchOrderId}</p>
                <p className="c-black-65 m-b-24">单据条数：{batchDetails && batchDetails.availableOrderCount}</p>
                <p className="c-black-65 m-b-24">金额共计：
                  <span className="c-black-85 fs-20" style={{fontWeight: 'bold'}}>¥{batchDetails && batchDetails.totalAmount/100}</span>
                  {
                    batchDetails && batchDetails.commission > 0 &&
                    <span>，手续费{batchDetails.commission/100}元</span>
                  }
                </p>
                <p className="c-black-65 m-b-24">支付状态：<span style={{color: 'rgba(255, 204, 12, 1)'}}>待支付</span></p>
              </div>
            </div>
          </div>
        </ModalTemp>
      </span>
    );
  }
}
export default ConfirmPay;
