import React, { useState } from 'react';
import { Modal } from 'antd';
import style from './classify.scss';
// import Tags from '../../../../components/Tags';
// import AddInvoice from './AddInvoice';

const cost = [{
  key: 'add_0',
  name: '报销单',
  styleName: 'invoiceType',
  children: [{
    key: '0',
    title: '· 适用于差旅报销、行政报销等场景',
  }]
}, {
  key: 'add_1',
  name: '借款单',
  styleName: 'borrowType',
  children: [{
    key: '0',
    title: '· 适用于备用金借款等场景',
  }, {
    key: '1',
    title: '· 可通过报销单核销或线下还款',
  }]
}, {
  key: 'add_2',
  styleName: 'applyType',
  name: '申请单',
  children: [{
    key: '0',
    title: '· 适用于出差、采购事前申请',
  }]
}, {
  styleName: 'salaryType',
  key: 'add_3',
  name: '薪资单',
  children: [{
    key: '0',
    title: '· 适用于工资、奖金、社保等保密性支出',
  }, {
    key: '1',
    title: '· 一般由人事/财务发起申请',
  }]
}];
const income = [{
  styleName: 'incomeType',
  key: 'add_20',
  name: '收款单',
  children: [{
    key: '0',
    title: '· 适用于各种业务收入款项的结算发起',
  }, {
    key: '1',
    title: '· 一般由销售/商务发起，出纳确认',
  }]
}, {
  styleName: 'futureType',
  key: 'add_30',
  name: '收入合同',
  children: [{
    key: '0',
    title: '· 用于合同签订后的收款计划申请',
  }],
  disabled: true,
}];
export default function JudgeType(props) {
  const [visible, setVisible] = useState(props.visible);
  const cancel = (val) => {
    if (val === 'add_30') return;
    props.linkInvoice(val);
    setVisible(false);
  };

  const list = props.type ? income : cost;

  return (
    <span>
      <span onClick={() => setVisible(true)}>{props.children}</span>
      <Modal
        title={null}
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={props.type ? '520px' : '752px'}
        height="400px"
      >
        <p className="fs-24 c-black-85 m-b-40 fw-500" style={{marginLeft: '14px', marginTop: '14px'}}>请选择你要创建的单据类型</p>
        <div className={props.type ? style.incomeJudgeType : style.judgeType}>
          {
            list.map(it => (
              <div className={style[it.styleName]} onClick={() => cancel(it.key)} key={it.key}>
                <p className={props.type ? 'fs-20 c-black-85 m-l-4 m-b-10' : 'fs-20 c-black-85 m-l-4 m-b-10'} style={{paddingTop: '24px'}}>
                  <span className="fs-20 c-black-85 m-l-24 m-b-10" style={{verticalAlign: 'middle'}}>{it.name}</span>
                  {
                    it.disabled &&
                    <div className={style.tags}>暂未开放</div>
                  }
                </p>
                {
                  it.children.map(item => (
                    <p className="c-black-36 fs-12 m-l-24" key={item.key}>{item.title}</p>
                  ))
                }
              </div>
            ))
          }

          {/* <div className={style.borrowType} onClick={() => cancel('add_1')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '24px'}}>借款单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于备用金借款等场景</p>
            <p className="c-black-36 fs-12 m-l-24">· 可通过报销单核销或线下还款</p>
          </div>
          <div className={style.applyType} onClick={() => cancel('add_2')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '24px'}}>申请单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于出差、采购事前申请</p>
          </div>
          <div className={style.salaryType} onClick={() => cancel('add_3')}>
            <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '24px'}}>薪资单</p>
            <p className="c-black-36 fs-12 m-l-24">· 适用于工资、奖金、社保等保密性支出</p>
            <p className="c-black-36 fs-12 m-l-24">· 一般由人事/财务发起申请</p>
          </div> */}
        </div>
      </Modal>
    </span>
  );
}
