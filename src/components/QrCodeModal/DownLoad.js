import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import logo from '../../assets/img/logo.png';
import style from './index.scss';



export const Download = (props) => {
  const [visible, setVisible] = useState(props.dVis || false);
  const qrBox = useRef();
  const handleInfo = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };
  const download = () => {
    console.log(qrBox.current);
    const content = qrBox.current;
    const scale = window.devicePixelRatio; // 获取设备像素比
    const height = content.offsetHeight; // 获取DOM高度
    const width = content.offsetWidth; // 获取DOM宽度

    html2canvas(content, {
      useCORS: true,
      scale,
      width,
      height
    }).then(canvas => {
      window.location.href = canvas.toDataURL('image/png');
      const img = document.createElement('a');
      img.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
      img.download = `${props.name}.jpg`;
      img.click();
    });
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
        wrapClassName={style.codeModal}
      >
        <div>
          <div className={style.code} ref={qrBox}>
            <div className={style.share_title}>
              {/* <div className={style.logo}>
                <i className="iconfont" />
                <p className="fs-15 fw-500 c-fff m-b-8" style={{marginBottom: 0}}>鑫支出</p>
              </div> */}
              <img src={logo} alt="logo" className={style.logos} />
              <p className="fs-15 fw-500 c-fff" style={{marginBottom: 0}}>便捷的企业支出管理系统</p>
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
              <p className="use_a m-t-40">请使用钉钉扫一扫</p>
            </div>
          </div>
          <div className={style.modalBtn}>
            <Button onClick={() => onCancel()} className="m-b-12">取消</Button>
            <Button type="primary" onClick={() => download()}>下载二维码</Button>
          </div>
        </div>
      </Modal>
    </span>
  );
};

export default Download;
