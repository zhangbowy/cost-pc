import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import Avatar from '../../AntdComp/Avatar';
import style from './index.scss';

class ViewMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [],
    };
  }

  onShow = () => {
    this.setState({
      visible: true,
      list: this.props.list.users || [],
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { children } = this.props;
    const { visible, list } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="全部人员"
          visible={visible}
          onCancel={this.onCancel}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>
          ]}
        >
          <div className={style.viewMores}>
            {
              list && list.map(it => (
                <div className={style.avatars}>
                  <Avatar avatar={it.avatar} name={it.userName} size={36} className={style.avatar}   />
                  <p>{it.userName}</p>
                </div>
              ))
            }
          </div>
        </Modal>
      </span>
    );
  }
}

export default ViewMore;
