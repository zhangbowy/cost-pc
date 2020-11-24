import React from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';
import style from './index.scss';

function FixedStr({ isSelect, name, field, disabled, cardList, changeCardList }) {
  const [, drag] = useDrag({
    item: {
      type: 'box',
      name,
      field,
    },
    begin: () => {
      const useless = cardList.find((item) => item.id === -1);
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      if (!useless) {
        changeCardList([{ name, ...field, id: -1 }, ...cardList]);
      }
      return {
        type: 'box',
        name,
        field,
      };
    },
    end: (item, monitor) => {
      // const datas = monitor.getItem();
      const didDrop = monitor.didDrop();
      const uselessIndex = cardList.findIndex(it => it.id === -1);
      if (!didDrop) {
        cardList.splice(uselessIndex, 1, {
          name,
          field,
        });
      } else {
        cardList.splice(uselessIndex, 1);
      }
      changeCardList(cardList);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging,
    }),
  });
  let pro = '';
  if (disabled) {
    pro = '必选';
  } else if (!disabled && isSelect) {
    pro = '已选';
  }
  return (
    <div className={isSelect ? cs(style.dragLabel, style.dragActive) : style.dragLabel} ref={drag}>
      <span className="c-black-65">{name}</span>
      <span className="fs-12 c-black-25">{pro}</span>
    </div>
  );
}

export default FixedStr;

