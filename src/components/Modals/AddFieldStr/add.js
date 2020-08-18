import React, { Component } from 'react';
import { Modal, Radio, Input, Button, Switch, Form, message } from 'antd';
import cs from 'classnames';
import { formItemLayout, customFields } from '../../../utils/constants';
import style from  './index.scss';

let id=0;
const len = 5;
@Form.create()
class AddFieldStr extends Component {
  constructor(props) {
    super(props);
    const initialVal = [];
    for(let i=0; i<len; i++) {
      initialVal.push(`expand_field_0${i+1}`);
    }
    this.state = {
      visible: false,
      fieldType: 0,
      list: [],
      fields: initialVal,
      details: {},
    };
  }

  onShow = () => {
    const { detail, getParams } = this.props;
    if (getParams) {
      const val = getParams();
      const details = val.list.filter(it => it.field === detail.field);
      this.setState({
        details: details[0],
      });
      console.log(details);
    }
    if (detail && detail.fieldType) {
      if (Number(detail.fieldType) === 2 && detail.options && detail.options.length > 0) {
        const arr = detail.options.map((it, index) => { return { id: `aa_${index}`, name: it }; });
        this.setState({
          list: arr
        });
      }
      this.setState({
        fieldType: Number(detail.fieldType)
      });
    } else {
      this.setState({
        fieldType: 0
      });
    }
    this.setState({
      visible: true,
    });
  }

  /**
   * 新增条件
   */
  onAdd = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{
      id: ++id,
      name: '',
    }]);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      list: nextKeys,
    });
  }

  /**
   * 删除条件
   * @param { String } 包含k(删除的id值)
   */
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key.id !== k),
    });
    this.setState({
      list: keys.filter(key => key.id !== k),
    });
  };

  onCancel  = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onChange = (e) => {
    if (Number(e.target.value) === 2) {
      this.setState({
        list: [{ id: 'a1' }]
      });
    }
    this.setState({
      fieldType: Number(e.target.value),
    });
  }

  onConfirm = () => {
    const {
      expandField,
      type,
      detail,
    } = this.props;
    const { fields } = this.state;
    let newArr = [...expandField];
    let flag = 0;
    this.props.form.validateFieldsAndScroll((err,val) => {
      if (!err) {
        let vals = {
          fieldType: val.fieldType,
          status: val.status,
          isWrite: val.isWrite,
          name: val.name
        };
        const oldFields = expandField.map(it => it.field);
        const options = [];

        if (val.keys && (Number(val.fieldType) === 2)) {
          // val.keys.forEach(item => )
          const keys = val.keys.map(it => it.id);
          keys.forEach(itm => {
            if (val[itm]) {
              options.push(val[itm]);
            } else {
              flag = 1;
            }
          });
          vals.options = options;
        }
        if (flag) {
          message.error('不能为空');
          return;
        }
        delete vals.keys;
        if (type === 'edit') {
          const arr = [];
          newArr.forEach(it => {
            if (it.field === detail.field) {
              arr.push({
                ...it,
                ...vals,
              });
            } else {
              arr.push(it);
            }
          });
          newArr = arr;
        } else {
          const newFields = fields.filter(it => !oldFields.includes(it));
          console.log(newFields);
          vals = {
            ...vals,
            field: newFields[0],
            key: newFields[0],
          };
          newArr.push(vals);
        }
        console.log('newArr', newArr);
        this.props.onAddStr(newArr);
        this.onCancel();
      }
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator, getFieldValue },
      detail,
    } = this.props;
    const { visible, fieldType, list, details } = this.state;
    getFieldDecorator('keys', { initialValue: list });
    const keys = getFieldValue('keys');
    const formItems = fieldType === 2 ? keys.map(item=> (
      <div className={style.addForm}>
        <Form.Item
          key={item.id}
        >
          {
            getFieldDecorator(`${item.id}`, {
              initialValue:item.name,
              rules: [{ max: 15, message: '限制15个字' }]
            })(
              <Input placeholder="请输入选项" style={{width: '300px'}} />
            )
          }
        </Form.Item>
        <span onClick={() => this.remove(item.id)} className={cs('deleteColor', style.del)}>删除</span>
      </div>
    )) : null;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          visible={visible}
          title="新增自定义字段"
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
            height: '342px',
            overflowY: 'scroll',
            marginTop: '32px'
          }}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="save" type="primary" onClick={() => this.onConfirm()}>保存</Button>
          ]}
          width='582px'
        >
          <Form className="formItem">
            <Form.Item
              {...formItemLayout}
              label="字段类型"
            >
              {
                getFieldDecorator('fieldType', {
                  initialValue: `${fieldType}`,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <Radio.Group onChange={e => this.onChange(e)}>
                    {
                      customFields.map(it => (
                        <Radio key={it.key} value={it.key}>{it.value}</Radio>
                      ))
                    }
                  </Radio.Group>
                )
              }
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="字段名称"
            >
              {
                getFieldDecorator('name', {
                  initialValue: detail.name,
                  rules: [
                    { required: true, message: '请输入字段名称' },
                    { max: 5, message: '限制5个字' }
                  ]
                })(
                  <Input placeholder="请输入字段名称" />
                )
              }
            </Form.Item>
            {
              fieldType === 2 &&
              <div className={style.moveForm}>
                {formItems}
                <Button
                  type="primary"
                  className={style.addSelect}
                  onClick={() => this.onAdd()}
                  disabled={list && (list.length > 15 || (list.length === 15))}
                >
                  添加选项
                </Button>
              </div>
            }
            <Form.Item
              {...formItemLayout}
              label="启用"
            >
              {
                getFieldDecorator('status', {
                  initialValue: !!details.status,
                  valuePropName: 'checked'
                })(
                  <Switch />
                )
              }
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="必填"
            >
              {
                getFieldDecorator('isWrite', {
                  initialValue: details.isWrite || false,
                  valuePropName: 'checked'
                })(
                  <Switch />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddFieldStr;
