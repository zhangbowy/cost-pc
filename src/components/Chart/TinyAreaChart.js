import React from 'react';
import ReactEcharts from 'echarts-for-react';


const TinyAreaChart = ({ options }) => {
  const data = [0, 1397,264, 417, 438, 887, 309, 1397, 417, 438, 887, 309, 397];
  const config = {
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      show: false
    },
    width: 360,
    grid: {
      // left: 'left',
      // top: 'middle',
      left: 16,
      right: 0,
      top: 0,
      bottom: 0,
      show: false,
      containLabel: false,
    },
    series: [
      {
        smooth: true,
        data,
        type: 'line',
        symbol: 'none',
        color: 'rgb(0, 199, 149)',
        markPoint: {
          symbol: 'none'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#57FAD1 ' // 0% 处的颜色
            }, {
                offset: 1, color: '#F9FAFC' // 100% 处的颜色
            }],
          }
        }
      }
    ]
  };
  return (
    <ReactEcharts
      style={{height: '52px'}}
      notMerge
      lazyUpdate
      option={{ ...config, ...options }}
    />
  );
};

export default TinyAreaChart;
