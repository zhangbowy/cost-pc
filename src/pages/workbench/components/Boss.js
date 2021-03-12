import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import style from './index.scss';

function Boss({ visible, changeBoss }) {
  return (
    <Modal
      title={null}
      footer={null}
      visible={visible}
      width="680px"
      closable={false}
      maskClosable={false}
    >
      <p className="fs-24 c-black-85 m-b-12 fw-500" style={{marginLeft: '14px'}}>
        欢迎来到鑫支出！请选择您的角色
      </p>
      <p className="fs-14 c-black-65 m-b-47" style={{marginLeft: '14px'}}>
        不同角色对应不同的工作台，如有角色转变，后续可以在个人中心修改
      </p>
      <div className={style.judgeType}>
        <div className={style.boss} onClick={() => changeBoss(true)}>
          <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '24px'}}>boss/总监/主管</p>
          <p className="c-black-36 fs-12 m-l-24" style={{ width: '145px' }}>倾向统计，按数据权限范围查看/管理企业开支</p>
        </div>
        <div className={style.peoples} onClick={() => changeBoss(false)}>
          <p className="fs-20 c-black-85 m-l-24 m-b-10" style={{paddingTop: '24px'}}>员工</p>
          <p className="c-black-36 fs-12 m-l-24">倾向提报/查看单据</p>
        </div>
      </div>
    </Modal>
  );
}

Boss.propTypes = {
  visible: PropTypes.bool,
};

export default Boss;

