import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { defaultColor } from '@/utils/constants';
import style from './leftPie.scss';
import NoData from '../../../../components/NoData';

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
      left: '48%',
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
      show: false,
    },
    color: defaultColor,
    series: [
      {
        name: tabList[current].value,
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['50%', '50%'],
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
          <div className={style.pieCharts}>
            <ReactEcharts
              style={{height: '323px', width: '40%'}}
              className='echarts-for-echarts'
              notMerge
              lazyUpdate
              option={option}
              onEvents={onclick}
            />
            <div className={style.legend}>
              {
                data.map((it, index) => (
                  <div className={style.list} key={it.dimensionId} onClick={() => clickEchartsLegend({...it, name: it.dimensionName})}>
                    <div className={style.titles}>
                      <i style={{background: defaultColor[index]}} />
                      <span>{it.dimensionName}</span>
                    </div>
                    <div className={style.money}>
                      <span className="c-black-65">¥ {it.costSum/100}</span>
                      <span className={style.line}>|</span>
                      <span className="c-black-45" style={{width: '72px', display: 'inline-block'}}>
                        {
                          it.annulusSymbolType !== null &&
                          <i className={`iconfont ${it.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng'}`} />
                        }
                        <span className="fw-500" style={{width: '52px',display: 'inline-block'}}>{`${it.annulusSymbolType !== null ? `${it.annulus}%` : '-'}`}</span>
                      </span>
                    </div>
                  </div>
                ))
              }

            </div>
          </div>
          :
          <NoData />
      }
    </div>
  );
}

export default PieChart;
