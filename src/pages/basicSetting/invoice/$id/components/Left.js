import React, { useState } from 'react';
import cs from 'classnames';
// import PropTypes from 'prop-types';
// import { useDrag } from 'react-dnd';
import style from './index.scss';
import FixedStr from './FixedStr';
import SelfStr from './SelfStr';

const title = [{
  key: 'show',
  value: '共有库'
}, {
  key: 'self',
  value: '自定义字段'
}];
const selfStr = [{
  key: '0',
  value: '单行文本',
  icon: 'icondanhangwenben',
}, {
  key: '1',
  value: '多行文本',
  icon: 'iconduohangwenben',
}, {
  key: '2',
  value: '单选',
  icon: 'icondanxuan',
}, {
  key: '5',
  value: '日期',
  icon: 'iconriqi',
}];
// import PropTypes from 'prop-types'

function Left({ fieldList, selectList, onChange }) {
  // const { fieldList } = props;
  const [active, setActive] = useState('show');
  // const [, drange] = useDrag({
  //   item: { type: 'Box' },
  // });
  const onHandle = (e) => {
    setActive(e);
  };
  return (
    <div className={style.left}>
      <div className={style.header}>
        {
          title.map(it => (
            <div
              className={it.key === active ? cs(style.titles, style.active) : style.titles}
              key={it.key}
              onClick={() => onHandle(it.key)}
            >
              <span>{it.value}</span>
              {
                it.key === 'show' &&
                <i className="iconfont iconIcon-yuangongshouce m-l-12 m-r-8" />
              }
            </div>
          ))
        }
      </div>
      <div className={style.leftCntDrag}>
        {
          active === 'show' ?
            <>
              {
                fieldList.map(it => (
                  <FixedStr
                    key={it.field}
                    name={it.name}
                    data={it}
                    selectList={selectList}
                    onChange={onChange}
                    isFixed={it.isFixed}
                    isSelect={it.isSelect}
                    disabled={it.disabled}
                  />
                ))
              }
            </>
            :
            <>
              {
                selfStr.map(item => (
                  <SelfStr
                    key={item.key}
                    fieldType={item.key}
                    name={item.value}
                    icon={item.icon}
                    selectList={selectList}
                    onChange={onChange}
                  />
                ))
              }
            </>
        }
      </div>
    </div>
  );
}

Left.propTypes = {

};

export default Left;

