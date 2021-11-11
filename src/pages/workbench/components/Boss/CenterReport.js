/*
*  支出简报
*/
import React from 'react';
import { Spin } from 'antd';
import one from '../../../../assets/img/first/0.png';
import two from '../../../../assets/img/first/1.png';
import three from '../../../../assets/img/first/2.png';
import four from '../../../../assets/img/first/3.png';
import style from './centerReport.scss';
import TinyAreaChart from '../../../../components/Chart/TinyAreaChart';
import TempTable from './TempTable';
import TimeComp from '../TimeComp';

const listP = [{
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
const list = [{
  key: 'needPayCostSum',
  img: one,
  name: '待付金额',
  color: '#FEF5F0',
  status: 2,
}, {
  key: 'paidCostSum',
  img: two,
  name: '已付金额',
  color: '#E8FAF7',
  status: 3,
}, {
  key: 2,
  img: three,
  name: '审核中金额',
  color: '#FFF9F9',
  status: 1,
}, {
  key: 'repaymentSum',
  img: four,
  name: '借款待还金额',
  color: '#F1F7FF'
}];
const CenterReport = ({ data, loading, submitReportDetail, reportChange, onChangeState, submitTime, reportPage, reportTotal, loanSumVo, onLink }) => {
  return (
    <div className={style.centerReport}>
      <div className={style.title}>
        <p className="c-black-85 fw-500 fs-16">支出简报</p>
        <TimeComp
          onChangeData={onChangeState}
          submitTime={submitTime}
          formType={1}
        />
      </div>
      <Spin spinning={loading}>
        <div className={style.content}>
          <div className={style.left}>
            <p className="c-black-65 m-b-8">企业总支出</p>
            <p className="c-black-85 fw-500 fs-38">¥{data.totalCostSum ? data.totalCostSum/100 : 0}</p>
            <div className={style.portion}>
              {
                listP.map(it => (
                  <p key={it.key}>
                    <span className="c-black-45">{it.name}</span>
                    {
                      data[it.type] !== null &&
                      <i className={`iconfont ${data[it.type] === 1 ? 'iconxiajiang' : 'iconshangsheng'}`} />
                    }
                    <span className="c-black-85 fw-500">{data[it.key] || 0}{data[it.type] !== null && '%'}</span>
                  </p>
                ))
              }
            </div>
            <div style={{width: '100%', margin: '0 -24px'}}>
              <TinyAreaChart
                options={{ }}
              />
            </div>
          </div>
          {
            list.map(it => {
              const Items = (
                <>
                  <img src={it.img} alt="展示图片" />
                  <p className="c-black-85 fw-500 fs-24 m-l-24">¥{data[it.key] ? data[it.key]/100 : 0}</p>
                  <p className="c-black-65 m-l-24">{it.name}</p>
                </>
              );
              if (it.key === 'repaymentSum') {
                return (
                  <TempTable
                    loanList={submitReportDetail}
                    reportChange={reportChange}
                    reportType={3}
                    submitTime={submitTime}
                    page={reportPage}
                    total={reportTotal}
                    loanSumVo={loanSumVo}
                    className={style.list}
                    key={it.key}
                  >
                    {Items}
                  </TempTable>
                );
              }
              return (
                <div
                  className={style.list}
                  key={it.key}
                  style={{background: it.color}}
                  onClick={() => onLink(0, it.status)}
                >
                  {Items}
                </div>
              );
            })
          }
        </div>
      </Spin>
    </div>
  );
};

export default CenterReport;
