import React, { useState } from 'react';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';
// eslint-disable-next-line import/no-named-as-default
import Download from './DownLoad';
import style from './index.scss';
// import constants from '../../utils/constants';

// const {
//   APPID,
// } = constants;

export const QrCodeModal = (props) => {
  const userInfo = props.userInfo || {};
  console.log(props.id);
  // eslint-disable-next-line camelcase
  const micro_url = '&page=pages/index/addExpense/addExpense?id=';
  // eslint-disable-next-line camelcase
  const MICRO_URL = `dingtalk://dingtalkclient/action/open_micro_app?appId=${userInfo.appId}&corpId=${userInfo.corpId}${micro_url}`;
  const qrValue = `${MICRO_URL}${props.id}`;
  const [visible, setVisible] = useState(false);
  const [dVis, setDVis] = useState(false);
  const handleInfo = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };
  const download = () => {
    setDVis(true);
    setVisible(false);
  };
  return(
    <span>
      <span onClick={() => handleInfo()}>{props.children}</span>
      <Modal
        width='575px'
        title={null}
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
      >
        <div className={style.code}>
          <div className={style.code_ctn}>
            <i className="iconfont iconyuanxingxuanzhongfill" />
            <p className="fs-16 fw-500 c-black-85">{props.name} 创建成功</p>
          </div>
          <div className={style.cnt}>
            <div className={style.left}>
              <QRCode
                value={qrValue}
                size={100}
                bgColor='#fff'
                fgColor='#000'
                className="share-img"
              />
              <Download
                qrValue={qrValue}
                name={props.name}
                visible={dVis}
              >
                <p className="sub-color" onClick={() => download()}>下载提报二维码</p>
              </Download>
            </div>
            <div className={style.right}>
              <span>员工可通过以下方式提报</span>
              <div style={{marginTop: '32px'}}>
                <p>· 进入钉钉 - 工作台 - 鑫支出，进行提报</p>
                <p>· 打印二维码让员工用钉钉扫码提报</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </span>
  );
};

export default QrCodeModal;
