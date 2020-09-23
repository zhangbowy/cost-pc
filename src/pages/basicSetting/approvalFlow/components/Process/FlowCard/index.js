/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Tooltip, Icon, Popover } from 'antd';
import cs from 'classnames';
import { NodeUtils } from './util.js';
import style from './index.scss';

function FlowCard(props) {
  // 判断是否已经有抄送节点
  const {scaleVal, ccPosition} = props;
  const isCondition = data => data.nodeType === 'condition';
  const notEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
  // const hasBranch = data => notEmptyArray(data.conditionNodes);
  const hasBranch = data => (data.nodeType === 'route');
  const stopPro = ev => ev.stopPropagation();
  /**
   *事件触发器 统筹本组件所有事件并转发到父组件中
    * @param { Object } 包含event（事件名）和args（事件参数）两个参数
    */
   const eventLancher = (e, event, ...args) => {
    e.stopPropagation();
    e.preventDefault();

    const param = { event, args };
    props.onEmits(param);
  };

  const createNormalCard = (ctx, conf) => {
    const classList = ['flow-path-card'];
    console.log('ctx', ctx);
    let count = 0;
    if (conf.nodeType === 'approver') {
      count = NodeUtils.getApprove(ctx.data);
    }
    // eslint-disable-next-line no-sequences
    const afterTrue = (isTrue, name) => (isTrue && classList.push(name), isTrue);
    const isStartNode = afterTrue(NodeUtils.isStartNode(conf), 'start-node');
    const isApprNode = afterTrue(NodeUtils.isApproverNode(conf), 'approver');
    const isCopyNode = afterTrue(NodeUtils.isCopyNode(conf), 'notifier');
    const isGrant = afterTrue(NodeUtils.isGrant(conf), 'grant');
    const isOnlyApprove = conf && conf.nodeType === 'approver' &&
                          (
                            ((conf.prevId.indexOf('START') > -1) ||
                            conf.childNode && (conf.childNode.nodeType === 'grant')) &&
                            (count === 1)
                          ); // 唯一的一个审批节点
    return (
      <section className={cs(style['flow-path-card'], style[classList[1]])} onClick={(e) => eventLancher(e, 'edit', conf)} >
        <header className={style.header}>
          <div className={style['title-box']} style={{height: '100%',width:'190px'}}>
            {isApprNode && (
              <i className="iconfont iconshenpi fs-12" style={{color:'white',marginRight:'4px'}} />
            )}
            {isCopyNode && (
              <i className="el-icon-s-promotion fs-12" style={{color:'white',marginRight:'4px'}} />
            )}
            <span className={style['title-text']}>{conf.name}</span>
            {!isStartNode && (
              <span className={style['title-input']} style={{marginTop:'3px'}} onClick={stopPro}>{conf.name}</span>
            )}
          </div>
          {
            !isGrant && !isStartNode && !isOnlyApprove &&
            <div className={style.actions} style={{marginRight: '4px'}}>
              <Icon type="close" className={cs(style['el-icon-close'], style.icon)} onClick={(e) => eventLancher(e, 'deleteNode', conf, ctx.data)}  />
            </div>
          }
        </header>
        <div className={style.body}>
          <span className={cs(style.text, 'eslips-1')}>{conf.content}</span>
          {
            !isStartNode &&
            <div className={cs(style['icon-wrapper'], style.right)}>
              <Icon type="right" className={cs(style['el-icon-arrow-right'], style.icon, style['right-arrow'])} />
            </div>
          }
        </div>
      </section>
    );
  };

  // arg = ctx, data, h
  const createFunc = (...arg) => createNormalCard.call(arg[0], ...arg);
  const nodes = {
    start: createFunc,
    approver: createFunc,
    notifier: createFunc,
    grant: createFunc,
    empty: _ => '',
    condition(ctx, conf) {
        // <i
        //    class="el-icon-document-copy icon"
        //    onClick={this.eventLancher.bind(ctx, "copyNode", conf, ctx.data)}
        //  ></i>
      return (
        <section
          className={cs(style['flow-path-card'], style.condition)}
          onClick={(e) => eventLancher(e, 'edit', conf)}
        >
          <header className={style.header}>
            <div className={style['title-box']} style={{height: '20px',width:'160px'}}>
              <span className={style['title-text']}>条件{conf.priority}</span>
              {/* <input
                vModel_trim={conf.bizData.title}
                className={style['title-input']}
                style={{marginTop:'1px'}}
                onClick={stopPro}
              /> */}
            </div>
            <span className={style.priority}>优先级{conf.priority}</span>
            <div className={style.actions}>

              <Icon
                type="close"
                className={cs(style['el-icon-close'], style.icon)}
                onClick={(e) => eventLancher(e,
                  'deleteNode',
                  conf,
                  ctx.data
                )}
              />
            </div>
          </header>
          <div className={style.body}>
            <pre className={style.text} >{conf.content}</pre>
          </div>
          {/* <div
            className={cs(style['icon-wrapper'], style.left)}
            onClick={(e) => eventLancher(e,
              'increasePriority',
              conf,
              ctx.data
            )}
          >
            <Icon type="left" className={cs(style['el-icon-arrow-left'], style.icon, style['left-arrow'])} />
          </div>
          <div
            className={cs(style['icon-wrapper'], style.right)}
            onClick={(e) => eventLancher(e,
              'decreasePriority',
              conf,
              ctx.data
            )}
          >
            <Icon type="right" className={cs(style['el-icon-arrow-right'], style.icon, style['right-arrow'])} />
          </div> */}
        </section>
      );
    }
  };

  const addNodeButton = (ctx, data, isBranch = false) => {
    // 只有非条件节点和条件分支树下面的那个按钮 才能添加新分支树
    const couldAddBranch = !hasBranch(data) || isBranch;
    const isEmpty = data.nodeType === 'empty';
    if (isEmpty && !isBranch) {
      return '';
    }
    const isCopy = ((data.nodeType === 'start') ||
                  (data.childNode && data.childNode.nodeType === 'grant'))
                  &&  !ccPosition;
    // 判断是否可以有抄送人
    const isButton = data.nodeType === 'grant' ||
                    (data.nodeType === 'start' && data.childNode && data.childNode.nodeType === 'notifier')
                    || (data.nodeType === 'notifier' &&
                    data.childNode && data.childNode.nodeType === 'grant' &&
                    (data.prevId.indexOf('START') === -1));
    return (
      <div className={cs(style['add-node-btn-box'], style.flex, style['justify-center'], isButton && style.addNodeBtns)}>
        {
          !isButton &&
          <div className={style['add-node-btn']}>
            <Popover
              placement="right"
              trigger="click"
              width="300"
              getPopupContainer={triggerNode => triggerNode.parentElement}
              content={(
                <div className={style['condition-box']}>
                  <div className="c-black-85 fs-16">
                    <div className={style['condition-icon']} onClick={(e) => eventLancher(e, 'addApprovalNode',  data, isBranch)} >
                      <i className={cs(style.iconfont, 'iconfont', 'iconicon_approval_fill')} />
                    </div>
                    审批人
                  </div>
                  {
                    isCopy &&
                    <div className="c-black-85 fs-16">
                      <div className={style['condition-icon']} onClick={(e) => eventLancher(e, 'addCopyNode',  data, isBranch )} >
                        <i className={cs('iconfont', 'iconicon_copyto', style.iconfont)} style={{verticalAlign: 'middle'}} />
                      </div>
                      抄送人
                    </div>
                  }
                  <div className="c-black-85 fs-16">
                    <div className={style['condition-icon']} onClick={(e) =>eventLancher(e, 'appendBranch', data, isBranch)}>
                      <i className={cs('iconfont', 'iconicon_newgroup_fill', style.iconfont, 'green')} />
                    </div>
                    条件分支
                  </div>
                </div>
              )}
            >
              <button className={style.btn} type="button" slot="reference">
                <Icon type="plus" className={cs(style['el-icon-plus'], style.icon, 'green')} />
              </button>
            </Popover>
          </div>
        }
      </div>
    );
  };

  const NodeFactory = (ctx, data) => {
    if (!data) return;
    const showErrorTip = ctx.verifyMode && (NodeUtils.checkNode(data) === true);
    const res = [];
    let branchNode = '';
    const selfNode = data.nodeType && (data.nodeType !== 'route') && (
      <div className={style['node-wrap']}>
        <div className={cs(style['node-wrap-box'], `${showErrorTip ? style.error : ''}`, style[data.nodeType])}>
          <Tooltip content="未设置条件" placement="top" effect="dark">
            <div className={style['error-tip']} onClick={(e) => eventLancher(e, 'edit', data)}>!!!</div>
          </Tooltip>
          {nodes[data.nodeType].call(ctx, ctx, data)}
          {addNodeButton.call(ctx, ctx, data)}
        </div>
      </div>
    );

    if (hasBranch(data) && data.conditionNodes) {
      // 如果节点是数组 一定为条件分支 添加分支样式包裹
      // {data.childNode && NodeFactory.call(ctx, ctx, data.childNode, h)}
      branchNode = (
        <div className={style['branch-wrap']}>
          <div className={style['branch-box-wrap']}>
            <div className={cs(style['branch-box'], style.flex, style['justify-center'], style.relative)}>
              <button
                className={style.btn}
                onClick={(e) => eventLancher(e, 'appendConditionNode', data)}
              >
                添加条件
              </button>
              {data.conditionNodes.map(d => NodeFactory.call(ctx, ctx, d))}
            </div>
          </div>
          {addNodeButton.call(ctx, ctx, data, true)}
        </div>
      );
    }

    if (isCondition(data)) {
      return (
        <div className={style['col-box']}>
          <div className={style['center-line']} />
          <div className={style['top-cover-line']} />
          <div className={style['bottom-cover-line']} />
          {selfNode}
          {branchNode}
          {NodeFactory.call(ctx, ctx, data.childNode)}
        </div>
      );
    }
    res.push(selfNode);
    branchNode && res.push(branchNode);
    data.childNode && res.push(NodeFactory.call(ctx, ctx, data.childNode));
    return res;
  };

  const addEndNode = () => {
    return <section className={style['end-node']}>审批结束</section>;
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        zoom: `${scaleVal / 100}`,
      }}
    >
      {props.data && NodeFactory.call(this, props, props.data)}
      {addEndNode()}
    </div>
  );
}

export default FlowCard;

