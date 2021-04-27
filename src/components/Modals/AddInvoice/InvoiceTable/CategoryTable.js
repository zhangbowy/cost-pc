/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Form, Input, Select, DatePicker, Table, Button, InputNumber, Tooltip } from 'antd';
import style from '../index.scss';
import { setMoney, timeStampToHex, handleProduction } from '../../../../utils/common';
import { numAdd } from '../../../../utils/float';
import { dragDisabled } from '../../../../utils/constants';

const { Option } = Select;
const { RangePicker } = DatePicker;
const objY = {
  'detail_sale': 'unit',
  'detail_account': 'num',
  'detail_money': 'sum',
};
@Form.create()
class CategoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: props.detailList ? props.detailList : [{ key: '0a', }],
      total: 0,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.detailList !== this.props.detailList) {
      this.setState({
        dataList: this.props.detailList ?
        this.props.detailList.map((it, index) => { return {...it, key: `${index}_01aa`}; })
        : [],
      }, () => {
        this.getTotal();
      });
    }
  }

  getTotal = () => {
    const { form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    let sum = 0;
    const sumVal = values.detail_money;
    if (sumVal) {
      const keys = Object.keys(sumVal);
      keys.forEach(it => {
        if (sumVal[it]) {
          sum=numAdd(sumVal[it],sum);
        }
      });
    }
    this.setState({
      total: sum,
    });
  }

  // componentDidUpdate(prevProps, prevState) {

  // }

  check = (rule, value, callback) => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const _this = this;
    const values = getFieldsValue();
    const fields = rule.field;
    const mFlag = (fields.indexOf('detail_money') > -1) ||
    (fields.indexOf('detail_sale') > -1);
    if (mFlag ||
      (fields.indexOf('detail_account') > -1)) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000 || value === 100000000) {
        callback('金额需小于1个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      const key = fields.substring((fields.indexOf('[')+1), fields.indexOf(']'));
      const objss = _this.checkNum(values, key, fields, value);
      setFieldsValue(objss);
      _this.getTotal();
      callback();
    } else {
      callback();
    }
  }

  checkNum = (val, key, current, value) => {
    let obj = {};
    const keys = Object.keys(objY);
    const index = keys.findIndex(it => current.indexOf(it) > -1);
    const newArr = keys.filter(it => current.indexOf(it) === -1);
    for (let i =0;i<newArr.length; i++ ) {
      if (val[newArr[i]][key]) {
        const name = newArr.filter(it => it !== newArr[i]);
        obj = {
          [`${name}[${key}]`]: setMoney({
            [`${objY[keys[index]]}`]: value || 0,
            [`${objY[newArr[i]]}`]: val[newArr[i]][key]
          })
        };
        break;
      }
    }
    return obj;
  }

  onHandle = () => {
    const { dataList } = this.state;
    const arr = [...dataList];
    arr.push({ key: timeStampToHex() });
    this.setState({
      dataList: arr,
    });
  }

  onDelete = (key) => {
    const { dataList } = this.state;
    const arr = dataList.filter(it => it.key !== key);
    this.setState({
      dataList: arr,
    });
  }

  onSave = () => {
    const { form: { validateFieldsAndScroll }, list } = this.props;
    const fieldObj = {};
    list.forEach(it => {
      Object.assign(fieldObj, {
        [it.field]: {...it}
      });
    });
    const { dataList } = this.state;
    let data = null;
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        const fieldKeys = Object.keys(val);
        const keys = dataList.map(it => it.key);
        const newArr = [];
        keys.forEach(it => {
          let obj = {};
          fieldKeys.forEach(item => {
            if (fieldObj[item] && fieldObj[item].fieldType === 5 && val[item][it]) {
              if (fieldObj[item].dateType === 1) {
                obj = {
                  ...obj,
                  [item]: moment(val[item][it]).format('x')
                };
              } else if (fieldObj[item]) {
                obj = {
                  ...obj,
                  [item]: `${moment(val[item][it][0]).format('x')}~${moment(val[item][it][1]).format('x')}`
                };
              }
            } else if (fieldObj[item].fieldType === 9 ) {
              obj = {
                ...obj,
                [item]: fieldObj[item].note
              };
            } else {
              obj = {
                ...obj,
                [item]: item=== 'detail_money' || item === 'detail_sale'
                 ? Number(val[item][it] * 100).toFixed(0) : val[item][it].toString(),
              };
            }
          });
          newArr.push(obj);
        });
        data = newArr;
      } else {
        data = false;
      }
    });
    return data;
  }

  onCopy = (key) => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const { dataList } = this.state;
    const newKey = timeStampToHex();
    const values = getFieldsValue();
    const keys = Object.keys(values);
    const copyObj = {};
    const newObj = {};
    keys.forEach(item => {
      Object.assign(copyObj, {
        [`${item}[${newKey}]`]: values[item][key],
      });
      Object.assign(newObj, {
        [`${item}`]: values[item][key],
      });
    });
    const newArr = [...dataList, { ...newObj, key: newKey }];
    console.log('onCopy -> newArr', newArr);

    this.setState({
      dataList: newArr,
    }, () => {
      setFieldsValue(copyObj);
      this.getTotal();
    });
  }

  getColumns = (list) => {
    const { form: { getFieldDecorator } } = this.props;
    const arr = [];
    const newList = handleProduction(list);
    newList.filter(it => it.fieldType !== 9).forEach((it) => {
      let nodes = null;
      const type = it.fieldType;
      if (dragDisabled.includes(it.field)) {
        nodes = (
          <InputNumber placeholder={it.note ? it.note : '请输入'} style={{width: '100%'}} />
        );
      } else if ((type === 0 || type === 1) && !dragDisabled.includes(it.field)) {
        nodes = (
          <Input placeholder={it.note ? it.note : '请输入'} style={{width: '100%'}} />
        );
      } else if (type === 2 || type === 8) {
        nodes = (
          <Select
            placeholder={it.note ? it.note : '请输入'}
            style={{width: '100%'}}
            mode={type === 8 ? 'multiple' : ''}
          >
            {
              it.options && it.options.map(its => (
                <Option key={its}>{its}</Option>
              ))
            }
          </Select>
        );
      } else if (it.dateType === 1) {
          nodes = (
            <DatePicker
              placeholder={it.note ? it.note : '请选择时间'}
              style={{width: '100%'}}
            />
          );
        } else {

          nodes = (
            <RangePicker
              placeholder={it.note ? it.note : '请选择时间'}
              style={{width: '100%'}}
              format="YYYY-MM-DD"
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
            />
          );
        }
      arr.push({
        title: (
          <span>
            {it.isWrite ?
              <span
                style={{
                  color: '#FF5A5F',
                  verticalAlign: 'middle',
                  marginRight: '4px'
                }}
              >
                *
              </span>
              : ''}
            <span>{it.name}</span>
            {
              it.itemExplain && !!(it.itemExplain.length) &&
              <Tooltip
                title={(
                  <>
                    {
                      it.itemExplain.map(item => (
                        <p>{item.note}</p>
                      ))
                    }
                  </>
                )}
              >
                <i className="iconfont iconIcon-yuangongshouce m-l-8" />
              </Tooltip>
            }
          </span>
        ),
        dataIndex: it.field,
        render: (_, record) => {
          let msg = record[it.field];
          if (Number(it.fieldType) === 5 && msg) {
            if (it.dateType === 1) {
              msg = record[it.field].indexOf('~') === -1 ?
                    moment(moment(Number(record[it.field])).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
            } else {
              const str = record[it.field];
              if (str && str.indexOf('~') > -1) {
                const s = str.split('~');
                msg = [moment(moment(Number(s[0])).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                moment(moment(Number(s[1])).format('YYYY-MM-DD'), 'YYYY-MM-DD')];
              } else {
                msg = [];
              }
            }
          } else if (msg && (it.field === 'detail_money' || it.field === 'detail_sale')) {
            msg /=100;
          } else if(msg && it.field === 'detail_account') {
            msg = (msg*100).toFixed(0)/100;
          } else if (msg && it.fieldType === 8) {
            msg = msg.split(',');
          }
          const checkObj = [{
            required: it.isWrite,
            message: '必填'
          }, {
            validator: this.check,
          }];
          if (it.fieldType === 0 && !dragDisabled.includes(it.field)) {
            checkObj.push({
              max: 20,
              message: '限制字数20'
            });
          } else if (it.fieldType === 1 && !dragDisabled.includes(it.field)) {
            checkObj.push({
              max: 128,
              message: '限制字数128'
            });
          }
          return (
            <Form.Item>
              {
                getFieldDecorator(`${it.field}[${record.key}]`, {
                  initialValue: msg,
                  rules: checkObj
                })(
                  nodes
                )
              }
            </Form.Item>
          );
        }
      });
    });
    arr.push({
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => (
        <>
          <span className="deleteColor" onClick={() => this.onDelete(record.key)}>删除</span>
          <Divider type="vertical" />
          <a onClick={() => this.onCopy(record.key)}>复制</a>
        </>
      ),
      fixed: 'right',
      className: 'fixCenter',
    });
    return arr;
  }

  render() {
    const { list } = this.props;

    const columns = this.getColumns(list);
    const { dataList, total } = this.state;
    return (
      <>
        <Divider type="horizontal" />
        <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
          <div className={style.header}>
            <div className={style.line} />
            <span>明细</span>
            <span>（总金额：{total}</span>
            <span className="fs-13 c-black-45">（默认=多条明细金额之和）</span>
            <span>）</span>
          </div>
          <div style={{textAlign: 'center'}} className={style.addbtn}>
            <Button
              icon="plus"
              style={{ width: '231px', marginBottom: '16px' }}
              key="handle"
              onClick={() => this.onHandle()}
            >
              手动添加
            </Button>
            {
              dataList && dataList.length > 0 &&
              <Table
                columns={columns}
                pagination={false}
                dataSource={dataList}
                className={style.categoryTable}
                scroll={{ x: columns.length > 8 ? 1400 : 1200 }}
              />
            }
          </div>
        </div>
      </>
    );
  }
}

CategoryTable.propTypes = {

};

export default CategoryTable;
