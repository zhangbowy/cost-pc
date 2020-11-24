import React from 'react';
import { useDrag } from 'react-dnd';
// import moment from 'moment';
import style from './index.scss';
import { timeStampToHex } from '../../../../../utils/common';
// import Templates from './templates';

function SelfStr({ name, icon, fieldType, selectList, onChange }) {
  const idGenerator = () => {
    let qutient = 10000;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    const time = timeStampToHex();

    return `self_${res.join('')}${time+1}`;
  };

  const [, drag] = useDrag({
    item: {
      type: 'box',
      name,
      fieldType,
      dateType: 1,
      options: Number(fieldType) === 2 ? ['选项一', '选项二'] : []
    },
    begin: () => {
      const useless = selectList.find((item) => item.id === -1);
      // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
      if (!useless) {
          console.log('SelfStr -> useless', useless);
          onChange('selectList', [{
            name, id: -1,
            fieldType,
            field: idGenerator(),
            dateType: 1,
            options: Number(fieldType) === 2 ? ['选项一', '选项二'] : []
          }, ...selectList]);
      }
      return {
        type: 'box',
        name,
        fieldType,
        isSelect: true,
        field: idGenerator(),
      };
    },
    end: (item, monitor) => {
      const datas = monitor.getItem();
      // console.log('SelfStr -> datas', datas);
      const didDrop = monitor.didDrop();
      console.log('SelfStr -> didDrop', didDrop);
      const uselessIndex = selectList.findIndex(it => it.id === -1);
      if (didDrop) {
        selectList.splice(uselessIndex, 1, { ...datas });
      } else {
        selectList.splice(uselessIndex, 1);
      }
      console.log('SelfStr -> selectList', selectList);
      onChange('selectList', selectList);
    }
  });

  const handleAdd = (e) => {
    e.stopPropagation();
    onChange('selectList', [...selectList, {
      name,
      fieldType,
      field: idGenerator(),
      dateType: 1,
      options: Number(fieldType) === 2 ? ['选项一', '选项二'] : []
    }]);
  };
  return (
    <>
      <div className={style.selfStr} ref={drag} onClick={(e) => handleAdd(e)}>
        <i className={`${icon} iconfont m-l-8 m-r-8`} />
        <span>{name}</span>
      </div>
    </>
  );
}

export default SelfStr;
