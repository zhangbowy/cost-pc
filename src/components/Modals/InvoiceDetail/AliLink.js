import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';
import fields from '@/utils/fields';
import logo from '../../../assets/img/aliTrip/aliLogo.png';
import style from './index.scss';
import { getParams } from '../../../utils/common';
// import { ddOpenLink } from '../../../utils/ddApi';

const { aliTraffic } = fields;
const AliLink = ({ status, subTrip, onGetLink }) => {
console.log('AliLink -> status', status);
const [visible, setVisible] = useState(false);
const [oderType, setOrderType] = useState(1);
const handleClick = (key) => {
  setOrderType(key);
  setVisible(true);
};
const onLink = async(it) => {
  const orders = it.traffic === '飞机' ? 1 : 2;
  const result = await onGetLink({
    orderType: oderType !== 1 ? oderType : orders,
    startCity: it.startCity,
    endCity: it.endCity,
    itineraryId: it.itineraryId
  });
  if (result) {
    setVisible(false);
    window.location.href = result;
    // ddOpenLink(result);
  }
};
return (
  <>
    <div className={style.aliLink}>
      <div className={style.logos}>
        <img src={logo} alt="阿里商旅" />
        <span className="fs-16 c-black-85" style={{ verticalAlign: 'middle' }}>
          {
            status !== 2 ?
            '审批通过后可使用阿里商旅进行行程预定'
            :
            '使用阿里商旅可快速进行行程预定'
          }
        </span>
      </div>
      <div>
        <Button disabled={status !== 2} type="primary" className="m-r-12" onClick={() => handleClick(1)}>订票</Button>
        <Button disabled={status !== 2} type="primary" className="m-r-12" onClick={() => handleClick(3)}>订酒店</Button>
        <Button disabled={status !== 2} type="primary" onClick={() => handleClick(4)}>用车</Button>
      </div>
    </div>
    <Modal
      title="选择行程"
      visible={visible}
      width="680px"
      onCancel={() => setVisible(false)}
    >
      <div>
        {
          subTrip.map(item => (
            <div className={style.singleContent} key={item.startDate} onClick={() => onLink(item)}>
              <div className={style.iconImg}>
                <img
                  src={getParams({res: item.traffic, list: aliTraffic, key: 'label', resultKey: 'icon'})}
                  alt="模式"
                />
              </div>
              <div className="m-t-16">
                <p className="c-black-85 fs-16 fw-500 m-b-6">{item.startCity} - {item.endCity}</p>
                <p className="c-black-65 fs-14">
                  {moment(Number(item.startDate)).format('YYYY-MM-DD')} - {moment(Number(item.endDate)).format('YYYY-MM-DD')}
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </Modal>
  </>
 );
};

export default AliLink;
