import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import styles from './index.scss';
import { defaultColor } from '../../../utils/constants';

function Line({ data, series, changeType, changeMoney }) {
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
          <span class=${styles.tooltipCont}>${item.seriesName}：${item.componentSubType === 'bar' ? (`${item.value}${changeMoney > 101 ? '万元' : '元'}`) : (`${item.value}%`)}</span>
        </div>`;
        });
        return `<div class=${styles.tooltip}>
            <div class=${styles.tooltipTit}>${params[0].name}</div>
            ${lis}
          </div>`;
      }
    },
    title:{
      // show,// show 可以在上面顶一个一个 let show = null;
      textStyle: {
        color:'rgba(0,0,0,0.45)',
        fontSize: 14,
        fontWeight:100
      },
      text: `${changeType ? '' : '暂无去年同期数据'}`,// 这个你可以定义一个变量，也可以直接写死'暂无数据'
      left: 'center',
      top: 'center'
    },
    legend: {
        data: series,
        textStyle: {
          color: 'rgba(0,0,0,0.65)'
        },
        top: -1,
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
              color:'#E9E9E9'     // X轴的颜色
          },
        },
        axisLabel:{
          color:'rgba(0,0,0,0.65)',
          interval:0,
          rotate:25
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: `金额（${changeMoney > 101 ? '万元' : '元'}）`,
        // axisLabel: {
        //     formatter: '{value}',
        //     color:'rgba(0,0,0,0.65)'
        // },
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
          color:'rgba(0,0,0,0.65)',
          margin: 2,
          formatter: (value) => {
            let values = value;
            if (changeMoney < 101) {
              if (values >= 10000 && values < 10000000) {
                values = `${value / 10000  }万`;
              } else if (values >= 10000000) {
                values = `${values / 10000000  }千万`;
              }
            } else if (values > 1000) {
              values = `${values / 1000  }千万`;
            }
            return values;
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
        // min: -100,
        // max: 100,
        // interval: 25,
        axisLabel: {
            formatter: '{value} %',
            color:'rgba(0,0,0,0.65)'
        },
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
    ],
    color: defaultColor,
    grid:{
      left:'5%',
      right:'5%',
      bottom:'8%',
      containLabel: true
    }
  };
  return (
    <div>
      <ReactEcharts
        style={{height: '440px', width: '100%'}}
        className='echarts-for-echarts'
        notMerge
        lazyUpdate
        option={option}
      />
    </div>
  );
}

export default Line;
