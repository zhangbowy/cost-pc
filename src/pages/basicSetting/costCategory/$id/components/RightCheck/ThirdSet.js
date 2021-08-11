import React from 'react';
import { Divider, Checkbox } from 'antd';
import style from './index.scss';

const ThirdSet = () => {
  return (
    <div>
      <Divider type="horizontal" />
      <div className={style.modules}>
        <p className="fs-14 c-black-85 m-b-8">行程同步至第三方平台</p>
        <Checkbox>阿里商旅</Checkbox>
      </div>
      <div className={style.modules}>
        <p className="fs-14 c-black-85 m-b-8">成本中心</p>
        <p className="c-black-45 fs-13">请到阿里商旅管理后台为每个员工设置对应成本中心，员工提交申请时自动关联成本中心，如有多个，需选择其中一个</p>
      </div>
      <div className={style.modules}>
        <p className="fs-14 c-black-85 m-b-8">发票抬头</p>
        <p className="c-black-45 fs-13">设置方式同成本中心</p>
      </div>
      <div className={style.modules}>
        <p className="fs-14 c-black-85 m-b-8">同行人(通讯录选择，支持多人)</p>
        <Checkbox>启用</Checkbox>
      </div>
      <div className={style.modules}>
        <p className="fs-14 c-black-85 m-b-8">费用归属</p>
        <p className="c-black-45 fs-13">1、 按分摊计入</p>
        <p className="c-black-45 fs-13">2、均计入申请人</p>
      </div>
    </div>
  );
};

export default ThirdSet;
