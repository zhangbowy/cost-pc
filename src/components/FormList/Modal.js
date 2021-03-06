import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

class MyModal extends PureComponent {
  onCancel = () => {
    const { onCancel } = this.props;

    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error('modal模式下，请传入onCancel事件');
    }
  };

  render() {
    const { title, visible, children, footer, modalWidth } = this.props;

    const MFooter =
      footer
      && React.cloneElement(footer, {
        onCancel: this.onCancel
      });

    return (
      <Modal
        title={title}
        width={modalWidth}
        visible={visible}
        destroyOnClose
        footer={MFooter}
        maskClosable={false}
        onCancel={this.onCancel}
      >
        {children}
      </Modal>
    );
  }
}

MyModal.propTypes = {
  footer: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  modalWidth: PropTypes.number.isRequired
};

export default MyModal;
