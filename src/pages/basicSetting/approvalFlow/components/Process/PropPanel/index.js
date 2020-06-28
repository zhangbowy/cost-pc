import React, { Component } from 'react';
import { Modal } from 'antd';

class PropPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span>{children}</span>
        <Modal visible={visible}>
          <div />
        </Modal>
      </span>
    );
  }
}

export default PropPanel;
