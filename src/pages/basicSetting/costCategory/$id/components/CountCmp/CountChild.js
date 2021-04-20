import React, { PureComponent } from 'react';
import style from './index.scss';

class CountChild extends PureComponent {
  render () {
    return (
      <div className={style.childTemp}>
        <div className={style.childStr}>
          <span className={style.required}>*</span>
          <div className={style.tmpCnt}>
            <p className="fs-14 c-black-85">单价</p>
            <div className={style.inputs}>
              <span className="fs-14 c-black-25">请输入</span>
            </div>
          </div>
        </div>
        <div className={style.childStr}>
          <span className={style.required}>*</span>
          <div className={style.tmpCnt}>
            <p className="fs-14 c-black-85">数量</p>
            <div className={style.inputs}>
              <span className="fs-14 c-black-25">请输入</span>
            </div>
          </div>
        </div>
        <div className={style.childStr}>
          <span className={style.required}>*</span>
          <div className={style.tmpCnt}>
            <p className="fs-14 c-black-85">金额</p>
            <div className={style.inputs}>
              <span className="fs-14 c-black-25">请输入</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CountChild;
