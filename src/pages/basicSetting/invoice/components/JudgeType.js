import React, { useState } from 'react';
import { Modal } from 'antd';
import style from './classify.scss';
// import AddInvoice from './AddInvoice';

export default function JudgeType(props) {
  const [visible, setVisible] = useState(props.visible);
  const cancel = (val) => {
    props.linkInvoice(val);
    setVisible(false);
  };

  return (
    <span>
      <span onClick={() => setVisible(true)}>{props.children}</span>
      <Modal
        title={null}
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
        width="750px"
        height="400px"
      >
        <p className="fs-24 c-black-85 m-b-47" style={{marginLeft: '14px'}}>请选择你要创建的单据类型</p>
        <div className={style.judgeType}>
          <div className={style.invoiceType} onClick={() => cancel('add_0')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>报销单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于差旅报销、行政报销等场景</p>
          </div>
          <div className={style.borrowType} onClick={() => cancel('add_1')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>借款单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于备用金借款等场景</p>
            <p className="c-black-36 fs-12 m-l-24">· 可通过报销单核销或线下还款</p>
          </div>
          <div className={style.applyType} onClick={() => cancel('add_2')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>申请单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于出差、采购事前申请</p>
          </div>
          <div className={style.applyType} onClick={() => cancel('add_3')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>薪资单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于工资、奖金、社保等保密性支出</p>
            <p className="c-black-36 fs-12 m-l-24">· 一般由人事/财务发起申请</p>
          </div>
        </div>
      </Modal>
    </span>
  );
}
