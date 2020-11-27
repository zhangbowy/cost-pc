/**
 * filename: List
 * overview: 用来存放下方 Card 列表的 List 组件
 */

import update from 'immutability-helper';
import React, {  useCallback } from 'react';
import { useDrop } from 'react-dnd';
// import Card from './Card';
// import Templates from './Templates';
import Card from './Card';
import style from './index.scss';

const StrCenter = ({cardList, changeCardList, dragId, changeDragId}) => {
  const [, drop ] = useDrop({
      accept: 'box'
  });
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    /**
     * 1、如果此时拖拽的组件是 Box 组件，则 dragIndex 为 undefined，则此时修改，则此时修改 cardList 中的占位元素的位置即可
     * 2、如果此时拖拽的组件是 Card 组件，则 dragIndex 不为 undefined，此时替换 dragIndex 和 hoverIndex 位置的元素即可
     */
    if (dragIndex === undefined) {
        const lessIndex = cardList.findIndex((item) => item.id === -1);
        changeCardList(update(cardList, {
            $splice: [[lessIndex, 1], [hoverIndex, 0, { field: '1111', name: '费用礼拜', fieldType: 1, id: -1 }]],
        }));
    } else {
        const dragCard = cardList[dragIndex];
        changeCardList(update(cardList, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }));
    }
    // eslint-disable-next-line
  }, [cardList])

  const findCard = (field) => {
    return cardList.findIndex(it => it.field === field);
  };

  const onDelete = (field, disabled) => {
    const arr = [...cardList];
    if (!disabled) {
      const lessIndex = cardList.findIndex((item) => item.field === field);
      arr.splice(lessIndex, 1);
      const newId = arr[lessIndex-1].field;
      changeCardList(update(cardList, {
        $splice: [[lessIndex, 1]],
      }));
      changeDragId(newId);
    }
  };
  return (
    <div ref={drop} className={style.contents}>
      {
        cardList.map((item, index) =>(
          <Card
            {...item}
            key={item.field}
            moveCard={moveCard}
            findCard={(val) => findCard(val)}
            dragId={dragId}
            changeDragId={changeDragId}
            onDelete={onDelete}
            index={index}
          />
        ))
      }
    </div>
  );
};

export default StrCenter;
