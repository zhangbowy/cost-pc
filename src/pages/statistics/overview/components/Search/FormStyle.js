/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import update from 'immutability-helper';
import moment from 'moment';
import cs from 'classnames';
import { Input, Select, DatePicker, TreeSelect, message } from 'antd';
import YearPicker from '@/components/YearPicker';
import QuarterPicker from '@/components/QuarterPicker';
import add from '@/assets/img/addP.png';
import style from './index.scss';
import { ddComplexPicker, ddDepartmentsPicker } from '../../../../../utils/ddApi';
import { yearChange, monthChage, getQuarter, defaultMonth, selfTime } from './time';

const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;
const { Group } = Input;
const { SHOW_CHILD, SHOW_ALL } = TreeSelect;
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
}, {
  key: -1,
  Comp: RangePicker,
  name: '自定义',
  placeholder: '选择时间区间'
}];
class FormStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPeople = (e, index, handle) => {
    e.stopPropagation();
    const { fields, onChangeSearch } = this.props;
    if (handle === 'del') {
      onChangeSearch( update(fields, {
        $splice: [[index, 1, { ...fields[index],
          value: null, valueStr: null }]]
      }));
    } else {
      ddComplexPicker({
        multiple: true,
        users: fields[index].value && fields[index].value[fields[index].key[0]] ?
        fields[index].value[fields[index].key[0]].map(it => it.userId) : [],
        departments: fields[index].value && fields[index].value[fields[index].key[1]] ?
        fields[index].value[fields[index].key[1]].map(it => it.deptId) : [],
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
                deptName: item.name,
                number: item.number,
              });
            });
          }
          const keys = fields[index].key;
          const obj = {};
          keys.forEach(it => {
            if (it.toLowerCase().indexOf('user') > -1) {
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

  }

  onSelectDept = (e, index, handle) => {
    e.stopPropagation();

    const { fields, onChangeSearch } = this.props;
    console.log('FormStyle -> onSelectDept -> fields', fields);

    if (handle === 'del') {
      onChangeSearch( update(fields, {
        $splice: [[index, 1, { ...fields[index],
          value: null, valueStr: null }]]
      }) );
    } else {
      ddDepartmentsPicker({
        departments: fields[index].value && fields[index].value[fields[index].key] ?
        fields[index].value[fields[index].key].map(it => it.deptId) : [],
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
        }
      });
    }

  }

  onChangeSelect = (obj, index) => {
    console.log('FormStyle -> onChangeSelect -> obj', obj);
    const { fields, onChangeSearch } = this.props;
    const params = {};
    if (Array.isArray(obj)) {
      Object.assign(params, {
        value: {
          [fields[index].key]: obj.map(it => it.key)
        },
        valueStr: obj.map(it => it.label).join(',')
      });
    } else {
      Object.assign(params, {
        value: {
          [fields[index].key]: obj.key
        },
        valueStr: obj.label
      });
    }
    if (fields[index].linkUrl) {
      onChangeSearch( update(fields, {
        $splice: [[index, 1, { ...fields[index], ...params }]]
      }), fields[index].linkUrl);
    } else {
      onChangeSearch( update(fields, {
        $splice: [[index, 1, { ...fields[index], ...params }]]
      }));
    }
  }

  onChangeDate = (val, index) => {
    const { fields, onChangeSearch } = this.props;
    const obj = {};
    fields[index].key.forEach((it, i) => {
      Object.assign(obj, {
        [it]: val.length > 1 ? val[i].format('x') : null,
      });
    });
    const valueStr =  val.length > 1 ? val.map(it =>
      moment(it).format('YYYY-MM-DD')).join('~') : null;
    onChangeSearch( update(fields, {
      $splice: [[index, 1, { ...fields[index],
        value: { ...obj }, valueStr }]]
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
    let obj = {};
    switch(dateType) {
      case 0:
        obj = {
          ...monthChage(val),
        };
      break;
      case 1:
        obj = {
          ...getQuarter(val, true),
        };
        break;
      case 2:
        obj = {
          ...yearChange(val),
        };
      break;
      case -1:
        obj = {
          startTime: moment(`${moment(val[0]).format('YYYY-MM-DD')} 00:00:00`).format('x'),
          endTime: moment(`${moment(val[1]).format('YYYY-MM-DD')} 23:59:59`).format('x'),
          valueStr: `${moment(val[0]).format('YYYY-MM-DD')}~${moment(val[1]).format('YYYY-MM-DD')}`,
        };
      break;
        default:
          break;
    }
    console.log('切换时间', obj);
    const value = [obj.startTime, obj.endTime];
    this.onChanges({
      value,
      valueStr: obj.valueStr,
      others: {
        dateType,
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
        if (it.toLowerCase().indexOf(other.compareStr) > -1) {
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
    onChangeSearch(update(fields, {
      $splice: [[i, 1, {
        ...fields[i],
        valueStr: val.valueStr,
        value: {
          ...obj,
        }
      }]]
    }));
  }

  onChangeTree = (val, index) => {
    const ids = val.map(it => it.value);
    const str = val.map(it => it.label);
    const { fields, onChangeSearch } = this.props;
    onChangeSearch(update(fields, {
      $splice: [[index, 1, {
        ...fields[index],
        valueStr: str.join(','),
        value: {
          [fields[index].key]: ids,
        }
      }]]
    }));
  }

  onInput = (e, i, index) => {
    const { fields, onChangeSearch } = this.props;
    if(!/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/.test(e.target.value)) {
      message.error('请输入正确的金额');
      return;
    }
    const value = fields[i].value ? {...fields[i].value} : {};
    Object.assign(value, {
      [fields[i].key[index]]: (e.target.value * 100).toFixed(0),
    });
    onChangeSearch(update(fields, {
      $splice: [[i, 1, {
        ...fields[i],
        valueStr: `${value[fields[i].key[0]] ? value[fields[i].key[0]]/100 : ''}
        - ${value[fields[i].key[1]] ? value[fields[i].key[1]]/100 : ''}`,
        value: {
          ...value,
        }
      }]]
    }));
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
      // TO DO
      case -1:
        Object.assign(obj, {
          ...fields[index].value,
          valueStr: selfTime(fields[index].value),
        });
      break;
      default:
        break;
    }
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
    if (item.out) {
      switch(item.type) {
        case 'deptAndUser':
          node = (
            <div className={style.select} key={item.id} onClick={(e) => this.onPeople(e, index)}>
              <div className={cs(style.selectI, style.selectBorder)} style={{ position: 'relative' }}>
                <span>{item.label}</span>
                <i className="iconfont icondown" />
              </div>
            </div>
          );
        break;
        case 'dept':
          node = (
            <div className={style.select} key={item.id} onClick={(e) => this.onSelectDept(e, index)}>
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
                onChange={(val) => this.onChangeDate(val,index)}
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
              {
                item.type === 'select' ?
                  <Select
                    style={{ width: '160px' }}
                    value={item.value && Array.isArray(item.value)
                      ? item.value[item.key].map(it => { return { key: it }; })
                      : item.value ? { key: item.value[item.key] }
                      : undefined}
                    mode={item.mode || 'default'}
                    onChange={val => this.onChangeSelect(val, index)}
                    labelInValue
                  >
                    {
                      item.options && item.options.map(it => (
                        <Option key={it[item.fileName.key]}>{it[item.fileName.name]}</Option>
                      ))
                    }
                  </Select>
                  :
                  <TreeSelect
                    style={{ width: '160px', height: '32px' }}
                    treeData={item.options || []}
                    placeholder={item.placeholder}
                    treeCheckable
                    showCheckedStrategy={item.isShowAll ? SHOW_ALL : SHOW_CHILD}
                    dropdownStyle={{height: '300px'}}
                    showSearch
                    treeNodeFilterProp='title'
                    labelInValue
                    onChange={val => this.onChangeTree(val, index)}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    value={item.valueStr ? item.value[item.key].map(it => { return { value: it };})  : undefined}
                  />
              }
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
                {
                  item.value.dateType === -1 &&
                  <RangePicker
                    onChange={(str) => this.onChangeTime(str, index, -1)}
                    style={{ width: '69%' }}
                    format="YYYY-MM-DD"
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    value={item.valueStr ? selfTime({ ...item.value, handle: 'value' }) : undefined}
                  />
                }
              </Group>
            </div>
          );
        break;
        default:
          break;
      }
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
            <TreeSelect
              style={{ width: '204px' }}
              treeData={item.options || []}
              placeholder={item.placeholder}
              treeCheckable
              showCheckedStrategy={item.isShowAll ? SHOW_ALL : SHOW_CHILD}
              dropdownStyle={{height: '300px'}}
              showSearch
              treeNodeFilterProp='title'
              labelInValue
              onChange={val => this.onChangeTree(val, index)}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={item.valueStr ? item.value[item.key].map(it => { return { value: it };})  : undefined}
            />
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
                placeholder={item.placeholder[0]}
                onInput={e => this.onInput(e, index, 0)}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '24px',
                  textAlign: 'center',
                  lineHeight: '32px'
                }}
              >
                -
              </span>
              <Input
                style={{ width: 'calc(50% - 12px)' }}
                placeholder={item.placeholder[1]}
                onInput={e => this.onInput(e, index, 1)}
              />
            </div>
          </div>
        );
      break;
      case 'deptAndUser':
        node = (
          <div className={style.formItem} key={item.id} onClick={(e) => this.onPeople(e, index)}>
            <span className={style.label}>{item.label}</span>
            {
              !item.valueStr ?
                <div className={style.price}>
                  <img src={add} alt="部门/人"  />
                  <span className={style.names}>待选择</span>
                </div>
                :
                <div className={style.price}>
                  <span className={style.names}>
                    {
                      item.value[item.key[0]] && item.value[item.key[0]].length > 0 ?
                        <span>已选{item.value[item.key[0]][0].userName}等{item.value[item.key[0]].length}人，</span>
                        :
                        ''
                    }
                    {
                      item.value[item.key[1]] && item.value[item.key[1]].length > 0 ?
                        <span>已选{item.value[item.key[1]][0].deptName}等{item.value[item.key[1]].length}个部门</span>
                        :
                        ''
                    }
                    <i
                      className="iconfont icondelete_fill c-black-65 m-l-8"
                      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                      onClick={(e) => this.onPeople(e, index, 'del')}
                    />
                  </span>
                </div>
            }
          </div>
        );
      break;
      case 'dept':
        node = (
          <div className={style.formItem} key={item.id} onClick={(e) => this.onSelectDept(e, index)}>
            <span className={style.label}>{item.label}</span>
            {
              !item.valueStr ?
                <div className={style.price}>
                  <img src={add} alt="部门"  />
                  <span className={style.names}>待选择</span>
                </div>
                :
                <div className={style.price}>
                  <span className={style.names}>
                    {
                      item.value[item.key] && item.value[item.key].length > 0 ?
                        <span>已选{item.value[item.key][0].deptName}等{item.value[item.key].length}个部门</span>
                        :
                        ''
                    }
                    <i
                      className="iconfont icondelete_fill c-black-65 m-l-8"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => this.onSelectDept(e, index, 'del')}
                    />
                  </span>
                </div>
            }
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
              format="YYYY-MM-DD"
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              value={item.valueStr ?
              selfTime({
                startTime: item.value[item.key[0]],
                endTime: item.value[item.key[1]],
                handle: 'value', dateType: -1
              }) : undefined}
              onChange={(val) => this.onChangeDate(val,index)}
            />
          </div>
        );
      break;
      case 'select':
        node = (
          <div className={style.formItem} key={item.id}>
            <span className={style.label}>{item.label}</span>
            <Select
              style={{ width: '204px' }}
              placeholder={item.placeholder}
              labelInValue
              mode="multiple"
              onChange={(val) => this.onChangeSelect(val, index)}
              value={item.value ? item.value[item.key].map(it => { return { key: it }; }) : undefined}
            >
              {
                item.options && item.options.map(it => (
                  <Option key={it[item.fileName.key]}>{it[item.fileName.name]}</Option>
                ))
              }
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
    const { fields, type, node } = this.props;
    console.log(fields);
    return (
      <>
        {
          type === 'out' ?
            <div className={style.left}>
              {
                fields.map((it, index) => this.onNode(it, index))
              }
              {node}
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
