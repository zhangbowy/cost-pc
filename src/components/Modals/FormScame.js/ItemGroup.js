import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { config, convert } from './_utils';

@Form.create()
class ItemGroup extends Component {
  componentDidMount() {
    if (!this.isOptionsValid()) {
      // eslint-disable-next-line no-console
      console.error('使用Select组件请传入options数组，且长度要大于0');
    }
  }

  isOptionsValid = () => {
    const { item } = this.props;
    const { options } = item;

    return options && Array.isArray(options) && options.length > 0;
  };

  render() {
    const { item } = this.props;

    const { options, getFieldDecorator, itemClassName } = item;

    return this.isOptionsValid() ? (
      <div style={{ display: 'flex' }} className={itemClassName}>
        {
          options.map((it, index) => {
            if (index !== 1) {
              return (
                <Form.Item key={it.field} label={it.label}>
                  {getFieldDecorator(it.field, config(it))(convert(it))}
                </Form.Item>
              );
            }
            return (<it.component />);
          })
        }
      </div>
    ) : (
      <span style={{ color: 'red' }}>请检查配置项是否正确！！</span>
    );
  }
}

ItemGroup.propTypes = {
  item: PropTypes.object.isRequired
};

export default ItemGroup;
