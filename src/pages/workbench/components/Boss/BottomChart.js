import React, { useState } from 'react';
import style from './leftPie.scss';
import LineAndColumn from '../../../../components/Chart/LineAndColum.js';
import TimeComp from '../TimeComp';

const titleList = [{
  name: '类别支出分析',
  key: '0',
}, {
  name: '部门支出分析',
  key: '1',
}, {
  name: '项目支出分析',
  key: '2',
}];
const BottomChart = ({ onChangeState, submitTime }) => {
  const [type, setType] = useState('0');
  return (
    <div className={style.bottomChart}>
      <div className={style.header}>
        <div className={style.title}>
          {
            titleList.map(it => (
              <span
                className={type === it.key ? style.active : ''}
                key={it.key}
                onClick={() => setType(it.key)}
              >
                {it.name}
              </span>
            ))
          }
        </div>
        <TimeComp
          onChangeState={onChangeState}
          submitTime={submitTime}
          formType={1}
        />
      </div>
      <div className={style.lineChart}>
        <LineAndColumn options={{ height: 468 }} />
      </div>
    </div>
  );
};

export default BottomChart;
