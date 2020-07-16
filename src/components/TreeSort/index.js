import React, { PureComponent } from 'react';
import { Modal, Button, Tree } from 'antd';

const { TreeNode } = Tree;

export default class Sort extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: []
    };
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  save = () => {

  }

  move = (item) => {
    console.log(item);
    const { data } = this.state;
    const res = this.reduceSort(data, item.id);
    console.log(res);
    this.setState({ data: res });
  }

  reduceSort = (arr, id) => {
    const list = [].concat(arr);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if(item.id === id) {
        list[i].sort -= 1;
      }
      if(list[i].children && list[i].children.length) {
        this.reduceSort(list[i].children, id);
      }
    }
    return list;
  }

  showModal = () => {
    const { list } = this.props;

    const data = [].concat(list);
    this.setState({
      visible: true,
      data
    });
  }

  sortData = () => {
    // const data = list;
    // for (let i = 0; i < data.length; i++) {
    //   const element = data[i];
    //   element.sort();

    // }
  }

  loop = (data) => {
    console.log(data);
    data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
  }

  render() {
    const { visible, data } = this.state;

    return (
      <span>
        <span onClick={() => this.showModal()}>{this.props.children}</span>
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
          >
            {this.loop(data)}
          </Tree>
        </Modal>
      </span>
    );
  }
}
