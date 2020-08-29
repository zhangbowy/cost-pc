import React, { useState } from 'react';
import { Modal } from 'antd';
import style from './classify.scss';
import AddInvoice from './AddInvoice';

export default function JudgeType(props) {
  const [visible, setVisible] = useState(false);


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
        <p className="fs-24 c-black-85 m-b-8">请选择你要创建的单据类型</p>
        <p className="c-black-36 fs-12 m-b-22">请选择你要创建的单据类型</p>
        <div className={style.judgeType}>
          <AddInvoice title={props.title} onOk={props.onOk} data={props.data} templateType={0}>
            <div className={style.invoiceType}>
              <p className="fs-20 c-black-85 m-l-24" style={{paddingTop: '45px'}}>报销单</p>
              <p className="c-black-36 fs-12 m-l-24">这里是辅助的功能</p>
            </div>
          </AddInvoice>
          <AddInvoice title={props.title} onOk={props.onOk} data={props.data} templateType={1}>
            <div className={style.borrowType}>
              <p className="fs-20 c-black-85 m-l-24" style={{paddingTop: '45px'}}>借款单</p>
              <p className="c-black-36 fs-12 m-l-24">这里是辅助的功能</p>
            </div>
          </AddInvoice>
        </div>
      </Modal>
    </span>
  );
}
