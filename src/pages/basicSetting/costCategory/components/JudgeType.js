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
        width="520px"
        height="400px"
      >
        <p className="fs-24 c-black-85 m-b-47" style={{marginLeft: '14px'}}>请选择你要创建的支出类别</p>
        <div className={style.judgeType}>
          <div className={style.cost} onClick={() => cancel('add_0')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>费用支出</p>
            <p className="c-black-36 fs-12 m-l-24">· 涉及差旅、团餐、招待、出行等</p>
          </div>
          <div className={style.chengben} onClick={() => cancel('add_1')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>成本支出</p>
            <p className="c-black-36 fs-12 m-l-24">· 涉及人工、房租成本，采购、物料、固定资产成本等</p>
          </div>
        </div>
      </Modal>
    </span>
  );
}
