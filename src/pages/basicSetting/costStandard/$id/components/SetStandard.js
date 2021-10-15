import React, { PureComponent } from 'react';
import { Table, Form, InputNumber, Popconfirm, Select, Switch } from 'antd';
import add from '@/assets/img/addP.png';
import style from './other.scss';
import { ddComplexPicker } from '../../../../../utils/ddApi';
import EditCity from './EditCity';
import fields from '../../../../../utils/fields';
import { objToArr } from '../../../../../utils/common';

let id = 1000;
const { chargeType, flightLevels, trainLevels, cityLevel } = fields;
const { Option } = Select;
@Form.create()
class SetStandard extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      list: [{ key: '11111', userVos: [], depts: [] }],
      isOpenCityLevel: false,
      initDetail: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {details} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (details.costStandardDetailListVos && details !== prevState.initDetail) {
      const newArr = details.costStandardDetailListVos.map(it => {
        return {
          ...it,
          key: ++id,
        };
      });
      return {
        list: newArr,
        initDetail: details
      };
    }
    // 否则，对于state不进行任何操作
    return null;
}

  onAdd = () => {
    const { list, isOpenCityLevel } = this.state;
    let newArr = [...list];
    if (isOpenCityLevel) {
      const costStandardKey = ++id;
      newArr = [...list, {
        key: costStandardKey,
        cityLevel: 1,
        rowSpan: 4,
        costStandardKey,
      }, {
        key: ++id,
        cityLevel: 2,
        rowSpan: 0,
        costStandardKey,
      }, {
        key: ++id,
        cityLevel: 3,
        rowSpan: 0,
        costStandardKey,
      }, {
        key: ++id,
        cityLevel: '-1',
        rowSpan: 0,
        costStandardKey,
      }];
    } else {
      newArr.push({
        key: ++id,
        userVos: [],
        depts: []
      });
    }
    this.setState({
      list: newArr,
    });
  }

  onChange = (e) => {
    console.log('e', e);
    const { list } = this.state;
    const newArr = [...list];
    let newAdd = [];
    if (e) {
      newArr.forEach(item => {
        const arr = [{
          ...item,
          cityLevel: 1,
          rowSpan: 4,
          costStandardKey: item.key
        }, {
          ...item,
          key: ++id,
          cityLevel: 2,
          rowSpan: 0,
          costStandardKey: item.key
        }, {
          ...item,
          key: ++id,
          cityLevel: 3,
          rowSpan: 0,
          costStandardKey: item.key
        }, {
          ...item,
          key: ++id,
          cityLevel: '-1',
          rowSpan: 0,
          costStandardKey: item.key
        }];
        newAdd = [...newAdd, ...arr];
      });
    } else {
      const ids = newArr.map(it => it.costStandardKey);
      const newId = Array.from(new Set(ids));
      if (newId && newId.length) {
        newArr.forEach(item => {
          if (newId.includes(item.key)) {
            newAdd.push({
              ...item,
              rowSpan: null,
            });
          }
        });
      } else {
        newAdd = [...newArr];
      }
    }
    this.setState({
      isOpenCityLevel: e,
      list: newAdd
    });
  }

  onDel = (item, e) => {
    e.stopPropagation();
  }

  selectPeople = (item, e) => {
    e.stopPropagation();
    const { userVos = [], deptVos = [], key } = item;
    const { list } = this.state;
    const newArr = [...list];
    const index = list.findIndex(it => it.key === key);
    const _this = this;
    ddComplexPicker({
      multiple: true,
      users: userVos.map(it => it.userId),
      departments: deptVos.map(it => it.deptId),
    }, (res) => {
      const arr = [];
      const dep = [];
      if (res) {
        console.log(res);
        if (res.users) {
          res.users.forEach(it => {
            arr.push({
              userId: it.emplId,
              userName: it.name,
              avatar: it.avatar,
              name: it.name,
            });
          });
        }
        if (res.departments) {
          res.departments.forEach(it => {
            dep.push({
              deptId: it.id,
              name: it.name,
              number: it.number,
            });
          });
        }
        newArr.splice(index, 1, {
          ...list[index],
          userVos: arr,
          deptVos: dep,
        });
        _this.setState({
          list: newArr,
        });
      }
    }, {
      multiple: true,
      max: 20,
    });
  }

  onDelete = ({ key }) => {
    const { list, isOpenCityLevel } = this.state;
    this.setState({
      list: !isOpenCityLevel ? list.filter(it => it.key !== key) :
        list.filter(it => it.costStandardKey !== key),
    });
  }

  checkPeople = () => {
    const { list } = this.state;
    let flag = false;
    list.forEach(item => {
      if ((item.userVos && !item.userVos.length) &&
      (item.deptVos && !item.deptVos.length)) {
        flag = true;
      }
    });
    return flag;
  }

  getItems = () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    let value = null;
    const { list, isOpenCityLevel } = this.state;
    const { type } = this.props;
    validateFieldsAndScroll((err,val) => {
      if (!err) {
        console.log('标准设置', val);
        console.log('标准设置', list);
        if (this.checkPeople()) {
          return null;
        }
        const newArr = [];
        if (!isOpenCityLevel) {
          list.forEach(item => {
            const obj = {
              userVos: item.userVos,
              deptVos: item.deptVos,
              amountUnitType: val.amountUnitType && val.amountUnitType[item.key] ?
              val.amountUnitType[item.key] : chargeType[type].amountUnitType,
            };
            if (type !== 0 && type !== 1) {
              Object.assign(obj, {
                amount: ((val.amount[item.key] * 1000)/10).toFixed(0)
              });
            }
            if (val.trainLevels) {
              Object.assign(obj, {
                trainLevels: val.trainLevels[item.key]
              });
            }
            if (val.flightLevels) {
              Object.assign(obj, {
                flightLevels: val.flightLevels[item.key]
              });
            }
            newArr.push(obj);
          });
        } else {
          // const newList = list.map(it => it.costStandardKey);
          // const keys = Array.from(new Set(newList));
          const initArr = [];
          list.forEach(item => {
            const obj = {
              cityLevel: item.cityLevel,
              costStandardKey: item.costStandardKey,
              amount: ((val.amount[item.key] * 1000)/10).toFixed(0),
              amountUnitType: chargeType[type].amountUnitType,
            };
            if (item.costStandardKey === item.key) {
              Object.assign(obj, {
                userVos: item.userVos,
                deptVos: item.deptVos,
              });
            }
            initArr.push(obj);
          });
        }
        value = {
          costStandardDetailListVos: newArr,
          isOpenCityLevel: !!(val.isOpenCityLevel),
        };
      }
    });
    return value;
  }

  renderContent = (value) => {
    const obj = {
      children: value,
      props: {
        rowSpan: 4,
      },
    };
    return obj;
  };

  render() {
    const { list, isOpenCityLevel } = this.state;
    const { form: { getFieldDecorator }, type, details } = this.props;
    const columns = [{
      title: (<span className="isRequired">适用人员</span>),
      dataIndex: 'people',
      key: 'people',
      render: (_, record) => {
        const users = record.userVos && record.userVos.length ?
        `${record.userVos[0].userName}${record.userVos.length > 1 ? `等${record.userVos.length}人` : ''}` : '';
        const depts = record.deptVos && record.deptVos.length ?
        `${record.deptVos[0].name}${record.deptVos.length > 1 ? `等${record.deptVos.length}部门` : ''}` : '';
        return {
          children: (
            <div className={style.people} onClick={(e) => this.selectPeople(record, e)}>
              <img src={add} alt="部门/人"  />
              {
                users || depts ?
                  <div>
                    <span>已选{users}{users && depts && '、'}{depts}</span>
                    <i className="iconfont icondelete_fill c-black-65 m-l-8" onClick={(e) => this.onDel(record, e)} />
                  </div>
                  :
                  <span className={style.names}>选择适用人员/部门</span>
              }
            </div>
          ),
          props: {
            rowSpan: record.rowSpan === 0 || record.rowSpan ? record.rowSpan : 1,
          }
        };
      },
      width: 200
    }, {
      title: '操作',
      dataIndex: '',
      key: 'operate',
      render: (_, record) => {
        return {
          children: (
            <Popconfirm
              title="请确认是否删除？"
              onConfirm={() => this.onDelete(record)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          ),
          props: {
            rowSpan: record.rowSpan === 0 || record.rowSpan ? record.rowSpan : 1,
          }
        };
      },
      width: '80px',
      fixed: 'right'
    }];
    if (chargeType[type].options) {
      columns.splice(1, 0, {
        title: (<span className="isRequired">金额标准</span>),
        dataIndex: 'money',
        key: 'money',
        render: (_, record) => {
          return (
            <div className={style.money}>
              <span>不超过</span>
              <Form.Item>
                {
                  getFieldDecorator(`amount[${record.key}]`, {
                    initialValue: record.amount ? record.amount/100 : '',
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <InputNumber style={{width: '88px'}} placeholder="请输入" />
                  )
                }
              </Form.Item>
              <span>元{Array.isArray(chargeType[type].options) ? '每' : `/${chargeType[type].options}`}</span>
              {
                Array.isArray(chargeType[type].options) &&
                <Form.Item>
                  {
                    getFieldDecorator(`amountUnitType[${record.key}]`, {
                      initialValue: record.amountUnitType ? `${record.amountUnitType}` : '0',
                    })(
                      <Select style={{width: '88px'}}>
                        {
                          chargeType[type].options.map(item => (
                            <Option key={item.key}>{item.name}</Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              }
            </div>
          );
        },
        width: 200
      });
      if (isOpenCityLevel) {
        columns.splice(1, 0, {
          title: (
            <span>
              城市
              <EditCity>
                <a>编辑</a>
              </EditCity>
            </span>
          ),
          dataIndex: 'cityLevel',
          key: 'cityLevel',
          width: 200,
          render: (_, record) => (
            <span>{cityLevel[record.cityLevel].name}</span>
          )
        });
      }
    } else {
      columns.splice(1, 0, {
        title: (<span className="isRequired">{`${!type ? '火车席位' : '航班舱型'}`}</span>),
        dataIndex: 'level',
        key: 'level',
        render: (_, record) => {
          const optionsList = !type ? objToArr(trainLevels) : objToArr(flightLevels);
          return (
            <Form.Item>
              {
                getFieldDecorator(!type ? `trainLevels[${record.key}]` : `flightLevels[${record.key}]`, {
                  initialValue: record.trainLevels || record.flightLevels,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%', maxWidth: '240px' }}
                    placeholder="请选择"
                  >
                    {
                      optionsList.map(item => (
                        <Option key={item.key}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          );
        },
        width: 200
      });
    }
    return (
      <div className="m-t-24">
        <Form className={style.formTable}>
          {
            type === 2 &&
            <div className={style.switch}>
              <span className="m-r-12">按城市等级划分</span>
              {
                getFieldDecorator('isOpenCityLevel', {
                  initialValue: details.isOpenCityLevel || false,
                  valuePropName: 'checked',
                })(
                  <Switch onChange={(e) => this.onChange(e)} />
                )
              }
            </div>
          }
          <Table
            columns={columns}
            pagination={false}
            dataSource={list}
            rowKey='key'
          />
        </Form>
        <div className={style.adds}>
          <div className={style.add} onClick={() => this.onAdd()}>
            <span className="fs-14 c-black-65">+</span>
            <span className="fs-14 c-black-65 m-l-8">继续添加</span>
          </div>
        </div>
      </div>
    );
  }
}

export default SetStandard;
