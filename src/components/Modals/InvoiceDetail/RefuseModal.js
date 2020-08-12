import React, { Component } from 'react';
import { Modal, Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import { refuseReason } from '../../../utils/constants';

class RefuseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onConfirm = () => {

  }

  render() {
    const { visible } = this.state;
    const { children } = this.props;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="拒绝理由"
          visible={visible}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="save" onClick={() => this.onConfirm()} type="primary">确认</Button>
          ]}
        >
          <Form>
            <TextArea placeholder="请输入拒绝理由，或点击下方标签快捷输入，限制30个字以内" />
          </Form>
          <p className="m-b-15 fs-12" style={{ color: 'rgba(25,31,37,0.28)' }}>快捷输入</p>
          <p>
            {
              refuseReason.map(it => (
                <span className={style.tags} key={it.key}>{it.value}</span>
              ))
            }
          </p>
        </Modal>
      </span>
    );
  }
}

export default RefuseModal;
