import React, { Component } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { formItemLayout } from '@/utils/constants';

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

    };
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div style={{ width: '100%', paddingTop: '24px' }}>
        <Form {...formItemLayout}>
          <Form.Item label={labelInfo.costName}>
            {
              getFieldDecorator('costName', {
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.parentId}>
            {
              getFieldDecorator('parentId')(
                <Select>
                  <Select.Option key="all">无</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item
            label={labelInfo.note}
          >
            {
              getFieldDecorator('note', {
                rules: [{ max: 50, message: '不能超过50字' }]
              })(
                <TextArea max={50} />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.icon}>
            {
              getFieldDecorator('icon')(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.status}>
            {
              getFieldDecorator('status')(
                <Switch defaultChecked />
              )
            }
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Basic;
