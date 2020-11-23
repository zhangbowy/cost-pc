/* eslint-disable no-param-reassign */
import React from 'react';
// import PropTypes from 'prop-types';
// import { useDrag, useDrop } from 'react-dnd';
import style from './index.scss';
// import PreviewTemp from './PreviewTemp';

function Templates({ id, name, isWrite, dragId, onClick }) {

  return (
    <div
      className={style.StrTemplates}
      onClick={() => {
        onClick('selectId', id);
      }}
    >
      {
        dragId === id ?
          <p className={style.lines} />
          :
          <p className={style.linesD} />
      }
      {
        isWrite &&
        <span className={style.required}>*</span>
      }
      <div className={style.tmpCnt}>
        <p className="fs-14 c-black-85">{name}</p>
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

Templates.propTypes = {

};

export default Templates;

