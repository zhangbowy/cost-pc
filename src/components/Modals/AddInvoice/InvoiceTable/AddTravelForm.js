import React, { Component } from 'react';
import { Modal, Form, Button, Cascader, DatePicker, Radio, message, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import fields from '@/utils/fields';
import style from './index.scss';
import { getParams } from '../../../../utils/common';
import SearchCity from '../../../SearchCity';

const { aliTraffic, aliWay } = fields;
let id = 1000;
// {
//   field: 'other',
//   label: '其他交通工具',
//   type: 'DatePicker',
//   formItemLayout: {...formItemLayout},
//   required: false,
// },
const RadioGroup = Radio.Group;
@Form.create()
@connect(({ costGlobal }) => ({
  provinceAndCity: costGlobal.provinceAndCity,
  aliTripCity: costGlobal.aliTripCity,
}))
class AddTravelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [],
      errorArr: [],
      isShow: [],
      treeListObj: {},
    };
    this.easyForm = null;

  }

  onShow = (e) => {
    e.stopPropagation();

    this.props.dispatch({
      type: 'costGlobal/provinceAndCity',
      payload: {}
    }).then(() => {
      const { list, provinceAndCity } = this.props;
      const newArr = [];
      const showArr = [];
      const objs = {'defaultTree': this.onGetCity(provinceAndCity, 0)};
      if (list && list.length) {
        list.forEach((it, index) => {
          const startCity = this.handleCity(it.startCityCode, it.traffic);
          let sCode = [startCity.pid, startCity.areaCode];
          if (startCity.level > 2) {
            const pS = this.handleCity(startCity.pid, it.traffic);
            sCode = [pS.pid, startCity.pid, startCity.areaCode];
          }
          console.log('AddTravelForm -> onShow -> startCity', startCity);
          const endCity = this.handleCity(it.endCityCode, it.traffic);
          let eCode = [endCity.pid, endCity.areaCode];
          if (endCity.level > 2) {
            const eS = this.handleCity(endCity.pid, it.traffic);
            eCode = [eS.pid, endCity.pid, endCity.areaCode];
          }

          if (it.traffic === '其他') {
            showArr.push(`${index}_aa`);
          }
          newArr.push({
            key: `${index}_aa`,
            ...it,
            traffic: getParams({ res: it.traffic, list: aliTraffic, key: 'label', resultKey: 'value' }),
            way: getParams({ res: it.way, list: aliWay, key: 'label', resultKey: 'value' }),
            startCity: sCode,
            endCity: eCode,
            startDate: moment(moment(Number(it.startDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
            endDate: moment(moment(Number(it.endDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
            treeList: this.onGetCity(provinceAndCity, it.traffic)
          });
          Object.assign(objs, {
            [`${index}_aa`]: this.onGetCity(provinceAndCity, it.traffic),
          });
        });
      }
      this.setState({
        isShow: showArr,
        visible: true,
        list: newArr && newArr.length ? newArr : [{ key: '00_11' }],
        treeListObj: objs,
      });
    });
  }

  onGetCity = ({ airportCityList, normalList, trainStationCityList }, type) => {
    let list = normalList;
    if (type === '飞机' || type === 0) {
      list = airportCityList;
    } else if (type === '火车' || type === 1) {
      list = trainStationCityList;
    }
    const treeList = treeConvert({
      rootId: 0,
      pId: 'pid',
      name: 'areaName',
      id: 'areaCode',
      tName: 'label',
      tId: 'value'
    }, list);
    return treeList;
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onAdd = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({
      key: `a0_${id++}`,
    });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = k => {
    const { form } = this.props;
    console.log('删除', k);
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(i => i.key !== k),
    });
  };

  handleCity = (code, type) => {
    console.log('handleCity -> type', type);
    const { provinceAndCity } = this.props;
    let list = provinceAndCity.normalList;
    if (type === 0 || type === '飞机') {
      list = provinceAndCity.airportCityList;
    }else if (type === 1 || type === '火车') {
      list = provinceAndCity.trainStationCityList;
    }
    const city = list.filter(it => `${it.areaCode}` === `${code}`);
    console.log('citys', city);
    console.log('citysList', list);
    return city[0];
  }

  handleSubmit = () => {
    console.log(this.props.form);
    const { form: { validateFieldsAndScroll }, onOk, flag, allList, list } = this.props;
    let newArrs = [];
    validateFieldsAndScroll((err, value) => {
      if (!err) {
        console.log('value', value);
        const keyArr = value.keys;
        keyArr.forEach((it, index) => {
          const item = it.key;
          const start = value.startCity[item].length;
          const end = value.endCity[item].length;
          newArrs.push({
            key: `${index}_aa`,
            trafficName: value.trafficName && value.trafficName[item] ? value.trafficName[item][start-1] : '',
            traffic: getParams({ res: value.traffic[item], list: aliTraffic, key: 'value', resultKey: 'label' }),
            startCity: this.handleCity(value.startCity[item][start-1], Number(value.traffic[item])).areaName,
            startCityCode: value.startCity[item][start-1],
            endCity: this.handleCity(value.endCity[item][end-1], Number(value.traffic[item])).areaName,
            endCityCode: value.endCity[item][end-1],
            startDate: moment(value.startDate[item]).format('x'),
            endDate: moment(value.endDate[item]).format('x'),
            way: getParams({ res: value.way[item], list: aliWay, key: 'value', resultKey: 'label' }),
          });
        });
        if (flag && allList) {
          const i = list[0].editIndex;
          const obj = newArrs[0];
          newArrs = [...allList];
          newArrs.splice(i, 1, obj);
        }
        onOk(newArrs);
        this.onCancel();
      }
    });
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  onChangeCity = (key, value, newKey) => {
    const { form: { getFieldValue }, hasFellowTraveler } = this.props;
    if (!value || !value.length) return;
    const traffic = getFieldValue(`traffic[${newKey}]`);
    const start = this.handleCity(value[value.length -1], Number(traffic)).areaName;
    const end = getFieldValue(`${key.indexOf('start') > -1 ? 'endCity' : 'startCity'}[${newKey}]`);
    if (end && end.length && hasFellowTraveler && value) {
      const ends = this.handleCity(end[end.length-1], Number(traffic)).areaName;
      this.props.dispatch({
        type: 'costGlobal/aliTripCity',
        payload: {
          type: getParams({ res: getFieldValue(`traffic[${newKey}]`), list: aliTraffic, key: 'value', resultKey: 'label' }),
          keywords: key.indexOf('start') > -1 ?
          `${start}, ${ends}` : `${ends},${start}`,
        }
      }).then(() => {
        const { aliTripCity } = this.props;
        const { errorArr } = this.state;
        let arrs = [...errorArr];
        if (!aliTripCity) {
          message.error('起止城市没有该交通工具');
          if (!errorArr.includes(newKey)) {
            arrs.push(newKey);
          }
        } else {
          arrs = arrs.filter(it => it !== newKey);
        }
        this.setState({
          errorArr: arrs,
        });
      });
    }
  }

  onChange = (e, key) => {
    const { form: { getFieldValue }, hasFellowTraveler, provinceAndCity } = this.props;
    const startCity = getFieldValue(`startCity[${key}]`);
    const endCity = getFieldValue(`endCity[${key}]`);
    const { isShow } = this.state;
    if (!hasFellowTraveler) {
      return;
    }
    const { treeListObj } = this.state;
    Object.assign(treeListObj, {
      [key]: this.onGetCity(provinceAndCity, Number(e.target.value)),
    });
    console.log('onChangeCity -> treeListObj', treeListObj);

    this.setState({
      treeListObj,
    });
    if (Number(e.target.value) === 3 && !isShow.includes(key)) {
      isShow.push(key);
      this.setState({
        isShow,
      });
    } else {
      this.setState({
        isShow: isShow.filter(it => it !== key),
      });
    }
    if (startCity && endCity && hasFellowTraveler) {
      const s = this.handleCity(startCity[startCity.length - 1], Number(e.target.value));
      if (!s || !s.areaName) {
        this.checks(key);
        return;
      }
      const start = s.areaName;
      const es = this.handleCity(endCity[endCity.length - 1], Number(e.target.value));
      if (!es || !es.areaName) {
        this.checks(key);
        return;
      }
      const end = es.areaName;
      this.props.dispatch({
        type: 'costGlobal/aliTripCity',
        payload: {
          type: getParams({ res: e.target.value, list: aliTraffic, key: 'value', resultKey: 'label' }),
          keywords: `${start},${end}`,
        }
      }).then(() => {
        const { aliTripCity } = this.props;
        const { errorArr } = this.state;
        let arrs = [...errorArr];
        if (!aliTripCity) {
          message.error('起止城市没有该交通工具');
          if (!errorArr.includes(`${key}`)) {
            arrs.push(`${key}`);
          }
        } else {
          arrs = arrs.filter(it => it !== `${key}`);
        }

        this.setState({
          errorArr: arrs,
        });
      });
    }
  }

  checks = (key) => {
    const { errorArr } = this.state;
    let arrs = [...errorArr];
    if (!errorArr.includes(`${key}`)) {
      arrs.push(`${key}`);
    } else {
      arrs = arrs.filter(it => it !== `${key}`);
    }
    this.setState({
      errorArr: arrs,
    });
  }

  render () {
    const { list, errorArr, isShow, treeListObj } = this.state;
    const {
      children,
      form: { getFieldDecorator, getFieldValue },
      flag,
    } = this.props;
    getFieldDecorator('keys', { initialValue: list });
    const keys = getFieldValue('keys');
    const formItems = keys.map((it, index) => {
      return (
        <div className={style.tripModal} key={it.key}>
          <div className={style.tripModalT}>
            <span className="c-black-45 fs-14">行程（{index+1}）</span>
            <span className="deleteColor" onClick={() => this.remove(it.key)}>删除</span>
          </div>
          <div className={style.formLabel}>
            <Form.Item label="交通工具">
              {
                getFieldDecorator(`traffic[${it.key}]`, {
                  initialValue: it.traffic || '0',
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <RadioGroup className={style.selfRadio} onChange={e => this.onChange(e, it.key)}>
                    {
                      aliTraffic.map(item => (
                        <Radio.Button
                          key={item.label}
                          value={item.value}
                          className={style.radios}
                        >
                          {item.label}
                        </Radio.Button>
                      ))
                    }
                  </RadioGroup>
                )
              }
            </Form.Item>
            {
              isShow.includes(it.key) &&
              <Form.Item label="其他交通工具">
                {
                  getFieldDecorator(`trafficName[${it.key}]`, {
                    initialValue: it.trafficName || '',
                  })(
                    <Input placeholder="请输入" />
                  )
                }
              </Form.Item>
            }
            <Form.Item label="单程往返">
              {
                getFieldDecorator(`way[${it.key}]`, {
                  initialValue: it.way || '1',
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <RadioGroup className={style.selfRadio}>
                    {
                      aliWay.map(item => (
                        <Radio.Button
                          key={item.label}
                          value={item.value}
                          className={style.radios}
                        >
                          {item.label}
                        </Radio.Button>
                      ))
                    }
                  </RadioGroup>
                )
              }
            </Form.Item>
            <Form.Item label={(<span className={style.isRequired}>起止城市</span>)} className={style.selects}>
              <div style={{ display: 'flex' }}>
                <SearchCity>
                  <Form.Item>
                    <Input />
                  </Form.Item>
                </SearchCity>
                <span style={{ margin: '0 6px' }}>-</span>
                <Form.Item>
                  {
                    getFieldDecorator(`endCity[${it.key}]`, {
                      initialValue: it.endCity,
                      rules: [{ required: true, message: '请选择城市' }]
                    })(
                      <Cascader
                        options={treeListObj[it.key] || treeListObj.defaultTree}
                        placeholder="请选择"
                        allowClear
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch={this.filter}
                        changeOnSelect
                        onChange={val => this.onChangeCity(`endCity[${it.key}]`, val, it.key)}
                      />
                    )
                  }
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label={(<span className={style.isRequired}>起止日期</span>)} className={style.selects}>
              <div style={{display: 'flex'}}>
                <Form.Item>
                  {
                    getFieldDecorator(`startDate[${it.key}]`, {
                      initialValue: it.startDate,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <DatePicker placeholder="请选择" />
                    )
                  }
                </Form.Item>
                <span style={{ margin: '0 6px' }}>-</span>
                <Form.Item>
                  {
                    getFieldDecorator(`endDate[${it.key}]`, {
                      initialValue: it.endDate,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <DatePicker placeholder="请选择" />
                    )
                  }
                </Form.Item>
              </div>
            </Form.Item>
          </div>
        </div>
      );
    });
    const { visible } = this.state;
    return (
      <div>
        <span onClick={(e) =>this.onShow(e)}>{children}</span>
        <Modal
          title="添加行程"
          visible={visible}
          width="680px"
          onCancel={() => this.onCancel()}
          onOk={this.handleSubmit}
          okButtonProps={{
            disabled: errorArr.length
          }}
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
        >
          <Form>
            {formItems}
          </Form>
          {
            !flag &&
            <div style={{textAlign: 'center'}} className={style.addbtn}>
              <Button icon="plus" style={{ width: '231px' }} onClick={() => this.onAdd()}>添加行程</Button>
            </div>
          }
        </Modal>
      </div>
    );
  }
}

export default AddTravelForm;
