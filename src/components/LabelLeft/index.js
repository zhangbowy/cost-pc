import React from 'react';
import PropTypes from 'prop-types';
import style from './index.scss';

function LabelLeft(props) {
  return (
    <div className={style.cnt_foot}>
      <div className={style.header}>
        <div className={style.line} />
        <span>{props.title}</span>
      </div>
    </div>
  );
}

LabelLeft.propTypes = {
  title: PropTypes.string,
};

export default LabelLeft;

