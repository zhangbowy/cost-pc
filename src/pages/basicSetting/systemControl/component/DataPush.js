import React, { PureComponent } from 'react';
import { Table, Switch, Select, Form, Popover, Checkbox } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import add from '@/assets/img/addP.png';
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
      details: {
        weekMessage: [{
          'id': 0,
          'type': 0,
          companyId: '470547661288640512',
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
          users: [{
            avatar: 'https://static.dingtalk.com/media/lADPD2eDQaJ77dDNA_XNA_U_1013_1013.jpg',
            id: '0107443251773952',
            name: '幺幺'
          }],
          roles: [{
            id: '470613719782166528',
            name: '超级管理员'
          }],
        }],
        monthMessage: [{
          'id': 1,
          'type': 1,
          companyId: '470547661288640512',
          userPush: 0,
          rolePush: 0,
          pushDate: 9,
          users: [{
            avatar: 'https://static.dingtalk.com/media/lADPD2eDQaJ77dDNA_XNA_U_1013_1013.jpg',
            id: '0107443251773952',
            name: '幺幺'
          }],
          roles: [{
            id: '470613719782166528',
            name: '超级管理员'
          }],
        }]
      }
    };
  }

  handlePeople = (e, record) => {
    e.stopPropagation();
    const _this = this;
    const { details } = this.state;
    choosePeople(
      record.userPush ? record.userPush.map(it => it.userId) : [],
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
            [record.id]: [{
              ...details[record.id][0],
              users: arr,
            }]
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

  render() {
    const { form: { getFieldDecorator }, roleUserList } = this.props;
    const list = [{
      id: 'weekMessage',
      name: '1. 周报数据推送',
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
    }];
    const colums = [{
      dataIndex: 'people',
      title: '推送人员/角色',
      render: (_, record) => {
        if (record.key === 'userPush') {
          return (
            <div className={style.selP} onClick={e => this.handlePeople(e, record)}>
              <img src={add} alt="选择人员" />
              <span style={{color: '#00C795'}}>选择人员</span>
            </div>
          );
        }
        return (
          <Popover
            overlayClassName={style.popovers}
            title={null}
            content={(
              <div className={style.check}>
                <div className={style.checkGroup}>
                  <Form.Item>
                    {
                      getFieldDecorator(`rolePush[${record.id}]`)(
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
                <div className={style.btns} onClick={() => this.handleRole()}>
                  确定
                </div>
              </div>
            )}
            placement="topLeft"
            trigger="click"
          >
            <div className={style.selP}>
              <img src={add} alt="选择人员" />
              <span style={{color: '#00C795'}}>选择角色</span>
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
                getFieldDecorator(`userPush[${record.userPush}]`)(
                  <Switch />
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
                    <Select style={{ width: '80px' }} className="m-l-8 m-r-8">
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
              <p className="c-black-85 fs-14 m-b-12">{it.name}</p>
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
