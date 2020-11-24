import React from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';
import style from './index.scss';

function FixedStr({ isSelect, name, disabled, data, selectList, onChange }) {
  const [, drag] = useDrag({
    item: {
      type: 'box',
      ...data,
    },
    canDrag: () => {
      return isSelect;
    },
    begin: () => {
      const useless = selectList.find((item) => item.id === -1);
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      if (!useless) {
          onChange('selectList', [{ name, ...data, id: -1 }, ...selectList]);
      }
      return {
        type: 'box',
        ...data
      };
    },
    end: (item, monitor) => {
      // const datas = monitor.getItem();
      const didDrop = monitor.didDrop();
      console.log('FixedStr -> didDrop', didDrop);
      const uselessIndex = selectList.findIndex(it => it.id === -1);
      const arr = [...selectList];
      if (didDrop) {
        arr.splice(uselessIndex, 1, { ...data });
      } else {
        arr.splice(uselessIndex, 1);
      }
      onChange('selectList', arr);
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
    <div className={isSelect ? cs(style.dragLabel, style.dragActive) : style.dragLabel} ref={(node) => drag(node)}>
      <span className="c-black-65">{name}</span>
      <span className="fs-12 c-black-25">{pro}</span>
    </div>
  );
}

export default FixedStr;

