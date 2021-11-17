import React from 'react';
import { TreeSelect } from 'antd';
import treeConvert from '@/utils/treeConvert';
import style from './leftPie.scss';
import LineAndColumn from '../../../../components/Chart/LineAndColum.js';
import TimeComp from '../TimeComp';
import fields from '../../../../utils/fields';

const {monthAndYear} = fields;
const { SHOW_CHILD } = TreeSelect;
const BottomChart = ({ onChangeState, submitTime,  costCategoryList, onlyDeptList }) => {
  const costList = treeConvert(
    {
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    },
    costCategoryList
  );
  const changeData = (data) => {
    const item = [];
    data.forEach(list => {
      const newData = {};
      newData.key= list.deptId;
      newData.value = list.deptId;
      newData.title = list.deptName;
      newData.children = list.children  ? changeData(list.children) : [];    // 如果还有子集，就再次调用自己
      item.push(newData);
    });
    return item;
  };
  const onChangeTree = (val) => {
    console.log(val);
  };
  return (
    <div className={style.bottomChart}>
      <div className={style.header}>
        <div className={style.title}>
          <span className={style.active}>
            支出分析
          </span>
        </div>
        <div className={style.formTypes}>
          <TimeComp
            onChangeData={(str, val) => { onChangeState('costTime', val); }}
            submitTime={submitTime}
            noSelf
            formType={1}
            dateTypeList={monthAndYear}
          />
          <TreeSelect
            style={{ width: '160px', height: '32px' }}
            className="m-l-8"
            treeData={costList}
            placeholder="支出类别"
            treeCheckable
            showCheckedStrategy={SHOW_CHILD}
            dropdownStyle={{height: '300px'}}
            showSearch
            treeNodeFilterProp='title'
            labelInValue
            onChange={val => onChangeTree(val)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          />
          <TreeSelect
            style={{ width: '160px', height: '32px' }}
            className="m-l-8"
            treeData={changeData(onlyDeptList)}
            placeholder="部门"
            treeCheckable
            showCheckedStrategy={SHOW_CHILD}
            dropdownStyle={{height: '300px'}}
            showSearch
            treeNodeFilterProp='title'
            labelInValue
            onChange={val => onChangeTree(val)}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          />
        </div>
      </div>
      <div className={style.lineChart}>
        <LineAndColumn options={{ height: 468 }} />
      </div>
    </div>
  );
};

export default BottomChart;
