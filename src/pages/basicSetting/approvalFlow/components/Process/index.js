/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import FlowCard from './FlowCard';
import { NodeUtils, getMockData } from './FlowCard/util.js';


class Process extends Component {
  constructor(props) {
    super(props);
    const data = getMockData();
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(data, this.conf);
    }
    this.state = {
      data, // 流程图数据
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      updateId: 0, // key值 用于模拟$forceUpdate
      activeData: null, // 被激活的流程卡片数据，用于属性面板编辑
      isProcessCmp: true,
      verifyMode: false
    };
  }

  // 给父级组件提供的获取流程数据得方法
  getData(){
    this.verifyMode = true;
    if(NodeUtils.checkAllNode(this.data)) {
      return Promise.resolve({formData: this.data});
    }
      return Promise.reject({target: this.tabName});

  }

  /**
   * 接收所有FlowCard事件触发
   * @param { Object } data - 含有event(事件名称)/args(参数)两个属性
   */
  eventReciver({ event, args }) {
    if (event === 'edit') {
      this.activeData = args[0]; // 打开属性面板
      return;
    }
    // 本实例只监听了第一层数据（startNode）变动
    // 为了实时更新  采用$forceUpdate刷新 但是由于某些条件下触发失效（未排除清除原因）
    // 使用key + 监听父组件updateId方式强制刷新
    NodeUtils[event](...args);
    this.forceUpdate();
  }

  forceUpdate() {
    this.updateId += 1;
  }

  /**
   * 控制流程图缩放
   * @param { Object } val - 缩放增量 是step的倍数 可正可负
   */
  changeScale(val) {
    if (this.scaleVal > 0 && this.scaleVal < 200) {
      // 缩放介于0%~200%
      this.scaleVal += val;
    }
  }

  /**
   * 属性面板提交事件
   * @param { Object } value - 被编辑的节点的properties属性对象
   */
  onPropEditConfirm(value, content) {
    this.activeData.content = content || '请设置条件';
    const oldProp = this.activeData.properties;
    this.activeData.properties = value;
    // 修改优先级
    if (NodeUtils.isConditionNode(this.activeData) && value.priority !== oldProp.priority) {
      NodeUtils.resortPrioByCNode(
        this.activeData,
        oldProp.priority,
        this.data
      );
      NodeUtils.setDefaultCondition(this.activeData, this.data);
    }
    if(NodeUtils.isStartNode(this.activeData)) this.$emit('startNodeChange', this.data);
    this.onClosePanel();
    this.forceUpdate();
  }

  /**
   * 属性面板取消事件
   */
  onClosePanel() {
    this.activeData = null;
  }

  // 传formIds 查询指定组件 未传时  判断所有组件
  isFilledPCon ( formIds ) {
    let res = false;
    const loopChild = (parent, callback) => parent.childNode && loop( parent.childNode, callback );
    const loop = ( data, callback ) => {
      if(res || !data) return; // 查找到就退出
      if ( Array.isArray( data.conditionNodes )) {
        const uesd = data.conditionNodes.some( c => {
          const cons = c.properties.conditions || [];
          return Array.isArray(formIds)
            ? cons.some( item => formIds.includes(item.formId)) // 查询特定组件
            : cons.length > 0; // 只要有节点设置了条件 说明就有组件作为条件被使用
        });
        uesd ? callback() : data.conditionNodes.forEach(t => loopChild(t, callback));
      }
      loopChild(data, callback);
    };
    loop( this.data, () => res = true );
    return res;
  }

  render() {
    const { scaleVal, step, updateId, data, verifyMode } = this.state;
    return (
      <div className="flow-container">
        <div className="scale-slider">
          <i
            className="btn  el-icon-minus"
            onClick={this.changeScale.bind(this, -step)}
          />
          <span className="fs-14">{scaleVal}%</span>
          <i
            className="btn  el-icon-plus "
            onClick={this.changeScale.bind(this, step)}
          />
        </div>
        <FlowCard
          verifyMode={verifyMode}
          key={updateId}
          data={data}
          onEmits={this.eventReciver}
          style={{ transform: `scale(${scaleVal / 100})` }}
        />
        {/* <PropPanel
          value={this.activeData}
          processData={this.data}
          onConfirm={this.onPropEditConfirm}
          onCancel={this.onClosePanel}
        /> */}
      </div>
    );
  }
}

export default Process;
