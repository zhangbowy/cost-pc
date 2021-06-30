import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import update from 'immutability-helper';
import moment from 'moment';
import cs from 'classnames';
import { Input, Select, DatePicker } from 'antd';
import YearPicker from '@/components/YearPicker';
import QuarterPicker from '@/components/QuarterPicker';
import add from '@/assets/img/addP.png';
import style from './index.scss';
import { ddComplexPicker, ddDepartmentsPicker } from '../../../../../utils/ddApi';
import { yearChange, monthChage, getQuarter, defaultMonth } from './time';

const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;
const { Group } = Input;
const timeObj = [{
  key: 0,
  Comp: MonthPicker,
  name: '月度',
  placeholder: '选择月份'
}, {
  key: 1,
  Comp: QuarterPicker,
  name: '季度',
  placeholder: '选择季度'
}, {
  key: 2,
  Comp: YearPicker,
  name: '年度',
  placeholder: '选择年份'
}];
class FormStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPeople = (index) => {
    const { fields, onChangeSearch } = this.props;
    ddComplexPicker({
      multiple: true,
      users: [],
      departments: [],
    }, (res) => {
      const arr = [];
      const dep = [];
      if (res) {
        if (res.users) {
          res.users.forEach(item => {
            arr.push({
              userId: item.emplId,
              userName: item.name,
              avatar: item.avatar,
              name: item.name,
            });
          });
        }
        if (res.departments) {
          res.departments.forEach(item => {
            dep.push({
              deptId: item.id,
              name: item.name,
              number: item.number,
            });
          });
        }
        const keys = fields[index].key;
        const obj = {};
        keys.forEach(it => {
          if (keys.some(its => its.toLowerCase().indexOf('USER') > -1)) {
            Object.assign(obj, {
              [it]: arr
            });
          } else {
            Object.assign(obj, {
              [it]: dep
            });
          }
        });
        const str = [...dep, ...arr].map(it => it.name).join(',');
        onChangeSearch( update(fields, {
          $splice: [[index, 1, { ...fields[index],
            value: obj, valueStr: str }]]
        }));
      }
    }, {
      multiple: true,
      max: 1500,
    });
  }

  onSelectDept = (index) => {
    const { fields, onChangeSearch } = this.props;
    ddDepartmentsPicker({
      departments: [],
      multiple: true,
      max: 100,
    }, res => {
      const arr = [];
      if (res.departments) {
        res.departments.forEach(it => {
          arr.push({
            deptId: it.id,
            name: it.name,
            deptName: it.name,
            number:it.number,
          });
        });
        const str = [...arr].map(it => it.name).join(',');
        onChangeSearch( update(fields, {
          $splice: [[index, 1, { ...fields[index],
            value: { [fields[index].key]: arr }, valueStr: str }]]
        }) );
        console.log(arr);
      }
    });
  }

  onChangeSelect = (obj, index) => {
    const { fields, onChangeSearch } = this.props;
    console.log('obj', obj);
    onChangeSearch( update(fields, {
      $splice: [[index, 1, { ...fields[index],
        value: { [fields[index].key]: obj.key }, valueStr: obj.label }]]
    }));
  }

  onChangeTime = (val, index) => {
    const { fields, onChangeSearch } = this.props;
    const obj = {};
    fields[index].key.forEach((it, i) => {
      Object.assign(obj, {
        [it]: val.length > 1 ? val[i].format('X') : null,
      });
    });
    const valueStr =  val.length > 1 ? val.map(it =>
      moment(it).format('YYYY-MM-DD')).join('~') : null;
    onChangeSearch( update(fields, {
      $splice: [[index, 1, { ...fields[index],
        value: { [fields[index].key]: obj }, valueStr }]]
    }));
  }

  onChangeIn = (e, index) => {
    const { fields, onChangeSearch } = this.props;
    onChangeSearch( update(fields, {
      $splice: [[index, 1, { ...fields[index], value:
        { [fields[index].key]: e.target.value } }]]
    }));
  }

  onChangeTime = (val, index, dateType) => {
    let obj = {
      ...monthChage(val),
    };
    switch(dateType) {
      case 1:
        obj = {
          ...getQuarter(val),
        };
        break;
        case 2:
        obj = {
          ...yearChange(val),
        };
        break;
        default:
          break;
    }
    const value = [obj.startTime, obj.endTime];
    this.onChanges({
      value,
      valueStr: obj.valueStr,
      others: {
        dateType: 2,
      }
    }, index, {
      compareStr: 'start'
    });
  }

  /**
   * val 所有的值
   * i 改变的index
   * other 其他需要的参数，compare 需要比较的格式，可扩展
   * @memberof FormStyle
   */
  onChanges = (val, i, other) => {
    const { fields, onChangeSearch } = this.props;
    const keys = fields[i].key;
    const obj = {};
    if (val.others) {
      Object.assign(obj, {
        ...val.others,
      });
    }
    if (Array.isArray(keys)) {
      keys.forEach((it, index) => {
        if (keys.some(its =>
          its.toLowerCase().indexOf(other.compareStr) > -1)) {
          Object.assign(obj, {
            [it]: val.value[index],
          });
        } else {
          Object.assign(obj, {
            [it]: val.value[index],
          });
        }
      });
    } else {
      Object.assign(obj, {
        [keys]: val[other.value]
      });
    }
    onChangeSearch(fields, {
      $splice: [[i, 1, {
        valueStr: val.valueStr,
        value: {
          ...obj,
        }
      }]]
    });
  }

  timeType = (val, index) => {
    const { fields, onChangeSearch } = this.props;
    const obj = {};
    switch(val) {
      case 0:
        Object.assign(obj, {
          ...defaultMonth(),
        });
      break;
      case 1:
        Object.assign(obj, {
          ...getQuarter(getQuarter(new Date()), true),
        });
      break;
      case 2:
        Object.assign(obj, {
          ...yearChange(),
        });
      break;
      default:
        break;
    }
    console.log('obj', obj);
    onChangeSearch( update(fields, {
      $splice: [[index, 1,
        {
          ...fields[index],
          value: {
            dateType: Number(val),
            startTime: obj.startTime,
            endTime: obj.endTime,
          },
          valueStr: obj.valueStr
       }]]
    }));
  }

  onNode = (item, index) => {
    let node = null;
    switch(item.type) {
      case 'deptAndUser':
        node = (
          <div className={style.select} key={item.id} onClick={() => this.onPeople(index)}>
            <div className={cs(style.selectI, style.selectBorder)} style={{ position: 'relative' }}>
              <span>{item.label}</span>
              <i className="iconfont icondown" />
            </div>
          </div>
        );
      break;
      case 'rangeTime':
        node = (
          <div className={style.select} key={item.id}>
            <div className={style.selectI}>
              <span>{item.label}</span>
              <i className="iconfont icondown" />
            </div>
            <RangePicker
              style={{ width: '160px' }}
              format="YYYY-MM-DD"
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              onChange={(val) => this.onChangeTime(val,index)}
            />
          </div>
        );
      break;
      case 'select':
      case 'tree':
        node = (
          <div className={style.select} key={item.id}>
            <div className={style.selectI}>
              <span>{item.label}</span>
              <i className="iconfont icondown" />
            </div>
            <Select
              style={{ width: '160px' }}
              value={item.value ? { key: item.value[item.key] } : undefined}
              onChange={val => this.onChangeSelect(val, index)}
              labelInValue
            >
              <Option value={1}>请输入</Option>
              <Option value={2}>请输入2</Option>
              <Option value={3}>请输入3</Option>
            </Select>
          </div>
        );
      break;
      case 'search':
        node = (
          <Input
            key={item.id}
            placeholder={item.placeholder}
            style={{ width: '272px' }}
            onInput={e => this.onChangeIn(e, index)}
          />
        );
      break;
      case 'timeC':
        node = (
          <div className={style.select} style={{ width: '232px' }} key={item.id}>
            <div
              className={style.selectI}
              style={{
                position: 'absolute', right: '2px',
                zIndex: 10, borderLeft: 'none',left: 'auto'
              }}
            >
              <span>{item.label}</span>
              <i className="iconfont icondown" />
            </div>
            <Group style={{ width: '232px' }} compact>
              <Select
                style={{ width: '31%' }}
                onChange={val => this.timeType(val, index)}
                value={item.value ? item.value.dateType : 0}
              >
                {
                  timeObj.map(its => (
                    <Option key={its.key} value={its.key}>{its.name}</Option>
                  ))
                }
              </Select>
              {
                item.value.dateType === 0 &&
                <MonthPicker
                  // value={item.valueStr}
                  onChange={(_,str) => this.onChangeTime(str, index, 0)}
                  style={{ width: '69%' }}
                />
              }
              {
                item.value.dateType === 1 &&
                <QuarterPicker
                  onChange={(str) => this.onChangeTime(str, index, 1)}
                  style={{ width: '69%' }}
                  value={item.valueStr}
                />
              }
              {
                item.value.dateType === 2 &&
                <YearPicker
                  onChange={(str) => this.onChangeTime(str, index, 2)}
                  style={{ width: '69%' }}
                  value={item.valueStr}
                />
              }
            </Group>
          </div>
        );
      break;
      default:
        break;
    }
    return node;
  }

  onField = (item, index) => {
    let node = null;
    switch(item.type){
      case 'tree':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <Select
              style={{ width: '204px' }}
              placeholder={item.placeholder}
              labelInValue
              value={item.value ? { key: item.value[item.key] } : undefined}
              onChange={val => this.onChangeSelect(val, index)}
            >
              <Option value={12}>测试</Option>
            </Select>
          </div>
        );
      break;
      case 'inSector':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <div className={style.price} style={{ width: '204px' }}>
              <Input
                style={{ width: 'calc(50% - 12px)' }}
                placeholder={item.placeholder}
              />
              <span
                className={style.priceS}
                style={{ width: '24px', textAlign: 'center' }}
              >
                -
              </span>
              <Input
                style={{ width: 'calc(50% - 12px)' }}
                placeholder={item.placeholder}
              />
            </div>
          </div>
        );
      break;
      case 'deptAndUser':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <div className={style.price}>
              <img src={add} alt="部门/人"  />
              <span className={style.names}>待选择</span>
            </div>
          </div>
        );
      break;
      case 'rangeTime':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <RangePicker
              style={{ width: '204px' }}
              placeholder={item.placeholder}
            />
          </div>
        );
      break;
      case 'select':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <Select style={{ width: '204px' }} placeholder={item.placeholder}>
              <Option value={12}>测试</Option>
            </Select>
          </div>
        );
      break;
      default:
        break;
    }
    return node;
  }

  render() {
    // const { dateType } = this.state;
    const { fields, type } = this.props;
    console.log(fields);
    return (
      <>
        {
          type === 'out' ?
            <div className={style.left}>
              {
                fields.filter(it => it.out).map((it, index) => this.onNode(it, index))
              }
            </div>
            :
            <div>
              {
                fields.map((it, index) => {
                  return this.onField(it, index);
                })
              }
            </div>
        }
      </>
    );
  }
}

FormStyle.propTypes = {

};

export default FormStyle;
