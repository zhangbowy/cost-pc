import React, { useState } from 'react';
import { Modal } from 'antd';
import style from './classify.scss';
import AddInvoice from './AddInvoice';

export default function JudgeType(props) {
  const [visible, setVisible] = useState(props.visible);
  const cancel = () => {
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
        <p className="fs-24 c-black-85 m-b-47" style={{marginLeft: '14px'}}>请选择你要创建的单据类型</p>
        {/* <p className="c-black-36 fs-12 m-b-22" style={{marginLeft: '15px'}}>请选择你要创建的单据类型</p> */}
        <div className={style.judgeType}>
          <AddInvoice title={props.title} onOk={props.onOk} data={props.data} templateType={0} changeVisible={() => cancel()}>
            <div className={style.invoiceType}>
              <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>报销单</p>
              <p className="c-black-36 fs-12 m-l-24">· 适用于差旅报销、行政报销等场景</p>
            </div>
          </AddInvoice>
          <AddInvoice title={props.title} onOk={props.onOk} data={props.data} templateType={1} changeVisible={() => cancel()}>
            <div className={style.borrowType}>
              <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '45px'}}>借款单</p>
              <p className="c-black-36 fs-12 m-l-24">· 适用于备用金借款等场景</p>
              <p className="c-black-36 fs-12 m-l-24">· 可通过报销单核销或线下还款</p>
            </div>
          </AddInvoice>
        </div>
      </Modal>
    </span>
  );
}
