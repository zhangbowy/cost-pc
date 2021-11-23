import React, { Component } from 'react';
import { Modal, Form, Button, DatePicker, Radio, message, Input, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import fields from '@/utils/fields';
import style from './index.scss';
import { getParams, getTimeIdNo } from '../../../../utils/common';
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
const moments = [{
  key: '00:00:00',
  name: '上午',
}, {
  key: '12:00:00',
  name: '下午',
}];
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
      startCity: {},
      endCity: {}
    };
    this.easyForm = null;

  }

  onShow = (e) => {
    e.stopPropagation();
    const { list } = this.props;
    const newArr = [];
    const showArr = [];
    const startCity = {};
    const endCity = {};
    if (list && list.length) {
      list.forEach((it, index) => {
        const key = `${getTimeIdNo()}${index}`;
        Object.assign(startCity, {
          [`startCity[${key}]`]: {
            areaCode: it.startCityCode,
            areaName: it.startCity,
          }
        });
        Object.assign(endCity, {
          [`endCity[${key}]`]: {
            areaCode: it.endCityCode,
            areaName: it.endCity,
          }
        });
        if (it.traffic === '其他') {
          showArr.push(`${key}`);
        }
        newArr.push({
          ...it,
          key,
          traffic: getParams({ res: it.traffic, list: aliTraffic, key: 'label', resultKey: 'value' }),
          way: getParams({ res: it.way, list: aliWay, key: 'label', resultKey: 'value' }),
          startCity: it.startCity,
          endCity: it.endCity,
          startDate: moment(moment(Number(it.startDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
          startMoment: moment(moment(Number(it.startDate))).hours() > 11 ? '12:00:00' : '00:00:00',
          endMoment: moment(moment(Number(it.endDate))).hours() > 11 ? '12:00:00' : '00:00:00',
          endDate: moment(moment(Number(it.endDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
        });
      });
    }
    this.setState({
      isShow: showArr,
      visible: true,
      list: newArr && newArr.length ? newArr : [{ key: '00_11' }],
      startCity,
      endCity
    });
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
    const city = list.filter(it => `${it.areaCode}` === `${code}` || `${it.areaName}` === `${code}`);
    console.log('citys', city);
    console.log('citysList', list);
    return city[0];
  }

  handleSubmit = () => {
    console.log(this.props.form);
    const { form: { validateFieldsAndScroll }, onOk, flag, allList, list } = this.props;
    let newArrs = [];
    const { startCity, endCity } = this.state;
    validateFieldsAndScroll((err, value) => {
      if (!err) {
        console.log('value', value);
        const keyArr = value.keys;
        keyArr.forEach((it, index) => {
          const item = it.key;
          console.log(startCity[`startCity[${item}]`]);
          const startD = moment(`${moment(value.startDate[item]).format('YYYY.MM.DD')} ${value.startMoment[item]}`).format('x');
          const endD = moment(`${moment(value.endDate[item]).format('YYYY.MM.DD')} ${value.endMoment[item]}`).format('x');
          newArrs.push({
            key: it.key || `${index}_aa`,
            trafficName: value.trafficName && value.trafficName[item] ? value.trafficName[item] : '',
            traffic: getParams({ res: value.traffic[item], list: aliTraffic, key: 'value', resultKey: 'label' }),
            startCity: startCity[`startCity[${item}]`].areaName,
            startCityCode: startCity[`startCity[${item}]`].areaCode,
            endCity: endCity[`endCity[${item}]`].areaName,
            endCityCode: endCity[`endCity[${item}]`].areaCode,
            startDate: Number(startD),
            endDate: Number(endD),
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

  onChangeCity = (key, newKey) => {
    const { form: { getFieldValue }, hasFellowTraveler } = this.props;
    const { startCity, endCity } = this.state;
    const start = startCity[`startCity[${newKey}]`];
    const end = endCity[`endCity[${newKey}]`];
    if (end && start && hasFellowTraveler) {
      const ends = end.areaName;
      this.props.dispatch({
        type: 'costGlobal/aliTripCity',
        payload: {
          type: getParams({ res: getFieldValue(`traffic[${newKey}]`), list: aliTraffic, key: 'value', resultKey: 'label' }),
          keywords: `${start.areaName}, ${ends}`,
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
    const { hasFellowTraveler } = this.props;
    const { startCity, endCity } = this.state;
    const starts = startCity[`startCity[${key}]`];
    const ends = endCity[`endCity[${key}]`];
    console.log('onChange -> starts', starts);
    console.log('onChange -> ends', ends);
    const { isShow } = this.state;
    if (!hasFellowTraveler) {
      return;
    }
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
    if (starts && ends && hasFellowTraveler) {
      const s = starts;
      if (!s || !s.areaName) {
        this.checks(key);
        return;
      }
      const start = s.areaName;
      const es = ends;
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

  handleCityOk = (name, val, str, key) => {
    console.log(name, val);
    this.props.form.setFieldsValue({
      [name]: val.areaName || '',
    });
    let old = this.state.startCity;
    if (str === 'endCity') {
      old = this.state.endCity;
    }
    this.setState({
      [str]: {
        ...old,
        [name]: val,
      }
    }, () => {
      this.onChangeCity(name, key);
    });
  }

  render () {
    const { list, errorArr, isShow } = this.state;
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
                <SearchCity
                  onOk={val => this.handleCityOk(`startCity[${it.key}]`, val,'startCity', it.key)}
                  value={this.state.startCity[`startCity[${it.key}]`]}
                >
                  <Form.Item className={style.inputs}>
                    {
                      getFieldDecorator(`startCity[${it.key}]`, {
                        initialValue: it.startCity,
                        rules: [{ required: true, message: '请选择城市' }]
                      })(
                        <Input placeholder="请选择城市" disabled />
                      )
                    }
                  </Form.Item>
                </SearchCity>
                <span style={{ margin: '0 6px' }}>-</span>
                <SearchCity
                  onOk={val => this.handleCityOk(`endCity[${it.key}]`, val,'endCity', it.key)}
                  value={this.state.endCity[`endCity[${it.key}]`]}
                >
                  <Form.Item className={style.inputs}>
                    {
                      getFieldDecorator(`endCity[${it.key}]`, {
                        initialValue: it.endCity,
                        rules: [{ required: true, message: '请选择城市' }]
                      })(
                        <Input placeholder="请选择城市" disabled />
                      )
                    }
                  </Form.Item>
                </SearchCity>
              </div>
            </Form.Item>
            <Form.Item label={(<span className={style.isRequired}>开始时间</span>)} className={style.selectW}>
              <div style={{display: 'flex'}}>
                <Form.Item>
                  {
                    getFieldDecorator(`startDate[${it.key}]`, {
                      initialValue: it.startDate,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <DatePicker placeholder="请选择" style={{width: '200px'}} />
                    )
                  }
                </Form.Item>
                <Form.Item className="m-l-8">
                  {
                    getFieldDecorator(`startMoment[${it.key}]`, {
                      initialValue: it.startMoment,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <Select style={{width: '135px'}} placeholder="请选择">
                        {
                          moments.map(items => (
                            <Select.Option key={items.key}>{items.name}</Select.Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label={(<span className={style.isRequired}>结束时间</span>)} className={style.selectW}>
              <div style={{display: 'flex'}}>
                <Form.Item>
                  {
                    getFieldDecorator(`endDate[${it.key}]`, {
                      initialValue: it.endDate,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <DatePicker placeholder="请选择" style={{width: '200px'}} />
                    )
                  }
                </Form.Item>
                <Form.Item className="m-l-8" style={{width: '135px'}}>
                  {
                    getFieldDecorator(`endMoment[${it.key}]`, {
                      initialValue: it.endMoment,
                      rules: [{
                        required: true, message: '请选择时间'
                      }]
                    })(
                      <Select placeholder="请选择">
                        {
                          moments.map(items => (
                            <Select.Option key={items.key}>{items.name}</Select.Option>
                          ))
                        }
                      </Select>
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
          <Form className="formItem">
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
