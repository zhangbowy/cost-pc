import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import fields from '@/utils/fields';
import { Form, DatePicker, Select } from 'antd';
// import { dateToTime } from '../../../utils/util';

const { RangePicker } = DatePicker;
const { Option } = Select;
@Form.create()
class TimeComp extends PureComponent {
  static propTypes = {

  }

  state = {
    isShow: false,
  }

  onChange = value => {
    // const { chart, submitTime } = this.props;
    if (value === '-1') {
      this.setState({
        isShow: true,
      });
    } else {
      // chart({
      //   url: 'submitReport',
      //   payload: this.setVal({
      //     ...submitTime,
      //     ...dateToTime(value),
      //   })
      // }, () => {
      //   this.props.onChangeData('submitTime', {
      //     ...submitTime,
      //     ...dateToTime(value),
      //     type: value
      //   });
      //   this.setState({
      //     isShow: false,
      //   });
      // });
    }
  }

  onChangeDate = (date, dateString) => {
    const { chart, submitTime } = this.props;
    chart({
      url: 'submitReport',
      payload: this.setVal({
        ...submitTime,
        type: '-1',
        startTime: dateString.length ? moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ? moment(`${dateString[1]} 23:59:59`).format('x') : '',
      })
    }, () => {
      this.props.onChangeData('submitTime', {
        ...submitTime,
        type: '-1',
        startTime: dateString.length ?
          moment(`${dateString[0]} 00:00:01`).format('x') : '',
        endTime: dateString.length ?
          moment(`${dateString[1]} 23:59:59`).format('x') : '',
      });
    });
  }



  render() {
    const { dateType } = fields;
    const {
      isShow
    } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form layout="inline" className="m-l-16">
        <Form.Item style={{ marginRight: 0 }}>
          {
            getFieldDecorator('time', {
              initialValue: '0_m'
            })(
              <Select
                style={{ width: '160px' }}
                onChange={this.onChange}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  dateType.map(it => (
                    <Option key={it.key}>{it.value}</Option>
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
              style={{ width: '240px' }}
              className="m-l-8"
              onChange={this.onChangeDate}
              allowClear={false}
            />
          </Form.Item>
        }
      </Form>
    );
  }
}

export default TimeComp;
