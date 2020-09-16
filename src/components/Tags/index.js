import React from 'react';
import PropTypes from 'prop-types';
import style from './index.scss';

function Tags(props) {
  return (
    <div
      className={style.container}
      style={{
        backgroundColor: props.color || 'rgba(0, 199, 149, 0.08)',
        border: '1px solid',
        borderColor: props.color || 'rgba(0, 199, 149, 0.08)',
      }}
    >
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}

Tags.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
};

export default Tags;

