import React, { Component } from 'react';
import cs from 'classnames';
import PageHead from '@/components/PageHead';
import { Switch, Modal, Checkbox, Button } from 'antd';
import { connect } from 'dva';
import style from './index.scss';

@connect(({ systemControl }) => ({
  isModifyInvoice: systemControl.isModifyInvoice,
  isModifyReload: systemControl.isModifyReload,
}))
class SystemControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      switchCheck: false,
      changeReload: false
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'systemControl/query',
      payload: {},
    }).then(() => {
      this.onInit();
    });
  }

  onChangeHis = e => {
    this.setState({
      changeReload: e.target.checked,
    });
  }

  onInit = () => {
    const { isModifyInvoice, isModifyReload } = this.props;
    this.setState({
      changeReload: isModifyReload,
      switchCheck: isModifyInvoice,
    });
  }

  onSave = () => {
    const { changeReload } = this.state;
    this.setState({
      visible: false,
    });
    this.onQuery({
      isModifyInvoice: true,
      isModifyReload: changeReload,
    });
  };

  onQuery = (options) => {
    this.props.dispatch({
      type: 'systemControl/change',
      payload: {
        ...options,
      }
    });
  }

  onChange = e => {
    this.onQuery({
      isModifyInvoice: e,
      isModifyReload: false,
    });
    this.setState({
      switchCheck: e,
    });
    if (e) {
      this.setState({
        visible: true,
        changeReload: false,
      });
    } else {
      this.setState({
        changeReload: e,
      });
    }
  }

  onLink = (type) => {
    if (!type) {
      this.props.history.push('/basicSetting/invoice');
    } else {
      this.props.history.push('/basicSetting/costCategory');
    }
  }

  render () {
    const {
      visible,
      switchCheck,
      changeReload
    } = this.state;
    return (
      <div>
        <PageHead title="控制开关" />
        <div className={style.content}>
          <Switch className={style.switch} onChange={e => this.onChange(e)} checked={switchCheck} />
          <p className="fs-16 c-black-85 fw-500">允许发放环节改单</p>
          <p className={style.production}>
            <span>开启后，在单据发放环节，发放人可对单据的部分信息进行修改后发放，无需重新打回。比如事由、金额等，如需支持更多信息的修改，请至</span>
            <span className="sub-color">
              <a onClick={() => this.onLink(0)}>单据模版设置</a>/<a onClick={() => this.onLink(1)}>费用类别设置</a>
            </span>
            <span>，编辑页面操作</span>
          </p>
          <div className={style.label}>
            <div className={style.lables}>
              <span className={switchCheck ? cs(style.circle, style.active) : style.circle} />
              <span>{ switchCheck ? '已开启' : '已关闭' }</span>
            </div>
            <div className={style.lables}>
              <span className={changeReload ? cs(style.circle, style.active) : style.circle} />
              <span>{ changeReload ? '已开启留痕' : '已关闭留痕' }</span>
            </div>
          </div>
        </div>
        <Modal
          visible={visible}
          title='改单是否留痕'
          bodyStyle={{
            padding: '0 24px 10px'
          }}
          footer={[
            <Button key="cancel">取消</Button>,
            <Button key="save" onClick={() => this.onSave()} type="primary">保存</Button>
          ]}
          onCancel={() => this.setState({ visible: false })}
          className={style.modalInfo}
        >
          <Checkbox
            value={changeReload}
            onChange={e => this.onChangeHis(e)}
          >
            开启留痕，在发放环节修改的所有信息，均可追溯查看
          </Checkbox>
        </Modal>
      </div>
    );
  }
}

export default SystemControl;
