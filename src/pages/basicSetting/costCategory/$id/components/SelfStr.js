import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import cs from 'classnames';
import style from './index.scss';
import { timeStampToHex } from '../../../../../utils/common';

const expand = [{
  name: '单价',
  dateType: 0,
  fieldType: 0,
  key: '104',
  isWrite: true,
  field: 'detail_sale',
}, {
  name: '数量',
  dateType: 0,
  fieldType: 0,
  key: '103',
  isWrite: true,
  field: 'detail_account',
}, {
  name: '金额',
  dateType: 0,
  fieldType: 0,
  key: '102',
  isWrite: true,
  field: 'detail_money',
}];
let id = 1000;
function SelfStr({ name, icon, fieldType, cardList, changeCardList, changeDragId }) {
  const idGenerator = () => {
    let qutient = 10000;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    const time = timeStampToHex();

    return `self_${res.join('')}${time+1}`;
  };
  const box = {
    type: 'box',
    name,
    fieldType,
    dateType: Number(fieldType) === 5 ? 1 : 0,
    options: Number(fieldType) === 2 || Number(fieldType) === 8 ? ['选项一', '选项二'] : [],
    field: idGenerator(),
    isSelect: true,
    id: -1,
    isWrite: false,
  };
  if (Number(fieldType) === 3) {
    Object.assign(box, {
      expandFieldVos: expand.map(it => { return {...it, parentId: box.field}; })
    });
  }
  const [, drag, preview] = useDrag({
    item: box,
    begin: () => {
      const useless = cardList.find((item) => item.id === -1);
      console.log('SelfStr -> cardList', cardList);
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      if (!useless) {
          changeCardList([...cardList, { ...box }]);
      }
      return box;
    },
    canDrag: () => Number(fieldType) !== 3 ||
      (Number(fieldType) === 3 && (cardList.findIndex(it => Number(it.fieldType) === 3) === -1)),
    end: (item, monitor) => {
      const result = monitor.getDropResult();
      console.log('result', result);
      const uselessIndex = cardList.findIndex((it) => it.id === -1);
      // if (Number(fieldType) === 8) {
      //   uselessIndex=cardList.length - 1;
      // }
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       *  2、如果否，则将占位元素删除
       */
      const items = monitor.getItem();
      if (monitor.didDrop()) {
          if (uselessIndex > -1) {
            if (uselessIndex-1 > 0 && Number(cardList[uselessIndex-1].fieldType) === 3) {
              cardList.splice(uselessIndex, 1);
              changeCardList(cardList);
              return;
            }
            cardList.splice(uselessIndex, 1, { ...monitor.getItem(), id: id++ });
          } else {
            const index = cardList.findIndex(it => Number(it.fieldType) === 3);
            const arr = cardList[index].expandFieldVos;
            const useIndex = arr.findIndex(it => it.field === items.field);
            arr.splice(useIndex, 1, { ...monitor.getItem(), id: id++, parentId: cardList[index].field });
            cardList.splice(index, 1, {
              ...cardList[index],
              expandFieldVos: arr,
            });
          }
          changeDragId(items.field);
      } else if (uselessIndex > -1 ) {
        if (Number(items.fieldType) !== 3) {
          cardList.splice(uselessIndex, 1);
        } else {
          if (uselessIndex-1 > 0 && Number(cardList[uselessIndex-1].fieldType) === 3) {
            cardList.splice(uselessIndex, 1);
            changeCardList(cardList);
            return;
          }
          cardList.splice(uselessIndex, 1, { ...monitor.getItem(), id: id++ });
        }
      } else {
        const index = cardList.findIndex(it => Number(it.fieldType) === 3);
        const arr = cardList[index].expandFieldVos;
        const useIndex = arr.findIndex(it => it.field === items.field);
        arr.splice(useIndex, 1);
        cardList.splice(index, 1, {
          ...cardList[index],
          expandFieldVos: arr,
        });
      }
      // 更新 cardList 数据源
      changeCardList(cardList);
    }
  });

  const handleAdd = (e) => {
    e.stopPropagation();
    const boxs = {
      name,
      fieldType,
      field: idGenerator(),
      dateType: Number(fieldType) === 5 ? 1 : 0,
      options: Number(fieldType) === 2 ? ['选项一', '选项二'] : [],
      isWrite: false,
    };
    if (Number(fieldType) === 3) {
      Object.assign(boxs, {
        expandFieldVos: expand.map(it => { return{...it, parentId: boxs.field}; })
      });
    }
    const uselessIndex = cardList.length;
    console.log('handleAdd -> cardList', cardList);
    if (uselessIndex-1 > 0 && Number(cardList[uselessIndex-1].fieldType) === 3) {
      return;
    }
    if (Number(fieldType) === 3 && (cardList.findIndex(it => Number(it.fieldType) === 3) === -1)) {
      changeCardList([...cardList, boxs]);
    }
  };
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  // 🈲️止明细
  const isDisabled = Number(fieldType) === 3 && (cardList.findIndex(it => Number(it.fieldType) === 3) > -1);
  return (
    <>
      <div
        className={isDisabled ? cs(style.selfStr, style.idDisabled) : style.selfStr}
        ref={drag}
        onClick={(e) => handleAdd(e)}
      >
        <i className={`${icon} iconfont m-l-16 m-r-12 c-black-65`} />
        <span>{name}</span>
      </div>
    </>
  );
}

export default SelfStr;
