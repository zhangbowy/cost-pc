/* eslint-disable react/no-did-update-set-state */
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Spin } from 'antd';
import style from './leftPie.scss';

const list = [{
  name: '部门预警',
  key: 0,
  item: 'costWarningForDeptVos',
  arr:  ['deptName', 'exceedAmount', 'annulus'],
}, {
  name: '标准预警',
  key: 1,
  item: 'costWarningForStandardVos',
  arr:  ['standardName', 'exceedAmount', 'annulus'],
}];
const lists = [{
  name: '数量',
  key: 0,
}, {
  name: '金额',
  key: 1,
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
  }],
  11: [{
    title: '费用标准',
    key: 0,
  }, {
    title: '超标金额（元）',
    key: 1,
  }, {
    title: '环比',
    key: 2,
  }],
  10: [{
    title: '费用标准',
    key: 0,
  }, {
    title: '超标次数（次）',
    key: 1,
  }, {
    title: '环比',
    key: 2,
  }],
};
const RightChart = ({ loading, submitReport }) => {
  const [type, setType] = useState(0);
  const [count, setCount] = useState(0);
  return (
    <Spin spinning={loading}>
      <div className={style.right}>
        <div className={style.title}>
          <div className={style.tLeft}>
            {
              list.map(it => (
                <span
                  onClick={() => { setType(it.key); setCount(0); }}
                  key={it.key}
                  className={it.key === type ? style.active : ''}
                >
                  {it.name}
                </span>
              ))
            }
          </div>
          {
            !!type &&
            <div className={style.tRight}>
              {
                lists.map(it => (
                  <span
                    onClick={() => setCount(it.key)}
                    key={it.key}
                    className={it.key === count ? style.active : ''}
                  >
                    {it.name}
                  </span>
                ))
              }
            </div>
          }
        </div>
        <div className={style.list}>
          <div className={style.hl}>
            {
              head[type ? `${type}${count}` : type].map(it => (
                <span key={it.key}>{it.title}</span>
              ))
            }
            {
              submitReport[list[type].item] && submitReport[list[type].item].map(it => (
                <div>
                  {
                    list[type].arr.map(item => (
                      <span key={item} >
                        {it[item] || '-'}
                      </span>
                    ))
                  }
                </div>
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
