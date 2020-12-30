import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import noImg from '../../../assets/img/noData.png';
import styles from './index.scss';
import { defaultColor } from '../../../utils/constants';

function Pie({ data, changeMoney }) {
  console.log('Line -> data', data);
  const option = {
    title: {
      text: '默认展示费用不为零的top10',
      textStyle: {
        color:'rgba(0,0,0,0.85)',
        fontSize: 16,
        fontWeight:500,
        fontFamily: 'PingFang SC'
      },
      left: 'center',
      top: 10
    },
  tooltip: {
      trigger: 'item',
      backgroundColor:'#fff',
      padding: 0,
      formatter: (params) => {
        console.log(params);
        return `<div class=${styles.tooltip}>
            <div class=${styles.tooltipTit}>${params.seriesName}</div>
            <div style='line-height: 20px;'>
              <span class=${styles.tooltipBall} style='background:${params.color}' ></span>
              <span class=${styles.tooltipCont}>${params.name}：${params.value}${changeMoney > 101 ? '万元' : '元'}(${params.percent}%)</span>
            </div>
          </div>`;
      }
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
          center: ['50%', '55%'],
          data: data.map(it => {
            return {
              value: it.submitSum/changeMoney,
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
    color: defaultColor,
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
