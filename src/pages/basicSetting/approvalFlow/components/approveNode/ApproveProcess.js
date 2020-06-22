/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import ApproveNode from './ApproveNode';
import style from './process.scss';
import ApproveBtn from './ApproveBtn';

// @connect(({ global }) => ({
//   nodes: global.nodes,
// }))
class ApproveProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {},
      ccPosition: props.ccPosition,
    };
    this.nodesRender = [];
  }

  componentDidMount(){
    this.nodesRender = [];
  }

  // eslint-disable-next-line react/sort-comp
  copyObj = (obj) => {
    const res = {};
    for (const key in obj) {
      res[key] = obj[key];
    }
    return res;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nodes !== this.props.nodes) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        nodes: this.props.nodes,
      });
    }
    if (prevProps.ccPosition !== this.props.ccPosition) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        ccPosition: this.props.ccPosition,
      });
    }
  }

  onChangeData = (val, type) => {
    const { nodes } = this.state;
    let node = { ...nodes };

    function childNode(child){
      const result = {};
      for (const key in child) {
        if (typeof (child[key]) === 'object' && !Array.isArray(child[key])) {
          let x = {};
          if ((val.preNodeId === child.nodeId) && (type === 'add')) {
            x = {
              ...child,
              childNode: val,
            };
            // x.childNode = val;
            Object.assign(result, x);
            return result;
          }
          if (type === 'edit' && (val.nodeId === child.nodeId)) {
            x = { ...val };
            // x.childNode = val;
            Object.assign(result, x);
            return result;
          }
          if (type === 'del' && (val.nodeId === child.nodeId)) {
            x = {
              ...val.childNode,
            };
            // x.childNode = val;
            Object.assign(result, x);
            return result;
          }
            x[key] = childNode(child[key]);
            Object.assign(result, x);

        } else {
          const c = {};
          c[key] = child[key];
          Object.assign(result, c);
        }
      }
      return result;
    };
    node = childNode(node);
    // const newNode = { ...node};
    this.nodesRender = [];
    // eslint-disable-next-line no-unused-expressions
    this.props.onChangeData && this.props.onChangeData(node);
    this.setState({
      nodes: node
    });
  }

  onChangePosition = (val) => {
    this.props.onChangePosition(val);
  }

  setNode = (obj) => {
    // eslint-disable-next-line no-unused-vars
    if (obj && obj.nodeId) {
      const objs = {
        name: obj.name,
        nodeId: obj.nodeId,
        nodeType: obj.nodeType,
        preNodeId: obj.preNodeId,
        bizData: obj.bizData,
        childNode: obj.childNode,
      };
      this.nodesRender.push(
        <ApproveNode
          ccPosition={this.state.ccPosition}
          key={obj.nodeId}
          details={objs}
          onChange={(val, type) => this.onChangeData(val, type)}
          onChangePotion={(val) => this.onChangePosition(val)}
        >
          {
            (obj.nodeType !== 'GRANT') &&
            <ApproveBtn
              name="addNode"
              ccPosition={this.state.ccPosition}
              parentNode={objs}
              onChangePotion={(val) => this.onChangePosition(val)}
              onChange={(val, type) => this.onChangeData(val, type)}
            />
          }
        </ApproveNode>
      );
    }
    if (obj && obj.childNode) {
      this.setNode(obj.childNode);
    }
    return this.nodesRender;
  }

  render() {
    const { nodes } = this.state;
    this.nodesRender = [];
    return (
      <div className={style.node_box}>
        <div className="branch-warp">
          <div className="branch-box-wrap">
            <div className="branch-box">
              <Button class="condition-btn" click="addNode(node, 'condition')" className="node.conditionNodes.length >= 10 ? 'c-gray1' : ''">添加条件</Button>
              <div v-for="(item, i) in node.conditionNodes" key="i" className="col-box">
                <template v-if="i === 0">
                  <div className="top-left-cover-line" />
                  <div className="bottom-left-cover-line" />
                </template>
                <ApproveNode node="item" class="condition-node" addNode="addNode" deleteNode="deleteNode" showNodePop="showNodePop">
                  <ApproveBtn slot="addNode" node="item" addNode="addNode" isConditional="isConditional" addNotifierStatus="false"/>
                </ApproveNode>
                <add-node-type v-if="item.childNode" node="item.childNode" addNode="addNode" isConditional="isConditional" isInSpindle="false"/>
                <template v-if="i === node.conditionNodes.length - 1">
                  <div className="top-right-cover-line" />
                  <div className="bottom-right-cover-line" />
                </template>
              </div>
            </div>
            <ApproveBtn class="add-node-btn-box" node="node" addNode="addNode" isConditional="isConditional" addNotifierStatus="routeNodeAddNotifierStatus"/>
          </div>
        </div>
        {
          this.setNode(nodes).map(item => (
            item
          ))
        }
      </div>
    );
  }
}

export default ApproveProcess;
