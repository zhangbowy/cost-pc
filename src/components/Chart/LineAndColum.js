/* eslint-disable radix */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '../../utils/constants';
// import { defaultColor } from '../../utils/constants';

const LineAndColumn = () => {
  const data1 = [
    2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
  ];
  const data2 = [
    2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
  ];
  const data3 = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
  const data4 = [
    2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
  ];
  const splitNumber=5;

  const min=Math.min.call(null,...data1, ...data2, ...data3, ...data4);

  // 取splitNumber的倍数
  let max= Math.ceil(Math.max.call(null,...data1, ...data2, ...data3, ...data4));

  max = parseInt(max/splitNumber) * splitNumber + (max%splitNumber === 0 ? 0 : splitNumber );

  const interval = parseInt(max / splitNumber);
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    legend: {
      data: ['Evaporation', 'Precipitation', 'Temperature'],
      textStyle: {
        color: 'rgba(0,0,0,0.65)'
      },
      bottom: -1,
    },
    color: defaultColor,
    grid: {
      left: 4,
      right: 4,
      top: 40,
      bottom: 20,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'line',
          color: '#d8d8d8'
        },
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        axisLine:{
          lineStyle:{
              color:'#E9E9E9'     // X轴的颜色
          },
        },
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          interval:0,
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        // axisTick: {           // 去掉坐标轴刻线
        //   show: false
        // },
        axisLine:{
          lineStyle:{
              color:'#fff'     // X轴的颜色
          },
        },
        splitNumber,
        max,
        min,
        interval,
        boundaryGap: false,
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          margin: 2,
        splitLine: {
            lineStyle:{
              color:'#E9E9E9'     // X轴的颜色
            },
          }
        }
      },
      {
        type: 'value',
        name: 'Temperature',
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        axisLine:{
          lineStyle:{
              color:'#fff'     // X轴的颜色
          },
        },
        splitNumber: 5,
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          margin: 2,
        splitLine: {
            lineStyle:{
              color:'#E9E9E9'     // X轴的颜色
            },
          }
        }
      }
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        stack: true,
        data: data1,
        barMaxWidth : 40,
      },
      {
        name: 'Precipitation',
        type: 'bar',
        stack: true,
        data: data2,
        barMaxWidth : 40,
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        data: data3
      },
      {
        name: 'eva',
        type: 'line',
        symbol: 'none',
        data: data4
      },
    ]
  };
  return (
    <ReactEcharts
      option={options}
      style={{height: '412px', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
};

export default LineAndColumn;
