/**
 * filename: Container
 * overview: 整个拖拽演示界面
 */

import React, { useState } from 'react';
import cs from 'classnames';
import style from './index.scss';
// import FixedStr from './FixedStr';
// import SelfStr from '../../../invoice/$id/components/SelfStr';
import StrCenter from './Center';
import Box from './Box';

// const boxs = [
//   { id: 1, category: 'Apple', bg: 'red' },
//   { id: 2, category: 'Banana', bg: 'yellow' },
//   { id: 3, category: 'Orange', bg: 'orange' },
//   { id: 4, category: 'Grape', bg: 'purple' },
//   { id: 5, category: 'Watermelon', bg: 'green' },
//   { id: 6, category: 'Peach', bg: 'pink' },
// ];
const title = [{
  key: 'show',
  value: '共有库'
}, {
  key: 'self',
  value: '自定义字段'
}];
// const selfStr = [{
//   key: '0',
//   value: '单行文本',
//   icon: 'icondanhangwenben',
// }, {
//   key: '1',
//   value: '多行文本',
//   icon: 'iconduohangwenben',
// }, {
//   key: '2',
//   value: '单选',
//   icon: 'icondanxuan',
// }, {
//   key: '5',
//   value: '日期',
//   icon: 'iconriqi',
// }];

const StrSetting = ({ fieldList, selectList }) => {
    const [cardList, setCardList] = useState(selectList);
    const [active, setActive] = useState('show');
    // const [, drange] = useDrag({
    //   item: { type: 'Box' },
    // });
    const onHandle = (e) => {
      setActive(e);
    };
    const changeCardList = (list) => {
        setCardList([...list]);
    };

    return (
      <>
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
              fieldList.map((item) => <Box key={item.field} {...item} cardList={cardList} changeCardList={changeCardList} />)
            }
            {/* {
              active === 'show' ?
                <>
                  {
                    fieldList.map(it => (
                      <FixedStr
                        key={it.field}
                        {...it}
                        cardList={cardList}
                        changeCardList={changeCardList}
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
                        cardList={cardList}
                        changeCardList={changeCardList}
                      />
                    ))
                  }
                </>
            } */}
          </div>
        </div>
        <div className={style.strCenter}>
          <div className={style.header}>
            <span className="fs-16 c-black-85 fw-500">表单内容</span>
            <div className={style.pro}>
              <span>
                <i className="iconfont iconinfo-cirlce" />
                <span>请拖拽左侧添加控件</span>
              </span>
              <i className="iconfont iconclose" />
            </div>
          </div>
          <StrCenter cardList={cardList} changeCardList={changeCardList} />
        </div>
      </>
    );
};

export default StrSetting;
