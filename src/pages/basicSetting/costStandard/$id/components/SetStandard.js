import React, { PureComponent } from 'react';
import { Table, Form, InputNumber, Popconfirm, Select } from 'antd';
import add from '@/assets/img/addP.png';
import style from './index.scss';
import { ddComplexPicker } from '../../../../../utils/ddApi';
import EditCity from './EditCity';
import fields from '../../../../../utils/fields';
import { objToArr } from '../../../../../utils/common';

let id = 1000;
const { chargeType, flightLevels, trainLevels } = fields;
const { Option } = Select;
@Form.create()
class SetStandard extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      list: [{ key: '11111', userVos: [], depts: [] }]
    };
  }

  onAdd = () => {
    const { list } = this.state;
    const newArr = [...list];
    newArr.push({
      key: ++id,
      userVos: [],
      depts: []
    });
    this.setState({
      list: newArr,
    });
  }

  selectPeople = (item) => {
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
    const { list } = this.state;
    this.setState({
      list: list.filter(it => it.key !== key)
    });
  }

  render() {
    const { list } = this.state;
    const { form: { getFieldDecorator }, type } = this.props;
    const columns = [{
      title: '适用人员',
      dataIndex: 'people',
      key: 'people',
      render: (_, record) => {
        const users = record.userVos && record.userVos.length ?
        `${record.userVos[0].userName}${record.userVos.length > 1 ? `等${record.userVos.length}人` : ''}` : '';
        const depts = record.deptVos && record.deptVos.length ?
        `${record.deptVos[0].name}${record.deptVos.length > 1 ? `等${record.deptVos.length}部门` : ''}` : '';
        return (
          <div className={style.people} onClick={() => this.selectPeople(record)}>
            <img src={add} alt="部门/人"  />
            {
              users || depts ?
                <div>
                  <span>已选{users}、{depts}</span>
                  <i className="iconfont icondelete_fill c-black-65 m-l-8" />
                </div>
                :
                <span className={style.names}>选择适用人员/部门</span>
            }

          </div>
        );
      },
      width: 200
    }, {
      title: '操作',
      dataIndex: '',
      key: 'operate',
      render: (_, record) => (
        <Popconfirm
          title="请确认是否删除？"
          onConfirm={() => this.onDelete(record)}
        >
          <span className="deleteColor">删除</span>
        </Popconfirm>
      ),
      width: '80px',
      fixed: 'right'
    }];
    if (chargeType[type].options) {
      columns.splice(1, 0, {
        title: '金额标准',
        dataIndex: 'money',
        key: 'money',
        render: (_, record) => {
          return (
            <div className={style.money}>
              <span>不超过</span>
              <Form.Item>
                {
                  getFieldDecorator(`amount[${record.key}]`)(
                    <InputNumber style={{width: '88px'}} />
                  )
                }
              </Form.Item>
              <span>元{Array.isArray(chargeType[type].options) ? '每' : `/${chargeType[type].options}`}</span>
              {
                Array.isArray(chargeType[type].options) &&
                <Form.Item>
                  {
                    getFieldDecorator(`amountUnitType[${record.key}]`)(
                      <Select>
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
      if (type === 2) {
        columns.splice(1, 0, {
          title: (
            <span>
              城市
              <EditCity>
                <a>编辑</a>
              </EditCity>
            </span>
          ),
          dataIndex: 'city',
          key: 'city',
          width: 200
        });
      }
    } else {
      columns.splice(1, 0, {
        title: `${!type ? '火车席位' : '航班舱型'}`,
        dataIndex: 'level',
        key: 'level',
        render: (_, record) => {
          const optionsList = !type ? objToArr(trainLevels) : objToArr(flightLevels);
          return (
            <Form.Item>
              {
                getFieldDecorator(`trainLevels[${record.key}]`)(
                  <Select
                    mode="multiple"
                    style={{ width: '100%', maxWidth: '240px' }}
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
