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

const style = {
    backgroundColor: 'white',
    border: '1px dashed gray',
    margin: '100px auto',
    minHeight: '300px',
	padding: '0 10px',
    textAlign: 'center',
    width: 300
};

const StrCenter = ({cardList, changeCardList, findCard, dragId}) => {

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
            console.log('moveCard -> cardList', cardList);
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
    console.log('StrCenter -> cardList', cardList);

    return (
      <div style={style} ref={drop} className={style.contents}>
        {
          cardList.map((item, index) =>(
            <Card
              key={item.field}
              id={`${item.field}`}
              name={item.name}
              isWrite={item.isWrite}
              moveCard={moveCard}
              findCard={(val) => findCard(val)}
              dragId={dragId}
              onClick={changeCardList}
              index={index}
            />
          ))
        }
      </div>
    );
};

export default StrCenter;
