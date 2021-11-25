import React, { PureComponent } from 'react';
import Search from 'antd/lib/input/Search';
import { Popover } from 'antd';
import { connect } from 'dva';
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
@connect(({ costGlobal }) => ({
  cityList: costGlobal.cityList,
  levelCityList: costGlobal.levelCityList,
}))
class SearchCity extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      popoverVisible: false,
      hotCities: [],
      awAreaVos: [],
      selectCitys: [],
      selectCitysCode: [],
      activeKey: 0,
      searchCityList: [],
    };
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'costGlobal/cityList',
      payload: {},
    }).then(() => {
      const { cityList: { hotCities, awAreaVos } } = this.props;
      this.setState({
        hotCities,
        awAreaVos
      });
    });
  }

  handleChange = e => {
    this.setState({
      searchValue: e.target.value,
    });
    this.getCityList(e.target.value);
  }

  // 获取选择城市code
  getCityCode = selectCitys => {
    const citysCode = selectCitys.reduce((acc, cur) => {
      acc.push(cur.areaCode);
      return acc;
    }, []);
    this.setState({ selectCitysCode: citysCode });
  };

   // 选择城市确定
   handleOk = () => {
    const { selectCitys } = this.state;
    const arr = selectCitys.map(it => { return { areaCode: it.areaCode,areaName: it.areaName }; });
    console.log('SearchCity -> handleOk -> arr', arr);
    this.setState({
      // selectCitysList: [...selectCitys],
      popoverVisible: false,
      selectCitys: [],
      selectCitysCode: [],
    });
    if (arr.length) {
      this.props.onOk(arr[0]);
    } else {
      this.props.onOk({});
    }

  };

  handleCity = (item, flag) => {
    // console.log("🚀 ~ file: EditCity.js ~ line 130 ~ EditCity ~ item", item);
    const { selectCitysCode } = this.state;
    if (selectCitysCode.indexOf(item.areaCode) !== -1) {
      return;
    }
    const citys = [];
    citys.push(item);
    if (flag) {
      this.setState({
        searchValue: ''
      });
    }
    this.setState({ selectCitys: citys }, () => {
      this.handleOk();
    });
    this.getCityCode(citys);

    this.goToEnd();
  };

  getCityList = cityName => {
    this.props
      .dispatch({
        type: 'costGlobal/cityList',
        payload: { cityName: cityName || '' }
      })
      .then(() => {
        // console.log("城市列表：", this.props.cityList);
        const {
          hotCities, awAreaVos,
          resultCities
        } = this.props.cityList;
        const city = resultCities.reduce((acc, cur) => {
          acc.push(...cur.awAreaList);
          return acc;
        }, []);
        if (!cityName) {
          this.setState({
            hotCities, awAreaVos,
          });
        }
        this.setState({
          // hotCities,
          // awAreaVos,
          searchCityList: city
        });
      });
  };

  handleTab = (key) => {
    this.setState({
      activeKey: key,
    });
  }

  handleClose = () => {
    this.setState({
      selectCitys: [],
      selectCitysCode: [],
    });
  }

  handleCancel = () => {
    this.setState({
      popoverVisible: false,
    });
  }

  onShow = () => {
    this.props.dispatch({
      type: 'costGlobal/cityList',
      payload: {},
    }).then(() => {
      const { cityList: { hotCities, awAreaVos }, value } = this.props;
      this.setState({
        hotCities,
        awAreaVos,
        popoverVisible: true,
        selectCitys: value && value.areaCode ? [value] : [],
        selectCitysCode: value && value.areaCode ? [value.areaCode] : [],
      });
    });
  }

  goToEnd = () => {
    if (this.messagesEnd) {
      const { scrollHeight } = this.messagesEnd; // 里面div的实际高度
      console.log('this.messagesEnd', this.messagesEnd);
      console.log(
        '🚀 ~ file: EditCity.js ~ line 615 ~ EditCity ~ scrollHeight',
        scrollHeight
      );
      const height = this.messagesEnd.clientHeight; // 网页可见高度
      console.log(
        '🚀 ~ file: EditCity.js ~ line 617 ~ EditCity ~ height',
        height
      );
      const maxScrollTop = scrollHeight - height;
      console.log('🚀 ~ file: EditCity.js ~ line 617 ~ EditCity ~ maxScrollTop', maxScrollTop);
      this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      // 如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
    }
  };

  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { searchValue, activeKey, selectCitys, searchCityList, selectCitysCode,
      hotCities, awAreaVos, popoverVisible } = this.state;
    const { children } = this.props;
    return (
      <div className={style.cities}>
        <Popover
          trigger="click"
          overlayClassName={style.popStyle}
          icon={false}
          visible={popoverVisible}
          onVisibleChange={this.handleVisibleChange}
          title={null}
          placement="bottomLeft"
          content={
            <div className={style.popoverCity}>
              <div className={style.search}>
                <div className={style.inputs} ref={el => { this.messagesEnd = el; }}>
                  {selectCitys.map((item, index) => (
                    <div className={style.cityName} key={item.areaCode}>
                      <span>{item.areaName}</span>
                      <i
                        className="iconfont iconclose"
                        onClick={() => this.handleClose(index)}
                      />
                    </div>
                  ))}
                  <Search
                    placeholder="搜素城市名称"
                    value={searchValue}
                    className={style.searchBox}
                    onChange={e => this.handleChange(e)}
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
                        onClick={() => this.handleCity(item, 'search')}
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
                        onClick={() => this.handleTab(item.key)}
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
                          onClick={() => this.handleCity(item)}
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
                                    onClick={() => this.handleCity(item)}
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
                    {/* <Button onClick={() => this.handleCancel()}>取消</Button> */}
                    {/* <Button className={style.btn2} onClick={() => this.handleOk()}>
                      确定
                    </Button> */}
                  </div>
                </>
              )}
            </div>
          }
        >
          <span className={style.add} onClick={e => this.onShow(e)}>
            {children}
          </span>
        </Popover>
      </div>
    );
  }
}

export default SearchCity;

