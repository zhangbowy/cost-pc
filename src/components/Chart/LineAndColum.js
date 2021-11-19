/* eslint-disable radix */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '../../utils/constants';
import styles from './index.scss';
import NoData from '../NoData';
// import { defaultColor } from '../../utils/constants';

const LineAndColumn = ({ lineCharts, barCharts }) => {
  const { value } = barCharts;
  const value1 = lineCharts.value || [];
  const xAxisData = barCharts.xList || [];
  const splitNumber=5;

  const min1=Math.min.call(null, ...value);
  console.log('LineAndColumn -> min1', min1);
  const min2=Math.min.call(null, ...value1);
  console.log('LineAndColumn -> min2', min2);

  // 取splitNumber的倍数
  const max1= Math.ceil((Math.max.call(null,...value)/9.5)*10);
  console.log('LineAndColumn -> max1', max1);
  const max2= Math.ceil((Math.max.call(null,...value1)/9.5)*10);
  console.log('LineAndColumn -> max2', max2);

  const barOption = [];
  barCharts.keys.forEach((el) => {
    barOption.push({
      name: el,
      type: 'bar',
      stack: true,
      data: barCharts.dataList.map(it => it[el]),
      barMaxWidth : 40,
    });
  });
  const lineOptions = [];
  lineCharts.keys.forEach(el => {
    lineOptions.push({
      name: el,
      type: 'line',
      yAxisIndex: 1,
      symbol: 'none',
      data: lineCharts.dataList.map(it => it[el]),
    });
  });
  const interval1 = Math.ceil((max1-min1) / splitNumber);
  console.log('LineAndColumn -> interval1', interval1);
  const interval2 = Math.ceil((max2-min2) / splitNumber);
  console.log('LineAndColumn -> interval2', interval2);
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      backgroundColor:'#fff',
      padding: 0,
      formatter: (params) => {
        let lis = '';
        params.forEach(item => {
          lis+=`<div style='line-height: 20px;'>
          <span class=${styles.tooltipBall} style='background:${item.color}' ></span>
          <span class=${styles.tooltipCont}>${item.seriesName}：${`${item.value || 0}元`}</span>
        </div>`;
        });
        return `<div class=${styles.tooltip}>
            <div class=${styles.tooltipTit}>${params[0].name}</div>
            ${lis}
          </div>`;
      }
    },
    legend: {
      data: [...barCharts.keys, ...lineCharts.keys],
      textStyle: {
        color: 'rgba(0,0,0,0.65)'
      },
      bottom: -1,
    },
    color: defaultColor,
    grid: {
      left: 4,
      right: 4,
      top: '10%',
      bottom: 40,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: xAxisData || [],
      axisPointer: {
        type: 'line',
        color: '#d8d8d8'
      },
      axisTick: {           // 去掉坐标轴刻线
        show: false
      },
      axisLine:{
        show: true,
        onZero: false,
        lineStyle:{
            color:'#E9E9E9'     // X轴的颜色
        },
      },
      axisLabel:{
        color:'rgba(0,0,0,0.65)',
      },
    }],
    yAxis: [
      {
        type: 'value',
        name: '部门',
        axisLine:{
          lineStyle:{
              color:'#fff'     // X轴的颜色
          },
        },
        boundaryGap: false,
        nameTextStyle: {
          color: 'rgba(0,0,0,0.65)',
          padding:[0,24,10,0],
        },
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          margin: 2,
        },
        splitNumber,
        max: max1,
        min: min1,
        interval: interval1,
        splitLine: {
          show: true,
          lineStyle:{
            color: ['#d8d8d8'],
            width: 1,
            type: 'dashed'
          }
        },
      },
      {
        type: 'value',
        name: '支出',
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        nameTextStyle: {
          color: 'rgba(0,0,0,0.65)',
          padding:[0,0,10,24],
          fontSize: 12,
        },
        splitNumber,
        max: max2,
        min: min2,
        interval: interval2,
        splitLine: {
          show: true,
          lineStyle:{
            color: ['#d8d8d8'],
            width: 1,
            type: 'dashed'
          }
        },
        axisLine:{
          onZero: false,
          lineStyle:{
              color:'#fff'     // X轴的颜色
          },
        },
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          margin: 2,
        }
      }
    ],
    series: [
      ...barOption,
      ...lineOptions,
    ]
  };
  return (
    <>
      {
        barOption.length > 0 || lineOptions.length > 0 ?
          <ReactEcharts
            option={options}
            style={{height: '420px', width: '100%'}}
            notMerge
            lazyUpdate
          />
          :
          <NoData />
      }
    </>
  );
};

export default LineAndColumn;
