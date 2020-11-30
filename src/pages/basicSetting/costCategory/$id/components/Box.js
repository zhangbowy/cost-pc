/**
 * filename: Box
 * overview: 用来承载界面最上方水果类型的 Box 组件
 */

import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';
import { getEmptyImage } from 'react-dnd-html5-backend';
import style from './index.scss';
// import PreviewBox from './PreviewBox';

let id = 1;

const Box = ({field, name, cardList, changeCardList, isSelect, disabled, data, changeDragId}) => {
  const box = {
    field,
    name,
    type: 'box',
    ...data,
    id: -1
  };
  const [, drag, preview] = useDrag({
    item: box,
    canDrag: () => !isSelect,
    begin() {
        const useless = cardList.find((item) => item.id === -1);
        // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
        if (!useless) {
          changeCardList([...cardList, { name, field, id: -1, isSelect: true }]);
        }
        return box;
    },
    end(_, monitor) {
      const uselessIndex = cardList.findIndex((item) => item.id === -1);
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       *  2、如果否，则将占位元素删除
       */
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
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  let pro = '';
  if (disabled) {
    pro = '已选';
  } else if (!disabled && isSelect) {
    pro = '已选';
  }
  return (
    <>
      <div className={isSelect ? cs(style.dragLabel, style.dragActive) : style.dragLabel} ref={drag}>
        <span className="c-black-65">{name}</span>
        <span className="fs-12 c-black-25">{pro}</span>
      </div>
    </>
  );
};

export default Box;
