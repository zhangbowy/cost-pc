import React, { Component } from 'react';
import { Modal, Form, Button, Cascader, DatePicker, Radio, message, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import fields from '@/utils/fields';
import style from './index.scss';
import { getParams } from '../../../../utils/common';

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
    };
    this.easyForm = null;

  }

  onShow = (e) => {
    e.stopPropagation();

    this.props.dispatch({
      type: 'costGlobal/provinceAndCity',
      payload: {}
    }).then(() => {
      const { list } = this.props;
      const newArr = [];
      const showArr = [];
      if (list && list.length) {
        list.forEach((it, index) => {
          const startCity = this.handleCity(it.startCityCode);
          console.log('AddTravelForm -> onShow -> startCity', startCity);
          const endCity = this.handleCity(it.endCityCode);
          if (it.traffic === '其他') {
            showArr.push(`${index}_aa`);
          }
          newArr.push({
            key: `${index}_aa`,
            ...it,
            traffic: getParams({ res: it.traffic, list: aliTraffic, key: 'label', resultKey: 'value' }),
            way: getParams({ res: it.way, list: aliWay, key: 'label', resultKey: 'value' }),
            startCity: [startCity.pid, startCity.areaCode],
            endCity: [endCity.pid, endCity.areaCode],
            startDate: moment(moment(Number(it.startDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
            endDate: moment(moment(Number(it.endDate)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
          });
        });
      }
      this.setState({
        isShow: showArr,
        visible: true,
        list: newArr && newArr.length ? newArr : [{ key: '00_11' }],
      });
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

  handleCity = (code) => {
    const { provinceAndCity } = this.props;
    const city = provinceAndCity.filter(it => `${it.areaCode}` === `${code}`);
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
            startCity: this.handleCity(value.startCity[item][start-1]).areaName,
            startCityCode: value.startCity[item][start-1],
            endCity: this.handleCity(value.endCity[item][end-1]).areaName,
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

  onChangeCity = (key, value) => {
    const { form: { getFieldValue }, hasFellowTraveler } = this.props;
    const start = this.handleCity(value[value.length -1]).areaName;
    const end = getFieldValue(`${key.indexOf('start') > -1 ? 'endCity' : 'startCity'}[${key}]`);
    if (end && end.length && hasFellowTraveler) {
      const ends = this.handleCity(end[end.length-1]).areaName;
      this.props.dispatch({
        type: 'costGlobal/aliTripCity',
        payload: {
          type: getParams({ res: getFieldValue(`traffic[${key}]`), list: aliTraffic, key: 'value', resultKey: 'label' }),
          keywords: key.indexOf('start') > -1 ?
          `${start}, ${ends}` : `${ends},${start}`,
        }
      }).then(() => {
        const { aliTripCity } = this.props;
        const { errorArr } = this.state;
        let arrs = [...errorArr];
        if (!aliTripCity) {
          message.error('起止城市没有该交通工具');
          if (!errorArr.includes(key)) {
            arrs.push(key);
          }
        } else {
          arrs = errorArr.filter(it => it === key);
        }
        this.setState({
          errorArr: arrs,
        });
      });
    }
  }

  onChange = (e, key) => {
    const { form: { getFieldValue }, hasFellowTraveler } = this.props;
    const startCity = getFieldValue(`startCity[${key}]`);
    const endCity = getFieldValue(`endCity[${key}]`);
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
    if (startCity && endCity && hasFellowTraveler) {
      const start = this.handleCity(startCity[startCity.length - 1]).areaName;
      const end = this.handleCity(endCity[endCity.length - 1]).areaName;
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
          if (!errorArr.includes(`[${key}]`)) {
            arrs.push(`[${key}]`);
          }
        } else {
          arrs = errorArr.filter(it => it !== `[${key}]`);
        }

        this.setState({
          errorArr: arrs,
        });
      });
    }
  }

  render () {
    const { list, errorArr, isShow } = this.state;
    const {
      children,
      form: { getFieldDecorator, getFieldValue },
      provinceAndCity,
      flag,
    } = this.props;
    const treeList = treeConvert({
      rootId: 0,
      pId: 'pid',
      name: 'areaName',
      id: 'areaCode',
      tName: 'label',
      tId: 'value'
    }, provinceAndCity);
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
                <Form.Item>
                  {
                    getFieldDecorator(`startCity[${it.key}]`, {
                      initialValue: it.startCity,
                      rules: [{ required: true, message: '请选择' }]
                    })(
                      <Cascader
                        options={treeList}
                        placeholder="请选择"
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch={this.filter}
                        onChange={val => this.onChangeCity(`startCity[${it.key}]`, val)}
                      />
                    )
                  }
                </Form.Item>
                <span style={{ margin: '0 6px' }}>-</span>
                <Form.Item>
                  {
                    getFieldDecorator(`endCity[${it.key}]`, {
                      initialValue: it.endCity,
                      rules: [{ required: true, message: '请选择' }]
                    })(
                      <Cascader
                        options={treeList}
                        placeholder="请选择"
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch={this.filter}
                        onChange={val => this.onChangeCity(`endCity[${it.key}]`, val)}
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
