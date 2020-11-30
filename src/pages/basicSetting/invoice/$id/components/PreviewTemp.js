import React from 'react';
import style from './index.scss';

function PreviewTemp() {
  return (
    <div
      className={style.StrTemplates}
    >
      <div className={style.tmpCnt}>
        <p className="fs-14 c-black-85">费用类别</p>
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

export default PreviewTemp;
