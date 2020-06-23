/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Popover } from '_antd@3.26.17@antd';
import { NodeUtils } from './util.js.js';

const isCondition = data => data.type === 'condition';
const notEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
const hasBranch = data => notEmptyArray(data.conditionNodes);
const stopPro = ev => ev.stopPropagation();

function createNormalCard(ctx, conf, h) {
  const classList = ['flow-path-card'];
  // eslint-disable-next-line no-sequences
  const afterTrue = (isTrue, name) => (isTrue && classList.push(name), isTrue);
  const isStartNode = afterTrue(NodeUtils.isStartNode(conf), 'start-node');
  const isApprNode = afterTrue(NodeUtils.isApproverNode(conf), 'approver');
  const isCopyNode = afterTrue(NodeUtils.isCopyNode(conf), 'copy');
  console.log(isStartNode);
  return (
    <section className={classList.join(' ')} onClick={this.eventLancher.bind(ctx, 'edit', conf)} >
      <header className="header">
        <div className="title-box" style={{height: '100%',width:'190px'}}>
          {isApprNode && (
            <i className="iconfont iconshenpi fs-12" style={{color:'white',marginRight:'4px'}} />
          )}
          {isCopyNode && (
            <i className="el-icon-s-promotion fs-12" style={{color:'white',marginRight:'4px'}} />
          )}
          <span className="title-text">{conf.properties.title}</span>
          {!isStartNode && (
            <input vModel_trim={conf.properties.title} className="title-input" style={{marginTop:'3px'}} onClick={stopPro} />
          )}
        </div>
        <div className="actions" style={{marginRight: '4px'}}>
          <i className="el-icon-close icon" onClick={this.eventLancher.bind(ctx, 'deleteNode', conf, ctx.data)}  />
        </div>
      </header>
      <div className="body">
        <span className="text">{conf.content}</span>
        <div className="icon-wrapper right">
          <i className="el-icon-arrow-right icon right-arrow" />
        </div>
      </div>
    </section>
  );
}

// arg = ctx, data, h
const createFunc = (...arg) => createNormalCard.call(arg[0], ...arg);
console.log(createFunc);
const nodes = {
  start: createFunc,
  approver: createFunc,
  copy: createFunc,
  empty: _ => '',
  condition(ctx, conf, h) {
      // <i
      //    class="el-icon-document-copy icon"
      //    onClick={this.eventLancher.bind(ctx, "copyNode", conf, ctx.data)}
      //  ></i>
    return (
      <section
        className="flow-path-card condition"
        onClick={this.eventLancher.bind(ctx, 'edit', conf)}
      >
        <header className="header">
          <div className="title-box" style={{height: '20px',width:'160px'}}>
            <span className="title-text">{conf.properties.title}</span>
            <input
              vModel_trim={conf.properties.title}
              className="title-input"
              style={{marginTop:'1px'}}
              onClick={stopPro}
            />
          </div>
          <span className="priority">优先级{conf.properties.priority + 1}</span>
          <div className="actions">

            <i
              className="el-icon-close icon"
              onClick={this.eventLancher.bind(
                ctx,
                'deleteNode',
                conf,
                ctx.data
              )}
            />
          </div>
        </header>
        <div className="body">
          <pre className="text" >{conf.content}</pre>
        </div>
        <div
          className="icon-wrapper left"
          onClick={ctx.eventLancher.bind(
            ctx,
            'increasePriority',
            conf,
            ctx.data
          )}
        >
          <i className="el-icon-arrow-left icon left-arrow" />
        </div>
        <div
          className="icon-wrapper right"
          onClick={ctx.eventLancher.bind(
            ctx,
            'decreasePriority',
            conf,
            ctx.data
          )}
        >
          <i className="el-icon-arrow-right icon right-arrow" />
        </div>
      </section>
    );
  }
};

function addNodeButton(ctx, data, h, isBranch = false) {
  // 只有非条件节点和条件分支树下面的那个按钮 才能添加新分支树
  const couldAddBranch = !hasBranch(data) || isBranch;
  const isEmpty = data.type === 'empty';
  if (isEmpty && !isBranch) {
    return '';
  }
  return (
    <div className="add-node-btn-box flex  justify-center">
      <div className="add-node-btn">
        <Popover placement="right" trigger="click" width="300">
          <div className="condition-box">
            <div>
              <div className="condition-icon" onClick={ctx.eventLancher.bind( ctx, 'addApprovalNode',  data, isBranch )} >
                <i className="iconfont iconshenpi" />
              </div>
              审批人
            </div>

            <div>
              <div className="condition-icon" onClick={ctx.eventLancher.bind( ctx, 'addCopyNode',  data, isBranch )} >
                <i className="el-icon-s-promotion iconfont" style={{verticalAlign: 'middle'}} />
              </div>
              抄送人
            </div>

            <div>
              <div className="condition-icon" onClick={this.eventLancher.bind(ctx, 'appendBranch', data, isBranch)}>
                <i className="iconfont iconcondition" />
              </div>
              条件分支
            </div>
          </div>

          <button className="btn" type="button" slot="reference">
            <i className="el-icon-plus icon" />
          </button>
        </Popover>
      </div>
    </div>
  );
}

function NodeFactory(ctx, data, h) {
  if (!data) return;
  const showErrorTip = ctx.verifyMode && NodeUtils.checkNode(data) === false;
  const res = [];
    let branchNode = '';
    const selfNode = (
      <div className="node-wrap">
        <div className={`node-wrap-box ${data.type} ${showErrorTip ? 'error' : ''}`}>
          <el-tooltip content="未设置条件" placement="top" effect="dark">
            <div className="error-tip" onClick={this.eventLancher.bind(ctx, 'edit', data)}>!!!</div>
          </el-tooltip>
          {nodes[data.type].call(ctx, ctx, data, h)}
          {addNodeButton.call(ctx, ctx, data, h)}
        </div>
      </div>
    );

  if (hasBranch(data)) {
    // 如果节点是数组 一定为条件分支 添加分支样式包裹
    // {data.childNode && NodeFactory.call(ctx, ctx, data.childNode, h)}
    branchNode = (
      <div className="branch-wrap">
        <div className="branch-box-wrap">
          <div className="branch-box  flex justify-center relative">
            <button
              className="btn"
              onClick={this.eventLancher.bind(ctx, 'appendConditionNode', data)}
            >
              添加条件
            </button>
            {data.conditionNodes.map(d => NodeFactory.call(ctx, ctx, d, h))}
          </div>
        </div>
        {addNodeButton.call(ctx, ctx, data, h, true)}
      </div>
    );
  }

  if (isCondition(data)) {
    return (
      <div className="col-box">
        <div className="center-line" />
        <div className="top-cover-line" />
        <div className="bottom-cover-line" />
        {selfNode}
        {branchNode}
        {NodeFactory.call(ctx, ctx, data.childNode, h)}
      </div>
    );
  }
  res.push(selfNode);
  branchNode && res.push(branchNode);
  data.childNode && res.push(NodeFactory.call(ctx, ctx, data.childNode, h));
  return res;
}

function addEndNode(h) {
  return <section className="end-node">流程结束</section>;
}

class FlowCard extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

   /**
   *事件触发器 统筹本组件所有事件并转发到父组件中
    * @param { Object } 包含event（事件名）和args（事件参数）两个参数
    */
  eventLancher(event, ...args) {
    // args.slice(0,-1) vue 会注入MouseEvent到最后一个参数 去除事件对象
    const param = { event, args: args.slice(0, -1) };
    this.$emit('emits', param);
  }

  render() {
    return (
      <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}}>
        {this.data && NodeFactory.call(this, this, this.data, h)}
        {addEndNode(h)}
      </div>
    );
  }
}

export default FlowCard;
