/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/**
 * filename: Card
 * overview: 根据放入 Box 生成的 Card 组件
 */

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import style from './index.scss';

import OrderListSvg from '../../../../../assets/img/menuImg/dbzyhl.png';

const svgStyle = {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 6,
    left: 6,
    cursor: 'move'
};

const Card = ({ name, isWrite, index, moveCard, id }) => {
    const ref = useRef(null);

    const [, drag, dragPreview] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        // item 中包含 index 属性，则在 drop 组件 hover 和 drop 是可以根据第一个参数获取到 index 值
        item: { type: 'box', index },
    });

    const [, drop] = useDrop({
        accept: 'box',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            console.log('hover -> dragIndex', dragIndex);
            const hoverIndex = index;

            // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
            if (dragIndex === hoverIndex) {
                return;
            }

            // 确定屏幕上矩形范围
            const hoverBoundingRect = ref.current ? ref.current.getBoundingClientRect() : {};
            console.log('hover -> hoverBoundingRect', hoverBoundingRect);

            // 获取中点垂直坐标
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            console.log('hover -> hoverMiddleY', hoverMiddleY);

            // 确定鼠标位置
            const clientOffset = monitor.getClientOffset();
            console.log('hover -> clientOffset', clientOffset);

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

    // const style = useMemo(() => ({
    //     position: 'relative',
    //     background: bg,
    //     margin: '16px 6px',
    //     // Card 为占位元素是，透明度 0.4，拖拽状态时透明度 0.2，正常情况透明度为 1
    //     opacity: id === -1 ? 0.4 : isDragging ? 0.2 : 1,
    //     padding: '20px 0px',
    //     verticalAlign: 40,
    //     width: 288,
    // }), [bg, id, isDragging]);

    /**
     * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
     * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
     */
    dragPreview(drop(ref));

    return (
      <div ref={ref} className={style.StrTemplates}>
        { id !== -1 && drag && drag(<img alt="" src={OrderListSvg} style={svgStyle} />) }
        {/* {
          dragId === id ?
            <p className={style.lines} />
            :
            <p className={style.linesD} />
        } */}
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
          <p className={style.delete}>
            <i className="iconfont iconshanchu" />
          </p>
        </div>
      </div>
    );
};

export default Card;
