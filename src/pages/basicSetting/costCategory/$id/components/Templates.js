/* eslint-disable no-param-reassign */
import React from 'react';
// import PropTypes from 'prop-types';
// import { useDrag, useDrop } from 'react-dnd';
import style from './index.scss';
// import PreviewTemp from './PreviewTemp';

function Templates({ name, isWrite, fieldType }) {
  const types = Number(fieldType);
  return (
    <div
      className={style.StrTemplates}
      style={{boxShadow: '0px 2px 30px 1px rgba(0, 0, 0, 0.08)', background: '#fff'}}
    >
      <span className={isWrite ? style.required : style.requireds}>*</span>
      <div className={style.tmpCnt}>
        {
          types !== 9 &&
          <p className="fs-14 c-black-85 m-b-16">{name}</p>
        }
        {
          (types === 2) &&
          <div className={style.inputs}>
            <span className="fs-14 c-black-25">请选择</span>
            <i className="iconfont icondown c-black-25" />
          </div>
        }
        {
          (types === 5 || types === 8) &&
          <div className={style.dateType}>
            <i className="iconfont iconriqi c-black-25 m-r-8" />
            <span className="fs-14 c-black-25">请选择</span>
          </div>
        }
        {
          (types === 0 || types === 1) &&
          <div className={style.inputs}>
            <span className="fs-14 c-black-25">请输入</span>
            {/* <i className="iconfont icondown c-black-25" /> */}
          </div>
        }
        {
          (types === 6 || types === 7) &&
          <div className={style.images}>
            <i className="iconfont iconxinzengbaoxiao" />
          </div>
        }
        {
          types === 9 &&
          <div className={style.production}>
            <span>说明文字</span>
          </div>
        }
      </div>
    </div>
  );
}

Templates.propTypes = {

};

export default Templates;

