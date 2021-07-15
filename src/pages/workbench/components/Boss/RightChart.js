/* eslint-disable react/no-did-update-set-state */
import React from 'react';
// import PropTypes from 'prop-types';
import { Divider, Spin } from 'antd';
import warn from '../../../../assets/img/warn.png';
import styles from './index.scss';
import TempTable from './TempTable';

const list = [{
  name: '同比',
  icon: 'iconshangsheng',
  key: 'yearOnYear',
  type: 'yearOnYearSymbolType'
}, {
  name: '环比',
  icon: 'iconxiajiang',
  key: 'annulus',
  type: 'annulusSymbolType'
}];
const RightChart = ({ data, loading, submitReportDetail, reportChange, submitTime, reportPage, reportTotal, loanSumVo, onLink }) => {
  return (
    <Spin spinning={loading}>
      <div className={styles.lefts}>
        <div className={styles.head}>
          <div className={styles.headL}>
            <i className="iconfont iconzongzhichu fs-24" style={{ color: '#00C795' }} />
          </div>
          <div>
            <p className="fs-16 c-black-85 fw-500" style={{ marginBottom: '2px' }}>企业总支出</p>
            <p className="fs-12 c-black-45">总支出包含审批通过，已确定会支出的数据</p>
          </div>
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => onLink(0)}>
          <p className="fs-36 fw-500 c-black-85 li-36 numF">¥ {data.totalCostSum ? data.totalCostSum/100 : 0}</p>
          <div className={styles.pro}>
            {
              list.map(it => (
                <div key={it.key} className="m-r-24">
                  <span className="c-black-65 fs-12">{it.name}</span>
                  {
                    data[it.type] !== null &&
                    <i className={`iconfont ${data[it.type] === 1 ? 'iconxiajiang' : 'iconshangsheng'}`} />
                  }
                  <span className="c-black-85 fs-12">{data[it.key] || 0}{data[it.type] !== null && '%'}</span>
                </div>
              ))
            }

          </div>
        </div>
        <Divider type="horizontal" style={{margin: '20px 0 0 0'}} />
        <div className={styles.centers}>
          <div className={styles.cPrice} onClick={() => onLink(0, 2)}>
            <p className="fs-20 fw-500 c-black-85 numF">¥{data.needPayCostSum ? data.needPayCostSum/100 : 0}</p>
            <p className="fs-14 c-black-45">待付金额</p>
          </div>
          <Divider type="vertical" style={{ margin: 0, height: '48px' }} />
          <div className={styles.cPrice} onClick={() => onLink(0, 3)}>
            <p className="fs-20 fw-500 c-black-85 numF">¥{data.paidCostSum ? data.paidCostSum/100 : 0}</p>
            <p className="fs-14 c-black-45">已付金额</p>
          </div>
        </div>
        <TempTable
          loanList={submitReportDetail}
          reportChange={reportChange}
          reportType={3}
          submitTime={submitTime}
          page={reportPage}
          total={reportTotal}
          loanSumVo={loanSumVo}
        >
          <div className={styles.footer}>
            <div className={styles.footL}>
              <div className={styles.footLI}>
                <img alt="警告" src={warn} />
              </div>
              <span>借款待还金额</span>
            </div>
            <div>
              <span className="fs-14 numF" style={{ color: '#FF2F00' }}>¥ {data.repaymentSum ? data.repaymentSum/100 : 0}</span>
              <i className="iconfont iconenter c-black-45" />
            </div>
          </div>
        </TempTable>
      </div>
    </Spin>
  );
};

export default RightChart;
