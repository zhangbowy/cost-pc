import React, { useState } from 'react';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';
import style from './index.scss';

export const Download = (props) => {
  const [visible, setVisible] = useState(props.dVis || false);
  const handleInfo = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };
  return(
    <span className={style.shareCode}>
      <span onClick={() => handleInfo()}>{props.children}</span>
      <Modal
        width='300px'
        title={null}
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
        bodyStyle={{ padding:'0' }}
      >
        <div className={style.code}>
          <div className={style.share_title}>
            <p>鑫支出</p>
            <p className="fs-16 fw-500 c-black-85">{props.name}</p>
          </div>
          <div className={style.share_cnt}>
            <p className="fs-24 c-black-85 fw-600 m-b-12 m-t-34">{props.name}</p>
            <div className="m-b-12">
              <QRCode
                value={props.qrValue}
                size={150}
                bgColor='#fff'
                fgColor='#000'
                className="share-img-code"
              />
            </div>
            <p className="sub-color m-t-40">请使用钉钉扫一扫</p>
          </div>
        </div>
      </Modal>
    </span>
  );
};

export default Download;
