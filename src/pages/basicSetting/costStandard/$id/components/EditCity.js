import React, { PureComponent } from 'react';
import { Modal } from 'antd';
// import Search from 'antd/lib/input/Search';
import { connect } from 'dva';
import Lines from '@/components/StyleCom/Lines';
import style from './index.scss';
import Popovers from './Popovers';

@connect(({ costGlobal }) => ({
  cityList: costGlobal.cityList
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
      hotCities: [
        // 热门城市
        {
          id: 2,
          areaCode: 110100,
          areaName: '北京市',
          level: 2,
          cityCode: '010',
          center: '116.407394,39.904211',
          pid: 110000,
          initials: 'B',
          isHot: true,
          last: false
        },
        {
          id: 793,
          areaCode: 310100,
          areaName: '上海市',
          level: 2,
          cityCode: '021',
          center: '121.473662,31.230372',
          pid: 310000,
          initials: 'S',
          isHot: true,
          last: false
        },
        {
          id: 811,
          areaCode: 320100,
          areaName: '南京市',
          level: 2,
          cityCode: '025',
          center: '118.796682,32.05957',
          pid: 320000,
          initials: 'N',
          isHot: true,
          last: false
        },
        {
          id: 921,
          areaCode: 330100,
          areaName: '杭州市',
          level: 2,
          cityCode: '0571',
          center: '120.209789,30.24692',
          pid: 330000,
          initials: 'H',
          isHot: true,
          last: false
        },
        {
          id: 2237,
          areaCode: 500100,
          areaName: '重庆市',
          level: 2,
          cityCode: '023',
          center: '106.551643,29.562849',
          pid: 500000,
          initials: 'C',
          isHot: true,
          last: false
        }
      ],
      awAreaVos: [
        // 城市列
        {
          initials: 'A',
          awAreaList: [
            {
              id: 460,
              areaCode: 152900,
              areaName: '阿拉善盟',
              level: 2,
              cityCode: '0483',
              center: '105.728957,38.851921',
              pid: 150000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 490,
              areaCode: 210300,
              areaName: '鞍山市',
              level: 2,
              cityCode: '0412',
              center: '122.994329,41.108647',
              pid: 210000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1074,
              areaCode: 340800,
              areaName: '安庆市',
              level: 2,
              cityCode: '0556',
              center: '117.115101,30.531919',
              pid: 340000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1556,
              areaCode: 410500,
              areaName: '安阳市',
              level: 2,
              cityCode: '0372',
              center: '114.392392,36.097577',
              pid: 410000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2431,
              areaCode: 513200,
              areaName: '阿坝藏族羌族自治州',
              level: 2,
              cityCode: '0837',
              center: '102.224653,31.899413',
              pid: 510000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2514,
              areaCode: 520400,
              areaName: '安顺市',
              level: 2,
              cityCode: '0853',
              center: '105.947594,26.253088',
              pid: 520000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2800,
              areaCode: 542500,
              areaName: '阿里地区',
              level: 2,
              cityCode: '0897',
              center: '80.105804,32.501111',
              pid: 540000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2907,
              areaCode: 610900,
              areaName: '安康市',
              level: 2,
              cityCode: '0915',
              center: '109.029113,32.68481',
              pid: 610000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3109,
              areaCode: 659002,
              areaName: '阿拉尔市',
              level: 2,
              cityCode: '1997',
              center: '81.280527,40.547653',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3160,
              areaCode: 652900,
              areaName: '阿克苏地区',
              level: 2,
              cityCode: '0997',
              center: '80.260605,41.168779',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3217,
              areaCode: 654300,
              areaName: '阿勒泰地区',
              level: 2,
              cityCode: '0906',
              center: '88.141253,47.844924',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            }
          ]
        },
        {
          initials: 'B',
          awAreaList: [
            {
              id: 460,
              areaCode: 152900,
              areaName: '阿拉善盟',
              level: 2,
              cityCode: '0483',
              center: '105.728957,38.851921',
              pid: 150000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 490,
              areaCode: 210300,
              areaName: '鞍山市',
              level: 2,
              cityCode: '0412',
              center: '122.994329,41.108647',
              pid: 210000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1074,
              areaCode: 340800,
              areaName: '安庆市',
              level: 2,
              cityCode: '0556',
              center: '117.115101,30.531919',
              pid: 340000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1556,
              areaCode: 410500,
              areaName: '安阳市',
              level: 2,
              cityCode: '0372',
              center: '114.392392,36.097577',
              pid: 410000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2431,
              areaCode: 513200,
              areaName: '阿坝藏族羌族自治州',
              level: 2,
              cityCode: '0837',
              center: '102.224653,31.899413',
              pid: 510000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2514,
              areaCode: 520400,
              areaName: '安顺市',
              level: 2,
              cityCode: '0853',
              center: '105.947594,26.253088',
              pid: 520000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2800,
              areaCode: 542500,
              areaName: '阿里地区',
              level: 2,
              cityCode: '0897',
              center: '80.105804,32.501111',
              pid: 540000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2907,
              areaCode: 610900,
              areaName: '安康市',
              level: 2,
              cityCode: '0915',
              center: '109.029113,32.68481',
              pid: 610000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3109,
              areaCode: 659002,
              areaName: '阿拉尔市',
              level: 2,
              cityCode: '1997',
              center: '81.280527,40.547653',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3160,
              areaCode: 652900,
              areaName: '阿克苏地区',
              level: 2,
              cityCode: '0997',
              center: '80.260605,41.168779',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3217,
              areaCode: 654300,
              areaName: '阿勒泰地区',
              level: 2,
              cityCode: '0906',
              center: '88.141253,47.844924',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            }
          ]
        },
        {
          initials: 'F',
          awAreaList: [
            {
              id: 460,
              areaCode: 152900,
              areaName: '阿拉善盟',
              level: 2,
              cityCode: '0483',
              center: '105.728957,38.851921',
              pid: 150000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 490,
              areaCode: 210300,
              areaName: '鞍山市',
              level: 2,
              cityCode: '0412',
              center: '122.994329,41.108647',
              pid: 210000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1074,
              areaCode: 340800,
              areaName: '安庆市',
              level: 2,
              cityCode: '0556',
              center: '117.115101,30.531919',
              pid: 340000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 1556,
              areaCode: 410500,
              areaName: '安阳市',
              level: 2,
              cityCode: '0372',
              center: '114.392392,36.097577',
              pid: 410000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2431,
              areaCode: 513200,
              areaName: '阿坝藏族羌族自治州',
              level: 2,
              cityCode: '0837',
              center: '102.224653,31.899413',
              pid: 510000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2514,
              areaCode: 520400,
              areaName: '安顺市',
              level: 2,
              cityCode: '0853',
              center: '105.947594,26.253088',
              pid: 520000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2800,
              areaCode: 542500,
              areaName: '阿里地区',
              level: 2,
              cityCode: '0897',
              center: '80.105804,32.501111',
              pid: 540000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 2907,
              areaCode: 610900,
              areaName: '安康市',
              level: 2,
              cityCode: '0915',
              center: '109.029113,32.68481',
              pid: 610000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3109,
              areaCode: 659002,
              areaName: '阿拉尔市',
              level: 2,
              cityCode: '1997',
              center: '81.280527,40.547653',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3160,
              areaCode: 652900,
              areaName: '阿克苏地区',
              level: 2,
              cityCode: '0997',
              center: '80.260605,41.168779',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            },
            {
              id: 3217,
              areaCode: 654300,
              areaName: '阿勒泰地区',
              level: 2,
              cityCode: '0906',
              center: '88.141253,47.844924',
              pid: 650000,
              initials: 'A',
              isHot: false,
              last: false
            }
          ]
        }
      ]
    };
  }

  onShow = () => {
    this.getCityList();
    this.setState({
      visible: true
    });
  };

  getCityList = cityName => {
    this.props
      .dispatch({
        type: 'costGlobal/cityList',
        payload: { cityName }
      })
      .then(() => {
        // console.log("城市列表：", this.props.cityList);
        const {
          // hotCities, awAreaVos,
          resultCities
        } = this.props.cityList;
        const city = resultCities.reduce((acc, cur) => {
          acc.push(...cur.awAreaList);
          return acc;
        }, []);

        this.setState({
          // hotCities,
          // awAreaVos,
          searchCityList: city
        });
      });
  };

  // 点击选择城市
  handleCity = item => {
    // console.log("🚀 ~ file: EditCity.js ~ line 130 ~ EditCity ~ item", item);
    const { selectCitysCode, selectCitys } = this.state;
    if (selectCitysCode.indexOf(item.areaCode) !== -1) {
      return;
    }
    const citys = [...selectCitys];
    citys.push(item);
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
  handleCloseOut = index => {
    const { selectCitysList } = this.state;
    const selectCity = selectCitysList;
    selectCity.splice(index, 1);
    this.setState({ selectCitysList: selectCity }, () => {
      this.handleClose(index);
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
    const { selectCitys } = this.state;
    this.setState({
      selectCitysList: [...selectCitys],
      popoverVisible: false
    });
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
  handleAdd = () => {
    const { selectCitysList } = this.state;
    this.setState(
      {
        popoverVisible: true,
        selectCitys: [...selectCitysList]
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
      // console.log(
      //   "🚀 ~ file: EditCity.js ~ line 615 ~ EditCity ~ scrollHeight",
      //   scrollHeight
      // );
      const height = this.messagesEnd.clientHeight; // 网页可见高度
      // console.log(
      //   "🚀 ~ file: EditCity.js ~ line 617 ~ EditCity ~ height",
      //   height
      // );
      const maxScrollTop = scrollHeight - height;
      // console.log("🚀 ~ file: EditCity.js ~ line 617 ~ EditCity ~ maxScrollTop", maxScrollTop)
      this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      // 如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
    }
  };

  render() {
    const { children } = this.props;
    const {
      visible,
      popoverVisible,
      activeKey,
      hotCities,
      selectCitysCode,
      selectCitys,
      awAreaVos,
      selectCitysList,
      searchValue,
      searchCityList
    } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="编辑城市"
          visible={visible}
          bodyStyle={{
            height: '491px',
            padding: '0 24px'
          }}
          width="780px"
        >
          <div className={style.addCity}>
            <Lines name={`一线城市（${selectCitysList.length}个）`} />
            <Popovers
              popoverVisible={popoverVisible}
              activeKey={activeKey}
              hotCities={hotCities}
              selectCitysCode={selectCitysCode}
              selectCitys={selectCitys}
              awAreaVos={awAreaVos}
              searchValue={searchValue}
              searchCityList={searchCityList}
              selectCitysList={selectCitysList}
              handleCancel={this.handleCancel}
              handleOk={this.handleOk}
              handleClose={this.handleClose}
              handleCloseOut={this.handleCloseOut}
              handleChange={this.handleChange}
              handleCity={this.handleCity}
              handleTab={this.handleTab}
              handleAdd={this.handleAdd}
              handleRef={el => {
                this.messagesEnd = el;
              }}
            />
          </div>
          <div className={style.addCity}>
            <Lines name="一线城市（4个）" />
            <div className={style.cities}>
              <div className={style.add}>
                {/* <span className="c-black-45 m-r-8"> */}
                <i className="iconfont iconxinzengbaoxiao fs-14 fw-600 c-black-45 m-r-8" />
                {/* </span> */}
                <span className="fs-14 c-black-45">添加</span>
              </div>
              <div className={style.city}>
                <span className="fs-14">杭州</span>
              </div>
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default EditCity;
