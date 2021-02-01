import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio, Divider, Row, Col, Button, message, Checkbox, Tooltip } from 'antd';
import { approveUser, approveCreate, approveSet, approveLeader } from '@/utils/constants';
import RadioGroup from 'antd/lib/radio/group';
import { choosePeople } from '@/utils/ddApi';
import { timeStampToHex } from '@/utils/common';

const {Option} = Select;
const nodeTypes = {
  APPROVER: '审批节点',
  NOTIFIER: '抄送节点',
};
@Form.create()
class ApproveSettingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      typeFirst: 'ASSIGN_MEMBER',
      users: [],
      nodeType: props.nodeType || 'APPROVER',
      approveNode: {},
      types: 'add', // 添加或者编辑
      typeSecond: {}, // 二级节点
      // ccPosition: props.ccPosition || '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.details !== this.props.details) {
      if (this.props.details.bizData && this.props.details.bizData.approveNode) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          approveNode: this.props.details.bizData.approveNode,
          users: this.props.details.bizData.approveNode.users || [],
        });
        if (this.props.details.bizData.approveNode.typeAttr) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            typeFirst: this.props.details.bizData.approveNode.typeAttr.typeFirst || 'ASSIGN_MEMBER',
            typeSecond: this.props.details.bizData.approveNode.typeAttr.typeSecond || {}
          });
        }
      }
    }
  }

  onChange = (e) => {
    this.setState({
      typeFirst: e.target.value,
      users: [],
    });
  }

  onReset() {
    this.props.form.resetFields();
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
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

  onShow = () => {
    const { details, Add } = this.props;
    let types = 'add';
    if (!Add) {
      if (details.bizData && details.bizData.approveNode) {
        this.setState({
          approveNode: details.bizData.approveNode,
          users: details.bizData.approveNode.users || [],
        });
        if (details.bizData.approveNode.typeAttr) {
          this.setState({
            typeFirst: details.bizData.approveNode.typeAttr.typeFirst || 'ASSIGN_MEMBER',
            typeSecond: details.bizData.approveNode.typeAttr.typeSecond || {}
          });
        }
      }
      types = 'edit';
    }
    this.setState({
      visible: true,
      types,
    });
  }

  onSubmit = () => {
    const {
      users,
      // approveNode,
      types,
    } = this.state;
    const {
      onChangeData,
      details,
      nodeType,
    } = this.props;
    const appNode = {};
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const detail = {};
        if (val.typeFirst === 'ASSIGN_MEMBER') {
          if (!users || users.length === 0) {
            message.error('请选择指定人员');
            return;
          }
          Object.assign(appNode, {
            typeAttr: {
              typeFirst: val.typeFirst,
            },
            method: val.method,
          });
        }
        if (val.typeFirst === 'LEADER') {
          Object.assign(appNode, {
            typeAttr: {
              typeFirst: val.typeFirst,
              typeSecond: {
                sFirst: val.sFirst,
                sSecond: val.sSecond,
              },
            },
            method: val.method,
          });
        }
        if (val.typeFirst === 'SELF_CHOOSE') {
          Object.assign(appNode, {
            typeAttr: {
              typeFirst: val.typeFirst,
              typeSecond: null,
            },
            method: val.method,
          });
        }
        if (users) {
          Object.assign(appNode, {
            users,
          });
        }
        if (nodeType !== 'APPROVER') {
          Object.assign(appNode, {
            allowSelfChoose: val.allowSelfChoose,
          });
          if (!val.allowSelfChoose && users.length === 0) {
            message.error('请设置人员');
            return;
          }
          if (types === 'add') {
            this.changeCC();
          }
        }
        if (details) {
          Object.assign(detail, {
            nodeId: details.nodeId,
            name: val.name,
            nodeType,
            preNodeId: details.preNodeId,
            bizData: {
              approveNode: appNode,
            },
            childNode: details.childNode,
          });
        } else {
          const time = timeStampToHex();
          const { parentNode } = this.props;
          Object.assign(detail, {
            nodeId: `${nodeType}_${time+1}`,
            name: val.name,
            nodeType,
            preNodeId: parentNode.nodeId,
            bizData: {
              approveNode: appNode,
            },
            childNode: parentNode.childNode,
          });
        }
        this.setState({
          visible: false,
        });
        this.onReset();
        // eslint-disable-next-line no-unused-expressions
        onChangeData && onChangeData(detail, types);
      } else if (err.sFirst || err.sSecond) {
          message.error('请选择指定主管');
        }
    });
  }

  // 判断抄送节点
  changeCC = () => {
    const { parentNode } = this.props;
    let str = '';
    if (parentNode.nodeType === 'START') {
      str = 'START';
    } else {
      str = 'FINISH';
    }
    this.props.onChangePotion(str);
  }

  render() {
    const {
      visible,
      typeFirst,
      nodeType,
      approveNode,
      users,
      typeSecond,
    } = this.state;
    const {
      children,
      form: { getFieldDecorator },
      details
    } = this.props;
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
    if (nodeType !== 'APPROVER') {
      radioList = approveUser.filter(it => it.key !== 'LEADER');
    }
    return (
      <span>
        <span onClick={() => this.onShow()}>
          {children}
        </span>
        <Modal
          visible={visible}
          title={nodeType === 'APPROVER' ? '设置审批节点' : '设置抄送节点'}
          width="580px"
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={this.onSubmit} type="primary">保存</Button>
          ]}
          onCancel={this.onCancel}
        >
          <Form>
            <Form.Item label={`${nodeTypes[nodeType]}名称`} {...formItemLayouts}>
              {
                getFieldDecorator('name', {
                  initialValue: details && details.name,
                  rules: [{ required: true, message: '请输入名称' }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            <Form.Item label="设置人员" {...formItemLayouts}>
              {
                nodeType === 'APPROVER' &&
                  getFieldDecorator('typeFirst', {
                    initialValue: typeFirst
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
                                      <div>
                                        <p className="m-b-8">1.审核角色是什么？</p>
                                        <p className="m-b-8">可以将有相同审批职能的人设置为同一角色，并将角色添加为审批人。</p>
                                        <p className="m-b-8">2.角色的管理范围？</p>
                                        <p className="m-b-8">角色中的每个人可以指定管理的部门/费用类别，设置后对应部门/费用类别的员工的审批就由对应的人审批</p>
                                        <p className="m-b-8">如何添加审批角色？</p>
                                        <p className="m-b-8">进入设置-&lt;角色管理-&lt;审批角色，有两种方式添加审批角色</p>
                                        <p className="m-b-8">a.手动添加</p>
                                        <p className="m-b-8">b.直接同步钉钉通讯录的角色至鑫支出</p>
                                      </div>
                                    )}
                                    placement="bottomLeft"
                                  >
                                    <i className="iconfont iconIcon-yuangongshouce" />
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
                (typeFirst === 'ASSIGN_MEMBER' || nodeType !== 'APPROVER') &&
                <div>
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
                (nodeType !== 'APPROVER') &&
                getFieldDecorator('allowSelfChoose', {
                  initialValue: (approveNode && approveNode.allowSelfChoose) || false,
                  valuePropName: 'checked'
                })(
                  <Checkbox >允许提交人自选</Checkbox>
                )
              }
              {
                typeFirst === 'LEADER' &&
                <div>
                  <span className="fs-14 c-black-45">按&nbsp;</span>
                  {
                    getFieldDecorator('sFirst', {
                      initialValue: typeSecond.sFirst || '',
                      rules: [{ required: true, message: '请选择指定主管' }]
                    })(
                      <Select style={{width: '150px'}}>
                        {
                          approveCreate.map(item => (
                            <Option key={item.key}>{item.value}</Option>
                          ))
                        }
                      </Select>
                    )
                  }
                  <span className="fs-14 c-black-45">&nbsp;向上匹配，由&nbsp;</span>
                  {
                    getFieldDecorator('sSecond', {
                      initialValue: typeSecond.sSecond || '',
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

            </Form.Item>
            {
              nodeType === 'APPROVER' &&
              <Divider type="horizontal" />
            }
            {
              nodeType === 'APPROVER' &&
              <p>
                <span className="fs-14 c-black-85">多人审批时采取的审批方式</span>
                <span className="fs-14 c-black-35">（2人以上生效，审批人空缺时自动跳过）</span>
              </p>
            }
            {
              nodeType === 'APPROVER' &&
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
                              <Radio key={item.key} value={item.key}>{item.value}</Radio>
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
        </Modal>
      </span>
    );
  }
}

export default ApproveSettingModal;
