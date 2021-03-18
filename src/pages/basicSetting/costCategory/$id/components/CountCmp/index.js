import React from 'react';
// import PropTypes from 'prop-types';
import { Divider } from 'antd';
import { useDrop } from 'react-dnd';
import style from './index.scss';

function CountCmp() {
  const [, drop] = useDrop({
    accept: 'box',
    canDrop: () => {},
    hover(item, monitor) {
      console.log('card-->drop', monitor);
      // if (Number(fieldType) === 8) {
      //   const len = findCard(Number(fieldType));
      //   moveCard(len, index);
      // }
    },
  });
  return (
    <div
      className={style.details}
      ref={(node) => drop(node)}
    >
      <p>
        <span className="fs-14 c-black-85">明细</span>
        <span className="fs-12 c-black-45">（可拖入多个自定义组件，不包括明细组件）</span>
      </p>
      <Divider type="horizontal" style={{ margin: '16px 0 15px 0' }} />
      <div className={style.detailBottom}>
        <p className="fs-14 c-black-85">数量</p>
        <div className={style.inputs}>
          <span className="fs-14 c-black-25">请输入</span>
        </div>
        <p className="fs-14 c-black-85">单价</p>
        <div className={style.inputs}>
          <span className="fs-14 c-black-25">请输入</span>
        </div>
        <p className="fs-14 c-black-85">金额<span className="c-black-45 fs-12">（金额=数量*单价）</span></p>
        <div className={style.inputs}>
          <span className="fs-14 c-black-25">请输入</span>
        </div>
      </div>
    </div>
  );
}

CountCmp.propTypes = {

};

export default CountCmp;

