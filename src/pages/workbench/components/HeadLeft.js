import React from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';
import style from './index.scss';
import SelectInvoice from '../../../components/Modals/SelectInvoice';
import AddCost from '../../../components/Modals/AddInvoice/AddCost';
import AddInvoice from '../../../components/Modals/AddInvoice';

function HeadLeft(props) {
  const { OftenTemplate } = props;
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
      <div style={{ display: 'flex' }}>
        {
          OftenTemplate.map(it => (
            <AddInvoice key={it.id} id={it.id} templateType={it.templateType} onHandleOk={props.onOk}>
              <div className={style.tags} key={it.id}>
                <span className={style.iconfonts}>
                  <i className="iconfont iconorder_fill" />
                </span>
                <span className="m-l-8">{it.name}</span>
              </div>
            </AddInvoice>
          ))
        }
      </div>
    </div>
  );
}

HeadLeft.propTypes = {

};

export default HeadLeft;

