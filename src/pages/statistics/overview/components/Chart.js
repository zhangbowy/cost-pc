import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '@/utils/constants';
import style from './leftPie.scss';

// const tabList = [{
//   key: '0',
//   value: '费用支出'
// }, {
//   key: '1',
//   value: '成本支出'
// }];
function Chart({ data, total, fileName }) {
  const option = {
    title: {
      zlevel: 0,
      text: [
        '{name|总支出}',
        `{value|￥${  total/100  }}`,
      ].join('\n'),
      rich: {
        value: {
          color: 'rgba(0,0,0,0.85)',
          fontSize: 18,
          lineHeight: 32,
        },
        name: {
          color: 'rgba(0,0,0,0.45)',
          lineHeight: 22,
          fontSize: 14
        },
      },
      top: '15%',
      left: '49%',
      textAlign: 'center',
      textStyle: {
        rich: {
          value: {
            color: 'rgba(0,0,0,0.85)',
            fontSize: 24,
            lineHeight: 32,
          },
          name: {
            color: 'rgba(0,0,0,0.45)',
            lineHeight: 22,
            fontSize: 14
          },
        },
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor:'#fff',
      padding: 0,
      formatter: (params) => {
        console.log(params);
        return `<div class=${style.tooltip}>
            <div class=${style.tooltipTit}>${params.seriesName}</div>
            <div style='line-height: 20px;'>
              <span class=${style.tooltipBall} style='background:${params.color}' ></span>
              <span class=${style.tooltipCont}>${params.name}：${params.value}元(${params.percent}%)</span>
            </div>
          </div>`;
      }
    },
    legend: {
      top: 210,
      orient: 'vertical',
      icon: 'circle',
      type: 'scroll',
      formatter: name => {
        let obj = {};
        for (let i = 0, l = data.length; i < l; i++) {
          if (data[i][fileName.name] === name) {
            obj = data[i];
          }
        }
        const arr = [
          `{a|${ name.length > 9 ? `${name.slice(0,8)  }...` : name }}`,
          `{b|｜${  obj.proportion}}`,
          `{c|¥${obj[fileName.price]/100}}`
        ];
        return arr.join('');
      },
      itemWidth: 4,
      itemHeight: 4,
      // backgroundColor: '#fff',
      textStyle:{
        rich:{
          a:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.65)',
            width: 120,
            lineHeight: 22
          },
          b:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.45)',
            width: 68
          },
          c:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.65)'
          },
        }
      }
    },
    color: defaultColor,
    series: [
      {
        name: '总支出',
        type: 'pie',
        radius: ['43%', '55%'],
        center: ['50%', '20%'],
        avoidLabelOverlap: true,
        minAngle: 10,
        stillShowZeroSum: false,
        zlevel: 1,
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: data.length === 1 ? 0 : 5
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: data.map(it => {
          return {
            value: it[fileName.price]/100,
            name: it[fileName.name]
          };
        })
      }
    ]
  };
  return (
    <div className={style.chart}>
      {
        data.length ?
          <ReactEcharts
            style={{height: '510px', width: '328'}}
            className='echarts-for-echarts'
            notMerge
            lazyUpdate
            option={option}
          />
          :
          <div className={style.noData}>
            <div className={style.noDataChild}>
              <p className="fs-14 c-black-45">暂无数据</p>
              <p className="fs-24 c-black-85">¥0.00</p>
            </div>
          </div>
      }
    </div>
  );
}

export default Chart;
