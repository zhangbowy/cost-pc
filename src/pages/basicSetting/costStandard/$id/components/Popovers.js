import React, { PureComponent } from 'react';
import { Popover, Button } from 'antd';
import Search from 'antd/lib/input/Search';
import style from './index.scss';

const tabs = [
  {
    key: 0,
    value: '热门城市'
  },
  {
    key: 1,
    value: 'ABCDE'
  },
  {
    key: 2,
    value: 'FGHJ'
  },
  {
    key: 3,
    value: 'KLMNP'
  },
  {
    key: 4,
    value: 'QRSTW'
  },
  {
    key: 5,
    value: 'XYZ'
  }
];
const tabObj = {
  0: '热门城市',
  1: 'ABCDE',
  2: 'FGHJ',
  3: 'KLMNP',
  4: 'QRSTW',
  5: 'XYZ'
};
class Popovers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      popoverVisible,
      activeKey,
      hotCities,
      selectCitysCode,
      selectCitys,
      awAreaVos,
      searchValue,
      searchCityList,
      selectCitysList,
      handleCancel,
      handleOk,
      handleClose,
      handleCloseOut,
      handleChange,
      handleCity,
      handleTab,
      handleAdd,
      handleRef,
      cityLevel
    } = this.props;

    return (
      <div className={style.cities}>
        <Popover
          trigger="click"
          overlayClassName={style.popStyle}
          icon={false}
          visible={popoverVisible}
          title={null}
          placement="topLeft"
          content={
            <div className={style.popoverCity}>
              <div className={style.search}>
                <div className={style.inputs} ref={el => handleRef(el)}>
                  {selectCitys.map((item, index) => (
                    <div className={style.cityName} key={item.areaCode}>
                      <span>{item.areaName}</span>
                      <i
                        className="iconfont iconclose"
                        onClick={() => handleClose(index)}
                      />
                    </div>
                  ))}
                  <Search
                    placeholder="搜素城市名称"
                    value={searchValue}
                    className={style.searchBox}
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
              {searchValue ? (
                <div className={style.searchCityBox}>
                  {searchCityList.length ? (
                    searchCityList.map(item => (
                      <div
                        className={`${style.searchCityItem} ${
                          selectCitysCode.indexOf(item.areaCode) !== -1
                            ? style.activeSearchCity
                            : null
                        }`}
                        key={item.areaCode}
                        onClick={() => handleCity(item, 'search')}
                      >
                        {item.areaName}
                      </div>
                    ))
                  ) : (
                    <div className={style.emptyList}>未搜索到该城市</div>
                  )}
                </div>
              ) : (
                <>
                  <div className={style.menu}>
                    {tabs.map(item => (
                      <span
                        className={`${style.listMenu} ${
                          activeKey === item.key ? style.hover : null
                        }`}
                        key={item.key}
                        onClick={() => handleTab(item.key)}
                      >
                        {item.value}
                      </span>
                    ))}
                  </div>
                  <div className={style.cityList}>
                    {activeKey === 0
                      ? hotCities.map(item => (
                        <span
                          className={`${style.cityNames} ${
                              selectCitysCode.indexOf(item.areaCode) !== -1
                                ? style.activeCity
                                : null
                            }`}
                          key={item.areaCode}
                          onClick={() => handleCity(item)}
                        >
                          {item.areaName}
                        </span>
                        ))
                      : awAreaVos.map(i => {
                          if (tabObj[activeKey].indexOf(i.initials) !== -1) {
                            return (
                              <div className={style.cityBox}>
                                {i.awAreaList.map(item => (
                                  <span
                                    className={`${style.cityNames} ${
                                      selectCitysCode.indexOf(item.areaCode) !==
                                      -1
                                        ? style.activeCity
                                        : null
                                    }`}
                                    key={item.areaCode}
                                    onClick={() => handleCity(item)}
                                  >
                                    {item.areaName}
                                  </span>
                                ))}
                                <div className={style.cityInitial}>
                                  {i.initials}
                                </div>
                              </div>
                            );
                          }
                            return null;

                        })}
                  </div>
                  <div className={style.popoverFooter}>
                    <Button onClick={() => handleCancel()}>取消</Button>
                    <Button className={style.btn2} onClick={() => handleOk()}>
                      确定
                    </Button>
                  </div>
                </>
              )}
            </div>
          }
        >
          <div className={style.add} onClick={() => handleAdd()}>
            <i className="iconfont iconxinzengbaoxiao fs-14 fw-600 c-black-45 m-r-8" />
            <span className="fs-14 c-black-45">添加</span>
          </div>
        </Popover>
        { selectCitysList && selectCitysList.map((item) => (
          <div className={style.city}>
            <span className="fs-14" key={item.areaCode}>
              {item.areaName}
            </span>
            <i
              className="iconfont iconclose"
              onClick={() => handleCloseOut({...item, cityLevel})}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Popovers;
