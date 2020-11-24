/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import cs from 'classnames';
import style from './index.scss';
// import OrderListSvg from '../../../../../assets/img/menuImg/dbzyhl.png';
// import PreviewTemp from './PreviewTemp';

function Templates({ name, moveCard, isWrite, dragId, onChange, index, field, disabled, onDelete }) {
  // const originalIndex = findCard(id).index;
  const ref = useRef();
  const [ , drag] = useDrag({
      item: {
        type: 'box',
        field,
        index
      },
      canDrag: () => {
        return !disabled;
      }
  });
  const [, drop] = useDrop({
      accept: 'box',
      canDrop: () => {
        return !disabled;
      },
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        console.log('hover -> dragIndex', dragIndex);
        const hoverIndex = index;
        console.log('hover -> hoverIndex', hoverIndex);

        // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
        if (dragIndex === hoverIndex) {
            return;
        }

        // 确定屏幕上矩形范围
        const hoverBoundingRect = ref.current ? ref.current.getBoundingClientRect() : null;
        // console.log('hover -> hoverBoundingRect', hoverBoundingRect);

        // 获取中点垂直坐标
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // 确定鼠标位置
        const clientOffset = monitor.getClientOffset();
        // console.log('hover -> clientOffset', clientOffset);

        // 获取距顶部距离
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        /**
         * 只在鼠标越过一半物品高度时执行移动。
         *
         * 当向下拖动时，仅当光标低于50%时才移动。
         * 当向上拖动时，仅当光标在50%以上时才移动。
         *
         * 可以防止鼠标位于元素一半高度时元素抖动的状况
         */

        // 向下拖动
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // 向上拖动
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        console.log('hover -> hoverIndex', hoverIndex);
        // 执行 move 回调函数
        moveCard(dragIndex, hoverIndex);

        /**
         * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
         * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
         */
        if (item.index !== undefined) {
            item.index = hoverIndex;
        }
      },
  });
  drag(drop(ref));
//   const svgStyle = {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     top: 6,
//     left: 6,
//     cursor: 'move'
//   };

//   const styles = useMemo(() => ({
//     position: 'relative',
//     margin: '16px 6px',
//     // Card 为占位元素是，透明度 0.4，拖拽状态时透明度 0.2，正常情况透明度为 1
//     opacity: field === -1 ? 0.4 : isDragging ? 0.2 : 1,
//     padding: '20px 0px',
//     verticalAlign: 40,
//     width: 'inherit',
// }), [ field, isDragging]);
  // const display = isDragging ? 'block' : 'none';
  // console.log(opacity, originalIndex);

  return (
    <div
      className={style.StrTemplates}
      ref={ref}
      // style={styles}
      onClick={(e) => {
        e.stopPropagation();
        onChange('selectId', field, 'del');
      }}
    >
      {
        dragId === field ?
          <p className={style.lines} />
          :
          <p className={style.linesD} />
      }
      {
        isWrite &&
        <span className={style.required}>*</span>
      }
      <div className={style.tmpCnt}>
        <p className="fs-14 c-black-85">{name}</p>
        <div className={style.inputs}>
          <span className="fs-14 c-black-25">请选择</span>
          <i className="iconfont icondown c-black-25" />
        </div>
      </div>
      <div className={style.operator}>
        <p
          className={disabled ? cs(style.delete,style.opacity) : style.delete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(field, disabled);
          }}
        >
          <i className="iconfont iconshanchu" />
        </p>
      </div>
    </div>
  );
}

Templates.propTypes = {

};

export default Templates;

