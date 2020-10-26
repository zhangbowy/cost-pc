import React from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';
import style from './index.scss';
import SelectInvoice from '../../../components/Modals/SelectInvoice';
import AddCost from '../../../components/Modals/AddInvoice/AddCost';

function HeadLeft(props) {
  return (
    <div className={style.headLeftC}>
      <div className={style.btns}>
        <SelectInvoice onOk={props.onOk}>
          <Button type="primary" className="m-r-8">
            <i className="iconfont iconPCxinzengdanju fs-18" />
            <span className="m-l-4">提单据</span>
          </Button>
        </SelectInvoice>
        <AddCost costType={1} onCallback={() => props.onOk()}>
          <Button type="primary" ghost>
            <i className="iconfont iconjiyibi fs-14 sub-color" />
            <span className="m-l-4 sub-color">记一笔</span>
          </Button>
        </AddCost>
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

