/* eslint-disable radix */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '../../utils/constants';
import styles from './index.scss';
import NoData from '../NoData';
import { compare } from '../../utils/common';
// import { defaultColor } from '../../utils/constants';

const LineAndColumn = ({ lineCharts, barCharts }) => {
  const { sum, value } = barCharts;
  const value1 = lineCharts.value || [];
  const xAxisData = barCharts.xList || [];
  const splitNumber=5;

  const min1=Math.min.call(null, ...value);
  const min2=Math.min.call(null, ...value1);

  // 取splitNumber的倍数
  const max1= Math.ceil(sum);
  const max2= Math.ceil((Math.max.call(null,...value1)/9.5)*10);

  const barOption = [];
  barCharts.keys.forEach((el) => {
    barOption.push({
      name: el,
      type: 'bar',
      stack: 'total',
      data: barCharts.dataList.map(it => it[el]),
      barMaxWidth : 40,
      // yAxisIndex: 0,
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
  const interval2 = Math.ceil((max2-min2) / splitNumber);
  const barcharts = barCharts.keys.map(it => {
    return {
      name: it,
      icon: 'circle',
    };
  });
  const lineChartsKeys = lineCharts.keys.map(it => {
    return {
      name: it,
      icon: 'path://M512 298.666667a213.418667 213.418667 0 0 1 209.066667 170.666666H981.333333a42.666667 42.666667 0 0 1 0 85.333334l-260.266666 0.042666a213.418667 213.418667 0 0 1-199.424 170.410667L512 725.333333a213.418667 213.418667 0 0 1-209.066667-170.624L42.666667 554.666667a42.666667 42.666667 0 0 1 0-85.333334h260.266666a213.418667 213.418667 0 0 1 199.424-170.453333L512 298.666667z m0 85.333333a128 128 0 1 0 0 256 128 128 0 0 0 0-256z'
    };
  });
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
        const barQ = params.filter(it => it.seriesType === 'bar' && it.seriesName === '其他') || [];
        const lineQ = params.filter(it => it.seriesType === 'line' && it.seriesName === '其他') || [];
        const bars = params.filter(it => it.seriesType === 'bar' && it.seriesName !== '其他')
          .sort(compare('value', true)) || [];
        const lines = params.filter(it => it.seriesType === 'line' && it.seriesName !== '其他')
          .sort(compare('value', true)) || [];
        const resultList = [...bars, ...barQ, ...lines,...lineQ];
        const newResult = resultList.filter(it => it.value);
        newResult.forEach(item => {
          let strs = `<span class=${styles.tooltipBall} style='background:${item.color}' ></span>`;
          if (item.seriesType === 'line') {
            strs = `<span class=${styles.tooltipBill} style='background:${item.color}' ><i style='border: 1px solid ${item.color}'></i></span>`;
          }
          lis+=`<div style='line-height: 20px;'>
          ${strs}
          <span class=${styles.tooltipCont}>${item.seriesName}：¥${`${item.value || 0}`}</span>
        </div>`;
        });
        return `<div class=${styles.tooltip}>
            <div class=${styles.tooltipTit}>${params[0].name}</div>
            ${lis}
          </div>`;
      }
    },
    legend: {
      data: [...barcharts, ...lineChartsKeys],
      textStyle: {
        color: 'rgba(0,0,0,0.65)'
      },
      bottom: -1,
      itemHeight: 8,
    },
    color: defaultColor,
    grid: {
      left: 4,
      right: 4,
      top: '10%',
      bottom: '14%',
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
        name: '',
        axisLine:{
          lineStyle:{
              color:'#fff'     // X轴的颜色
          },
        },
        // boundaryGap: false,
        nameTextStyle: {
          color: 'rgba(0,0,0,0.65)',
          padding:[0,8,10,0],
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
        name: '',
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        nameTextStyle: {
          color: 'rgba(0,0,0,0.65)',
          padding:[0,0,10,8],
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
          <div style={{height: '420px', width: '100%', position: 'relative'}}>
            <span style={{position: 'absolute', left: '0px', top: 0}} className="fs-12 c-black-65">部门金额(元)</span>
            <span style={{position: 'absolute', right: '0px', top: 0}} className="fs-12 c-black-65">类别金额(元)</span>
            <ReactEcharts
              option={options}
              style={{height: '420px', width: '100%'}}
              notMerge
              lazyUpdate
            />
          </div>
          :
          <NoData />
      }
    </>
  );
};

export default LineAndColumn;
