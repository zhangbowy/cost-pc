import React from 'react';
import { Chart, Tooltip, Legend, Point, Line, Interval, Interaction, Axis } from 'bizcharts';
// import { defaultColor } from '../../utils/constants';

const LineAndColumn = () => {
  const data = [
    {
      time: '10:10',
      call: 4,
      waiting: 2,
      people: 2,
    },
    {
      time: '10:15',
      call: 2,
      waiting: 6,
      people: 3,
    },
    {
      time: '10:20',
      call: 13,
      waiting: 2,
      people: 5,
    },
    {
      time: '10:25',
      call: 9,
      waiting: 9,
      people: 1,
    },
    {
      time: '10:30',
      call: 5,
      waiting: 2,
      people: 3,
    },
    {
      time: '10:35',
      call: 8,
      waiting: 2,
      people: 1,
    },
    {
      time: '10:40',
      call: 13,
      waiting: 1,
      people: 2,
    },
  ];

  let chartIns = null;
  const scale = {
    people: {
      min: 0,
      tickCount: 4,
      alias: '人数',
      type: 'linear-strict'
    },
    waiting: {
      min: 0,
      tickCount: 4,
      alias: '等待',
      type: 'linear-strict'
    },
  };
  const colors = ['#6394f9', '#62daaa'];
  return (
    <Chart
      scale={scale}
      autoFit
      height={430}
      data={data}
      theme={{ maxColumnWidth: 32 }}
      onGetG2Instance={(chart) => {
        chartIns = chart;
      }}
    >
      <Legend
        custom
        allowAllCanceled
        items={[
          {
            value: 'waiting',
            name: '等待',
            marker: {
              symbol: 'square',
              style: { fill: colors[0], r: 5 },
            },
          },
          {
            value: 'people',
            name: '人数',
            marker: {
              symbol: 'hyphen',
              style: { stroke: colors[1], r: 5, lineWidth: 3 },
            },
          },
        ]}
        onChange={(ev) => {
          const {item} = ev;
          const {value} = item;
          const checked = !item.unchecked;
          const geoms = chartIns.geometries;

          for (let i = 0; i < geoms.length; i++) {
            const geom = geoms[i];

            if (geom.getYScale().field === value) {
              if (checked) {
                geom.show();
              } else {
                geom.hide();
              }
            }
          }
        }}
      />
      <Tooltip shared />
      <Interval
        position="time*waiting"
        color={colors[0]}
      />
      <Interaction type="active-region" />
      <Axis
        name="people"
        grid={{
          align: 'center', // 网格顶点从两个刻度中间开始
          line: { // 当line为null时则不展示网格线
            type: 'line', // 网格线类型 line circle polygon
            style: {
                stroke: '#E8E8E8', // 网格线的颜色
                lineWidth: 1, // 网格线的宽度复制代码
                lineDash: [1, 1] // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
            }
          }, // 网格线的样式配置，原有属性为 line
          alignTick: false, // 是否同刻度线对齐，如果值为 false，则会显示在两个刻度中间。 alignTick设为false，且数据类型为 category 时，tickLine 的样式变为 category 数据专有样式
        }}
      />
      <Axis
        name="time"
        line={{
          stroke: '#dddddd',
          fill: '#ffffff',
          lineWidth: 1
        }}
      />
      <Axis
        name="waiting"
        grid={{
          align: 'top', // 网格顶点从两个刻度中间开始
          line: { // 当line为null时则不展示网格线
            type: 'line', // 网格线类型 line circle polygon
            style: {
                stroke: '#E8E8E8', // 网格线的颜色
                lineWidth: 1, // 网格线的宽度复制代码
                lineDash: [2, 2] // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
            }
          }, // 网格线的样式配置，原有属性为 line
          alignTick: false, // 是否同刻度线对齐，如果值为 false，则会显示在两个刻度中间。 alignTick设为false，且数据类型为 category 时，tickLine 的样式变为 category 数据专有样式
        }}
      />
      <Line
        position="time*people"
        color={colors[1]}
        size={2}
        shape="line"
      />
      <Point
        position="time*people"
        color={colors[1]}
        size={2}
        shape="circle"
      />
    </Chart>
  );
};

export default LineAndColumn;
