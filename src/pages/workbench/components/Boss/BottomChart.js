import React from 'react';
import { TreeSelect } from 'antd';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import style from './leftPie.scss';
import LineAndColumn from '../../../../components/Chart/LineAndColum.js';
import TimeComp from '../TimeComp';
import fields from '../../../../utils/fields';

const {monthAndYear} = fields;
const { SHOW_CHILD } = TreeSelect;
const BottomChart = ({ onChangeState, submitTime,  costCategoryList,
  lineParams,
  onlyDeptList, lineCharts, barCharts }) => {
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
  const changeData = (data=[]) => {
    const item = [];
    if (data) {
      data.forEach(list => {
        const newData = {};
        newData.key= list.deptId;
        newData.value = list.deptId;
        newData.title = list.deptName;
        newData.children = list.children  ? changeData(list.children) : [];    // 如果还有子集，就再次调用自己
        item.push(newData);
      });
    }
    return item;
  };
  const onChangeTree = (val, key) => {
    onChangeState('lineParams', {
      ...lineParams,
      [key]: val,
    });
  };
  const handleArr = (arr) => {
    const x = arr.map(it => it.time) || [];
    const value = arr.map(it => it.value/100) || [];
    const xs = Array.from(new Set(x)).sort(function(m, n){
      if (moment(m).format('x') < moment(n).format('x')) return -1;
      if (moment(m).format('x') > moment(n).format('x')) return 1;
      return 0;
    });
    const newList = [];
    xs.forEach(it => {
      const newArr = arr.filter(item => item.time === it);
      let obj = {};
      newArr.forEach(item => {
        obj = {
          ...obj,
          [item.name]: item.value/100,
        };
      });
      newList.push(obj);
    });
    const keys = newList.length ? Object.keys(newList[0]) : [];
    return {
      keys,
      dataList: newList,
      xList: xs,
      value,
    };
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
            onChange={val => onChangeTree(val, 'categoryIds')}
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
            onChange={val => onChangeTree(val, 'deptIds')}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          />
        </div>
      </div>
      <div className={style.lineChart}>
        <LineAndColumn options={{ height: 468 }} lineCharts={handleArr(lineCharts)} barCharts={handleArr(barCharts)} />
      </div>
    </div>
  );
};

export default BottomChart;
