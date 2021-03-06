import React, { PureComponent } from 'react';
import { Form, Switch, InputNumber } from 'antd';
import style from './other.scss';
import { formItemLayout } from '../../../../../utils/constants';

@Form.create()
class OtherRule extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isShow: false,
      initDetail: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {details} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (details !== prevState.initDetail) {
      return {
        isShow: details.isRiseAmount,
        initDetail: details,
      };
    }
    // 否则，对于state不进行任何操作
    return null;
}

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

  onChange = (e) => {
    this.props.form.setFieldsValue({
      riseProportion: ''
    });
    this.setState({
      isShow: e,
    });
  }

  checkMoney = (rule, value, callback) => {
    console.log('走了没呀');
    if (value) {
      if(!/^[1-9]\d*|0$/.test(value)) {
        callback('请输入正确的数字');
      }
      if (value > 200) {
        callback('金额需小于200');
      }
      if (value < 100) {
        callback('金额不能小于100');
      }
      callback();
    } else {
      callback();
    }
  }

  render() {
      const { form: { getFieldDecorator }, details } = this.props;
      const { isShow } = this.state;
      return (
        <Form className={style.forms} style={{marginTop: '20px'}}>
          <Form.Item label="双人合住标准上浮：" {...formItemLayout}>
            {
              getFieldDecorator('isRiseAmount', {
                initialValue: details.isRiseAmount,
                valuePropName: 'checked',
              })(
                <Switch onChange={e => this.onChange(e)} />
              )
            }
          </Form.Item>
          <p className={style.production}>
            注：按照单条费用明细的分摊人匹配费用标准，多人分摊认为多人合住。假设合住的两人酒店标准分别为A元和B元(A&gt;=B)如同行3人，
            按照A、B、C其中差标最高者取上浮；如第三人未合住可分开提交2条费用明细
          </p>
          {
            isShow &&
            <div className={style.costRule}>
              <p className="m-l-24">费用标准 = A *</p>
              <Form.Item>
                {
                  getFieldDecorator('riseProportion', {
                    initialValue: details.riseProportion,
                    rules: [{ validator: this.checkMoney }]
                  })(
                    <InputNumber placeholder="请输入" className="m-l-8 m-r-8" />
                  )
                }
              </Form.Item>
              <p>%</p>
              <span className="c-black-45">（差标就高，可上浮一定比例，请输入100～200之前的整数）</span>
            </div>
          }
        </Form>
      );
  }
}

export default OtherRule;
