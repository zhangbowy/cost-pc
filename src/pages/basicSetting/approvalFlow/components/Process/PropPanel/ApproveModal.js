import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Radio, Button, Checkbox, Select, Divider, Row, Col, message, Tooltip } from 'antd';
import { connect } from 'dva';
import { formItemLayout, approveSet, approveLeader, approveCreate, approveUser } from '@/utils/constants';
import { getArrayValue, approveCreateObj } from '../../../../../../utils/constants';
import { choosePeople } from '../../../../../../utils/ddApi';
import style from './index.scss';

const RadioGroup = Radio.Group;
const { Option } =  Select;
const nodeTypes = {
  approver: '审批节点',
  notifier: '抄送节点',
};
@Form.create()
@connect(({ global }) => ({
  approverRoleList: global.approverRoleList,
}))
class ApproveModal extends Component {
  static propTypes = {
    details: PropTypes.object,
  }

  constructor(props) {
    super(props);
    props.viewShowModal(this.getItems);
    this.state = {
      users: this.props.approveNode && this.props.approveNode.userList ? this.props.approveNode.userList : [],
      type: this.props.approveNode.type || '',
    };
  }

  onChange = (e) => {
    this.setState({
      type: e.target.value,
      users: [],
    });
  }

  getItems = () => {
    const {
      form,
      details,
      nodeType,
      approverRoleList
    } = this.props;
    const { users } = this.state;
    let vals = { ...details };
    let prods = '';
    form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let approveNodes = {
          type: val.type,
          name: getArrayValue(val.type, approveUser),
          method: val.method,
          userList: users,
        };
        if (val.type === 'assignMember' && (!users || (users && users.length === 0))) {
          vals = 'message';
          message.error('请选择指定人员');
          return;
        }
        prods = users.length ? users.map(it => it.userName).join(',') : '';
        if (val.type === 'leader') {
          prods = `${approveCreateObj[val.methods]}${approveCreateObj[val.ruleType]}`;
          approveNodes = {
            ...approveNodes,
            rule: {
              method: val.methods,
              values: [{
                type: val.ruleType,
              }]
            }
          };
        } else if (val.type === 'approverRole') {
          const objs = approverRoleList.filter(it => it.id === val.value);
          prods = objs[0].approveRoleName;
          approveNodes = {
            ...approveNodes,
            rule: {
              method: val.method,
              values: [{
                value: val.value,
                type: 'approverRoleId',
              }]
            }
          };
        }
        if (nodeType === 'notifier') {
          if (users.length === 0 && !val.allowSelfChoose) {
            message.error('请设置抄送人员或允许提交人自选');
            vals='notifier';
            return;
          }
          approveNodes = {
            ...approveNodes,
            type: 'notifier',
            name: val.allowSelfChoose ? '提交人自选' : users.map(it => it.userName).toString(),
            allowSelfChoose: val.allowSelfChoose,
          };
        }
        vals = {
          ...vals,
          name: val.name,
          content: prods ? `${approveNodes.name}-${prods}` : approveNodes.name,
          bizData: {
            approveNode: approveNodes,
          },
        };

      } else {
          const keys = Object.keys(err);
          vals = 'message';
          message.error(err[keys[0]].errors[0].message);
      }
    });
    return vals;
  }

  addPeople = () => {
    const _this = this;
    const { users } = this.state;
    choosePeople(users.map(it => it.userId), (res) => {
      const arr = [];
      res.forEach(item => {
        arr.push({
          userId: item.emplId,
          avatar: item.avatar,
          userName: item.name,
        });
      });
      _this.setState({
        users: arr
      });
    }, { multiple: true, max: 20 });
  }

  render() {
    const {
      details,
      form: { getFieldDecorator },
      nodeType,
      approveNode,
      approverRoleList,
      templateType
    } = this.props;
    console.log(`approveNode${JSON.stringify(approveNode)}`);
    const { users, type } = this.state;
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let radioList = approveUser;
    if (nodeType !== 'approver') {
      radioList = approveUser.filter(it => it.key !== 'leader');
    }
    if (Number(templateType) !== 0 && Number(templateType) !== 3) {
      radioList = radioList.filter(it => it.key !== 'bearUser');
    }
    const newArr = [...approveCreate];
    const approveArr = Number(templateType) ? newArr.filter(it => it.key==='make_user') : approveCreate;
    return (
      <Form>
        <Form.Item label={`${nodeTypes[nodeType]}名称`} {...formItemLayout}>
          {
            getFieldDecorator('name', {
              initialValue: details && details.name,
              rules: [{ required: true, message: '请输入名称' }]
            })(
              <Input placeholder="请输入" />
            )
          }
        </Form.Item>
        <Form.Item label="设置人员" {...formItemLayouts} className={style.changeStyle}>
          {
            nodeType === 'approver' &&
              getFieldDecorator('type', {
                initialValue: approveNode.type
              })(
                <RadioGroup onChange={e => this.onChange(e)}>
                  {
                    radioList.map(item => (
                      <Radio key={item.key} value={item.key}>
                        {
                          item.key === 'approverRole' ?
                            <span>
                              {item.value}
                              <Tooltip
                                title={(
                                  <div className="fs-14">
                                    <p style={{marginBottom: 0}}>1.审核角色是什么？</p>
                                    <p className="m-b-8">可以将有相同审批职能的人设置为同一角色，并将角色添加为审批人。</p>
                                    <p style={{marginBottom: 0}}>2.角色的管理范围？</p>
                                    <p className="m-b-8">角色中的每个人可以指定管理的部门/支出类别，设置后对应部门/支出类别的员工的审批就由对应的人审批</p>
                                    <p style={{marginBottom: 0}}>如何添加审批角色？</p>
                                    <p style={{marginBottom: 0}}>进入设置-&lt;角色管理-&lt;审批角色，有两种方式添加审批角色</p>
                                    <p style={{marginBottom: 0}}>a.手动添加</p>
                                    <p className="m-b-8">b.直接同步钉钉通讯录的角色至鑫支出</p>
                                  </div>
                                )}
                                placement="bottomRight"
                              >
                                <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                              </Tooltip>
                            </span>
                            :
                            <span>{item.value}</span>
                        }
                      </Radio>
                    ))
                  }
                </RadioGroup>
              )
          }
          {
            (type === 'assignMember' || nodeType !== 'approver') &&
            <div className="m-t-10">
              <Button type="primary" onClick={() => this.addPeople()}>添加成员</Button>
              <span className="m-l-16 fs-14 c-black-45">不能超过20人</span>
              <p style={{marginBottom: 0, marginTop: '8px', lineHeight: 1}}>
                {
                  users.map((it,index) => (
                    <span className="fs-14 c-black-45" key={it.userId}>{it.userName}{(index !== (users.length -1)) && '、'}</span>
                  ))
                }
              </p>
            </div>
          }
          {
            (nodeType !== 'approver') &&
            getFieldDecorator('allowSelfChoose', {
              initialValue: (approveNode && approveNode.allowSelfChoose) || false,
              valuePropName: 'checked'
            })(
              <Checkbox className="m-t-10">允许提交人自选</Checkbox>
            )
          }
          {
            type === 'leader' &&
            <div className="m-t-10">
              <span className="fs-14 c-black-45">按&nbsp;</span>
              {
                getFieldDecorator('methods', {
                  initialValue: (approveNode && approveNode.methods) || '',
                  rules: [{ required: true, message: '请选择指定主管' }]
                })(
                  <Select style={{width: '150px'}}>
                    {
                      approveArr.map(item => (
                        <Option key={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
              <span className="fs-14 c-black-45">&nbsp;向上匹配，由&nbsp;</span>
              {
                getFieldDecorator('ruleType', {
                  initialValue: approveNode.ruleType || '',
                  rules: [{ required: true, message: '请选择指定主管' }]
                })(
                  <Select style={{width: '100px'}}>
                    {
                      approveLeader.map(item => (
                        <Option key={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
              <span className="fs-14 c-black-45">&nbsp;审批</span>
            </div>
          }
          {
            type === 'approverRole' &&
            <div className="m-t-10">
              {
                getFieldDecorator('value', {
                  initialValue: approveNode.ruleValue,
                  rules:[{ required: true, message: '请选择审批角色' }]
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      approverRoleList.map(it => (
                        <Option key={it.id}>{it.approveRoleName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </div>
          }

        </Form.Item>
        {
          nodeType === 'approver' &&
          <Divider type="horizontal" />
        }
        {
          nodeType === 'approver' &&
          <p>
            <span className="fs-14 c-black-85">多人审批时采取的审批方式</span>
            <span className="fs-14 c-black-35">（2人以上生效，审批人空缺时自动跳过）</span>
          </p>
        }
        {
          nodeType === 'approver' &&
          <Row>
            <Col span={6} />
            <Col span={18}>
              <Form.Item {...formItemLayouts}>
                {
                  getFieldDecorator('method', {
                    initialValue: approveNode.method || 'AND'
                  })(
                    <RadioGroup>
                      {
                        approveSet.map(item => (
                          <Radio key={item.key} value={item.key} className="m-t-10">{item.value}</Radio>
                        ))
                      }
                    </RadioGroup>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        }
      </Form>
    );
  }
}

export default ApproveModal;
