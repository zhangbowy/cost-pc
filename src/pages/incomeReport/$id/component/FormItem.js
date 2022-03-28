import { Form, Input } from 'antd';
import React, { PureComponent } from 'react';

class FormItems extends PureComponent {
  render() {
    const { item, modify } = this.props;
    return (
      <Form.Item>
        {
          item.fieldType === 0 ?
            <Input
              placeholder={item.note ? item.note : '请输入'}
              disabled={modify && !item.isModify}
            />
            :
            null
        }
      </Form.Item>
    );
  }
}

export default FormItems;
