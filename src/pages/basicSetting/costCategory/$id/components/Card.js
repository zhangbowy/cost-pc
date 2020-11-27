/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/**
 * filename: Card
 * overview: 根据放入 Box 生成的 Card 组件
 */

import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import cs from 'classnames';
import style from './index.scss';
import { defaultString } from '../../../../../utils/constants';

// import OrderListSvg from '../../../../../assets/img/menuImg/dbzyhl.png';

const Card = ({ name, isWrite, index, moveCard, field, findCard, dragId, id, fieldType, changeDragId, onDelete, disabled, data }) => {
  // const ref = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
    canDrag: () => !defaultString.includes(field),
    // item 中包含 index 属性，则在 drop 组件 hover 和 drop 是可以根据第一个参数获取到 index 值
    item: { type: 'box', index, field, ...data, },
    end: (dropResult, monitor) => {
      const didDrop = monitor.didDrop();
      const { field: dropId } = monitor.getItem();
      if (!didDrop) {
        const hoverIndex = findCard(dropId);
        moveCard(hoverIndex, index);
      }
    }
  });

  const [, drop] = useDrop({
    accept: 'box',
    canDrop: () => !defaultString.includes(field),
    hover(item, monitor) {
      console.log(monitor);
      if (item.field !== field && !defaultString.includes(field)) {
        const hoverIndex = findCard(item.field);
        moveCard(hoverIndex, index);
      }
    },
  });
  const opacity = isDragging || (id === -1) ? 0 : 1;
  /**
   * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
   * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
   */
  const types = Number(fieldType);
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <div
      ref={(node) => drag(drop(node))}
      className={
        dragId === field ?
        cs(style.StrTemplates, style.activeStr) : style.StrTemplates
      }
      style={{
        opacity,
        cursor: defaultString.includes(field) ? 'default' : 'move',
      }}
      onClick={(e) => {
        e.stopPropagation();
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
      <span className={isWrite ? style.required : style.requireds}>*</span>
      <div className={style.tmpCnt}>
        <p className="fs-14 c-black-85">{name}</p>
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
      <div className={style.operator}>
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
        <p
          className={defaultString.includes(field) ?
          cs(style.delete,style.opacity, style.drag) :
          cs(style.delete, style.drag)}
          style={{ display: dragId === field ? 'block' : '' }}
        >
          <i className="iconfont icontuozhuai" />
        </p>
      </div>
    </div>
  );
};

export default Card;
