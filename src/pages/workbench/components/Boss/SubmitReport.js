import React, { PureComponent } from 'react';
import { Form, Select, Divider } from 'antd';
import fields from '@/utils/fields';
import lists from './list';
import style from './submitReport.scss';

const { Option } = Select;
class SubmitReport extends PureComponent {
  render () {
    const { dateType } = fields;
    const { list } = lists;
    return (
      <div className={style.submit}>
        <div className={style.top}>
          <p>支出简报</p>
          <Form layout="inline">
            <Form.Item>
              <Select style={{ width: '88px' }}>
                {
                  dateType.map(it => (
                    <Option key={it.key}>{it.value}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <Select style={{ width: '88px' }}>
                {
                  dateType.map(it => (
                    <Option key={it.key}>{it.value}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={style.bottom}>
          {
            list.map((it, index)=> (
              <React.Fragment key={it.key}>
                <div className={style.content}>
                  <p className="c-black-45">{it.value}金额</p>
                  <p className="c-black-85 fs-30">¥1200</p>
                </div>
                {
                  ((list.length - 1) !== index) &&
                  <Divider
                    type="vertical"
                    style={{
                      color: '##e9e9e9',
                      height: '56px',
                      margin: '0 8px 0 13px'
                    }}
                  />
                }
              </React.Fragment>
            ))
          }

        </div>
      </div>
    );
  }
}

export default SubmitReport;

