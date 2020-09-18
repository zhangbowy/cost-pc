import React, { useEffect } from 'react';
import { Modal, Button, Alert } from 'antd';
import { connect } from 'dva';
import style from './index.scss';

function ComfirmPay(props) {
  useEffect(() => {
    props.dispatch({
      type: 'global/signDetail',
      payload: {},
    });
  }, []);
  const onSave = () => {
    props.goPay();
  };
  return (
    <div>
      <span>{props.children}</span>
      <Modal
        title={null}
        footer={null}
        width="680px"
      >
        <h1>确认支付</h1>
        <div className={style.confirm}>
          <Alert
            type="success"
            message={(
              <span className="c-black-65">
                支付完成后可返回
                <span className="c-black-85" style={{fontWeight: 'bold'}}>付款批次页面</span>
                查看支付结果
              </span>
            )}
            icon={(
              <i className="iconfont iconIcon-yuangongshouce fs-14 sub-color m-l-8" />
            )}
          />
          <span className="c-black-65 m-b-24">付款批次：</span>
          <span className="c-black-65 m-b-24">单据条数：</span>
          <span className="c-black-65 m-b-24">金额共计：</span>
          <span className="c-black-65 m-b-24">支付状态：<span style={{color: 'rgba(255, 204, 12, 1)'}}>待支付</span></span>
          <Button key="save" onClick={() => onSave()}>去支付</Button>
        </div>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    signDetails: state.global.signDetails,
  };
};

export default connect(mapStateToProps)(ComfirmPay);
