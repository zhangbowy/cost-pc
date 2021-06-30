import React from 'react';
import PropTypes from 'prop-types';
import Form from './MyForm';
import Modal from './Modal';
import ButtonGroup from './ButtonGroup';

class FormList extends React.Component {
  _formInstance = React.createRef();

  render() {
    const {
      mode,
      isModal,
      fields,
      onSubmit,
      modalWidth,
      formProps,
      ...otherProps
    } = this.props;

    // 只有onSubmit事件存在，才显示按钮
    const _footer = onSubmit && (
      <ButtonGroup
        formInstance={this._formInstance}
        onSubmit={onSubmit}
        mode={mode}
      />
    );

    const _form = (
      <Form
        wrappedComponentRef={this._formInstance}
        fields={fields}
        mode={mode}
        footer={isModal ? null : _footer}
        formProps={formProps}
      />
    );

    return isModal ? (
      <Modal {...otherProps} modalWidth={modalWidth} footer={_footer}>
        {_form}
      </Modal>
    ) : (
      _form
    );
  }
}

FormList.propTypes = {
  fields: PropTypes.array.isRequired,
  mode: PropTypes.string,
  isModal: PropTypes.bool,
  onSubmit: PropTypes.func,
  // 下面的属性都是modal模式下独有的
  title: PropTypes.string,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  modalWidth: PropTypes.number,
  formProps: PropTypes.object
};

FormList.defaultProps = {
  mode: 'default', // default, search, plain
  isModal: false, // 是否是弹窗模式
  onSubmit: null, // modal模式必须传；其他模式下，如果传了，组件内就会显示button；如果onSubmit是promise，button会自动管理loading效果
  // 下面的属性都是modal模式下独有的
  modalWidth: 500, // modal宽度
  title: '弹窗',
  visible: false,
  onCancel: null
};

export default FormList;
