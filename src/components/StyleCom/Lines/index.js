import React from 'react';
import style from './index.scss';

export default function Lines(props) {
  return (
    <div className={style.header}>
      <div className={style.line} />
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
