import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { formItemLayout } from '@/utils/constants';
import { choosePeople } from '@/utils/ddApi';

@Form.create()
class ApproveSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      users: [],
      approveNode: {},
    };
  }

  onShow = () => {
    const { nodeType, nodeDetail } = this.props;
    if (nodeType === 'GRANT') {
      if (nodeDetail && nodeDetail.bizData && nodeDetail.bizData.approveNode) {
        this.setState({
          approveNode: nodeDetail.bizData.approveNode,
          users: (nodeDetail.bizData.approveNode && nodeDetail.bizData.approveNode.users) || []
        });
      }
      this.setState({
        visible: true
      });
    }
  }

  onCancel = () => {
    this.setState({
      visible: false,
      users: [],
    });
  }

  onSubmit = () => {
    const {
      users,
      approveNode,
    } = this.state;
    const {
      onChangeData,
      nodeDetail,
    } = this.props;
    let appNode = {...nodeDetail};
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        if (users) {
          appNode = {
            ...appNode,
            name: val.name,
            bizData: {
              approveNode: {
                ...approveNode,
                users,
              },
            }
          };
        }
        this.onCancel();
        // eslint-disable-next-line no-unused-expressions
        onChangeData && onChangeData(appNode, 'edit');
      }

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
      children,
      nodeDetail,
      form: { getFieldDecorator },
    } = this.props;
    const { visible, users } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="设置发放节点"
          visible={visible}
          onCancel={() => this.onCancel()}
          onOk={() => this.onSubmit()}
          maskClosable={false}
        >
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
            <Form.Item label="发放人" {...formItemLayout}>
              <Button type="primary" onClick={() => this.onAddPeople()}>添加人员</Button>
              <p style={{marginBottom: 0, marginTop: '8px', lineHeight: 1}}>
                {
                  users.map((it,index) => (
                    <span className="fs-14 c-black-45" key={it.userId}>{it.userName}{(index !== (users.length -1)) && '、'}</span>
                  ))
                }
              </p>
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default ApproveSend;
