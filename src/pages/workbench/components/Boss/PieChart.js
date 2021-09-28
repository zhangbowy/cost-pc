import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '@/utils/constants';
import style from './leftPie.scss';

const tabList = [{
  key: 'appDeptStatisticReturnVo',
  value: '部门支出'
}, {
  key: 'appCategoryStatisticReturnVo',
  value: '类别支出'
}, {
  key: 'appProjectStatisticReturnVo',
  value: '项目支出'
}];
function PieChart({ data, total, current, title, onLink }) {
  const option = {
    title: {
      zlevel: 0,
      text: [
        `{name|${title}支出合计}`,
        `{value|￥${  total/100  }}`,
      ].join('\n'),
      rich: {
        value: {
          color: 'rgba(0,0,0,0.85)',
          fontSize: 18,
          lineHeight: 32,
          fontFamily: 'Helvetica, sans-serif, Arial'
        },
        name: {
          color: 'rgba(0,0,0,0.45)',
          lineHeight: 22,
          fontSize: 14
        },
      },
      top: 'center',
      left: '22%',
      textAlign: 'center',
      textStyle: {
        rich: {
          value: {
            color: 'rgba(0,0,0,0.85)',
            fontSize: 24,
            lineHeight: 32,
            fontFamily: 'Helvetica, sans-serif, Arial'
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
      left: '42%',
      top: 'center',
      bottom: '16',
      orient: 'vertical',
      icon: 'circle',
      formatter: name => {
        let obj = {};
        for (let i = 0, l = data.length; i < l; i++) {
          if (data[i].dimensionName === name) {
            obj = data[i];
          }
        }
        const arr = [
          `{a|${ name.length > 9 ? `${name.slice(0,8)  }...` : name }}`,
          `{b|｜${  obj.proportionStr}}`,
          `{c|¥${obj.costSum/100}}`
        ];
        return arr.join('');
      },
      itemWidth: 6,
      itemHeight: 6,
      textStyle:{
        rich:{
          a:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.65)',
            width: 104,
            lineHeight: 22
          },
          b:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.45)',
            width: 68,
          },
          c:{
            fontSize:12,
            align:'left',
            color: 'rgba(0,0,0,0.65)',
            fontFamily: 'Helvetica Neue'
          },
        }
      }
    },
    color: defaultColor,
    series: [
      {
        name: tabList[current].value,
        type: 'pie',
        radius: ['43%', '55%'],
        center: ['23%', '50%'],
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
            value: it.costSum/100,
            name: it.dimensionName
          };
        })
      }
    ]
  };
  const clickEchartsPie = (e) => {
    console.log('点击了扇形图啊', e);
    const index = e.dataIndex;
    onLink(data[index]);
    console.log('点击了扇形图啊', data);
  };
  const clickEchartsLegend = (params) => {
    const { name } = params;
    onLink(data.filter(it => it.dimensionName === name)[0]);
    console.log('点击了扇形图啊', data);
  };
  const onclick = {
    'click': clickEchartsPie.bind(this),
    'legendselectchanged': clickEchartsLegend.bind(this)
  };
  return (
    <div className={style.chart}>
      {
        data.length ?
          <ReactEcharts
            style={{height: '323px', width: '100%'}}
            className='echarts-for-echarts'
            notMerge
            lazyUpdate
            option={option}
            onEvents={onclick}
          />
          :
          <div className={style.noData}>
            <div className={style.noDataChild}>
              <p className="fs-14 c-black-45">暂无{tabList[current].value}</p>
              <p className="fs-24 c-black-85">¥0.00</p>
            </div>
          </div>
      }
    </div>
  );
}

export default PieChart;
