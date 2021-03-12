import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
// import { defaultColor } from '@/utils/constants';
import styles from './leftPie.scss';

function RightLine({ data }) {
  let xline = [];
  if (data.fyCategory && data.fyCategory.length) {
    xline = data.fyCategory;
  } else if (data.cbCategory && data.cbCategory.length) {
    xline = data.cbCategory;
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor:'#fff',
      padding: 0,
      formatter: (params) => {
        let lis = '';
        params.forEach(item => {
          lis+=`<div style='line-height: 20px;'>
          <span class=${styles.tooltipBall} style='background:${item.color}' ></span>
          <span class=${styles.tooltipCont}>${item.seriesName}：${item.value}元</span>
        </div>`;
        });
        return `<div class=${styles.tooltip}>
            <div class=${styles.tooltipTit}>${params[0].name}</div>
            ${lis}
          </div>`;
      }
    },
    color: ['rgba(3,122,254,1)','rgba(0,199,149,1)'],
    grid: {
      left: '32px',
      right: '32px',
      containLabel: true
    },
    legend: {
      icon: 'circle',
      data: ['费用支出','成本支出'],
      bottom: 20,
      textStyle: {
        fontSize: 12,
        color: '#666'
      },
      itemWidth: 8,
      itemHeight: 8,
    },
    xAxis: {
      type: 'category',
      data: xline && xline.map(it => it.x),
      axisTick: {           // 去掉坐标轴刻线
        show: false
      },
      axisLine:{
        lineStyle:{
            color:'#D9D9D9'     // X轴的颜色
        },
      },
      axisLabel: {
        color:'rgba(0,0,0,0.65)',
        formatter: (value) => {
            // const dateX = new Date(value);
            // return idx === 0 ? value : [dateX.getMonth() + 1, dateX.getDate()].join('-');
            return value;
        }
      },
    },
    yAxis: {
      type: 'value',
      axisTick: {           // 去掉坐标轴刻线
        show: false
      },
      axisLine:{
        lineStyle:{
            color:'#fff'     // X轴的颜色
        },
      },
      axisPointer: {
          label: {
          }
      },
      axisLabel:{
        color:'rgba(0,0,0,0.65)'
      },
      splitNumber: 3,
      splitLine: {
        lineStyle:{
          color:'#E9E9E9'     // X轴的颜色
        },
      }
    },
    series: [{
      name: '费用支出',
      type: 'line',
      data: data.fyCategory && data.fyCategory.map(it => it.y/100),
      hoverAnimation: false,
      symbolSize: 6,
      showSymbol: data.fyCategory && data.fyCategory.length === 1
    }, {
    name: '成本支出',
    type: 'line',
    data: data.cbCategory && data.cbCategory.map(it => it.y/100),
    hoverAnimation: false,
    symbolSize: 6,
    showSymbol: data.cbCategory && data.cbCategory.length === 1
  }]
  };
  return (
    <div>
      <ReactEcharts
        style={{height: '384px', width: '100%'}}
        className='echarts-for-echarts'
        notMerge
        lazyUpdate
        option={option}
      />
    </div>
  );
}

export default RightLine;
