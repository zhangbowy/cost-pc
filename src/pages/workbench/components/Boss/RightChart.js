/* eslint-disable react/no-did-update-set-state */
import React from 'react';
// import PropTypes from 'prop-types';
import { Divider } from 'antd';
import styles from './index.scss';

const list = [{
  name: '同比',
  icon: 'iconshangsheng',
  key: 'up',
}, {
  name: '环比',
  icon: 'iconxiajiang',
  key: 'up',
}];
const RightChart = () => {
  return (
    <div className={styles.lefts}>
      <div className={styles.head}>
        <div className={styles.headL}>
          <i className="iconfont iconjifenquanicon" style={{ color: '#00C795' }} />
        </div>
        <div>
          <p className="fs-16 c-black-85 fw-500">企业总支出</p>
          <p className="fs-12 c-black-45">总支出包含审批通过，已确定会支出的数据</p>
        </div>
      </div>
      <div className={styles.price}>
        <p className="fs-36 fw-500 c-black-85 li-36">¥ 1,026,560.40</p>
        <div className={styles.pro}>
          {
            list.map(it => (
              <div key={it.key} className="m-r-24">
                <span className="c-black-65 fs-12">{it.name}</span>
                <i className={`iconfont ${it.icon}`} />
                <span className="c-black-85 fs-12">12%</span>
              </div>
            ))
          }

        </div>
      </div>
      <Divider type="horizontal" style={{margin: '20px 0 0 0'}} />
      <div className={styles.centers}>
        <div className={styles.cPrice}>
          <p className="fs-20 fw-500 c-black-85">¥5,000.00</p>
          <p className="fs-14 c-black-45">待付金额</p>
        </div>
        <Divider type="vertical" style={{ margin: 0, height: '48px' }} />
        <div className={styles.cPrice}>
          <p className="fs-20 fw-500 c-black-85">¥5,000.00</p>
          <p className="fs-14 c-black-45">待付金额</p>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footL}>
          <div className={styles.footLI}>
            <i className="iconfont" />
          </div>
          <span>借款待还金额</span>
        </div>
        <div>
          <span className="fs-14" style={{ color: '#FF2F00' }}>¥ 12,423</span>
          <i className="iconfont iconenter c-black-45" />
        </div>
      </div>
    </div>
  );
};

export default RightChart;
