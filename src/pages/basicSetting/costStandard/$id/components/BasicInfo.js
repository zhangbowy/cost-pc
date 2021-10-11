import React, { Component } from 'react';
import { Form, Input, Radio, Switch } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import fields from '../../../../../utils/fields';
import { objToArr } from '../../../../../utils/common';
import style from './index.scss';

const  { highType, chargeType } = fields;
const highTypeList = objToArr(highType);
@Form.create()
class BasicInfo extends Component {

  getItems = () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll((err,val) => {
      if (!err) {
        console.log('基础信息', val);
      }
    });
  }


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
    const { form: { getFieldDecorator }, type } = this.props;
    return (
      <Form className={style.form}>
        <Form.Item label="标准名称：" {...formItemLayout}>
          {
            getFieldDecorator('standardName', {
              rules: [{ required: true, message: '请输入' }]
            })(
              <Input placeholder="请输入" className={style.input} />
            )
          }
        </Form.Item>
        <Form.Item label="适用支出类别：" {...formItemLayout}>
          {
            getFieldDecorator('categoryIds', {
              rules: [{ required: true, message: '请输入' }]
            })(
              <Input placeholder="请输入" className={style.input} />
            )
          }
          <p className="c-black-45">设置{chargeType[type].name}标准后，员工提单时需额外填写[消费城市、xx]，用于费标判断</p>
        </Form.Item>
        <Form.Item label="超标限制：" {...formItemLayout}>
          {
            getFieldDecorator('exceedStandardType', {
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
              getFieldDecorator('exceedStandardNote')(
                <Input style={{width: '301px'}} placeholder={`请填写${chargeType[type].name}费超标理由`} />
              )
            }
          </div>
        </Form.Item>
        <Form.Item label="是否启用：" {...formItemLayout}>
          {
            getFieldDecorator('status', {
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
