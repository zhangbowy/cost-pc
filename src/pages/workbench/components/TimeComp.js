import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import fields from '@/utils/fields';
import { Form, DatePicker, Select } from 'antd';
import { dateToTime } from '../../../utils/util';

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
    const { submitTime } = this.props;
    console.log('TimeComp -> submitTime', submitTime);
    if (value === '-1') {
      this.setState({
        isShow: true,
      }, () => {
        this.props.onChangeData('submitTime', {
          ...submitTime,
          dateType: -1
        });
      });
    } else {
      this.setState({
        isShow: false,
      });
      this.props.onChangeData('submitTime', {
        ...submitTime,
        ...dateToTime(value),
        type: value
      });
    }
  }

  onChangeDate = (date, dateString) => {
    const { submitTime } = this.props;
    this.props.onChangeData('submitTime', {
      ...submitTime,
      type: '-1',
      dateType: -1,
      startTime: dateString.length ?
        moment(`${dateString[0]} 00:00:01`).format('x') : '',
      endTime: dateString.length ?
        moment(`${dateString[1]} 23:59:59`).format('x') : '',
    });
  }



  render() {
    const { dateType } = fields;
    const {
      isShow,
    } = this.state;
    const {
      form: { getFieldDecorator },
      submitTime
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
              value={submitTime.startTime ?
                [moment(moment(Number(submitTime.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                moment(moment(Number(submitTime.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : undefined}
            />
          </Form.Item>
        }
      </Form>
    );
  }
}

export default TimeComp;
