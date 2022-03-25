import React, { Component } from 'react';
import { Modal, Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import style from './index.scss';
import { refuseReason } from '../../../utils/constants';

@Form.create()
class RefuseModal extends Component {
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
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onConfirm = () => {
    this.props.form.validateFieldsAndScroll((err,val) => {
      if (!err) {
        this.onCancel();
        this.props.refuse(val.rejectNote);
      }
    });
  }

  onChange = (val) => {
    const vals = this.props.form.getFieldValue('rejectNote');
    this.props.form.setFieldsValue({
      rejectNote: vals ? `${vals}，${val}` : `${val}`
    });
  }

  render() {
    const { visible } = this.state;
    const { children, form: { getFieldDecorator } } = this.props;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={(<span className="isRequired">拒绝理由</span>)}
          visible={visible}
          onCancel={this.onCancel}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="save" onClick={() => this.onConfirm()} type="primary">确认</Button>
          ]}
        >
          <Form>
            <Form.Item>
              {
                getFieldDecorator('rejectNote', {
                  rules: [
                    { max: 30, message: '限制30个字以内' },
                    { required: true, message: '请输入拒绝理由' }
                  ]
                })(
                  <TextArea
                    placeholder="请输入拒绝理由，或点击下方标签快捷输入，限制30个字以内"
                  />
                )
              }
            </Form.Item>
          </Form>
          <p className="m-b-15 fs-12" style={{ color: 'rgba(25,31,37,0.28)' }}>快捷输入</p>
          <p>
            {
              refuseReason.map(it => (
                <span className={style.tags} key={it.key} onClick={() => this.onChange(it.value)}>{it.value}</span>
              ))
            }
          </p>
        </Modal>
      </span>
    );
  }
}

export default RefuseModal;
