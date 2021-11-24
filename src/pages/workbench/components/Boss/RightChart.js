/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Spin } from 'antd';
import cs from 'classnames';
import noData from '@/assets/img/noData.png';
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
  arr:  ['standardName', 'exceedContent', 'annulus'],
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
    title: '环比（%）',
    key: 2,
  }],
  11: [{
    title: '费用标准',
    key: 0,
  }, {
    title: '超标金额（元）',
    key: 1,
  }, {
    title: '环比（%）',
    key: 2,
  }],
  10: [{
    title: '费用标准',
    key: 0,
  }, {
    title: '超标次数（次）',
    key: 1,
  }, {
    title: '环比（%）',
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
          </div>
          <div style={{ height: '230px' }}>
            {
              submitReport[list[type].item] && submitReport[list[type].item]
              .filter(it => {
                if (type === 0) {
                  return true;
                }
                return count ? [2,3,4,5].includes(it.standardType) : [0,1].includes(it.standardType);
              }).length > 0 ?
              submitReport[list[type].item] && submitReport[list[type].item]
              .filter(it => {
                if (type === 0) {
                  return true;
                }
                return count ? [2,3,4,5].includes(it.standardType) : [0,1].includes(it.standardType);
              })
              .map((it, index) => (
                <div className={style.ctl}>
                  {
                    list[type].arr.map((item, i) => {
                      let str = it[item] || '-';
                      if (i === 1) {
                        if (type === 0 || (type === 1 && [2,3,4,5].includes(it.standardType))) {
                          str = it[item]/100;
                        } else {
                          str = it[item] || 0;
                        }
                      }
                      if (i === 2) {
                        str = (
                          <>
                            {
                              it.annulusSymbolType !== null &&
                              <i className={`iconfont ${it.annulusSymbolType === 1 ? 'iconxiajiang' : 'iconshangsheng'}`} />
                            }
                            <span className="c-black-85 fw-500">{it.annulus || 0}{it.annulus !== null && ''}</span>
                          </>
                        );
                      }
                      return (
                        <span key={item} className={style.tds}>
                          {
                            i === 0 &&
                            <span className={index < 3 ? cs(style.num, style.actives) : style.num}>{(index+1)}</span>
                          }
                          {str}
                        </span>
                      );
                    })
                  }
                </div>
              ))
              :
              <div className={style.noData}>
                <img src={noData} alt="暂无数据" />
                <span>暂无数据</span>
              </div>
            }
          </div>
        </div>
        <div className={style.contPro}>
          <i className="iconfont icona-jinggao3x" />
          <span>有效控制超标费用，一年至少可节省10%的无效支出！</span>
        </div>
      </div>
    </Spin>
  );
};

export default RightChart;
