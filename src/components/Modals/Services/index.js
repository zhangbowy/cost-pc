import React, { useState } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import group from '@/assets/img/Group.png';
import style from './index.scss';

function Services(props) {
  const [visible, setVisible] = useState(props.visible || false);
  const onShow = () => {
    setVisible(true);
  };
  const costConfigCheckVo = props.costConfigCheckVo || {};
  // const status = costConfigCheckVo.status;

  return (
    <div style={{width: '100%'}}>
      <span onClick={onShow}>{props.children}</span>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        width="720px"
        footer={null}
        maskClosable={false}
        closable={Number(props.status) !== 2}
      >
        <div className={style.modals}>
          <p className="fs-26 fw-600 c-black-85 m-b-18">{props.isDelay ? '已到期，请扫码购买' : '升级享受更多服务'}</p>
          <p className="m-b-13 fs-14">
            <span>您当前试用的版本规格为：</span>
            <span className="cl-tip">{costConfigCheckVo.version}</span>
            <span className="m-l-8">有限期至：</span>
            <span className="cl-tip">{costConfigCheckVo.serviceStopTime && moment(costConfigCheckVo.serviceStopTime).format('YYYY-MM-DD')}</span>
          </p>
          <p className="c-black-65 m-b-28">升级后您可以享受更多服务</p>
          <img alt="说明" src={group} style={{width: '612px'}} />
          <div className={style.codeBtn}>
            <span>扫码升级</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Services;
