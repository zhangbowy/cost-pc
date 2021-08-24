import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';


class MyCascader extends Component {
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

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  render() {
    const { item, ...otherProps } = this.props;

    const { options } = item;

    return this.isOptionsValid() ? (
      <Cascader
        options={options}
        placeholder="请选择"
        getPopupContainer={triggerNode => triggerNode.parentNode}
        showSearch={this.filter}
        {...otherProps}
      />
    ) : (
      <span style={{ color: 'red' }}>请检查配置项是否正确！！</span>
    );
  }
}

MyCascader.propTypes = {
  item: PropTypes.object.isRequired
};

export default MyCascader;
