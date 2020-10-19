import React from 'react';
import { Tree, TreeSelect } from 'antd';
import cs from 'classnames';


const { TreeNode } = Tree;

function TreeCatogory(props) {
  console.log(props.list);
  // 循环渲染树结构
  const loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.value}
          title={(
            <div>
              <span>{item.title}</span>
            </div>
          )}
        >
          <a>上移</a>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.value}
      title={(
        <div className="icons">
          {
            item.type ?
              <i className={cs(`icon${item.icon}`, 'iconfont')} />
              :
              null
          }
          <span>{item.title}</span>
        </div>
      )}
    />;
  });

  return (
    <div>
      <TreeSelect
        placeholder="请选择"
        style={{width: '100%'}}
        treeDefaultExpandAll
        dropdownStyle={{height: '300px'}}
      >
        { loop(props.list) }
      </TreeSelect>
    </div>
  );
}

export default TreeCatogory;
