import React, { Component } from 'react';
import { Form, Input, Button, Radio, Select, message } from 'antd';
import { formItemLayout } from '@/utils/constants';
import { choosePeople } from '@/utils/ddApi';
import { connect } from 'dva';

const labelIn = {
  assignMember: '指定发放人',
  approverRole: '按审批角色分工'
};
const { Option } = Select;
@Form.create()
@connect(({ global }) => ({
  approverRoleList: global.approverRoleList,
}))
class ApproveSend extends Component {
  constructor(props) {
    super(props);
    props.onChangeData(this.onSubmit);
    this.state = {
      users: this.props.approveNode && this.props.approveNode.userList ? this.props.approveNode.userList : [],
      type: this.props.approveNode.type || 'assignMember',
    };
  }

  onShow = () => {
    const { nodeType, nodeDetail } = this.props;
    if (nodeType === 'grant') {
      if (nodeDetail && nodeDetail.bizData && nodeDetail.bizData.approveNode) {
        this.setState({
          users: (nodeDetail.bizData.approveNode && nodeDetail.bizData.approveNode.users) || []
        });
      }
    }
  }

  onSubmit = () => {
    const {
      users,
    } = this.state;
    const {
      nodeDetail,
    } = this.props;
    let appNode = {...nodeDetail};
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let content = '';
        let approves = {
          type: val.type,
          name: labelIn[val.type]
        };
        if (users && users.length > 0) {
          approves = {
              ...approves,
              userList: users,
          };
          content = users.map(it => it.userName).toString();
        } else {
          content = '按审批角色分工';
          approves = {
            ...approves,
            rule: {
              values: [{
                type: 'approverRoleId',
                value: val.value,
              }]
            }
          };
        }
        if (val.type === 'assignMember' && users.length === 0) {
          appNode = 'message';
          message.error('请选择指定人员');
          return;
        }
        appNode = {
          ...appNode,
          name: val.name,
          content,
          bizData: {
            approveNode: approves,
          }
        };
      } else {
        const keys = Object.keys(err);
        appNode = 'message';
        message.error(err[keys[0]].errors[0].message);
      }
    });
    return appNode;
  }

  onChange = (e) => {
    this.setState({
      type: e.target.value,
      users: [],
    });
  }

  onAddPeople = () => {
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
      nodeDetail,
      form: { getFieldDecorator },
      approverRoleList,
      approveNode,
    } = this.props;
    const { users, type } = this.state;
    return (
      <Form>
        <Form.Item label="发放节点名称" {...formItemLayout}>
          {
            getFieldDecorator('name', {
              initialValue: nodeDetail.name || '',
            })(
              <Input placeholder="请输入" />
            )
          }
        </Form.Item>
        <Form.Item label="设置人员" {...formItemLayout}>
          {
            getFieldDecorator('type', {
              initialValue: type,
            })(
              <Radio.Group onChange={e => this.onChange(e)}>
                <Radio value="assignMember">指定发放人</Radio>
                <Radio value="approverRole">按审批角色分工</Radio>
              </Radio.Group>
            )
          }
          {
            type === 'approverRole' &&
            <div>
              {
                getFieldDecorator('value', {
                  initialValue: approveNode.ruleValue,
                  rules: [{ required: true, message: '请选择审批角色' }]
                })(
                  <Select>
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
          {
            type === 'assignMember' &&
            <div>
              <Button type="primary" onClick={() => this.onAddPeople()}>添加人员</Button>
              <p style={{marginBottom: 0, marginTop: '8px', lineHeight: 1}}>
                {
                  users.map((it,index) => (
                    <span className="fs-14 c-black-45" key={it.userId}>{it.userName}{(index !== (users.length -1)) && '、'}</span>
                  ))
                }
              </p>
            </div>
          }
        </Form.Item>
      </Form>
    );
  }
}

export default ApproveSend;
