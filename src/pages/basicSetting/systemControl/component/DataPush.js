import React, { PureComponent } from 'react';
import { Table, Switch, Select, Form, Popover, Checkbox, message } from 'antd';
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
        id: 'weeklyReportSetting',
        name: '1. 周报数据推送',
        img: week,
        initDetail: {},
        list: [{
          id: 'weeklyReportSetting',
          key: 'userPush',
          rowSpan: 2,
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
        }, {
          key: 'rolePush',
          id: 'weeklyReportSetting',
          rowSpan: 0,
        }]
      }, {
        id: 'monthlyReportSetting',
        name: '2. 月报数据推送',
        img: month,
        list: [{
          id: 'monthlyReportSetting',
          key: 'userPush',
          rowSpan: 2,
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
        }, {
          key: 'rolePush',
          id: 'monthlyReportSetting',
          rowSpan: 0,
        }]
      }],
      roles: {},
      roleVisible: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.details !== state.initDetail) {
      console.log('DataPush -> getDerivedStateFromProps -> details走了吗', props.details);
      const { details: { monthlyReportSetting, weeklyReportSetting } } = props;
      const newArr = [{
        id: 'weeklyReportSetting',
        name: '1. 周报数据推送',
        img: week,
        list: [{
          ...weeklyReportSetting,
          id: 'weeklyReportSetting',
          key: 'userPush',
          rowSpan: 2,
        }, {
          ...weeklyReportSetting,
          key: 'rolePush',
          id: 'weeklyReportSetting',
          rowSpan: 0,
        }]
      }, {
        id: 'monthlyReportSetting',
        name: '2. 月报数据推送',
        img: month,
        list: [{
          ...monthlyReportSetting,
          id: 'monthlyReportSetting',
          key: 'userPush',
          rowSpan: 2,

        }, {
          ...monthlyReportSetting,
          key: 'rolePush',
          id: 'monthlyReportSetting',
          rowSpan: 0,
        }]
      }];
      return {
        list: newArr,
        initDetail: props.details,
        roles: {
          monthlyReportSetting: (monthlyReportSetting && monthlyReportSetting.roles) || [],
          weeklyReportSetting: (weeklyReportSetting && weeklyReportSetting.roles) || [],
        }
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
     console.log('🚀 ~ file: DataPush.js ~ line 120 ~ DataPush ~ res', res);
      const arr = [];
      if (res.length) {
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
    }, {
      multiple: true,
      max: 1000,
    });
  }

  handleRole = (record) => {
    const { roles } = this.state;
    console.log('DataPush -> handleRole -> roles', roles);
    if (roles[record.id] && roles[record.id].length) {
      this.onChange(roles[record.id], record, 'roles');
      this.setState({
        roleVisible: false,
      });
    } else {
      message.error('不能为空');
    }
  }

  onChangeCheck = (e, record) => {
    const { roleUserList } = this.props;
    const { roles } = this.state;
    const newArr = roleUserList.filter(it => e.includes(it.id));
    console.log('DataPush -> onChangeCheck -> newArr', newArr);
    this.setState({
      roles: {
        ...roles,
        [record.id]: newArr.map(it => {
          return {
            id: it.id,
            name: it.roleName,
          };
        }),
      }
    });
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
    const { list, roleVisible } = this.state;
    const colums = [{
      dataIndex: 'people',
      title: '推送人员/角色',
      render: (_, record) => {
        console.log('roles', record.roles);
        if (record.key === 'userPush') {
          const useStr = record.users && record.users.length ? record.users.map(it => it.name).join('、') : '';
          return (
            <span className={style.selP} onClick={e => this.handlePeople(e, record)}>
              <img src={add} alt="选择人员" />
              {
                useStr ?
                  <span style={{color: 'rgba(0,0,0,0.65)'}}>{useStr}</span>
                  :
                  <span style={{color: '#00C795'}}>选择人员</span>
              }
            </span>
          );
        }
        const roleStr = record.roles && record.roles.length ? record.roles.map(it => it.name).join('、') : '';
        return (
          <Popover
            overlayClassName={style.popovers}
            title={null}
            visible={roleVisible === record.id}
            content={(
              <div className={style.check}>
                <div className={style.checkGroup}>
                  <Form.Item>
                    {
                      getFieldDecorator(`rolePush[${record.id}]`, {
                        initialValue: record.roles ? record.roles.map(it => it.id) : [],
                      })(
                        <CheckboxGroup onChange={e => this.onChangeCheck(e, record)}>
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
                <div className={style.btnName}>
                  <div className={style.btn} onClick={() => this.setState({ roleVisible: null, })}>
                    取消
                  </div>
                  <div className={style.btns} onClick={() => this.handleRole(record)}>
                    确定
                  </div>
                </div>
              </div>
            )}
            placement="topLeft"
            trigger="click"
          >
            <div className={style.selP} onClick={() => this.setState({ roleVisible: record.id })}>
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
              <Switch checked={record.isPush} onChange={e => this.onChange(e, record, 'isPush')} />
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
                <Select
                  style={{ width: '80px' }}
                  className="m-l-8 m-r-8"
                  onChange={val => this.onChange(val, record, 'pushDate')}
                  value={record.pushDate ? `${record.pushDate}` : '8'}
                >
                  {
                    time.map(it => (
                      <Select.Option key={it.key}>{it.name}</Select.Option>
                    ))
                  }
                </Select>
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
                rowKey="key"
              />
            </div>
          ))
        }
      </Form>
    );
  }
}

export default DataPush;
