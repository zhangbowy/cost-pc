import React from 'react';
import noData from '@/assets/img/noData.png';
import style from './index.scss';

const NoData = () => {
  return (
    <div className={style.noData}>
      <img src={noData} alt="暂无数据" />
      <span>暂无数据</span>
    </div>
  );
};

export default NoData;
