import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

class AddAssets extends PureComponent {
  state={
    visible: false,
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <span>
        <span onClick={() => this.setState({ visible: true })}>{children}</span>
        <Modal
          title="新增类目映射"
          visible={visible}
          wrapClassName="centerModal"
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
          width="580px"
          style={{
            height: '480px'
          }}
        >
          <Form layout="vertical">
            <Form.Item label="鑫资产分类">
              <Input />
            </Form.Item>
            <Form.Item label="鑫支出对应类别">
              <Input />
            </Form.Item>
            <Form.Item label="备注">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddAssets;
