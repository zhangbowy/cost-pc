import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import noImg from '../../../assets/img/noData.png';
// import styles from './index.scss';

function Pie({ data }) {
  console.log('Line -> data', data);
  const option = {
  tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
      orient: 'vertical',
      left: 'right',
      data: data.map(it => it.categoryName),
  },
  series: [
      {
          name: '费用类别',
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          data: data.map(it => {
            return {
              value: it.submitSum/100,
              name: it.categoryName,
            };
          }),
          emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
      }
    ],
  };
  return (
    <div>
      {
        data.length ?
          <ReactEcharts
            style={{height: '400px', width: '100%'}}
            className='echarts-for-echarts'
            notMerge
            lazyUpdate
            option={option}
          />
          :
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '400px' }}>
            <img src={noImg} alt="暂无数据" style={{ width: '300px', height: 'auto' }} />
            <span>暂无数据</span>
          </div>
      }
    </div>
  );
}

export default Pie;
