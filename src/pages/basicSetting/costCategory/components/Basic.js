import React, { Component } from 'react';
import { Form, Input, Switch, Icon, Cascader } from 'antd';
import cs from 'classnames';
import TextArea from 'antd/lib/input/TextArea';
import { classifyIcon } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import style from './classify.scss';

const labelInfo = {
  costName: '名称',
  parentId: '所属分组',
  note: '描述',
  icon: '图标',
  status: '启用'
};
@Form.create()
class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: (props.data && props.data.icon) || 'morenleibietu1',
      data: props.data || {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        data: this.props.data,
        active: (this.props.data && this.props.data.icon) || 'morenleibietu1',
      });
    }
  }

  onChangeIcon = (active) => {
    this.setState({
      active,
    });
  }

  onRest() {
    this.setState({
      active: 'morenleibietu1',
    });
    this.props.form.resetFields();
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  getFormItems = () => {
    const {
      form,
    } = this.props;
    const { active } = this.state;
    let val = {
      icon: active
    };
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(val, {
          ...values,
        });
      } else {
        val = null;
      }
    });
    return val;
  }

  render() {
    const {
      form: { getFieldDecorator },
      list,
      title,
      costType
    } = this.props;
    const lists = list.filter(it => Number(it.type) === 0);
    const datas = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'costName',
    }, lists);
    const { active, data} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <div style={{ width: '100%', paddingTop: '24px', overflowY: 'scroll' }}>
        <Form {...formItemLayout} className="formItem" style={{ width: '450px' }}>
          <Form.Item label={labelInfo.costName}>
            {
              getFieldDecorator('costName', {
                initialValue: data && data.costName,
                rules: [{ required: true, message: '请输入' }]
              })(
                <Input placeholder="请输入" />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.parentId}>
            {
              getFieldDecorator('parentId', {
                initialValue: (data && data.parentId) || '',
              })(
                <Cascader
                  options={datas}
                  placeholder="请选择"
                  fieldNames={{
                    label: 'costName',
                    value: 'id',
                  }}
                  disabled={title === 'edit'}
                  changeOnSelect
                  showSearch={this.filter}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                />
              )
            }
          </Form.Item>
          <Form.Item
            label={labelInfo.note}
          >
            {
              getFieldDecorator('note', {
                initialValue: data && data.note,
                rules: [{ max: 50, message: '不能超过50字' }]
              })(
                <TextArea max={50} placeholder="请输入" />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.icon}>
            <div className={style.iconMap}>
              {
                classifyIcon[costType].map(item => (
                  <div
                    className={item.key === active ? cs(style.iconList, style.activeIcon) : style.iconList}
                    key={item.key}
                    onClick={() => this.onChangeIcon(item.key)}
                  >
                    <i className={cs('iconfont', item.value)} style={{color: item.color}} />
                    {
                      (active === item.key) &&
                      <div className={style.checked}>
                        <Icon type="check" style={{color: '#fff'}} className="fs-12" />
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </Form.Item>
          <Form.Item label={labelInfo.status}>
            {
              getFieldDecorator('status', {
                initialValue: data && data.status === undefined ? true : data.status,
                valuePropName: 'checked'
              })(
                <Switch />
              )
            }
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Basic;
