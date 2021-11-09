/* eslint-disable no-restricted-properties */
import React from 'react';
import { Liquid, measureTextWidth } from '@ant-design/charts';

const DemoLiquid = ({ percents }) => {
  const config = {
    percent: percents,
    radius: 0.8,
    statistic: {
      title: {
        formatter: function formatter() {
          return '盈利率';
        },
        style: function style(_ref) {
          const { percent } = _ref;
          return { fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)' };
        },
      },
      content: {
        style: function style(_ref2) {
          const { percent } = _ref2;
          return {
            fontSize: 60,
            lineHeight: 1,
            fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
          };
        },
        customHtml: function customHtml(container, view, _ref3) {
          const {percent} = _ref3;
          const _container$getBoundin = container.getBoundingClientRect();
          const { width } = _container$getBoundin;
          const {height} = _container$getBoundin;
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = '占比 '.concat((percent * 100).toFixed(0), '%');
          const textWidth = (0, measureTextWidth)(text, { fontSize: 60 });
          const scale = Math.min(d / textWidth, 1);
          return '<div style="width:'
            .concat(d, 'px;display:flex;align-items:center;justify-content:center;font-size:')
            .concat(scale, 'em;line-height:')
            .concat(scale <= 1 ? 1 : 'inherit', '">')
            .concat(text, '</div>');
        },
      },
    },
    liquidStyle: function liquidStyle(_ref4) {
      const { percent } = _ref4;
      return {
        fill: percent > 0.45 ? '#5B8FF9' : '#FAAD14',
        stroke: percent > 0.45 ? '#5B8FF9' : '#FAAD14',
      };
    },
    color: function color() {
      return '#5B8FF9';
    },
  };
  return <Liquid {...config} />;
};

export default DemoLiquid;
