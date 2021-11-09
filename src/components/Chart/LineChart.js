import React from 'react';
import { DualAxes } from '@ant-design/charts';

const LineChart = ({ data, xField, yField }) => {
  const config = {
    data,
    xField,
    yField,
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        columnWidthRatio: 0.4,
        label: {},
        color: ['#5B8FF9', '#5D7092'],
      },
      {
        geometry: 'line',
        color: '#5AD8A6',
      },
    ],
    legend: {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: 'uv',
          name: 'uv',
          marker: {
            symbol: 'square',
            style: {
              fill: '#5B8FF9',
              r: 5,
            },
          },
        },
        {
          value: 'bill',
          name: '账单',
          marker: {
            symbol: 'square',
            style: {
              fill: '#5D7092',
              r: 5,
            },
          },
        },
        {
          value: 'count',
          name: '数值',
          marker: {
            symbol: 'square',
            style: {
              fill: '#5AD8A6',
              r: 5,
            },
          },
        },
      ],
    },
  };
  return (
    <DualAxes {...config} />
  );
};

export default LineChart;
