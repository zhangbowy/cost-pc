/**
 * filename: List
 * overview: 用来存放下方 Card 列表的 List 组件
 */

import update from 'immutability-helper';
import React, {  useCallback, useRef } from 'react';
// import { useDrop } from 'react-dnd';
// import Card from './Card';
// import Templates from './Templates';
import Card from './Card';
import style from './index.scss';
import { defaultString } from '../../../../../utils/constants';



const StrCenter = ({cardList, changeCardList, dragId, changeDragId, spacialCenter}) => {
  const scrollNode = useRef(null);
  const defaultList =  spacialCenter || defaultString;
  const moveCard = useCallback((dragIndex, hoverIndex, { item, field }) => {
    /**
     * 1、如果此时拖拽的组件是 Box 组件，则 dragIndex 为 undefined，则此时修改，则此时修改 cardList 中的占位元素的位置即可
     * 2、如果此时拖拽的组件是 Card 组件，则 dragIndex 不为 undefined，此时替换 dragIndex 和 hoverIndex 位置的元素即可
     */
    if (hoverIndex-1 > 0 &&
      (Number(cardList[hoverIndex].fieldType) === 3 || Number(cardList[hoverIndex-1].fieldType) === 3)) {
      return;
    }
    if (dragIndex === -1) {
        const oldIndex = cardList.findIndex(it => Number(it.fieldType) === 3);
        const hoverI = cardList.findIndex(it => it.field === field);
        const arr = [...cardList];
        const newArr = cardList[oldIndex].expandFieldVos.filter(it => item.field !== it.field);
        arr.splice(oldIndex, 1, {
          ...cardList[oldIndex],
          expandFieldVos: newArr,
        });
        changeCardList(update(arr, {
            $splice: [[hoverI, 0, item]],
        }));
    } else {
        const dragCard = cardList[dragIndex];
        // if (Number(cardList[hoverIndex].fieldType) === 3) {
        //   return;
        // }
        changeCardList(update(cardList, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }));
    }
    // eslint-disable-next-line
  }, [cardList])

  const findCard = (field) => {
    return cardList.findIndex(it => it.field === field);
  };

  const onDelete = (field) => {
    const arr = [...cardList];
    // let flag = false;
    if (!defaultList.includes(field)) {
      const lessIndex = cardList.findIndex((item) => item.field === field);
      let newId = '';
      if (lessIndex > -1) {
        if (Number(arr[lessIndex].fieldType) === 3) {
          // flag = true;
        }
        arr.splice(lessIndex, 1);
        newId = arr[lessIndex-1].field;
        changeCardList(update(cardList, {
          $splice: [[lessIndex, 1]],
        }));
      } else {
        const i = arr.findIndex(it => Number(it.fieldType) === 3);
        const expand = arr[i].expandFieldVos;
        const ci = expand.findIndex(it => it.field === field);
        expand.splice(ci, 1);
        if (expand.length) {
          arr.splice(i, 1, {
            ...arr[i],
            expandFieldVos: expand,
          });
        } else {
          // flag = true;
          arr.splice(i, 1);
        }
        if (expand.length) {
          if (ci-1 > 0 || ci-1===0){
            newId = expand[ci-1].field;
          } else {
            newId = arr[i].field;
          }
        } else {
          newId = arr[i-1].field;
        }
        changeCardList(arr);
      }
      changeDragId(newId);
    }
  };

  return (
    <div className={style.contents} ref={scrollNode}>
      {
        cardList.map((item, index) =>(
          <Card
            {...item}
            key={item.field}
            data={{...item}}
            moveCard={moveCard}
            findCard={(val) => findCard(val)}
            dragId={dragId}
            changeDragId={changeDragId}
            onDelete={onDelete}
            index={index}
            cardList={cardList}
            changeCardList={changeCardList}
            defaultList={defaultList}
          />
        ))
      }
    </div>
  );
};

export default StrCenter;
