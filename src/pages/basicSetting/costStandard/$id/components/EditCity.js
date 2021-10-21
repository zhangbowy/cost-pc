import React, { PureComponent } from 'react';
import { Modal, message, Button } from 'antd';
// import Search from 'antd/lib/input/Search';
import { connect } from 'dva';
import Lines from '@/components/StyleCom/Lines';
import style from './index.scss';
import Popovers from './Popovers';
import fields from '../../../../../utils/fields';

const { cityLevel } = fields;
@connect(({ costGlobal }) => ({
  cityList: costGlobal.cityList,
  levelCityList: costGlobal.levelCityList,
}))
class EditCity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      popoverVisible: false,
      searchValue: '', // 输入框搜索值
      searchCityList: [], // 符合搜索条件的城市列
      activeKey: 0, // tab
      selectCitysList: [], // 确定已选择的城市(展示)
      selectCitys: [], // 选择城市
      selectCitysCode: [], // 选择城市code
      hotCities: [], // 热门城市
      awAreaVos: [], // 城市列
      level: '',
    };
  }

  onShow = () => {
    this.props.dispatch({
      type: 'costGlobal/levelCityList',
      payload: {},
    }).then(() => {
      this.props
      .dispatch({
        type: 'costGlobal/cityList',
        payload: {}
      }).then(() => {
        console.log(this.props.cityList);
        const {
          hotCities, awAreaVos,
        } = this.props.cityList;
        this.setState({
          visible: true,
          hotCities,
          awAreaVos
        });
      });
    });

  };

  getCitys= () => {
    this.props.dispatch({
      type: 'costGlobal/levelCityList',
      payload: {},
    }).then(() => {

    });
  }

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

  // 点击选择城市
  handleCity = (item, flag) => {
    // console.log("🚀 ~ file: EditCity.js ~ line 130 ~ EditCity ~ item", item);
    const { selectCitysCode, selectCitys } = this.state;
    if (selectCitysCode.indexOf(item.areaCode) !== -1) {
      return;
    }
    const citys = [...selectCitys];
    citys.push(item);
    if (flag) {
      this.setState({
        searchValue: ''
      });
    }
    this.setState({ selectCitys: citys });
    this.getCityCode(citys);

    this.goToEnd();
  };

  // popover组件内删除城市
  handleClose = index => {
    const { selectCitys } = this.state;
    const citys = [...selectCitys];
    citys.splice(index, 1);
    this.setState({ selectCitys: citys });
    this.getCityCode(citys);
  };

  // popover组件外删除城市
  handleCloseOut = item => {
    // const { selectCitysList } = this.state;
    // const selectCity = selectCitysList;
    // selectCity.splice(index, 1);
    // this.setState({ selectCitysList: selectCity }, () => {
    //   this.handleClose(index);
    // });
    this.props.dispatch({
      type: 'costGlobal/delCityLevel',
      payload: {
        areaCode: item.areaCode,
        level: item.cityLevel,
      }
    }).then(() => {
      message.success('删除成功');
      this.getCitys();
    });
  };

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
    const { selectCitys, level } = this.state;
    console.log('handleOk -> selectCitys', selectCitys);
    const arr = selectCitys.map(it => { return { areaCode: it.areaCode,areaName: it.areaName }; });
    if (arr.length) {
      this.props.dispatch({
        type: 'costGlobal/editCityLevel',
        payload: {
          cityLevel: level,
          cities: arr,
        }
      }).then(() => {
        message.success('修改成功');
        this.getCitys();
        this.setState({
          // selectCitysList: [...selectCitys],
          popoverVisible: false,
          selectCitys: [],
          selectCitysCode: [],
          selectCitysList: [],
        });
      });
    }
  };

  // 选择城市取消
  handleCancel = () => {
    this.setState({ popoverVisible: false });
  };

  // 城市搜索
  handleChange = e => {
    this.setState({ searchValue: e.target.value });
    this.getCityList(e.target.value);
  };

  // //tab切换
  handleTab = key => {
    this.setState({ activeKey: key });
  };

  // 添加按钮
  handleAdd = (level) => {
    const { selectCitysList } = this.state;
    this.setState(
      {
        popoverVisible: true,
        selectCitys: [...selectCitysList],
        level,
      },
      () => {
        const { selectCitys } = this.state;
        this.getCityCode(selectCitys);
      }
    );
  };

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

  onCancel = () => {
    this.setState({
      visible: false,
      popoverVisible: false,
      searchValue: '', // 输入框搜索值
      searchCityList: [], // 符合搜索条件的城市列
      activeKey: 0, // tab
      selectCitysList: [], // 确定已选择的城市(展示)
      selectCitys: [], // 选择城市
      selectCitysCode: [], // 选择城市code
      hotCities: [], // 热门城市
      awAreaVos: [], // 城市列
      level: '',
    });
  }

  render() {
    const { children, levelCityList } = this.props;
    const {
      visible,
      popoverVisible,
      activeKey,
      hotCities,
      selectCitysCode,
      selectCitys,
      awAreaVos,
      // selectCitysList,
      searchValue,
      searchCityList,
      level,
    } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="编辑城市"
          visible={visible}
          bodyStyle={{
            height: '491px',
            padding: '0 24px',
            overflowY: 'scroll'
          }}
          width="780px"
          onCancel={this.onCancel}
          footer={[
            <Button type="default" onClick={this.onCancel}>取消</Button>
          ]}
        >
          {
            levelCityList.length && levelCityList.map(it => (
              <div className={style.addCity}>
                <Lines name={`${it.cityLevel && cityLevel[it.cityLevel] && cityLevel[it.cityLevel].name}（${it.cityCount}个）`} />
                <Popovers
                  cityLevel={it.cityLevel}
                  popoverVisible={popoverVisible && (it.cityLevel === level)}
                  activeKey={activeKey}
                  hotCities={hotCities}
                  selectCitysCode={selectCitysCode}
                  selectCitys={selectCitys}
                  awAreaVos={awAreaVos}
                  searchValue={searchValue}
                  searchCityList={searchCityList}
                  selectCitysList={it.cities}
                  handleCancel={this.handleCancel}
                  handleOk={this.handleOk}
                  handleClose={this.handleClose}
                  handleCloseOut={this.handleCloseOut}
                  handleChange={this.handleChange}
                  handleCity={this.handleCity}
                  handleTab={this.handleTab}
                  handleAdd={() => this.handleAdd(it.cityLevel)}
                  handleRef={el => {
                    this.messagesEnd = el;
                  }}
                />
              </div>
            ))
          }
        </Modal>
      </span>
    );
  }
}

export default EditCity;
