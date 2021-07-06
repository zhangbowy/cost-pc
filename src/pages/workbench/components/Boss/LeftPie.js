/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
// import echarts from 'echarts';
import { Radio } from 'antd';
import style from './leftPie.scss';
// import { defaultColor } from '../../../../utils/constants';
import { dateToTime } from '../../../../utils/util';
import PieChart from './PieChart';

const btn = [{
  key: '0',
  value: '按部门'
}, {
  key: '1',
  value: '按类别'
}, {
  key: '2',
  value: '按项目'
}];
class LeftPie extends PureComponent {

  state = {
    current: '0',
    data: [],
  }

  componentDidUpdate(prev) {
    if (prev.data !== this.props.data) {
      this.setState({
        data: this.props.data,
      });
    }
  }

  onChange = op => {
    const { chart, onChangeData, pieChart } = this.props;
    const { current } = this.state;

      chart({
        url: 'chartPie',
        payload: {
          attribute: current,
          ...dateToTime(op),
        }
      }, () => {
        onChangeData('pieChart', {
          ...pieChart,
          ...dateToTime(op),
          type: op
        });
      });
  }

  handleClick = e => {
    const { chart, pieChart, onChangeData } = this.props;
    this.setState({
      current: e.key,
    }, () => {
      chart({
        url: 'chartPie',
        payload: {
          attribute: e.key,
          startTime: pieChart.startTime,
          endTime: pieChart.endTime
        }
      }, () => {
        onChangeData('pieChart', {
          ...pieChart,
          attribute: e.key,
        });
      });
    });
  }

  onChangeDate = (date, dateString) => {
    const { chart, onChangeData, pieChart } = this.props;
    const { current } = this.state;
    chart({
      url: 'chartPie',
      payload: {
        attribute: current,
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      }
    }, () => {
      onChangeData('pieChart', {
        ...pieChart,
        type: '-1',
        attribute: current,
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      });
    });
  }

  render () {
    const { totalSum } = this.props;
    const {  current, data } = this.state;
    return (
      <div className={style.left}>
        <div className={style.leftTop}>
          <p className="fs-16 c-black-85 fw-500">支出分析</p>
          <Radio.Group value='0'>
            {
              btn.map(it => (
                <Radio.Button key={it.key} value={it.key}>{it.value}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
        <PieChart
          data={data}
          total={totalSum}
          current={current}
        />
      </div>
    );
  }
}

LeftPie.propTypes = {

};

export default LeftPie;


