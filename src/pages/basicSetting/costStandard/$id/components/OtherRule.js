import React, { PureComponent } from 'react';
import { Form, Switch, InputNumber } from 'antd';
import style from './other.scss';
import { formItemLayout } from '../../../../../utils/constants';

@Form.create()
class OtherRule extends PureComponent {

  getItems = () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    let value = null;
    validateFieldsAndScroll((err,val) => {
      if (!err) {
        console.log('其他规则', val);
        value = {
          ...val,
        };
      }
    });
    return value;
  }

  render() {
      const { form: { getFieldDecorator }, details } = this.props;
      return (
        <Form className={style.forms}>
          <Form.Item label="双人合住标准上浮：" {...formItemLayout}>
            {
              getFieldDecorator('isRiseAmount', {
                initialValue: details.isRiseAmount,
                valuePropName: 'checked',
              })(
                <Switch />
              )
            }
          </Form.Item>
          <p className={style.production}>
            注：按照单条费用明细的分摊人匹配费用标准，多人分摊认为多人合住。假设合住的两人酒店标准分别为A元和B元(A&gt;=B)如同行3人，
            按照A、B、C其中差标最高者取上浮；如第三人未合住可分开提交2条费用明细
          </p>
          <div className={style.costRule}>
            <p className="m-l-24">费用标准 = A *</p>
            {
              getFieldDecorator('riseProportion', {
                initialValue: details.riseProportion,
              })(
                <InputNumber placeholder="请输入" className="m-l-8 m-r-8" />
              )
            }
            <p>%</p>
            <span className="c-black-45">（差标就高，可上浮一定比例，请输入100～200之前的整数）</span>
          </div>
        </Form>
      );
  }
}

export default OtherRule;
