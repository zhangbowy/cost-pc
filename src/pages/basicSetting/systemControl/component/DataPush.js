import React, { PureComponent } from 'react';
import { Table, Switch, Select, Form, Popover, Checkbox } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import add from '@/assets/img/addP.png';
import week from '@/assets/img/week1.png';
import month from '@/assets/img/month1.png';
import style from './index.scss';
import { choosePeople } from '../../../../utils/ddApi';

const time = [ {
  key: '8',
  name: '8:00'
}, {
  key: '9',
  name: '9:00'
}, {
  key: '10',
  name: '10:00'
}];
@Form.create()
class DataPush extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      list: [{
        id: 'weekMessage',
        name: '1. 周报数据推送',
        img: week,
        list: [{
          id: 'weekMessage',
          key: 'userPush',
          rowSpan: 2,
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
        }, {
          key: 'rolePush',
          rowSpan: 0,
        }]
      }, {
        id: 'monthMessage',
        name: '2. 月报数据推送',
        img: month,
        list: [{
          id: 'monthMessage',
          key: 'userPush',
          rowSpan: 2,
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
        }, {
          key: 'rolePush',
          rowSpan: 0,
        }]
      }]
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.details !== state.list) {
      const { details: { monthMessage, weekMessage } } = props;
      const newArr = [{
        id: 'weekMessage',
        name: '1. 周报数据推送',
        img: week,
        list: [{
          ...weekMessage,
          id: 'weekMessage',
          key: 'userPush',
          rowSpan: 2,
        }, {
          ...weekMessage,
          key: 'rolePush',
          rowSpan: 0,
        }]
      }, {
        id: 'monthMessage',
        name: '2. 月报数据推送',
        img: month,
        list: [{
          ...monthMessage,
          id: 'monthMessage',
          key: 'userPush',
          rowSpan: 2,

        }, {
          ...monthMessage,
          key: 'rolePush',
          rowSpan: 0,
        }]
      }];
      return {
        list: newArr
      };
    }
    return null;
  }

  handlePeople = (e, record) => {
    e.stopPropagation();
    const _this = this;
    const { details } = this.props;
    choosePeople(
      record.users ? record.users.map(it => it.userId) : [],
     (res) => {
      const arr = [];
      if (res) {
        if (res) {
          res.forEach(item => {
            arr.push({
              userId: item.emplId,
              id: item.emplId,
              name: item.name,
              avatar: item.avatar,
            });
          });
          _this.props.onChange({
            ...details,
            [record.id]: {
              ...details[record.id],
              users: arr,
            }
          });
          console.log('添加的人员', arr);
        }
      }
    }, {
      multiple: true,
      max: 1000,
    });
  }

  handleRole = () => {

  }

  onChange = (e, record, str) => {
    const { details } = this.props;
    this.props.onChange({
      ...details,
      [record.id]: {
        ...details[record.id],
        [str]: e,
      }
    });
  }

  render() {
    const { form: { getFieldDecorator }, roleUserList } = this.props;
    const { list } = this.state;
    const colums = [{
      dataIndex: 'people',
      title: '推送人员/角色',
      render: (_, record) => {
        console.log('roles', record.roles);
        if (record.key === 'userPush') {
          const useStr = record.users && record.users.length ? record.users.map(it => it.name).join('、') : '';
          return (
            <div className={style.selP} onClick={e => this.handlePeople(e, record)}>
              <img src={add} alt="选择人员" />
              {
                useStr ?
                  <span style={{color: 'rgba(0,0,0,0.65)'}}>{useStr}</span>
                  :
                  <span style={{color: '#00C795'}}>选择人员</span>
              }
            </div>
          );
        }
        const roleStr = record.roles && record.roles.length ? record.roles.map(it => it.name).join('、') : '';
        return (
          <Popover
            overlayClassName={style.popovers}
            title={null}
            content={(
              <div className={style.check}>
                <div className={style.checkGroup}>
                  <Form.Item>
                    {
                      getFieldDecorator(`rolePush[${record.id}]`, {
                        initialValue: record.roles ? record.roles.map(it => it.id) : [],
                      })(
                        <CheckboxGroup>
                          {
                            roleUserList.map(it => (
                              <Checkbox value={it.id} key={it.id}>{it.roleName}</Checkbox>
                            ))
                          }
                        </CheckboxGroup>
                      )
                    }
                  </Form.Item>
                </div>
                <div className={style.btns} onClick={() => this.handleRole(record)}>
                  确定
                </div>
              </div>
            )}
            placement="topLeft"
            trigger="click"
          >
            <div className={style.selP}>
              <img src={add} alt="选择人员" />
              {
                roleStr ?
                  <span style={{color: 'rgba(0,0,0,0.65)'}}>{roleStr}</span>
                  :
                  <span style={{color: '#00C795'}}>选择角色</span>
              }
            </div>
          </Popover>
        );
      },
      width: 200
    }, {
      dataIndex: 'is',
      title: '是否推送',
      render: (_, record) => {
        return {
          props: {
            rowSpan: record.rowSpan,
          },
          children: (
            <Form.Item style={{marginBottom: 0}}>
              {
                getFieldDecorator(`isPush[${record.id}]`, {
                  initialValue: record.isPush,
                  valuePropName: 'checked'
                })(
                  <Switch onChange={e => this.onChange(Number(e), record, 'isPush')} />
                )
              }
            </Form.Item>
          )
        };
      },
      width: 100
    }, {
      dataIndex: 'time',
      title: '推送时间',
      render: (_, record) => {
        return {
          props: {
            rowSpan: record.rowSpan,
          },
          children: (
            <div className={style.tableForm}>
              <span>每周一早上</span>
              <Form.Item>
                {
                  getFieldDecorator(`pushDate[${record.id}]`, {
                    initialValue: record.pushDate ? `${record.pushDate}` : '8'
                  })(
                    <Select
                      style={{ width: '80px' }}
                      className="m-l-8 m-r-8"
                      onChange={val => this.onChange(val, record, 'pushDate')}
                    >
                      {
                        time.map(it => (
                          <Select.Option key={it.key}>{it.name}</Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
              <span>推送</span>
            </div>
          )
        };
      },
      width: 100
    }];
    return (
      <Form className="m-t-24">
        {
          list.map(it => (
            <div key={it.key} className="m-b-28">
              <div className={style.popTitle}>
                <p className="c-black-85 fs-14 m-b-12">{it.name}</p>
                <Popover
                  overlayClassName={style.popImg}
                  content={(
                    <div className={style.popStyle}>
                      <img src={it.img} alt="数据" style={{width: '360px'}} />
                    </div>
                  )}
                  placement="rightTop"
                >
                  <i className="iconfont iconshuomingwenzi c-black-45 m-l-8 fs-14" />
                </Popover>
              </div>
              <Table
                columns={colums}
                pagination={false}
                dataSource={it.list}
                className={style.tableList}
              />
            </div>
          ))
        }
      </Form>
    );
  }
}

export default DataPush;
