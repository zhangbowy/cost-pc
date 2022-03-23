/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { Form, Button, message } from 'antd';
import ApproveModal from './ApproveModal';
import Conditions from './Conditions';
import { NodeUtils } from '../FlowCard/util';
import ApproveSend from './ApprovePay';
import ModalTemp from '../../../../../../components/ModalTemp';

const title = {
  condition: '条件设置',
  approver: '设置审批节点',
  notifier: '设置抄送节点',
  grant: '设置发放节点'
};
@Form.create()
class PropPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      priorityLength: 1,
    };
    this.condition = null;
    this.approver = null;
  }

  componentDidUpdate(prevProps){
    if(prevProps.visible !==  this.props.visible) {
      this.setState({
        visible: this.props.visible
      });
      if (this.props.value && (this.props.value.nodeType === 'condition')) {
        this.getPriorityLength();
      }
    }
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.onCancel();
  }

  // 配合getPriorityLength 获取前一个节点条件数组长度 用于设置优先级
  getPrevData = () => {
    const { value, processData } = this.props;
    return NodeUtils.getPreviousNode(value && value.prevId, processData);
  }

  // 用于获取节点优先级范围
  getPriorityLength = () => {
    this.setState({
      priorityLength: this.getPrevData() &&
      this.getPrevData().conditionNodes.length,
    });
  }

  // 保存
  onSave = () => {
    console.log(this.isConditionNode());
    if (this.isConditionNode()) {
      this.conditionNodeComfirm();
    }
    if(this.isGrantNode()){
      this.grandNodeConfirm();
    }
    if (this.isApproverNode() || this.isNotifierNode()) {
      this.approveNodeConfirm();
    }
  }

  // 判断是否是条件节点
  isConditionNode = () => {
    return this.props.value ? NodeUtils.isConditionNode(this.props.value) : false;
  }

  // 判断是否是审批节点
  isApproverNode = () => {
    return this.props.value ? NodeUtils.isApproverNode(this.props.value) : false;
  }

  // 判断是否是发放节点
  isGrantNode = () => {
    return this.props.value ? NodeUtils.isGrant(this.props.value) : false;
  }

  // 判断是否是抄送节点
  isNotifierNode = () => {
    return this.props.value ? NodeUtils.isCopyNode(this.props.value) : false;
  }

  /**
   * 条件节点确认保存得回调
   */
  conditionNodeComfirm = () => {
    const cond = (this.condition && this.condition()) || {};
    if (!cond.content) {
      message.error('请检查条件');
      return;
    }
    const nodeContent = cond.content;
    const val = {
      ...this.props.value,
      priority: cond.priority,
      bizData: cond.bizData,
    };
    console.log(val,'条件节点');
    this.props.onConfirm(val, nodeContent || '请输入条件');
    this.setState({
      visible: false,
    });
  }

  /**
   * 发放节点的回调
   */
  grandNodeConfirm = () => {
    const val = this.grand();
    if (!val || !val.content) {
      if (val !== 'message') {
        message.error('请检查节点配置');
      }
      return;
    }
    this.props.onConfirm(val, val.content);
    this.setState({
      visible: false,
    });
  }

  /**
   * 审批和抄送节点的回调
   */
  approveNodeConfirm = () => {
    const val = this.approver();
    if (!val || val === 'notifier' || !val.content) {
      if (val !== 'notifier' && (val !== 'message')) {
        message.error('请检查节点配置');
      }
      return;
    }
    const nodeContent = val.content;
    this.props.onConfirm(val, nodeContent);
    this.setState({
      visible: false,
    });
  }

render() {
    const { value, conditions, approveNode, templateType, getCondition } = this.props;
    const { visible, priorityLength } = this.state;
    return (
      <ModalTemp
        visible={visible}
        onCancel={this.onCancel}
        title={title[value && value.nodeType]}
        size="default"
        footer={[
          <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
          <Button key="save" onClick={() => this.onSave()} type="primary">保存</Button>
        ]}
      >
        {
          ((value && value.nodeType === 'approver') ||
          (value && value.nodeType === 'notifier')) &&
          <ApproveModal
            nodeType={(value && value.nodeType) || 'approver'}
            approveNode={approveNode || {}}
            details={value || {}}
            // wrapperComponentRef={form => {this.approver=form;}}
            viewShowModal={fn=> { this.approver = fn; }}
            templateType={templateType}
          />
        }
        {
          value && value.nodeType === 'condition' &&
          <Conditions
            priorityLength={priorityLength}
            conditionNode={value.bizData && value.bizData.conditionNode ? value.bizData.conditionNode : []}
            details={value || {}}
            conditions={conditions}
            viewShowModal={fn=> { this.condition = fn; }}
            templateType={templateType}
            getCondition={getCondition}
          />
        }
        {
          value && value.nodeType === 'grant' &&
          <ApproveSend
            nodeDetail={value || {}}
            nodeType={value.nodeType || ''}
            approveNode={approveNode || {}}
            onChangeData={fn => {this.grand = fn;}}
          />
        }
      </ModalTemp>
    );
  }
}

export default PropPanel;

