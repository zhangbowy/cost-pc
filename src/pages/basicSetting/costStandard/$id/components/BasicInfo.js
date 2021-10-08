import React, { Component } from 'react';
import { Form, Input, Radio, Switch } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import fields from '../../../../../utils/fields';
import { objToArr } from '../../../../../utils/common';
import style from './index.scss';

const  { highType } = fields;
const highTypeList = objToArr(highType);
@Form.create()
class BasicInfo extends Component {
  render() {
    // const { form: { getFieldDecorate } } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      }
    };
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form className={style.form}>
        <Form.Item label="标准名称：" {...formItemLayout}>
          {
            getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入' }]
            })(
              <Input placeholder="请输入" className={style.input} />
            )
          }
        </Form.Item>
        <Form.Item label="适用支出类别：" {...formItemLayout}>
          {
            getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入' }]
            })(
              <Input placeholder="请输入" className={style.input} />
            )
          }
          <p className="c-black-45">设置xx标准后，员工提单时需额外填写[消费城市、xx]，用于费标判断</p>
        </Form.Item>
        <Form.Item label="超标限制：" {...formItemLayout}>
          {
            getFieldDecorator('link', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <RadioGroup>
                {
                  highTypeList.map(it => (
                    <Radio key={it.key} value={it.key}>{it.name}</Radio>
                  ))
                }
              </RadioGroup>
            )
          }
          <div className={style.tips}>
            <p>默认提示文案：</p>
            {
              getFieldDecorator('link')(
                <Input style={{width: '301px'}} />
              )
            }
          </div>
        </Form.Item>
        <Form.Item label="是否启用：" {...formItemLayout}>
          {
            getFieldDecorator('link', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Switch />
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default BasicInfo;
