import React from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';
import style from './index.scss';
import SelectInvoice from '../../../components/Modals/SelectInvoice';

function HeadLeft() {
  return (
    <div className={style.headLeftC}>
      <div className={style.btns}>
        <Button type="primary" className="m-r-8">
          <i className="iconfont iconPCxinzengdanju fs-18" />
          <SelectInvoice>
            <span className="m-l-4">提单据</span>
          </SelectInvoice>
        </Button>
        <Button type="primary" ghost>
          <i className="iconfont iconjiyibi fs-14 sub-color" />
          <span className="m-l-4 sub-color">记一笔</span>
        </Button>
      </div>
      <p className="fs-12 c-black-25 m-b-6">常用单据</p>
      <div>
        <div className={style.tags}>
          <span className={style.iconfonts}>
            <i className="iconfont iconorder_fill" />
          </span>
          <span className="m-l-8">借款单据</span>
        </div>
      </div>
    </div>
  );
}

HeadLeft.propTypes = {

};

export default HeadLeft;

