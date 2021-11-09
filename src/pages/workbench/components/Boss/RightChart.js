/* eslint-disable react/no-did-update-set-state */
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Spin } from 'antd';
import style from './leftPie.scss';

const list = [{
  name: '部门预警',
  key: '0',
}, {
  name: '标准预警',
  key: '1',
}];
const lists = [{
  name: '数量',
  key: '0',
}, {
  name: '金额',
  key: '1',
}];
const head = {
  0: [{
    title: '部门名称',
    key: 0,
  }, {
    title: '超标金额（元）',
    key: 1,
  }, {
    title: '环比',
    key: 2,
  }]
};
const RightChart = ({ loading }) => {
  const [type, setType] = useState('0');
  return (
    <Spin spinning={loading}>
      <div className={style.right}>
        <div className={style.title}>
          <div className={style.tLeft}>
            {
              list.map(it => (
                <span
                  onClick={() => setType(it.key)}
                  key={it.key}
                  className={it.key === type ? style.active : ''}
                >
                  {it.name}
                </span>
              ))
            }
          </div>
          <div className={style.tRight}>
            {
              lists.map(it => (
                <span
                  onClick={() => setType(it.key)}
                  key={it.key}
                  className={it.key === type ? style.active : ''}
                >
                  {it.name}
                </span>
              ))
            }
          </div>
        </div>
        <div className={style.list}>
          <div className={style.hl}>
            {
              head[type].map(it => (
                <span key={it.key}>{it.title}</span>
              ))
            }
          </div>
        </div>
        <div className={style.contPro}>
          <i className="iconfont iconshuomingwenzi" />
          <span>有效控制超标费用，一年至少可节省10%的无效支出！</span>
        </div>
      </div>
    </Spin>
  );
};

export default RightChart;
