import React, { Component } from 'react';
import { peopleType } from '@/utils/constants';
import cs from 'classnames';
import style from './node.scss';
import ApproveSettingModal from '../ApproveSettingModal';
import ApproveSend from '../ApprovePay';

class ApproveNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeDetail: props.details || {},
      visible: false,
      close: false,
      ccPosition: props.ccPosition,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.details !== this.props.details) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        nodeDetail: this.props.details,
        ccPosition: this.props.ccPosition,
      });
    }
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

  onChangeprops = (val, type) => {
    this.props.onChange(val, type);
  }

  onMouseEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      close: true,
    });
  }

  onMouseLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      close: false
    });
  }

  onClose = (e) => {
    e.stopPropagation();
    const { nodeDetail } = this.state;
    if (nodeDetail.nodeType === 'NOTIFIER') {
      this.props.onChangePotion('');
    }
    this.props.onChange(this.state.nodeDetail, 'del');
  }

  render() {
    const { nodeDetail, visible, close, ccPosition } = this.state;
    return (
      <div className={style.node_wrap}>
        {
          (nodeDetail.nodeType === 'APPROVER') || (nodeDetail.nodeType === 'NOTIFIER') ?
            <ApproveSettingModal
              details={nodeDetail}
              nodeType={nodeDetail.nodeType}
              visible={visible}
              onChangeData={(val,type) => this.onChangeprops(val,type)}
              ccPosition={ccPosition}
              onChangePotion={(val) => this.props.onChangePotion(val)}
            >
              <div
                className={style.contentPathBoxMain}
                onClick={() => this.onShow()}
                onMouseEnter={(e) => this.onMouseEnter(e)}
                onMouseLeave={(e) => this.onMouseLeave(e)}
              >
                <div className={nodeDetail.nodeType === 'NOTIFIER' ? cs(style.mainRemark, style.notice) : style.mainRemark}>
                  {peopleType[nodeDetail.nodeType]}
                  {
                    close &&
                    <i className="iconfont iconclose c-black-25" onClick={e => this.onClose(e)} />
                  }
                </div>
                <div className={style.mainUser}>
                  <span className={cs(style.ellipsis, 'c-black-85')}>{nodeDetail.name}</span>
                  <i className="iconfont iconenter c-black-45" />
                </div>
              </div>
            </ApproveSettingModal>
          :
            <ApproveSend
              nodeDetail={nodeDetail}
              nodeType={nodeDetail.nodeType}
              onChangeData={(val,type) => this.onChangeprops(val,type)}
            >
              <div className={style.contentPathBoxMain}>
                <div className={style.mainRemark}>{peopleType[nodeDetail.nodeType]}</div>
                <div className={style.mainUser}>
                  <span className={cs(style.ellipsis, 'c-black-85')}>{nodeDetail.name}</span>
                  <i className="iconfont iconenter c-black-45" />
                </div>
              </div>
            </ApproveSend>
        }
        {this.props.children}
      </div>
    );
  }
}

export default ApproveNode;
