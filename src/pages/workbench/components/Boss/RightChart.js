import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import echarts from 'echarts';
import fields from '@/utils/fields';
import style from './leftPie.scss';

const { Option } = Select;
@Form.create()
class RightChart extends PureComponent {

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('chart'));
    const option = {
      tooltip: {
          trigger: 'item'
      },
      legend: {
          right: '30%',
          top: 'center',
          orient: 'vertical',
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['30%', '50%'],
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
    window.onresize = function() {
      myChart.resize();
    };
    // myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});

  }

  render() {
    const { monthType } = fields;
    return (
      <div className={style.left} style={{ marginRight: 0 }}>
        <div className={style.top} style={{ borderBottom: '1px solid #E8E8E8' }}>
          <p>支出趋势</p>
          <Form layout="inline">
            <Form.Item>
              <Select>
                {
                  monthType.map(it => (
                    <Option key={it.key} value={it.value}>{it.value}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <Select>
                {
                  monthType.map(it => (
                    <Option key={it.key} value={it.value}>{it.value}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={style.chart} id="chart" />
      </div>
    );
  }
}

export default RightChart;

