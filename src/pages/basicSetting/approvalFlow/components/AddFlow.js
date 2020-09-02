import React, { Component } from 'react';
import { Modal, Icon, Button } from 'antd';
import style from './addFlow.scss';

class AddFlow extends Component {
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

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={null}
          footer={null}
          visible={visible}
          width="100%"
          top="0"
          style={{
            top: '0',
            height: '100vh',
            backgroundColor: ' #F7F8FA',
            padding: 0,
          }}
          bodyStyle={{
            height: '100vh',
            padding: 0,
            backgroundColor: ' #F7F8FA',
          }}
          onCancel={this.handleCancel}
          closable={false}
        >
          <div>
            <div className={style.titles}>
              <div className={style.inputs}>
                <Icon className="m-r-8" type="left" />
                {/* <Input value="报销单审批流" /> */}
                <span>报销单审批流</span>
                <Icon type="form" className="sub-color" />
              </div>
              <Button type="primary" key="save">保存</Button>
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddFlow;
