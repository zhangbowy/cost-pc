/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import cs from 'classnames';
import { Icon } from 'antd';
import FlowCard from './FlowCard';
import { NodeUtils } from './FlowCard/util.js';
import style from './index.scss';
import PropPanel from './PropPanel';
import { getObjValue, conditionObj } from '../../../../../utils/constants';


class Process extends Component {
  constructor(props) {
    super(props);
    const data = {};
    if (typeof props.conf === 'object' && props.conf !== null) {
      ({ ...data, ...props.conf});
    }
    this.state = {
      data: props.conf, // 流程图数据
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      updateId: 0, // key值 用于模拟$forceUpdate
      activeData: null, // 被激活的流程卡片数据，用于属性面板编辑
      isProcessCmp: true,
      verifyMode: false,
      visible: false, // 弹窗
      conditions: [], // 初始化条件
      approveNode: {},
    };
  }

  componentDidMount(){
    setTimeout(() => {
      console.log(this.props.conf);
      this.setState({
        data: this.props.conf,
      });
    },10);
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps.conf);
    if (prevProps.conf !== this.props.conf) {
      console.log('更新呢');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        data: this.props.conf,
      });
    }
  }

  // 给父级组件提供的获取流程数据得方法
  getData = () => {
    // this.setState({
    //   verifyMode: true,
    // });
    // if(NodeUtils.checkAllNode(this.state.data)) {
      if(true) {
      return Promise.resolve({formData: this.state.data});
    }
      return Promise.reject({target: this.props.tabName});
  }

  /**
   * 接收所有FlowCard事件触发
   * @param { Object } data - 含有event(事件名称)/args(参数)两个属性
   */
  eventReciver = ({ event, args }) => {
    const { templateType } = this.props;
    if (event === 'edit') {
      console.log(args[0]);
      const data = args[0];
      let conditionNodes = {};
      const arr = [];
      if (data.nodeType === 'start') {
        return;
      }
      if (data.nodeType === 'condition') {
        conditionNodes = data.bizData && data.bizData.conditionNode ? data.bizData.conditionNode : {};
        const conditions = conditionNodes.conditions || [];
        conditions.forEach((item, index) => {
          let obj = {
            id: `a_${index}`,
            ...getObjValue(conditionObj[templateType],item.type),
            methods: item.rule.method,
          };
          if (item.rule && item.rule.values) {
            item.rule.values.forEach(it => {
              if (it.type === 'user') {
                obj = {
                  ...obj,
                  users: it.value && it.value.split(',').map((its, i) => {
                    const userNames = it.others && it.others.split(',');
                    return {
                      userId: its,
                      userName: userNames && userNames[i],
                    };
                  }),
                };
              } else if (it.type === 'dept') {
                obj={
                  ...obj,
                  depts: it.value && it.value.split(',').map((its, j) => {
                    const deptNames = it.others && it.others.split(',');
                    return {
                      deptId: its,
                      name: deptNames && deptNames[j]
                    };
                  }),
                };
              } else {
                const vals = it.value && `${it.value}`;
                obj={
                  ...obj,
                  ruleValue: vals && vals.split(','),
                  categoryId: it.categoryId,
                };
              }
            });
          }
          arr.push(obj);
        });
      }
      let approveNode = {};
      if (data.nodeType === 'approver' || (data.nodeType === 'grant') || (data.nodeType === 'notifier')) {
        const approveNodes = data.bizData ? data.bizData.approveNode : {};
        approveNode = {...approveNodes};
        if (approveNodes.rule) {
          const rules = approveNodes.rule;
          if (approveNodes.type === 'leader') {
            approveNode = {
              ...approveNode,
              methods: rules.method,
            };
          }
          if (rules.values) {
            approveNode = {
              ...approveNode,
              ruleType: approveNodes.type !== 'approverRole' ?  rules.values[0].type : '',
              ruleValue: rules.values[0].value,
            };
          }
        }
      }
      console.log(approveNode);
      this.setState({
        activeData: args[0],// 打开弹窗
        visible: true,
        conditions: arr,
        approveNode,
      });
      return;
    }
    if(event === 'addCopyNode') {
      let ccPosition = '';
      if (args[0].nodeType === 'start') {
        ccPosition = 'START';
      } else {
        ccPosition = 'FINISH';
      }
      this.props.onChangePosition(ccPosition);
    }
    if (event === 'deleteNode' && (args[0].nodeType === 'notifier')) {
      this.props.onChangePosition('');
    }
    const { data } = this.state;
    // 本实例只监听了第一层数据（startNode）变动
    // 为了实时更新  采用forceUpdate刷新 但是由于某些条件下触发失效（未排除清除原因）
    // 使用key + 监听父组件updateId方式强制刷新
    const nodes = NodeUtils[event](data,...args);
    this.setState({
      data: nodes,
    });
    this.props.startNodeChange(nodes);
    this.forceUpdate();
  }

  forceUpdate = () => {
    const { updateId } = this.state;
    this.setState({
      updateId: (updateId + 1),
    });
  }

  /**
   * 控制流程图缩放
   * @param { Object } val - 缩放增量 是step的倍数 可正可负
   */
  changeScale = (val) => {
    let { scaleVal } = this.state;
    if (scaleVal > 0 && scaleVal < 200) {
      // 缩放介于0%~200%
      scaleVal += val;
    }
    this.setState({
      scaleVal,
    });
  }

  /**
   * 弹窗提交事件
   * @param { Object } value - 被编辑的节点的bizData属性对象
   */
  onPropEditConfirm = (value, content) => {
    const { activeData, data } = this.state;
    const newData = {...activeData};
    newData.content = content || '请设置条件';
    const oldProp = activeData;
    newData.bizData = value.bizData;
    newData.priority = value.priority || '';
    newData.name = value.name || '条件';
    console.log('newData', newData);
    // 修改优先级
    if (NodeUtils.isConditionNode(newData) && (Number(value.priority) !== Number(oldProp.priority))) {
      console.log('编辑节点');
      const nodes = NodeUtils.resortPrioByCNode(
        newData,
        oldProp.priority,
        data
      );
      this.setState({
        data: nodes,
      });
      this.props.startNodeChange(nodes);
      this.forceUpdate();
    }
    const nodes = NodeUtils.getMockData(data, newData, 'edit');
    console.log('Process -> onPropEditConfirm -> nodes', nodes);
    this.setState({
      activeData: newData,
      data: nodes,
    }, () => {
      if (this.props.startNodeChange) {
        this.props.startNodeChange(nodes);
      }
    });
    this.onClosePanel();
    this.forceUpdate();
  }

  /**
   * 弹窗取消事件
   */
  onClosePanel = () => {
    this.setState({
      activeData: null,
      visible: false,
    });
  }

  render() {
    const { scaleVal, step, updateId, data, verifyMode, visible, conditions, approveNode } = this.state;
    const { ccPosition } = this.props;
    console.log('Process -> render -> ccPosition', ccPosition);
    const { templateType } = this.props;
    return (
      <div className={style['flow-container']}>
        <div className={style['scale-slider']}>
          <Icon
            type="minus-square"
            className={cs(style.btn, style['el-icon-minus'])}
            onClick={() => this.changeScale(-step)}
          />
          <span className="fs-14">{scaleVal}%</span>
          <Icon
            type="plus-square"
            className={cs(style.btn, style['el-icon-minus'])}
            onClick={() => this.changeScale(step)}
          />
        </div>
        <FlowCard
          verifyMode={verifyMode}
          key={updateId}
          data={data}
          onEmits={this.eventReciver}
          scaleVal={scaleVal}
          ccPosition={ccPosition}
          templateType={templateType}
        />
        <PropPanel
          value={this.state.activeData}
          processData={data}
          visible={visible}
          onConfirm={this.onPropEditConfirm}
          onCancel={this.onClosePanel}
          conditions={conditions}
          approveNode={approveNode}
          templateType={templateType}
        />
      </div>
    );
  }
}

export default Process;
