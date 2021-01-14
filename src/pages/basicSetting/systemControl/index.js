import React from 'react';
import PageHead from '@/components/PageHead';
import { Switch } from 'antd';
import style from './index.scss';
// import PropTypes from 'prop-types';

function index() {
  return (
    <div>
      <PageHead title="控制开关" />
      <div className={style.content}>
        <Switch className={style.switch} />
        <p className="fs-16 c-black-85 fw-500">允许发放环节改单</p>
        <p className={style.production}>
          <span>开启后，在单据发放环节，发放人可对单据的部分信息进行修改后发放，无需重新打回。比如费用类别、金额等，如需支持更多信息的修改，请至</span>
          <span className="sub-color">单据模版设置/费用类别设置</span>
          <span>，编辑页面操作</span>
        </p>
        <div className={style.label}>
          <div className={style.lables}>
            <span className={style.circle} />
            <span>已关闭</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// index.propTypes = {

// };

export default index;

