import React, { Component } from 'react';
import { Modal } from 'antd';
import codes from '@/assets/img/qrCodes.png';
import openService from '@/assets/img/openService.png';
import style from './index.scss';

class InitModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <div style={{width: '100%'}}>
        <div style={{width: '100%'}} onClick={this.onShow}>{children}</div>
        <Modal
          title={null}
          footer={null}
          visible={visible}
          onCancel={this.onCancel}
          bodyStyle={{
            padding: 0,
          }}
          wrapClassName={style.initModal}
          width="449px"
        >
          <div className={style.imgs}>
            <img src={this.props.isOpen==='true'?openService:codes} alt="二维码" />
          </div>
        </Modal>
      </div>
    );
  }
}

export default InitModal;
