import React, { Component } from 'react';
import { Modal, Tag, Button } from 'antd';
import { choosePeople } from '../../../../utils/ddApi';

class LookAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      userVos: [],
    };
  }

  onShow = () => {
    const { userVos } = this.props;
    this.setState({
      visible: true,
      userVos,
    });
  }

  handleClose = removedTag => {
    const { userVos } = this.state;
    const tags = userVos.filter(tag => tag.userId !== removedTag);
    console.log(tags);
    this.setState({ userVos: tags });
  };

  selectPeople = () => {
    const { userVos } = this.state;
    const _this = this;
    const { payUserCount, checkAll, allUserCount } = this.props;
    choosePeople(userVos.map(it => it.userId), (res) => {
      console.log('取消', res);
      let user = userVos;
      if (res && res.length > 0) {
        user = res.map(it =>  {
          return {
            avatar: it.avatar,
            userName: it.name,
            userId: it.emplId
          };
        });
      }
      _this.setState({
        userVos: user,
      });
    }, {
      max: checkAll ? allUserCount : payUserCount,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onSave = () => {
    const { userVos } = this.state;
    this.onCancel();
    this.props.onChangePeo(userVos);

  }

  render() {
    const { children, payUserCount, checkAll, allUserCount } = this.props;
    const { visible, userVos } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="查看全部授权人员"
          visible={visible}
          bodyStyle={{
            height: '334px',
            overflowY: 'scroll'
          }}
          onCancel={this.onCancel}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={() => this.onSave()} type="primary">保存</Button>
          ]}
        >
          <div className="m-b-16">
            <Button
              type="default"
              className="m-r-15"
              onClick={() => this.selectPeople()}
            >
              添加人员
            </Button>
            <span>已授权{userVos.length}人，还可以授权{checkAll ? (allUserCount-userVos.length) : (payUserCount-userVos.length)}人</span>
          </div>
          {
            userVos.map(it => (
              <Tag
                className="m-b-8"
                key={it.userId}
                closable
                onClose={e => {
                  e.preventDefault();
                  this.handleClose(it.userId);
                }}
              >
                {it.userName}
              </Tag>
            ))
          }
        </Modal>
      </span>
    );
  }
}

export default LookAll;
