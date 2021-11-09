import React from 'react';
import { TinyArea } from '@ant-design/charts';

const TinyAreaChart = ({ options }) => {
  const data = [
    264, 417, 438, 887, 309, 397];
  const config = {
    height: 60,
    autoFit: true,
    data,
    smooth: true,
    ...options,
  };
  return <TinyArea {...config} />;
};

export default TinyAreaChart;
