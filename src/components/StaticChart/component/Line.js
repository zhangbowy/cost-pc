import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.scss';

function Line({ data, series }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      // backgroundColor:'#fff',
      axisPointer: {
        type: 'cross',
        crossStyle: {
            color: '#999'
        }
      }
    },
    legend: {
        data: series
    },
    xAxis: [
      {
        type: 'category',
        data: data.map(it => it.name),
        axisPointer: {
            type: 'shadow'
        },
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        axisLine:{
          lineStyle:{
              color:'#D9D9D9'     // X轴的颜色
          },
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额（元）',
        min: 0,
        // max,
        // interval: Number((max/8).toFixed(0)),
        axisLabel: {
            formatter: '{value}',
            color:'rgba(0,0,0,0.65)'
        },
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        axisLine:{
          lineStyle:{
              color:'#E9E9E9'     // X轴的颜色
          },
        },
        axisPointer: {
            label: {
            }
        },
        splitNumber: 3,
        splitLine: {
          lineStyle:{
            color:'#E9E9E9'     // X轴的颜色
          },
        }
      },
      {
        type: 'value',
        name: '百分比',
        min: -100,
        max: 100,
        interval: 25,
        axisLabel: {
            formatter: '{value} %',
            color:'rgba(0,0,0,0.65)'
        },
        axisTick: {           // 去掉坐标轴刻线
          show: false
        },
        axisLine:{
          lineStyle:{
              color:'#E9E9E9'     // X轴的颜色
          },
        },
        axisPointer: {
            label: {
            }
        },
        splitNumber: 3,
        splitLine: {
          lineStyle:{
            color:'#E9E9E9'     // X轴的颜色
          },
        }
      }
    ],
    series: [
      {
        name: series[0],
        type: 'bar',
        data: data.map(it => it.submitSum)
      },
      {
        name: series[1],
        type: 'bar',
        data: data.map(it => it.submitSumAnnulus)
      },
      {
        name: series[2],
        type: 'line',
        yAxisIndex: 1,
        data: data.map(it => it.annulus)
      }
    ]
  };
  return (
    <div>
      <ReactEcharts
        style={{height: '400px', width: '100%'}}
        className='echarts-for-echarts'
        notMerge
        lazyUpdate
        option={option}
      />
    </div>
  );
}

export default Line;
