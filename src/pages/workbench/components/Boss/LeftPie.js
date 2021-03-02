import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Menu } from 'antd';
import style from './leftPie.scss';
import { defaultColor } from '../../../../utils/constants';

class LeftPie extends PureComponent {

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('chart'));
    const option = {
      tooltip: {
          trigger: 'item'
      },
      legend: {
          right: 40,
          top: 'center',
          orient: 'vertical',
      },
      color: defaultColor,
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '60%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 5
              },
              selectedMode: true,
              label: {
                  normal: {
                      show: false,
                      position: 'center',
                  },
                  emphasis: {// 中间文字显示
                      show: true,
                      color:'#4c4a4a',
                      formatter: '{value|100}\n\r{name|共发布活动}',
                      rich: {
                          value:{
                              fontSize: 35,
                              fontFamily : '微软雅黑',
                              color:'#454c5c'
                          },
                          name: {
                              fontFamily : '微软雅黑',
                              fontSize: 16,
                              color:'#6c7a89',
                              lineHeight:30,
                          },
                      }
                  }
              },
             lableLine: {
                  normal: {
                      show: false
                  },
              },
              data: [
                  {value: 1048, name: '搜索引擎'},
                  {value: 735, name: '直接访问'},
                  {value: 580, name: '邮件营销'},
                  {value: 484, name: '联盟广告'},
                  {value: 300, name: '视频广告'}
              ]
          }
      ]
    };
    myChart.setOption(option);
    myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});

  }

  render () {
    return (
      <div className={style.left}>
        <div>
          <Menu mode="horizontal" style={{ height: '56px' }}>
            <Menu.Item key={0}>
              费用支出统计
            </Menu.Item>
            <Menu.Item key={1}>
              成本支出统计
            </Menu.Item>
          </Menu>
        </div>
        <div className={style.chart} id="chart" />
      </div>
    );
  }
}

LeftPie.propTypes = {

};

export default LeftPie;


