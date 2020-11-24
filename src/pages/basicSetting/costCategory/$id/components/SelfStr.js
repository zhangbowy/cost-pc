import React from 'react';
// import { useDrag } from 'react-dnd';
// import moment from 'moment';
import style from './index.scss';
// import Templates from './templates';

function SelfStr({ name, icon }) {

  return (
    <>
      <div className={style.selfStr}>
        <i className={`${icon} iconfont m-l-8 m-r-8`} />
        <span>{name}</span>
      </div>
    </>
  );
}

export default SelfStr;
