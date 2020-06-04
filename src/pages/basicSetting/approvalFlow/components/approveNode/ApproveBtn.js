import React from 'react';
import cs from 'classnames';
import { Icon, Popover } from 'antd';
import style from './btn.scss';
import ApproveSettingModal from '../ApproveSettingModal';

class ApproveBtn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appVis: false,
      ccPosition: props.ccPosition || '',
      visiblePop: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ccPosition !== this.props.ccPosition) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        ccPosition: this.props.ccPosition,
      });
    }
  }

  onShowPop = (visible) => {
    this.setState({
      visiblePop: visible,
    });
    // console.log(this.props.ccPosition);
  }

  onApp = () => {
    this.setState({
      appVis: true,
      visiblePop: false,
    });
  }

  onChangeprops = (val, type) => {
    this.props.onChange(val, type);
  }

  changePosition = (val) => {
    this.props.onChangePotion(val);
  }

  render() {
    const { appVis, ccPosition, visiblePop } = this.state;
    const { parentNode } = this.props;
    return (
      <>
        {
          ((parentNode.childNode
          && parentNode.childNode.nodeType === 'NOTIFIER'
          && !parentNode.preNodeId)
          || (
            parentNode.nodeType === 'NOTIFIER') &&
            parentNode.childNode.nodeType === 'GRANT'
          )
          ?
            <div className={cs(style.contentPathBoxConnect, style.lines)} />
          :
            <Popover
              title={null}
              placement="right"
              width="250"
              trigger="click"
              visible={visiblePop}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onVisibleChange={(visible) => this.onShowPop(visible)}
              content={(
                <div className={style.btn_box}>
                  <ApproveSettingModal
                    visible={appVis}
                    nodeType="APPROVER"
                    Add="add"
                    parentNode={parentNode}
                    onChangeData={(val,type) => this.onChangeprops(val,type)}
                  >
                    <div
                      className={style.btn_item}
                      onClick={() => this.onApp()}
                    >
                      <i className="iconfont iconicon_approval_fill deep_blue" />
                      <p className="c-black-85 fs-16 m-t-8">审批节点</p>
                    </div>
                  </ApproveSettingModal>
                  {
                  ((parentNode.childNode.nodeType === 'GRANT') || (parentNode.nodeType === 'START')) &&
                  !ccPosition &&
                  <ApproveSettingModal
                    visible={appVis}
                    nodeType="NOTIFIER"
                    Add="add"
                    parentNode={parentNode}
                    onChangeData={(val,type) => this.onChangeprops(val,type)}
                    onChangePotion={(val) => this.changePosition(val)}
                  >
                    <div
                      className={style.btn_item}
                      onClick={() => this.onApp()}
                    >
                      <i className="iconfont iconicon_copyto orange" />
                      <p className="c-black-85 fs-16 m-t-8">抄送节点</p>
                    </div>
                  </ApproveSettingModal>
                }
                </div>
            )}
            >
              <div className={style.contentPathBoxConnect}>
                <Icon type="plus-circle" className={style.addPathLine} />
                {/* <i className={cs('iconfont', 'iconxinzengbaoxiao', style.addPathLine)} /> */}
              </div>
            </Popover>
        }
      </>

    );
  }
}

export default ApproveBtn;
