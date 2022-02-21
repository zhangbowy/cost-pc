/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-undef */
import { TreeSelect, Tree } from 'antd';
import React from 'react';
import cs from 'classnames';
import style from './index.scss';

const { TreeNode } = Tree;
function CostTreeSelect(props) {
  const // 循环渲染树结构
  loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.value}
          label={item.title}
          value={item.value}
          selectable={!item.disabled}
          title={(
            <div className={cs('icons', item.type ? style.treeNodes : style.titles)}>
              {
                item.type ?
                  <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-28')} />
                  :
                  null
              }
              <div className={style.notes}>
                <span
                  className={`m-l-8 ${item.type ? 'c-black-85' : 'c-black-45'}`}
                  style={{verticalAlign: 'middle'}}
                >
                  {item.title}
                </span>
                {
                  item.note && item.type ?
                    item.note.length > 15 ?
                      <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                      </Tooltip>
                      :
                      <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                      :
                      null
                }
              </div>
            </div>
          )}
        >
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.value}
      label={item.title}
      value={item.value}
      selectable={!item.disabled}
      title={(
        <div className={cs('icons', item.type ? style.treeNodes : style.titles)}>
          {
            item.type ?
              <i className={cs(`icon${item.icon}`, 'iconfont', 'fs-28')} style={{verticalAlign: 'middle'}} />
              :
              null
          }
          <div className={style.notes}>
            <span
              className={`m-l-8 ${item.type ? 'c-black-85' : 'c-black-45'}`}
              style={{verticalAlign: 'middle'}}
            >
              {item.title}
            </span>
            {
              item.note && item.type ?
                item.note.length > 15 ?
                  <Tooltip title={item.note || '-'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                  </Tooltip>
                  :
                  <span className="c-black-45 fs-12 m-l-8" style={{lineHeight: 1, marginTop: '4px'}}>{item.note}</span>
                  :
                  null
            }
          </div>
        </div>
      )}
    />;
  });

  return (
    <TreeSelect
      placeholder="请选择"
      dropdownStyle={{height: '450px'}}
      showSearch
      treeNodeFilterProp="label"
      treeNodeLabelProp="label"
      treeDefaultExpandAll
      {...props}
    >
      {loop(props.list)}
    </TreeSelect>
  );
}

export default CostTreeSelect;
