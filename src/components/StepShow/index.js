import React, { Component } from 'react';
import { Tooltip, Steps, Button } from 'antd';
import style from './index.scss';
import { ddOpenLink } from '../../utils/ddApi';
import qrCode from '../../assets/img/qrcode.png';

const { Step } = Steps;
class StepShow extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  onOpen = (key) => {
    if (key === '1') {
      ddOpenLink('dingtalk://dingtalkclient/page/link?url=https://www.yuque.com/yifei-zszlu/ref3g8/ro7wnh');
    } else if (key === '2') {
      ddOpenLink('dingtalk://dingtalkclient/page/link?url=https://www.yuque.com/yifei-zszlu/ref3g8/vemhig');
    } else if (key === '2') {
      ddOpenLink('dingtalk://dingtalkclient/page/link?url=https://www.yuque.com/wangcongwen/xzcgly');
    } else if (key === '3') {
      this.props.history.push('/basicSetting/invoice');
    } else if (key === '4') {
      this.props.history.push('/basicSetting/costCategory');
      // window.open('https://www.yuque.com/wangcongwen/xzcgly', '_blank');
    } else if (key === '5') {
      this.props.history.push('/system/auth');
      // window.open('https://www.yuque.com/wangcongwen/xzcgly', '_blank');
    }
  }

  onHandle = () => {
    localStorage.setItem('initShow', 'true');
    this.props.history.push('/workbench');
  }

  render() {
    return (
      <div>
        <div className={style.app_header}>
          <p className="fs-20 fw-500 c-black-85 m-b-16">感谢你选择使用鑫支出，使用前需设置以下基础信息</p>
          <p className="fs-14 c-black-65 m-b-16">请按如下顺序进行初始化设置。如有疑问可以查看操作手册 或联系客服</p>
          <div className="fs-14" style={{marginBottom: 0, display: 'flex'}}>
            <div className="m-r-32" onClick={() => this.onOpen('2')}>
              <i className="iconfont iconIcon-yuangongshouce fs-24 vt-m sub-color m-r-8" />
              <a className="m-r-32">管理员操作手册</a>
            </div>
            <div className="m-r-32" onClick={() => this.onOpen('1')}>
              <i className="iconfont iconIcon-guanlishouce fs-24 vt-m sub-color m-r-8" />
              <a className="m-r-32">员工操作手册</a>
            </div>
            <Tooltip title={(<img alt="二维码" src={qrCode} className={style.qrCode} />)} color="#ffffff">
              <div className="m-r-32">
                <i className="iconfont iconIcon-saoma fs-24 vt-m sub-color m-r-8" />
                <a className="m-r-32">扫码联系客服</a>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="content-dt">
          <Steps direction="vertical">
            <Step
              title="第一步：人员权限设置"
              description={(
                <div className={style.onStep} onClick={() => this.onOpen('5')}>
                  <p>设置-基础设置-角色管理</p>
                  <a>去设置 &gt;</a>
                </div>
              )}
              status="process"
            />
            <Step
              title="第二步：基础信息设置"
              status="process"
              description={(
                <div>
                  <div className={style.onStep} onClick={() => this.onOpen('4')}>
                    <p>设置—基础设置-支出类别设置</p>
                    <a>去设置 &gt;</a>
                  </div>
                  <div className={style.onStep} onClick={() => this.onOpen('3')}>
                    <p>设置—基础设置-单据模版设置</p>
                    <a>去设置 &gt;</a>
                  </div>
                </div>
              )}
            />
          </Steps>
          <div className={style.btn}>
            <Button type="primary" onClick={() => this.onHandle()}>我已完成设置，开始使用</Button>
            <p className="m-l-24 c-black-35" style={{marginBottom: 0, cursor: 'pointer'}} onClick={() => this.onHandle()}>跳过，稍后自行设置 &gt;</p>
          </div>
        </div>
      </div>
    );
  }
}

export default StepShow;
