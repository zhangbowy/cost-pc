import React from 'react';
import cs from 'classnames';
import style from './index.scss';

const Sort =  (props) => {
  console.log(props);
  return (
    <>
      {
        props.treeList && props.treeList.map(item => {
          return (
            <div className={style.sorts} key={item.id}>
              <div className={style.cnt}>
                <span className="iconfont arrow_down" />
                <span>{item.name}</span>
              </div>
              <div className={cs(style.op, 'font-color')}>
                <span className={cs(style.up, 'sub-color')}>向上</span>
                <span className="border-color">｜</span>
                <span>向下</span>
              </div>
            </div>
          );
        })
      }
    </>
  );
};

export default Sort;
