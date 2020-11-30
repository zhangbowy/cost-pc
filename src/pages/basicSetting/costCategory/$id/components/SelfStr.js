import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import style from './index.scss';
import { timeStampToHex } from '../../../../../utils/common';

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
    dateType: 1,
    options: Number(fieldType) === 2 ? ['选项一', '选项二'] : [],
    field: idGenerator(),
    isSelect: true,
    id: -1,
  };
  const [, drag, preview] = useDrag({
    item: box,
    begin: () => {
      const useless = cardList.find((item) => item.id === -1);
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      if (!useless) {
          changeCardList([...cardList, { ...box }]);
      }
      return box;
    },
    end: (item, monitor) => {
      const uselessIndex = cardList.findIndex((it) => it.id === -1);
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       *  2、如果否，则将占位元素删除
       */
      console.log('end', monitor.didDrop());
      if (monitor.didDrop()) {
          const items = monitor.getItem();
          cardList.splice(uselessIndex, 1, { ...monitor.getItem(), id: id++ });
          changeDragId(items.field);
      } else {
          cardList.splice(uselessIndex, 1);
      }
      // 更新 cardList 数据源
      changeCardList(cardList);
    }
  });

  const handleAdd = (e) => {
    e.stopPropagation();
    changeCardList([...cardList, {
      name,
      fieldType,
      field: idGenerator(),
      dateType: Number(fieldType) === 5 ? 1 : 0,
      options: Number(fieldType) === 2 ? ['选项一', '选项二'] : [],
      isWrite: false,
    }]);
  };
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <>
      <div className={style.selfStr} ref={drag} onClick={(e) => handleAdd(e)}>
        <i className={`${icon} iconfont m-l-16 m-r-12 c-black-65`} />
        <span>{name}</span>
      </div>
    </>
  );
}

export default SelfStr;
