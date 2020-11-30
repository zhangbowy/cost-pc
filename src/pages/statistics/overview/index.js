import React, { Component } from 'react';
import { DatePicker, Radio  } from 'antd';
import moment from 'moment';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图图
import  'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { post } from '@/utils/request';
import getDateUtil from '@/utils/tool';
import YearPicker from '@/components/YearPicker';
import QuarterPicker from '@/components/QuarterPicker';
import { eventChange } from '@/utils/util';
import api from './services';
import styles from './index.scss';

const time =  getDateUtil(new Date().getTime()).split('-');
const startDate = `${time[0]}-${  time[1]  }-01 00:00:01`;
const { MonthPicker } = DatePicker;

const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};

class EchartsTest extends Component {

  state={
    overviewDate:[],
    colorArr : ['rgba(3,122,254,1)','rgba(0,199,149,1)'],
    startTime: new Date(startDate).getTime(),
    endTime: new Date().getTime(),
    type: 0,
    dateType: 0,
    defaultQuarter: this.getQuarter(new Date()),
    defaultMonth: `${time[0]}-${time[1]}`,
    defaultYear: time[0]
  }

    componentDidMount() {
      console.log('eventChange======',eventChange);
      console.log(5555);
      this.loadEchart();
      this.loadOverview();
      eventChange(() => {console.log(22222222,this);const { myChart } = this.state;if(myChart) myChart.resize();});
    }

    getQuarter(date,isValue){
      if(isValue){
        const start = `${date.split('~')[0]  }-01 00:00:01`;
        const end =  date.split('~')[1] + ((date.split('~')[1].split('-')[1]==='06'||date.split('~')[1].split('-')[1]==='09')?'-30 23:59:59':'-31 23:59:59');
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        this.setState({ startTime, endTime },()=>{
          this.loadEchart();
          this.loadOverview();
        });
      }else{
        const year = date.getFullYear();
        if(date <= 3){
          return `${year}-01~${year}-03`;
        }if(date <= 6){
          return `${year}-04~${year}-06`;
        }if(date <= 9){
          return `${year}-07~${year}-09`;
        }
          return `${year}-10~${year}-12`;
        
      }
    }

    setDateType(date){
      this.setState({dateType: date});
      if(date === 0){
        this.monthChage(this.state.defaultMonth);
      }else if(date===1){
        this.getQuarter(this.state.defaultQuarter,true);
      }else{
        this.yearChange(this.state.defaultYear);
      }
    }

    handleModeChange = e => {
      const type = Number(e.target.value);
      this.setState({ type },() => {
        this.loadEchart();
      });
    };

    yearChange(str){
      const start = `${str}-01-01 00:00:01`;
      const end = `${str}-12-31 23:59:59`;
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      this.setState({ startTime, endTime },() => {
        this.loadEchart();
        this.loadOverview();
      });
    }

    monthChage(str){
      const start = `${str}-01 00:00:01`;
      const end = `${str  }-${  getMaxDay(str.split('-')[0],str.split('-')[1]) } 23:59:59`;
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      this.setState({ startTime, endTime },() => {
        this.loadEchart();
        this.loadOverview();
      });
    }

    quarterChage(str){
      this.getQuarter(str,true);
    }

    loadEchart(){
      const { startTime, endTime, dateType, type } = this.state;
      post(api.overviewTrend,{dateType,startTime,endTime,type}).then(res => {
          // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'));
        const data = res.map(item => {
          const obj = {...item};
          obj.totleSum = (item.totleSum/100).toFixed(2);
          return obj;
        });
        const option = {
          tooltip: {
            trigger: 'axis',
            backgroundColor:'#fff',
            formatter: (params) => {
              return `<div class=${styles.tooltip}>
                  <div class=${styles.tooltipTit}>${params[0].name}</div>
                  <div style='line-height: 20px;'>
                    <span class=${styles.tooltipBall} style='background:${this.state.colorArr[this.state.type]}' ></span>
                    <span class=${styles.tooltipCont}>${this.state.type?'借款支出':'报销支出'}：￥${params[0].value}</span>
                  </div>
                </div>`;
            }
          },
          grid: {
              left: '32px',
              right: '32px',
              bottom: '3%',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              data: data.map((item) => {
                const date = item.date.split('-');
                  return date.length===3?`${date[1]}-${date[2]}`:item.date;
              }),
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
              type: 'line',
              data: data.map((item) => {
                  return item.totleSum;
              }),
              hoverAnimation: false,
              symbolSize: 6,
              itemStyle: {
                normal : {
                  lineStyle:{
                      color: this.state.colorArr[this.state.type]
                  },
                  color: this.state.colorArr[this.state.type]
                }
              },
              showSymbol: data.length === 1
          }]
        };
        this.setState({ myChart });
        // 绘制图表
        myChart.setOption(option);
        // }
      });
    }

    loadOverview(){
      const { startTime, endTime, dateType } = this.state;
      post(api.overview,{dateType,startTime,endTime}).then(res => {
        this.setState({overviewDate: res});
      });
    }


    render() {
      const { dateType, defaultYear, defaultQuarter, defaultMonth, type, overviewDate } = this.state;
      return (
        <div style={{margin:'24px',background:'#fff',minWidth:'935px',boxSizing:'border-box'}}>
          <div className={styles.title}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                统计概览
              </div>
              <div className={styles.headerRight}>
                <span onClick={() => this.setDateType(0)} className={`${styles.dateSelect} ${dateType===0?styles.dateActive:''}`}>月度</span>
                <span onClick={() => this.setDateType(1)} className={`${styles.dateSelect} ${dateType===1?styles.dateActive:''}`}>季度</span>
                <span onClick={() => this.setDateType(2)} className={`${styles.dateSelect} ${dateType===2?styles.dateActive:''}`}>年度</span>
                {/* <MonthPicker onChange={this.yearChange} ></MonthPicker> */}
                {
                  dateType===2 &&
                    <YearPicker onChange={(str) => this.yearChange(str)} defaultValue={defaultYear} />
                  || dateType===0 && 
                    <MonthPicker allowClear={false} onChange={(_,str) => this.monthChage(str)} defaultValue={moment(defaultMonth)} /> 
                  || dateType===1 &&
                    <QuarterPicker onChange={(str) => this.quarterChage(str)} value={defaultQuarter} />
                }
              </div>
            </div>
          </div>
          <div className={styles.showPanelBox}>
            {
              overviewDate.map((item) => {
                return (
                  <div className={styles.showPanel} key={Math.random()}>
                    <div className={`${styles.showPanelTit} m-b-8`}>{item.type===0?'报销支出':'借款支出'}</div>
                    <div className={`${styles.showPanelNum} m-b-8`}>
                      ¥{(item.totleSum/100).toFixed(2)}
                      <span className={styles.subText}>{item.type===0?'（含核销 ':'（待还 '}￥{(item.processSum/100).toFixed(2)}）</span>
                    </div>
                    <div className={styles.bottom}>
                      <span className="dis-inlineblock">
                        <span>同比</span>
                        {
                          item.yearOnYear !== '-'?
                            <span className={`iconfont ${item.yearOnYearSymbolType===0?`iconshangsheng ${styles.iconshangsheng}`:`iconxiajiang ${styles.iconxiajiang}`}`} />
                          : ' '
                        }
                        <span className={styles.percent}>{item.yearOnYear}{item.yearOnYear !== '-'?'%':''}</span>
                      </span>
                      <span className="dis-inlineblock m-l-24">
                        <span>环比</span>
                        {
                          item.yearOnYear !== '-'?
                            <span className={`iconfont ${item.annulusSymbolType===0?`iconshangsheng ${styles.iconshangsheng}`:`iconxiajiang ${styles.iconxiajiang}`}`} />
                            : ' '
                        }
                        <span className={styles.percent}>{item.annulus}{item.yearOnYear !== '-'?'%':''}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
         
          <div className={styles.canvasHeader}>
            <div className={styles.canvasHeaderLeft} >趋势图</div>
            <div className={styles.canvasHeaderRight} >
              <Radio.Group onChange={this.handleModeChange} value={type.toString()} style={{ marginBottom: 8 }}>
                <Radio.Button value="1">借款支出</Radio.Button>
                <Radio.Button value="0">报销支出</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div id="main" style={{ width: '100%',minWidth: 500, minHeight: 385,background:'#fff' }} />
          {/* <div className={styles.ballbox} >
            <span className={styles.ball} style={{background:this.state.colorArr[1]}} />
            借款支出
            <span style={{width:'15px',display:'inline-block'}} />
            <span className={styles.ball} style={{background:this.state.colorArr[0]}} />
            报销支出
          </div> */}
        </div>
      );
    }
}

export default EchartsTest;
