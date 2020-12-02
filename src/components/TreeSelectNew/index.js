import React, { Component } from 'react';
import { Tree, Icon, Input } from 'antd';
import Modal from '@/Components/Modal';
// import treeConvert from '@/utils/treeConvert';
// import styles from './index.scss';  

const { TreeNode } = Tree;
const { Search } = Input;
class TreeSelectNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      // searchValue:'',
      treeData: props.treeData,
      visible: false
    };
  }

  componentDidMount(){

  }

  onChange = e => {
    const { value } = e.target;
    const { treeData } = this.props;
    console.log(value);
    const Arr = this.returnTree(treeData, value);
    console.log('Arr========',Arr);
    this.setState({
      treeData: Arr,
      autoExpandParent: true,
    });
  };

  showModel = () => {
    const { visible } = this.state;
    if(visible){
      this.setState({visible: false});
    }else{
      this.setState({visible: true});
    }
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  returnTree(data,value){
    const arr =  data.filter(item => {
      if(item.title.indexOf(value)!==-1){
        return item;
      }if(item.children){
        let obj ={};
        const isReturn = this.returnTree(item.children,value);
        if(isReturn.length){
          obj={...item};
          return obj;
        }
      }
      return false;
    });
    return arr;
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });


  render() {
    const { treeData, visible } = this.state;
    console.log(visible);
    console.log('treeData=======',treeData);
    return (
      <span>
        <Input type="Group" onClick={this.showModel} />
        <Modal visible={visible} >
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
          <Tree
            checkable
            onExpand={this.onExpand}
            switcherIcon={<Icon type="down" />}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </Modal>
      </span>
    );
  }
}

export default TreeSelectNew;
