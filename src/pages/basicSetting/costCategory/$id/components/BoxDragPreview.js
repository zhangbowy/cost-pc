import React from 'react';
import style from './index.scss';

function BoxDragPreview(props) {
  return (
    <div
      className={style.StrTemplates}
    >
      <span className={style.required}>*</span>
      <div className={style.tmpCnt}>
        <p className="fs-14 c-black-85">{props.name}</p>
        <div className={style.inputs}>
          <span className="fs-14 c-black-25">请选择</span>
          <i className="iconfont icondown c-black-25" />
        </div>
      </div>
      <div className={style.operator}>
        <p className={style.delete}>
          <i className="iconfont iconshanchu" />
        </p>
      </div>
    </div>
  );
}

export default BoxDragPreview;
