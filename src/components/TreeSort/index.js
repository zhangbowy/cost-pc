/**
 * @param {function} callback 排序完成后的回调,用于传递排序结果
 * @param {array} list 排序数据
 */

import React, { Component } from 'react';
import { Modal, Button, Tree, message, Spin } from 'antd';
import treeConvert from '@/utils/treeConvert';

const { TreeNode } = Tree;
export default class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      isLoading: false
    };
  }

  // 关闭排序窗口
  closeModal = () => {
    this.setState({
      visible: false,
      isLoading: false
    });
  }

  // 保存排序结果
  onSave = () => {
    const { data } = this.state;
    this.resetSort(data);
    this.setState({ isLoading: true });
    this.props.callback(data, this.closeModal);
  }

  // 初始化
  showModal = () => {
    const { list } = this.props;
    const lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'name',
      name: 'name',
      otherKeys: ['sort']
    }, list);
    this.sortData(lists);
    this.resetSort(lists);
    this.setState({
      visible: true,
      data: lists
    });
  }

  // 根据sort排序
  sortData = (data) => {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.children && e.children.length) {
        this.sortData(e.children);
      }
    }
    data.sort((a, b) => {
      return a.sort - b.sort;
    });
  }

  // 根据sort结果重新赋值排序
  resetSort = (data) => {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.children && e.children.length) {
        this.resetSort(e.children);
      }
      e.sort = i + 1;
    }
  }

  // 循环渲染树结构
  loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode key={item.id} title={item.name}>
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id} title={item.name} />;
  })

  // 判断是否为同级
  compareIsPeer = (arr, currentId, targetId) => {
    let result = true;
    const currentArr = this.getCurrentArr(arr, currentId);
    const targetArr = currentArr.filter(item => item.id === targetId);
    if (!targetArr.length) {
      result = false;
    }
    return result;
  }

  // 获取排序的目标数组
  getCurrentArr = (arr, id) => {
    let arrs = [];
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      if (arrs.length) {
        break;
      }
      if (e.id === id) {
        arrs = arr;
        break;
      }
      if (e.children && e.children.length) {
        arrs = this.getCurrentArr(e.children, id, arrs);
      }
    }
    return arrs;
  }

  // 获取数组下标
  getIndex = (list, item) => {
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.id === item) {
        return i;
      }
    }
  }

  // 拖拽放开时的回调
  onDrop = (info) => {
    const currentId = info.dragNodesKeys[info.dragNodesKeys.length - 1]; // 拖拽内容的id
    const targetPosition = info.dropPosition; // 拖拽到的位置
    const relativeId = info.node.props.eventKey; //  相对的内容
    const { data } = this.state;
    const currentList = this.getCurrentArr(data, currentId);
    const currentIndex = this.getIndex(currentList, currentId);
    const targetIndex = this.getIndex(currentList, relativeId);

    const resultList = currentList.filter(item => item.id === relativeId);
    if (!resultList.length) {
      message.error('请在同级内移动');
      return;
    }

    let index = 0;
    if (targetPosition <= targetIndex) { // 拖拽到前面
      index = targetIndex;
    } else { // 拖拽到后面
      index = targetIndex + 1;
    }

    if (currentIndex > targetIndex) { // 上移
      const item = currentList.splice(currentIndex, 1);
      currentList.splice(index, 0, item[0]);
    } else { // 下移
      const item = currentList.splice(currentIndex, 1);
      currentList.splice(index - 1, 0, item[0]);
    }
    this.setState({ data });
  }

  render() {
    const { visible, data, isLoading } = this.state;

    return (
      <span>
        <span onClick={() => this.showModal()}>{this.props.children}</span>
        <Spin spinning={isLoading}>
          <Modal
            title="项目排序"
            visible={visible}
            key="sort"
            maskClosable={false}
            onCancel={() => this.closeModal()}
            onOk={e => this.onSave(e)}
            width="660px"
            footer={[
              <Button key="cancel" onClick={() => this.closeModal()}>取消</Button>,
              <Button key="save" type="primary" onClick={e => this.onSave(e)}>保存</Button>
            ]}
          >
            <Tree
              draggable
              blockNode
              onDragEnter={this.onDragEnter}
              onDrop={this.onDrop}
            >
              {this.loop(data)}
            </Tree>
          </Modal>
        </Spin>
      </span>
    );
  }
}
