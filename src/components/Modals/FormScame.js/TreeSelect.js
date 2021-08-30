import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect, Tree } from 'antd';

const { TreeNode } = Tree;
class MyTreeSelect extends Component {
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

   // 循环渲染树结构
   loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.key}
          label={item.title}
          value={item.key}
          title={(
            <div>
              <span>{item.title}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.key}
      label={item.title}
      value={item.key}
      title={(
        <div className="icons">
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  render() {
    const { item } = this.props;
    const { otherProps, options } =  item ;
    console.log('MyTreeSelect -> render -> otherProps', otherProps);

    return this.isOptionsValid() ? (
      <TreeSelect
        treeDefaultExpandAll
        treeNodeFilterProp="label"
        {...otherProps}
      >{ this.loop(options) }
      </TreeSelect>
    ) : (
      <span style={{ color: 'red' }}>请检查配置项是否正确！！</span>
    );
  }
}

MyTreeSelect.propTypes = {
  item: PropTypes.object.isRequired
};

export default MyTreeSelect;
