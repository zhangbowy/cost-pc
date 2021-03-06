/**
 * @param {function} callback 排序完成后的回调,用于传递排序结果
 * @param {array} list 排序数据
 */

import React, { Component } from 'react';
import { Modal, Button, Tree, Spin, Divider, Icon } from 'antd';
import treeConvert from '@/utils/treeConvert';
import styles from './index.scss';

const { TreeNode } = Tree;
class Sort extends Component {
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
        <TreeNode
          className={styles.treeNode}
          key={item.id}
          title={(
            <div className={styles.treeWrapper}>
              <span>{item.name}</span>
              <div>
                <a disabled={this.isTop(item.id, data)} onClick={() => this.move(item.id, 'up')}>上移</a>
                <Divider type="vertical" />
                <a disabled={this.isBottom(item.id, data)} onClick={() => this.move(item.id, 'down')}>下移</a>
              </div>
            </div>
          )}
        >
          <a>上移</a>
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      className={styles.treeNode}
      key={item.id}
      title={(
        <div className={styles.treeWrapper}>
          <span>{item.name}</span>
          <div>
            <a disabled={this.isTop(item.id, data)} onClick={() => this.move(item.id, 'up')}>上移</a>
            <Divider type="vertical" />
            <a disabled={this.isBottom(item.id, data)} onClick={() => this.move(item.id, 'down')}>下移</a>
          </div>
        </div>
      )}
    />;
  })

  move = (id, action) => {
    const n = action === 'up' ? -1 : 1;
    const { data } = this.state;
    const currentList = this.getCurrentArr(data, id);
    const currentIndex = this.getIndex(currentList, id);
    const item = currentList.splice(currentIndex, 1);
    currentList.splice(currentIndex + n, 0, item[0]);
    this.setState({ data });
  }

  // 判断是否为第一个
  isTop = (id, arr) => {
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      if(e.id === id && i === 0) {
        return true;
      }

      if(e.children) {
        if(this.isTop(id, e.children)) {
          return true;
        }
      }
    }
    return false;
  }

  isBottom = (id, arr) => {
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      if(e.id === id && i === arr.length - 1) {
        return true;
      }

      if(e.children) {
        if(this.isBottom(id, e.children)) {
          return true;
        }
      }
    }
    return false;
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

  // // 拖拽放开时的回调
  // onDrop = (info) => {
  //   const currentId = info.dragNodesKeys[info.dragNodesKeys.length - 1]; // 拖拽内容的id
  //   const targetPosition = info.dropPosition; // 拖拽到的位置
  //   const relativeId = info.node.props.eventKey; //  相对的内容
  //   const { data } = this.state;
  //   const currentList = this.getCurrentArr(data, currentId);
  //   const currentIndex = this.getIndex(currentList, currentId);
  //   const targetIndex = this.getIndex(currentList, relativeId);

  //   const resultList = currentList.filter(item => item.id === relativeId);
  //   if (!resultList.length) {
  //     message.error('请在同级内移动');
  //     return;
  //   }

  //   let index = 0;
  //   if (targetPosition <= targetIndex) { // 拖拽到前面
  //     index = targetIndex;
  //   } else { // 拖拽到后面
  //     index = targetIndex + 1;
  //   }

  //   if (currentIndex > targetIndex) { // 上移
  //     const item = currentList.splice(currentIndex, 1);
  //     currentList.splice(index, 0, item[0]);
  //   } else { // 下移
  //     const item = currentList.splice(currentIndex, 1);
  //     currentList.splice(index - 1, 0, item[0]);
  //   }
  //   this.setState({ data });
  // }

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
            width="680px"
            bodyStyle={{
              padding: '20px',
              height: '500px',
              overflowY: 'scroll'
            }}
            footer={[
              <Button key="cancel" onClick={() => this.closeModal()}>取消</Button>,
              <Button key="save" type="primary" onClick={e => this.onSave(e)}>保存</Button>
            ]}
          >
            <Tree
              blockNode
              switcherIcon={<Icon type="down" />}
            >
              {this.loop(data)}
            </Tree>
          </Modal>
        </Spin>
      </span>
    );
  }
}

export default Sort;
