/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React from 'react';
// import PropTypes from 'prop-types';
import cs from 'classnames';
import { Divider } from 'antd';
import update from 'immutability-helper';
import style from './index.scss';
// import Item from './Item';
import Card from '../Card';

function CountCmp({ expandFieldVos,
  isDragging, cardList,
  changeCardList, dragId, keyField, changeDragId, onDelete }) {
  const findChild = fields => {
    return expandFieldVos.findIndex(it => it.field === fields);
  };
  const moveChild = (drag, { field }) => {
    const dragIndex = cardList.findIndex(it => it.field === drag.field);
    const newArr = [...cardList];
    let child = [...expandFieldVos];
    const cIndex = expandFieldVos.findIndex(it => it.field === drag.field);
    if (drag.field && drag.field.indexOf('expand_') > -1) {
      return;
    }
    if (dragIndex > -1) {
      newArr.splice(dragIndex, 1);
    }
    const index = newArr.findIndex(it => Number(it.fieldType) === 3);
    const hover = child.findIndex(it => it.field === field);
    // if (hover-1 > 0 && child[hover-1].field === 'detail_account') {
    //   return;
    // }

    console.log('继续执行', field);
    if (!field) {
      return;
    }
    if (cIndex > -1) {
      child = update(child, {
        $splice: [[cIndex, 1], [hover, 0, drag]],
      });
    } else {
      child.splice(hover, 0, drag);
    }
    newArr.splice(index, 1, {
      ...newArr[index],
      expandFieldVos: child,
    });
    changeCardList(newArr,true);
  };


  return (
    <div
      className={
        dragId === keyField ?
        cs(style.StrTemplates, style.activeStr) : style.StrTemplates
      }
      style={{
        height: isDragging ? '116px' : 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (dragId !== keyField) {
          changeDragId(keyField);
        }
      }}
    >
      {
        dragId === keyField ?
          <p className={style.lines} />
          :
          <p className={style.linesD} />
      }
      <div className={style.tmpCnt}>
        <p style={{marginLeft: '12px'}}>
          <span className="fs-14 c-black-85 fw-500">明细</span>
          <span className="fs-12 c-black-45">（可拖入多个自定义组件，不包括明细组件）</span>
        </p>
        <Divider type="horizontal" style={{ margin: '16px -10px 15px 13px' }} />
        <div className={style.detailBottom}>
          {
            expandFieldVos.map((item, index) => (
              <Card
                {...item}
                key={item.field}
                data={{...item}}
                moveCard={moveChild}
                findCard={findChild}
                index={index}
                cardList={cardList}
                changeCardList={changeCardList}
                parentId={item.parentId}
                dragId={dragId}
                changeDragId={changeDragId}
                onDelete={onDelete}
                dragType='child'
                expandLength={expandFieldVos.length-1}
                className={style.childStr}
              />
            ))
          }
          <div className={style.proCenter}>
            <span>+ 添加明细</span>
          </div>
        </div>
      </div>
      <div className={style.operator}>
        <p
          className={cs(style.delete, 'm-r-8')}
          style={{ display: dragId === keyField ? 'block' : '' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(keyField);
          }}
        >
          <i className="iconfont iconshanchu" />
        </p>
        <p
          className={cs(style.delete,style.opacity, style.drag)}
          style={{ display: dragId === keyField ? 'block' : '' }}
        >
          <i className="iconfont icontuozhuai" />
        </p>
      </div>
    </div>
  );
}

CountCmp.propTypes = {

};

export default CountCmp;

