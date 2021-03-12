/* eslint-disable react/no-did-update-set-state */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Form, Select, DatePicker } from 'antd';
import moment from 'moment';
import fields from '@/utils/fields';
import styles from './leftPie.scss';
import RightLine from './RightLine';
import { dateToTime } from '../../../../utils/util';

const { Option } = Select;
const { RangePicker } = DatePicker;
@Form.create()
class RightChart extends PureComponent {

  state = {
    isShow: false,
    lineData: {},
  }

  componentDidUpdate(prev) {
    if (prev.lineData !== this.props.lineData) {
      this.setState({
        lineData: this.props.lineData,
      });
    }
  }

  onChange = op => {
    const { chart, onChangeData } = this.props;
    if (op === '-1') {
      this.setState({
        isShow: true,
      });
    } else {
      chart({
        url: 'brokenLine',
        payload: {
          ...dateToTime(op),
        }
      }, () => {
        onChangeData('lineChart', {
          ...dateToTime(op),
          type: op
        });
        this.setState({
          isShow: false,
        });
      });
    }
  }

  onChangeDate = (date, dateString) => {
    const { chart, onChangeData } = this.props;
    chart({
      url: 'brokenLine',
      payload: {
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      }
    }, () => {
      onChangeData('lineChart', {
        type: '-1',
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      });
    });
  }

  render() {
    const { monthType } = fields;
    const { form: { getFieldDecorator } } = this.props;
    const { isShow, lineData } = this.state;
    return (
      <div className={styles.left} style={{ marginRight: 0 }}>
        <div className={styles.top} style={{ borderBottom: '1px solid #E8E8E8' }}>
          <p>支出趋势</p>
          <Form layout="inline">
            <Form.Item>
              {
                getFieldDecorator('type', {
                  initialValue: '3_cm'
                })(
                  <Select
                    style={{ width: '120px' }}
                    onChange={this.onChange}
                  >
                    {
                      monthType.map(it => (
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
                <RangePicker
                  style={{ width: '136px' }}
                  onChange={this.onChangeDate}
                  className="m-l-8"
                />
              </Form.Item>
            }
          </Form>
        </div>
        <RightLine data={lineData} />
      </div>
    );
  }
}

export default RightChart;

