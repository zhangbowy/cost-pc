import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import style from './index.scss';

function Tags(props) {
  return (
    <div
      className={cs(style.container, props.className)}
      style={{
        backgroundColor: props.color || 'rgba(0, 199, 149, 0.08)',
        border: '1px solid',
        borderColor: props.color || 'rgba(0, 199, 149, 0.08)',
      }}
    >
      <span style={{color: props.nameColor || 'rgba(0,0,0,0.85)'}}>{props.name}</span>
      {props.children}
    </div>
  );
}

Tags.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
};

export default Tags;

