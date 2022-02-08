import React, { useState } from 'react';
import { Modal} from 'antd';
import moment from 'moment';
import style from './index.scss';

function Services(props) {
  const [visible, setVisible] = useState(props.visible || false);
  const onShow = () => {
    setVisible(true);
  };
  const costConfigCheckVo = props.costConfigCheckVo || {};
  // const status = costConfigCheckVo.status;
  // const goUpdate = () => {
  //   console.log(props,'9999999');
  //   console.log('kfds');
  // };
  return (
    <div style={{width: '100%'}}>
      <span onClick={onShow}>{props.children}</span>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        width="680px"
        footer={null}
        maskClosable={false}
        closable={Number(props.status) !== 2}
        className={style.bg}
        wrapClassName="centerModal"
      >
        <div className={style.modals}>
          {/* <p className="fs-26 fw-600 c-black-85 m-b-18">{props.isDelay ? '已到期，请扫码购买' : '升级享受更多服务'}</p> */}
          <p className="m-b-13 fs-14 m-t-80">
            <span>您当前使用的版本规格为：</span>
            <span className="cl-tip">{costConfigCheckVo.version}</span>
            <span className="m-l-8">有效期至：</span>
            <span className="cl-tip">{costConfigCheckVo.serviceStopTime && moment(costConfigCheckVo.serviceStopTime).format('YYYY-MM-DD')}</span>
          </p>
          {/* <img alt="说明" src={group} style={{width: '612px'}} /> */}
          {/* <Popover
            content={(
              <div>
                <img alt="二维码" src={adCode} style={{width: '200px'}} />
              </div>
            )}
            placement="top"
            trigger="hover"
          >
            <div className={style.codeBtn}>
              <span>扫码升级</span>
            </div>
          </Popover> */}
          {/* 续费升级按钮 */}
          <div>
            <a href="https://h5.dingtalk.com/appcenter/index-pc.html?ddtab=true&funnelsource=recruit_pc&#/detail/DD_GOODS-101001059326" target="_blank" rel='noreferrer' className={style.update}>立即续费升级</a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Services;
