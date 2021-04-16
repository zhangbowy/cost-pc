/**
 * filename: Container
 * overview: 整个拖拽演示界面
 */

import React, { useState, useImperativeHandle } from 'react';
import cs from 'classnames';
import style from './index.scss';
import StrCenter from './Center';
import Box from './Box';
import Right from './Right';
import SelfStr from './SelfStr';

const title = [{
  key: 'show',
  value: '公用库'
}, {
  key: 'self',
  value: '自定义'
}];
const selfStr = [{
  key: '0',
  fieldType: '0',
  name: '单行文本',
  icon: 'icondanhangwenben',
}, {
  key: '1',
  fieldType: '1',
  name: '多行文本',
  icon: 'iconduohangwenben',
}, {
  key: '2',
  fieldType: '2',
  name: '单选',
  icon: 'icondanxuan',
}, {
  key: '5',
  fieldType: '5',
  name: '日期',
  icon: 'iconriqi',
}, {
  key: '3',
  fieldType: '3',
  name: '明细',
  icon: 'iconmingxi',
}, {
  key: '8',
  fieldType: '8',
  name: '多选',
  icon: 'icondanxuan1',
}, {
  key: '9',
  fieldType: '9',
  name: '说明',
  icon: 'iconshuomingwenzi',
}];

const StrSetting = ({ fieldList,
  selectList, onChangeData, selectId, childRef,
  type, templateType, isModifyInvoice, operateType }) => {
  const [cardList, setCardList] = useState(selectList);
  const [active, setActive] = useState('show');
  const [dragId, setDragId] = useState(selectId);
  let formRef = null;

  useImperativeHandle(childRef, () => ({
    getRightParams: () => {
      let val = null;
      console.log('formRef', formRef);
      if (formRef && formRef.getFormItems) {
        val = formRef.getFormItems();
        console.log('val', val);
      }
      return val;
    }
  }));
  const onHandle = (e) => {
    setActive(e);
  };
  const changeCardList = (list, flag) => {
    console.log('changeCardList -> list', list);
    setCardList([...list]);
    onChangeData('selectList', [...list], flag);
  };

  const changeDragId = (id, flag) => {
    console.log('changeDragId -> formRef', formRef);
    if (flag && formRef && formRef.getFormItems) {
      const newValues = formRef.getFormItems();
      console.log('changeDragId -> newValues', newValues);
      if (!newValues) {
        return;
      }
      const newArr = [...cardList];

      const index = cardList.findIndex(it => it.field === newValues.field);
      if (index > -1) {
        newArr.splice(index, 1, newValues);
      } else {
        const i = newArr.findIndex(it => Number(it.fieldType) === 3);
        const expands = newArr[i].expandFieldVos;
        const mod = expands.findIndex(it => it.field === newValues.field);
        expands.splice(mod, 1, newValues);
        newArr.splice(i, 1, {
          ...newArr[i],
          expandFieldVos: expands
        });
      }
      console.log('changeDragId -> newArr', newArr);
      changeCardList(newArr);
    }
    setDragId(id);
  };
  const selfList = templateType === 2 ? selfStr : selfStr.filter(it => (Number(it.fieldType) !== 3));
  return (
    <div style={{width: '100%', height: '100%', display: 'flex'}}>
      <div className={style.left}>
        <div className={style.header}>
          {
            title.map(it => (
              <div
                className={it.key === active ?
                cs(style.titles, style.active) : style.titles}
                key={it.key}
                onClick={() => onHandle(it.key)}
              >
                <span>{it.value}</span>
                {/* {
                  it.key === 'show' &&
                  <i className="iconfont iconIcon-yuangongshouce m-l-12 m-r-8" />
                } */}
              </div>
            ))
          }
        </div>
        <div className={style.leftCntDrag}>
          {
            active === 'show' ?
              <>
                {
                  fieldList.map(item => (
                    <Box
                      {...item}
                      key={item.field}
                      data={{...item}}
                      cardList={cardList}
                      changeCardList={changeCardList}
                      changeDragId={changeDragId}
                    />
                  ))
                }
              </>
              :
              <>
                {
                  selfList.map(item => (
                    <SelfStr
                      {...item}
                      key={item.key}
                      data={{...item}}
                      cardList={cardList}
                      changeCardList={changeCardList}
                      changeDragId={changeDragId}
                    />
                  ))
                }
              </>
          }
        </div>
      </div>
      <div className={style.strCenter}>
        <div className={style.header}>
          <span className="fs-16 c-black-85 fw-500">表单内容</span>
          <div className={style.pro}>
            <span>
              <i className="iconfont iconinfo-cirlce" />
              <span>请拖拽左侧添加控件</span>
            </span>
          </div>
        </div>
        <StrCenter
          cardList={cardList}
          changeCardList={changeCardList}
          changeDragId={changeDragId}
          dragId={dragId}
        />
      </div>
      <Right
        wrappedComponentRef={form => {formRef = form;}}
        selectList={cardList}
        onChange={changeCardList}
        selectId={dragId}
        type={type}
        templateType={templateType}
        isModifyInvoice={isModifyInvoice}
        operateType={operateType}
      />
    </div>
  );
};

export default StrSetting;
