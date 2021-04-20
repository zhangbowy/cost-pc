/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/**
 * filename: Card
 * overview: 根据放入 Box 生成的 Card 组件
 */

import React, { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import cs from 'classnames';
import { Popconfirm } from 'antd';
import style from './index.scss';
import { defaultString, dragDisabled, applyDefault } from '../../../../../utils/constants';
import CountCmp from './CountCmp';
import CountChild from './CountCmp/CountChild';

// import OrderListSvg from '../../../../../assets/img/menuImg/dbzyhl.png';

const Card = ({ name, isWrite, index,
  moveCard, field, findCard, dragId, id,
  fieldType, changeDragId, onDelete, disabled, data,
  expandFieldVos, cardList, changeCardList, parentId,
  dragType, className}) => {
    const ref = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
    canDrag: () => !defaultString.includes(field) && !dragDisabled.includes(field),
    // item 中包含 index 属性，则在 drop 组件 hover 和 drop 是可以根据第一个参数获取到 index 值
    item: { ...data, type: dragType || 'parent', index, field,  },
    end: (dropResult, monitor) => {
      const didDrop = monitor.didDrop();
      const { field: dropId } = monitor.getItem();
      const item = monitor.getItem();
      if (!didDrop) {
        const hoverIndex = findCard(dropId);
        // if (Number(types) === 8) {
        //   hoverIndex = findCard(Number(types));
        // }
        moveCard(hoverIndex, index, { item, field: dropId });
      }
    }
  });

  const [, drop] = useDrop({
    accept: dragType === 'child' ? ['child', 'box'] : ['box', 'parent'],
    canDrop: () => !defaultString.includes(field),
    hover(item, monitor) {
      if (Number(item.fieldType) === 3) {
        return;
      }
      if (!ref.current) {
        return;
      }
      const dragIndex = findCard(item.field);
      console.log('hover -> item', dragIndex);
      const hoverIndex = index;
      console.log('hover -> item', hoverIndex);

      if (dragIndex === hoverIndex) {
        return;
      }
       // Determine rectangle on screen
       const hoverBoundingRect = ref.current ? ref.current.getBoundingClientRect() : null;
       // Get vertical middle
       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
       // Determine mouse position
       const clientOffset = monitor.getClientOffset();
       // Get pixels to the top
       const hoverClientY = clientOffset.y - hoverBoundingRect.top;
       // Only perform the move when the mouse has crossed half of the items height
       // When dragging downwards, only move when the cursor is below 50%
       // When dragging upwards, only move when the cursor is above 50%
       // Dragging downwards
       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && dragIndex !== -1) {
          return;
       }
       // Dragging upwards
       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
       }
      if (dragType === 'child' && (item.field.indexOf('expand') > -1 ||
      applyDefault.includes(item.field))) {
        return;
      }
      if (dragType !== 'child') {
        if (item.field !== field && !defaultString.includes(field)) {
          const hoverIndexs = findCard(item.field);
          moveCard(hoverIndexs, index, { item, field });
        }
      } else if (item.field !== field && !defaultString.includes(field)) {
        if (!parentId || item.field.indexOf('expand_') > -1) {
          const hoverIndexs = findCard(item.field);
          moveCard(hoverIndexs, index, { item, field });
        } else {
          console.log('走这里-明细');
          moveCard(item, { parentId, field });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  // console.log('card->out', parentId);
  const opacity = isDragging || (id === -1) ? 0 : 1;
  /**
   * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
   * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
   */
  const types = Number(fieldType);
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  drag(drop(ref));
  return (
    <>
      {
        types === 3 && id !== -1 &&
        <CountCmp
          types={8}
          expandFieldVos={expandFieldVos}
          findCard={findCard}
          moveCard={moveCard}
          {...data}
          isDragging={isDragging || (id === -1)}
          cardList={cardList}
          changeCardList={changeCardList}
          dragId={dragId}
          keyField={data.field}
          changeDragId={changeDragId}
          onDelete={onDelete}
        />
      }
      {
        types !== 3 && field !== 'detail_sale' && field !== 'detail_account' &&
        <div
          ref={ref}
          className={
            dragId === field ?
            cs(style.StrTemplates, style.activeStr, className) : cs(style.StrTemplates, className)
          }
          style={{
            opacity,
            cursor: defaultString.includes(field) ? 'default' : 'move',
            margin: dragType === 'child' ? '0 0 0 12px' : '0 24px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log('子组件', field);
            changeDragId(field, true);
          }}
        >
          {/* { field !== -1 && drag && drag(<img alt="" src={OrderListSvg} style={svgStyle} />) } */}
          {
            dragId === field ?
              <p className={style.lines} />
              :
              <p className={style.linesD} />
          }
          {
            !dragDisabled.includes(field) &&
            <>
              <span className={isWrite ? style.required : style.requireds}>*</span>
              <div className={style.tmpCnt}>
                {
                  types !== 3 &&
                  <p className="fs-14 c-black-85">{name}</p>
                }
                {
                  types === 2 &&
                  <div className={style.inputs}>
                    <span className="fs-14 c-black-25">请选择</span>
                    <i className="iconfont icondown c-black-25" />
                  </div>
                }
                {
                  types === 5 &&
                  <div className={style.dateType}>
                    <i className="iconfont iconriqi c-black-25 m-r-8" />
                    <span className="fs-14 c-black-25">请选择</span>
                  </div>
                }
                {
                  (types === 0 || types === 1) &&
                  <div className={style.inputs}>
                    <span className="fs-14 c-black-25">请输入</span>
                    {/* <i className="iconfont icondown c-black-25" /> */}
                  </div>
                }
                {
                  (types === 6 || types === 7) &&
                  <div className={style.images}>
                    <i className="iconfont iconxinzengbaoxiao" />
                  </div>
                }
              </div>
            </>
          }
          {
            field === 'detail_money' &&
            <CountChild />
          }
          <div className={style.operator}>
            {
              !dragDisabled.includes(field) &&
                <p
                  className={
                    defaultString.includes(field) ?
                    cs(style.delete,style.opacity, 'm-r-8') : cs(style.delete, 'm-r-8')
                  }
                  style={{ display: dragId === field ? 'block' : '' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(field, disabled);
                  }}
                >
                  <i className="iconfont iconshanchu" />
                </p>
            }
            {
              field === 'detail_money' &&
                <Popconfirm
                  title="将同步删除明细组件，请先添加任意组件后再行删除"
                  onConfirm={(e) => {
                    e.stopPropagation();
                    onDelete(field, disabled);
                  }}
                >
                  <p
                    className={
                      defaultString.includes(field) ?
                      cs(style.delete,style.opacity, 'm-r-8') : cs(style.delete, 'm-r-8')
                    }
                    style={{ display: dragId === field ? 'block' : '' }}
                  >
                    <i className="iconfont iconshanchu" />
                  </p>
                </Popconfirm>
            }
            <p
              className={defaultString.includes(field) ||
              types === 3 || field === 'detail_money' ?
              cs(style.delete,style.opacity, style.drag) :
              cs(style.delete, style.drag)}
              style={{ display: dragId === field ? 'block' : '' }}
            >
              <i className="iconfont icontuozhuai" />
            </p>
          </div>
        </div>
      }
    </>
  );
};

export default Card;
