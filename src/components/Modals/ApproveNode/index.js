/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { message } from 'antd';
import cs from 'classnames';
import allAvatars from '@/assets/img/allAvatars.png';
import addAvatars from '@/assets/img/addAvatar.png';
import { choosePeople } from '../../../utils/ddApi';
import { dataType } from '../../../utils/common';
import style from './index.scss';
import Avatar from '../../AntdComp/Avatar';
import ViewMore from './ViewMore';

class ApproveNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approveNodes: {},
      approveNodesList: [],
    };
  }

  componentDidMount() {
    const { approveNodes } = this.props;
    if (approveNodes.nodes) {
      this.traverseNodeList(approveNodes);
    }
  }

  componentDidUpdate(prePops) {
    const { approveNodes } = this.props;
    if(JSON.stringify(approveNodes) !== JSON.stringify(prePops.approveNodes)) {
      this.traverseNodeList(approveNodes);
    }
  }

  verifyApprove = () => {
    const isTips = this.approveNodesList.filter(v => v.type === 'selfSelect' && v.require && !v.userList.length).length > 0;
    // eslint-disable-next-line no-unused-expressions
    isTips ? message.error('请选择审批人') : this.modifyApproveNodes();
    return !isTips;
  }

  choosePerson = (index) => {
    const { approveNodesList } = this.state;
    const _this = this;
    if(typeof choosePeople === 'function') {
      const { userList = [] } = approveNodesList[index];
      console.log('users   ', JSON.stringify(userList));
      choosePeople(userList.map(({userId}) => userId), (result) => {
        // const { userList: resUsers } = result;
        console.log('resUsers ', JSON.stringify(result), index);
        // this.$spliceData({ 'approveNodesList': [index, 1, ] });
        approveNodesList.splice(index, 1, {
          ...approveNodesList[index],
          userList: result.map(val => {
            return { ...val, userName: val.name, userId: val.emplId };
          })
        });
        _this.setState({
          approveNodesList,
        }, () => {
          console.log('approveNodesList', this.state.approveNodesList);
          this.modifyApproveNodes();
          this.traverseNodeList(this.state.approveNodes);
        });
      }, {
        max: 20,
        multiple: true,
      });
    }
  }

  traverseNodeList = (approveNodesObj) => {
    const nodeArr = [];
    const { node = {} } = approveNodesObj || {};
    const traverse = (currentNode) => {
      const { childNode, nodeId, bizData, name, nodeType = '', errorMsg } = currentNode;
      const { approveNode = {} } = bizData || {};
      const { type, userList = [], method, allowSelfChoose } = approveNode || {};
      if(nodeType !== '') { // 审核节点
        // const { typeFirst: type, typeSecond = {} } = typeAttr;
        // eslint-disable-next-line no-unused-vars
        // const { required: require = false, sFirst = '', sSecond = '' } = typeSecond;
        let title = name;
        let tips = '';
        const len = userList.length;
        const methodObj = { OR: '或签', AND: '会签' };
        switch (nodeType) {
          case 'notifier':
            tips = `抄送${len}人`;
            break;
          case 'grant':
            tips = method ? `${len}人${methodObj[method]}发放` : `${len}人发放`;
            break;
          case 'failed_end':
            tips = errorMsg ? `${errorMsg}` : '节点信息有误';
            break;
          default:
            tips = method ? `${len}人${methodObj[method]}` : `${len}人`;
        }
        if(nodeType === 'notifier') {
          title = `${title}${title.indexOf('抄送') >= 0 ? '' : '(抄送人)'}`;
        }
        console.log('traverseNodeList', type, title, userList, allowSelfChoose);
        const shortUsers = userList.length > 3 ? userList.slice(0, 2) : [...userList];
        nodeArr.push({ userList, method, type, nodeType, allowSelfChoose, title, tips, nodeId, require, shortUsers });
      }
      if (dataType(childNode, 'object') && Object.keys(childNode).length) {
        traverse(childNode);
      }
    };
    traverse(node);

    this.setState({
      approveNodes: {...approveNodesObj},
      approveNodesList: nodeArr
    });
  }

  modifyApproveNodes = () => {
    const { approveNodes: approveNodesData, approveNodesList } = this.state;
    const obj = JSON.stringify(approveNodesData);
    const { onChangeForm } = this.props;
    const { node } = JSON.parse(obj);
    const selfChooseObj = approveNodesList.filter(({type, nodeType, allowSelfChoose}) => (type === 'selfSelect' || (nodeType === 'notifier' && allowSelfChoose))).reduce((pre, cur) => {
      const { nodeId, userList } = cur;
      // eslint-disable-next-line no-param-reassign
      pre[nodeId] = userList;
      return pre;
    }, {});
    const traverse = (currentNode) => {
      const { childNode = {}, nodeId, bizData } = currentNode || {};
        if(selfChooseObj[nodeId]) {
          const { approveNode = {} } = bizData || {};
          console.log(`approveNode.userList ${JSON.stringify(approveNode.userList)}`);
          console.log(`approveNode ${JSON.stringify(approveNode)}`);
          approveNode.userList=selfChooseObj[nodeId];
        }
        if (Object.keys(childNode).length) {
          traverse(childNode);
        }
    };
    traverse(node);
    // eslint-disable-next-line no-unused-expressions
    typeof onChangeForm === 'function' && onChangeForm({ ...approveNodesData, node });
  }

  // viewMore = (index) => {
  //   const { approveNodesList } = this.state;
  //   console.log('data', approveNodesList, index);
  //   this.setData({
  //     isShowAll: true,
  //     currentNode: approveNodesList[index]
  //   });
  // }

  closePop = () => {

  }

  render() {
    const { approveNodesList } = this.state;
    console.log(approveNodesList);
    return (
      <div className={style.component_approve_node}>
        {/* <span className="title">审批流程</span> */}
        {
          approveNodesList.length &&
          <div className={style.approve_box}>
            {
              approveNodesList.map((item, index) => (
                <div className={style.approve_item_box}>
                  <div className={cs(style.approve_item, `${ (index === 0 || index === approveNodesList.length - 1) ? style.relative : '' }`)}>
                    <div className="left">
                      { index === 0 && (<div className={style.border_left_top} />) }
                      {index === approveNodesList.length - 1 && (<div className={style.border_left_bottom} />)}
                      <div className={style.node_info}>
                        <span className={style.title}>{item.title}</span>
                        <span className={style.tips}>{item.tips}</span>
                      </div>
                    </div>
                    <div className={style.right}>
                      {
                        item.userList.length > 3 &&
                        (
                          <ViewMore list={approveNodesList[index]}>
                            <div className={style.view_box}>
                              <img alt="全部" src={allAvatars} mode="aspectFill" />
                              <span className={style.text}>查看全部</span>
                            </div>
                          </ViewMore>
                        )
                      }
                      {
                        item.shortUsers.map((it, ind) => (
                          <div className={style.user_list_box}>
                            {item.userList.length > 3 && ind === 0 && (<span className={style.add}>+</span>)}
                            <div className={cs(style.users_box, style.ellipsis)}>
                              <Avatar avatar={it.avatar} name={it.userName} size={36} className={style.avatar} />
                              <span className={cs(style.user_name, 'eslips-2')}>{it.userName}</span>
                            </div>
                            {(ind < (item.shortUsers.length - 1)) && (<span className={style.add}>+</span>)}
                          </div>
                        ))
                      }
                      {
                        (item.type === 'selfSelect' || (item.nodeType === 'notifier' && item.allowSelfChoose)) &&
                        (
                          <div className={cs(style.view_box, style.view_add_box)}>
                            <img alt="add" className={style.add_img} src={addAvatars} mode="aspectFill" onClick={() => this.choosePerson(index)} />
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        }
      </div>
    );
  };
};

export default ApproveNode;
