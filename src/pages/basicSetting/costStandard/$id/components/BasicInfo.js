import React, { Component } from 'react';
import { Form, Input, Radio, Switch, TreeSelect } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import fields from '../../../../../utils/fields';
import { objToArr } from '../../../../../utils/common';
import style from './index.scss';

const  { highType, chargeType } = fields;
const highTypeList = objToArr(highType);
const { SHOW_CHILD } = TreeSelect;
@Form.create()
class BasicInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      isShow: true,
      initDetail: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {details} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (details !== prevState.initDetail) {
      return {
        isShow: details.exceedStandardType === 0,
        initDetail: details,
      };
    }
    // 否则，对于state不进行任何操作
    return null;
}

  getItems = () => {
    const { form: { validateFieldsAndScroll }, type, id } = this.props;
    let value = null;
    validateFieldsAndScroll((err,val) => {
      if (!err) {
        console.log('基础信息', val);
        value = {
          ...val,
          status: val.status ? 1 : 0,
          standardType: type
        };
        if (id) {
          Object.assign(value, {
            id
          });
        }
      }
    });
    return value;
  }

  onChange = e => {
    this.setState({
      isShow: e.target.value === '0',
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
    const { isShow } = this.state;
    const { form: { getFieldDecorator }, type, details, costList } = this.props;
    return (
      <Form className={style.form}>
        <Form.Item label="标准名称：" {...formItemLayout}>
          {
            getFieldDecorator('standardName', {
              initialValue: details.standardName || '',
              rules: [
                { required: true, message: '请输入' },
                { max: 20, message: '最多输入20个字' }
              ]
            })(
              <Input placeholder="请输入" className={style.input} />
            )
          }
        </Form.Item>
        <Form.Item label="适用支出类别：" {...formItemLayout}>
          {
            getFieldDecorator('categoryIds', {
              initialValue: details.categoryIds || [],
              rules: [{ required: true, message: '请选择' }]
            })(
              <TreeSelect
                treeData={costList}
                placeholder="请选择"
                treeCheckable
                style={{ width: '400px' }}
                showCheckedStrategy={SHOW_CHILD}
                dropdownStyle={{height: '300px'}}
                showSearch
                treeNodeFilterProp='title'
                getPopupContainer={triggerNode => triggerNode.parentNode}
              />
            )
          }
          <p className="c-black-45">设置{chargeType[type].name}标准后，员工提单时需额外填写[{chargeType[type].fields}]，用于费标判断</p>
        </Form.Item>
        <Form.Item label="超标限制：" {...formItemLayout}>
          {
            getFieldDecorator('exceedStandardType', {
              initialValue: details.exceedStandardType ? `${details.exceedStandardType}` : '0',
              rules: [{ required: true, message: '请选择' }]
            })(
              <RadioGroup onChange={(e) => this.onChange(e)}>
                {
                  highTypeList.map(it => (
                    <Radio key={it.key} value={it.key}>{it.name}</Radio>
                  ))
                }
              </RadioGroup>
            )
          }
          {
            isShow &&
            <div className={style.tips}>
              <p>默认提示文案：</p>
              {
                getFieldDecorator('exceedStandardNote', {
                  initialValue: details.exceedStandardNote,
                  rules:[{ max: 20, message: '最多输入20个字' }]
                })(
                  <Input style={{width: '301px'}} placeholder={`请填写${chargeType[type].name}费超标理由`} />
                )
              }
            </div>
          }
        </Form.Item>
        <Form.Item label="是否启用：" {...formItemLayout}>
          {
            getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: details.status === undefined ? true : !!(details.status),
              rules: [{ required: true, message: '请选择' }]
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default BasicInfo;
