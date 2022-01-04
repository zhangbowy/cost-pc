import React from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';
import style from './index.scss';
import SelectInvoice from '../../../components/Modals/SelectInvoice';
import AddCost from '../../../components/Modals/AddInvoice/AddCost';

function HeadLeft(props) {
  const { OftenTemplate, onToAdd } = props;
  return (
    <div className={style.headLeftC}>
      <div className={style.btns}>
        <SelectInvoice onOk={props.onOk} onCallback={() => props.onOk()}>
          <Button type="primary" className="m-r-8" style={{width: '140px', height: '40px'}}>
            <i className="iconfont iconPCxinzengdanju fs-20" style={{ verticalAlign: 'middle' }} />
            <span className="m-l-8 fs-16 m-r-10" style={{ verticalAlign: 'middle' }}>提单据</span>
          </Button>
        </SelectInvoice>
        <AddCost costType={1} onCallback={() => props.onOk()} againCost>
          <Button type="primary" ghost style={{width: '140px', height: '40px', verticalAlign: 'center'}}>
            <i className="iconfont iconjiyibi fs-20 sub-color" style={{ verticalAlign: 'middle' }} />
            <span className="m-l-4 sub-color fs-16 m-r-10" style={{ verticalAlign: 'middle' }}>记一笔</span>
          </Button>
        </AddCost>
      </div>
      <p className="fs-12 c-black-25 m-b-6">常用单据</p>
      <div style={{ display: 'flex', minWidth: '368px', overflow: 'hidden' }} className="addWidth">
        {
          OftenTemplate.map(it => (
            <span className="invoiceFirst" key={it.id}>
              <span className="invoiceSecond">
                <div className={style.tags} onClick={() => onToAdd(it.templateType, it.id)}>
                  <span className={style.iconfonts}>
                    <i className="iconfont iconorder_fill" />
                  </span>
                  <span className="m-l-8 eslips-1" style={{flex: 1, display: 'inline-block'}}>{it.name}</span>
                </div>
              </span>
            </span>
          ))
        }
      </div>
    </div>
  );
}

HeadLeft.propTypes = {

};

export default HeadLeft;

