import React from 'react';
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

function Line() {
  return (
    <div>
      <ReactEcharts
        style={{height: '300px', width: '100%'}}
        className='echarts-for-echarts'
      />
    </div>
  );
}

export default Line;
