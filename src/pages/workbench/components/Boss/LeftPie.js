/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
// import echarts from 'echarts';
import { Form, Select, DatePicker, Menu } from 'antd';
import fields from '@/utils/fields';
import style from './leftPie.scss';
// import { defaultColor } from '../../../../utils/constants';
import { dateToTime } from '../../../../utils/util';
import PieChart from './PieChart';

const tabList = [{
  key: '0',
  value: '费用支出'
}, {
  key: '1',
  value: '成本支出'
}];
const { Option } = Select;
const { RangePicker } = DatePicker;
@Form.create()
class LeftPie extends PureComponent {

  state = {
    isShow: false,
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
    if (op === '-1') {
      this.setState({
        isShow: true,
      });
    } else {
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
        this.setState({
          isShow: false,
        });
      });
    }
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
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      });
    });
  }

  render () {
    const { form: { getFieldDecorator }, totalSum } = this.props;
    const { dateType } = fields;
    const { isShow, current, data } = this.state;
    return (
      <div className={style.left}>
        <div className={style.leftTop}>
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            onClick={this.handleClick}
          >
            {
              tabList.map(it => (
                <Menu.Item key={it.key}>{it.value}统计</Menu.Item>
              ))
            }
          </Menu>
          <Form layout="inline">
            <Form.Item>
              {
                getFieldDecorator('type', {
                  initialValue: '0_m'
                })(
                  <Select style={{ width: '120px' }} onChange={this.onChange}>
                    {
                      dateType.map(it => (
                        <Option key={it.key} value={it.key}>{it.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            {
              isShow &&
              <Form.Item>
                <RangePicker style={{ width: '136px' }} onChange={this.onChangeDate} />
              </Form.Item>
            }
          </Form>
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


