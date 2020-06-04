import React from 'react';
import cs from 'classnames';
import { Icon } from 'antd';
import style from './index.scss';

export const ChildNodes = (props) => {
  console.log(props);
  return(
    <div className={style.sorts} key={props.key}>
      <div className={style.cnt}>
        <Icon type="right" />
        <span>{props.value}</span>
      </div>
      <div className={cs(style.op, 'font-color')}>
        <span className={cs(style.up, 'sub-color')}>向上</span>
        <span className="border-color">｜</span>
        <span>向下</span>
      </div>
    </div>
  );
};

export default ChildNodes;
