/* eslint-disable guard-for-in */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { message } from 'antd';
import nodeConfig from './config.js';
import { timeStampToHex } from '../../../../../../utils/common.js';

const isEmpty = data => data === null || data === undefined || data === '';
const isEmptyArray = data => Array.isArray( data ) ? data.length === 0 : true;
/**
 * 审批流的一般方法
 * @export
 * @class NodeUtils
 */
export class NodeUtils {
  static globalID = 10000

  /**
   * 获取最大的节点ID 转换成10进制
   * @param {*} data - 整个流程数据
   */
  static getMaxNodeId ( data ) {
    let max = data.nodeId;
    const loop = node => {
      if ( !node ) return;
      max < node.nodeId && ( max = node.nodeId );
      node.childNode && ( loop( node.childNode ) );
      Array.isArray( node.conditionNodes ) && node.conditionNodes.forEach( c => loop( c ) );
    };
    loop( data );
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const len = chars.length;
    return max.split( '' ).reduce( ( sum, c, i ) => {
      return sum + chars.indexOf( c ) * Math.pow( len, i );
    }, 0 );
  }

  /**
   * 根据自增数生成64进制id
   * @returns 64进制id字符串
   */
  static idGenerator (nodeType) {
    let qutient = ++this.globalID;
    const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
    const charArr = chars.split( '' );
    const radix = chars.length;
    const res = [];
    const time = timeStampToHex();
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    return `${nodeType}_${res.join('')}_${time+1}`;

    // const time = timeStampToHex();
    // return `${nodeType}_${time+1}`;

  }


  /**
   * 判断节点类型
   * @param {Node} node - 节点数据
   * @returns Boolean
   */
  static isConditionNode ( node ) {
    return node && node.nodeType === 'condition';
  }

  static isCopyNode ( node ) {
    return node && node.nodeType === 'notifier';
  }

  static isStartNode ( node ) {
    return node && node.nodeType === 'start';
  }

  static isApproverNode ( node ) {
    return node && node.nodeType === 'approver';
  }

  static isRouteNode ( node ) {
    return node && node.nodeType === 'route';
  }

  static isGrant (node) {
    return node && node.nodeType === 'grant';
  }

  /**
   * 创建指定节点
   * @param { String } nodeType - 节点类型
   * @param { Object } previousNodeId - 父节点id
   * @returns { Object } 节点数据
   */
  static createNode ( type, previousNodeId ) {
    const res = JSON.parse( JSON.stringify( nodeConfig[type] ) );
    console.log('NodeUtils -> createNode -> res', res);
    res.nodeId = this.idGenerator(type);
    res.prevId = previousNodeId;
    console.log('NodeUtils -> createNode -> res', res);
    return res;
  }

  /**
   * 获取指定节点的父节点（前一个节点）
   * @param { String } prevId - 父节点id
   * @param { Object } processData - 流程图全部数据
   * @returns { Object } 父节点
   */
  static getPreviousNode ( prevId, processData ) {
    console.log('🚀 ~ file: util.js ~ line 119 ~ NodeUtils ~ getPreviousNode ~ prevId', prevId);
    if ( processData && (processData.nodeId === prevId) ) return processData;
    if ( processData.childNode ) {
      const r1 = this.getPreviousNode( prevId, processData.childNode );
      if ( r1 ) {
        return r1;
      }
    }
    if ( processData.conditionNodes ) {
      for ( const c of processData.conditionNodes ) {
        const r2 = this.getPreviousNode( prevId, c );
        if ( r2 ) {
          return r2;
        }
      }
    }
  }


  /**
   * 删除节点
   * @param { Object  } nodeData - 被删除节点的数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static deleteNode ( data, nodeData, processData, checkEmpty = true ) {
    const prevNode = {...this.getPreviousNode( nodeData.prevId, processData )};
    console.log(prevNode);
    // if ( checkEmpty && prevNode.nodeType === 'route' ) {
    //   if ( this.isConditionNode( nodeData ) ) {
    //     this.deleteNode( prevNode, processData );
    //   } else {
    //     if ( isEmptyArray( prevNode.conditionNodes ) ) {
    //       this.deleteNode( prevNode, processData );
    //     }
    //     this.deleteNode( nodeData, processData, false );
    //   }
    //   // this.deleteNode( prevNode, processData )
    //   // !this.isConditionNode(nodeData) && this.deleteNode(nodeData, processData)
    //   return;
    // }
    const concatChild = ( prev, delNode ) => {
      prev.childNode = delNode.childNode;
      isEmptyArray( prev.conditionNodes ) && ( prev.conditionNodes = delNode.conditionNodes );
      prev.childNode && ( prev.childNode.prevId = prev.nodeId );
      prev.conditionNodes && prev.conditionNodes.map( c => {
        return {
          ...c,
          prevId: prev.nodeId,
        };
      } );
    };
    if ( this.isConditionNode( nodeData ) ) {
      console.log('prevNode', prevNode);
      const conditions = [...prevNode.conditionNodes];
      const cons = [...conditions];
      const index = cons.findIndex( c => c.nodeId === nodeData.nodeId );
      if ( cons.length > 2 ) {
        cons.splice( index, 1 );
        const aonsDi = cons.map((item, i) => {
          if ((i > index) || (i === index)) {
            return {
              ...item,
              priority: item.priority - 1
            };
          }
            return { ...item };
        });
        prevNode.conditionNodes = aonsDi;
        return this.getMockData(data, prevNode, 'edit');
      }
        const anotherCon = cons[+( !index )];
        delete prevNode.conditionNodes;
        if ( prevNode.childNode && prevNode.childNode.nodeId ) {
          let endNode = {...anotherCon};
          while ( endNode.childNode ) {
            endNode = endNode.childNode;
          }
          endNode = {
            childNode: {
              ...prevNode.childNode,
              prevId: endNode.nodeId
            }
          };
          return this.getMockData(data, prevNode, 'del');
        }
        concatChild( prevNode, anotherCon );

      // 重新编排优先级
      console.log(prevNode);
      // cons.forEach(( c, i ) => {
      //   c.priority = i+1;
      // });
      return this.getMockData(data, prevNode, 'del');
    }
    return this.getMockData(data, nodeData, 'del');
  }

  // TODO:
  static copyNode ( data, nodeData, processData ) {
    console.log('NodeUtils -> copyNode -> nodeData', nodeData);
    const prevNode = this.getPreviousNode( nodeData.prevId, processData );
    console.log('NodeUtils -> copyNode -> prevNode', prevNode);
    const conditionNodes = [...prevNode.conditionNodes];
    const index = conditionNodes.findIndex( c => c.nodeId === nodeData.nodeId );
    const copyNode = JSON.parse(JSON.stringify(conditionNodes[index]));
    console.log('NodeUtils -> copyNode -> copyNode', copyNode);
    const appendNode = this.changeNodeId({...copyNode});
    console.log('NodeUtils -> copyNode -> appendNode', appendNode);
    conditionNodes.splice(index, 0, { ...appendNode });
    console.log('NodeUtils -> copyNode -> conditionNodes', conditionNodes);
    const newArrs = conditionNodes.map((it, i) => {
      return {
        ...it,
        priority: (i + 1),
      };
    });
    return this.getMockData(data, {...prevNode, conditionNodes: [...newArrs]}, 'edit');
  }

  static changeNodeId = (data) => {
    const _this = this;
    const newData = {...data};
    function nodes(oldData) {
      for (const key in oldData) {
        if (
          Object.prototype.hasOwnProperty.call(oldData, key) === true
        ) {
          const ids = _this.idGenerator(oldData.nodeType);
          oldData.nodeId = ids;
          if (key === 'childNode') {
            oldData.childNode.prevId = ids;
            nodes(oldData.childNode);
          } else if (key === 'conditionNodes') {
            oldData.conditionNodes.forEach(it => {
              it.prevId = ids;
              nodes(it);
            });
          }
        }
      }
    }
    nodes(newData);
    console.log('copy -》data', newData);
    return newData;
  }

  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审核节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNodes ( data, isBranchAction, newChildNode = undefined, flag ) {
    const datas = {...data};
    console.log('🚀 ~ file: util.js ~ line 273 ~ NodeUtils ~ addApprovalNodes ~ data', data);
    const oldChildNode = {...data.childNode};
    console.log('NodeUtils -> addApprovalNodes -> datas', datas);
    newChildNode = newChildNode || this.createNode( 'approver', data.nodeId );
    console.log('🚀 ~ file: util.js ~ line 276 ~ NodeUtils ~ addApprovalNodes ~ newChildNode', newChildNode);
    data.childNode = newChildNode;
    if ( oldChildNode ) {
      newChildNode.childNode = oldChildNode;
      oldChildNode.prevId = newChildNode.nodeId;
    }
    const {conditionNodes} = data;
    if ( Array.isArray( conditionNodes ) && !isBranchAction && conditionNodes.length ) {
      newChildNode.conditionNodes = conditionNodes.map( c => {
        c.prevId = newChildNode.nodeId;
        return c;
      } );
      delete datas.conditionNodes;
    }
    // if ( oldChildNode && oldChildNode.nodeType === 'route' ) {
    //   this.deleteNode( oldChildNode, datas );
    // }
  }

  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审核节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNode ( oldData, data, isBranchAction, newChildNode = undefined ) {
    const datas = {...data};
    const oldChildNode = data.childNode ? {...data.childNode} : null;
    newChildNode = newChildNode || this.createNode( 'approver', data.nodeId );
    datas.childNode = newChildNode;
    if ( oldChildNode ) {
      newChildNode.childNode = oldChildNode;
      oldChildNode.prevId = newChildNode.nodeId;
    }
    const {conditionNodes} = data;
    if ( Array.isArray( conditionNodes ) && !isBranchAction && conditionNodes.length ) {
      newChildNode.conditionNodes = conditionNodes.map( c => {
        c.prevId = newChildNode.nodeId;
        return c;
      } );
      delete datas.conditionNodes;
    }
    console.log(`datas${JSON.stringify(data)}`);
    // if ( oldChildNode && oldChildNode.nodeType === 'route' ) {
    //   this.deleteNode( oldChildNode, datas );
    // }
    return this.getMockData(oldData, datas, 'add');
  }

  /**
   * 添加空节点
   * @param { Object } data - 空节点的父级节点
   * @return { Object } emptyNode - 空节点数据
   */
  static addEmptyNode ( data ) {
    const emptyNode = this.createNode( 'route', data.nodeId );
    console.log('NodeUtils -> addEmptyNode -> emptyNode', emptyNode);
    this.addApprovalNodes( data, true, emptyNode );
    return emptyNode;
  }

  static addCopyNode ( oldData, data, isBranchAction ) {
    // 复用addApprovalNode  因为抄送人和审批人基本一致
    return this.addApprovalNode( oldData, data, isBranchAction, this.createNode( 'notifier', data.nodeId ) );
  }

  /**
   * 添加条件节点 condition 通过点击添加条件进入该操作
   * @param { Object } data - 目标节点所在分支数据，在该分支最后添加条件节点
   */
  static appendConditionNode ( oldData, data ) {
    console.log(data);
    const nodeData = {...data};
    if (nodeData.conditionNodes.length > 9) {
      message.error('分支条件最多只能10个');
      return this.getMockData(oldData, nodeData, 'edit');
    }
    const conditions = [...data.conditionNodes];
    const node = this.createNode( 'condition', data.nodeId );
    node.priority = conditions.length + 1;
    conditions.push( node );
    this.setDefaultCondition( node, data );
    console.log(`conditions${JSON.stringify(conditions)}`);
    nodeData.conditionNodes = conditions;
    return this.getMockData(oldData, nodeData, 'edit');
  }

  /**
   * 添加条件分支 branch
   * @param { Object } data - 目标节点所在节点数据，在该节点最后添加分支节点
   */
  static appendBranch ( oldData, data, isBottomBtnOfBranch ) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = {...data};
    nodeData = this.addEmptyNode( nodeData, true );
    console.log('NodeUtils -> appendBranch -> nodeData', nodeData);
    const conditionNodes = [
      this.createNode( 'condition', nodeData.nodeId ),
      this.createNode( 'condition', nodeData.nodeId )
    ].map( ( c, i ) => {
      c.bizData.title += i + 1;
      c.priority = i + 1;
      return c;
    } );
    nodeData.conditionNodes = conditionNodes;
    console.log(`nodeData${JSON.stringify(data)}`);
    return this.getMockData(oldData, nodeData, 'add');
  }

  /**
   * 重设节点优先级（条件节点）
   * @param {Node} cnode - 当前节点
   * @param {Number} oldPriority - 替换前的优先级（在数组中的顺序）
   * @param {Node} processData - 整个流程图节点数据
   */
  static resortPrioByCNode ( cnode, oldPriority, processData ) {
    console.log(`cnode${JSON.stringify(cnode)}`);
    // const prevNode = this.getPreviousNode( cnode.prevId, processData );
    const prevNode = {...this.getPreviousNode( cnode.prevId, processData )};
    console.log(prevNode);
    const preNodes = [...prevNode.conditionNodes];
    const newPriority = cnode.priority - 1;
    console.log(newPriority);
    const objs = preNodes.splice( newPriority, 1, cnode );
    const delNode = {...objs[0]};
    delNode.priority = oldPriority;
    preNodes[oldPriority-1] = delNode;
    prevNode.conditionNodes = preNodes;
    console.log(preNodes);
    return this.getMockData(processData, prevNode, 'edit');
  }

  /**
   * 提升条件节点优先级——排序在前
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static increasePriority ( datas, data, processData ) {
    // 分支节点数据 包含该分支所有的条件节点
    const prevNode = {...this.getPreviousNode( data.prevId, processData )};
    const branchData = [...prevNode.conditionNodes];
    const index = branchData.findIndex( c => c === data );
    if ( index ) {
      console.log(`index${index}`);
      // 和前一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index - 1] = {
        priority: index +1,
        ...branchData[index - 1],
      };
      branchData[index] = {
        priority: index,
        ...branchData[index]
      };
      const temp = branchData[index];
      branchData[index] = branchData[index-1];
      branchData[index-1] = temp;
    }
    console.log(`branchData${JSON.stringify(branchData)}`);
    prevNode.conditionNodes = branchData;
    return this.getMockData(processData, prevNode, 'edit');
  }

  /**
   * 降低条件节点优先级——排序在后
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static decreasePriority ( datas, data, processData ) {
    // 分支节点数据 包含该分支所有的条件节点
    const prevNode = {...this.getPreviousNode( data.prevId, processData )};
    const branchData = [...prevNode.conditionNodes];
    const index = branchData.findIndex( c => c.nodeId === data.nodeId );
    if ( index < (branchData.length - 1) ) {
      let lastNode = branchData[index + 1];
      // 和后一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      lastNode = {
        priority: index +1,
        ...lastNode,
      };
      branchData[index] = {
        priority: index + 2,
        ...branchData[index]
      };
      branchData[index+1] = branchData[index];
      branchData[index] = lastNode;
    }
    console.log(`branchData${JSON.stringify(branchData)}`);
    prevNode.conditionNodes = branchData;
    return this.getMockData(processData, prevNode, 'edit');
  }

  /**
 * 当有其他条件节点设置条件后 检查并设置最后一个节点为默认节点
 * @param {Node} cnode  - 当前节点
 * @param {Node} processData - 整个流程图节点数据或父级节点数据
 */
  static setDefaultCondition ( cnode, processData ) {
    const DEFAULT_TEXT = '其他情况进入此流程';
    const conditions = this.getPreviousNode( cnode.prevId, processData ).conditionNodes;
    const hasCondition = nodes => nodes.bizData && ( nodes.bizData.initiator || !isEmptyArray( nodes.bizData.conditions ) );
    const clearDefault = nodes => {
      nodes.content === DEFAULT_TEXT && ( nodes.content = '请设置条件' );
    };
    const setDefault = node => {
      node.content = DEFAULT_TEXT;
    };
    let count = 0;
    conditions.slice( 0, -1 ).forEach( node => {
      hasCondition( node ) && count++;
      clearDefault( node );
    } );
    const lastNode = conditions[conditions.length - 1];
    count > 0 && !hasCondition( lastNode ) ? setDefault( lastNode ) : clearDefault( lastNode );
    console.log(cnode);
  }

  /**
   * 校验单个节点必填项完整性
   * @param {Node} node - 节点数据
   */
  static checkNode ( node, _parent ) {
    // 抄送人应该可以默认自选
    let valid = true;
    const props = node.bizData;

    this.isConditionNode( node )
      && isEmptyArray( props.conditions )
      && ( valid = false );
    return valid;
  }

  /**
   * 判断所有节点是否信息完整
   * @param {Node} processData - 整个流程图数据
   * @returns {Boolean}
   */
  static checkAllNode ( processData ) {
    let valid = true;
    const loop = ( node, callback, parent ) => {
      !this.checkNode( node, parent ) && callback();
      if ( node.childNode ) loop( node.childNode, callback, parent );
      if ( !isEmptyArray( node.conditionNodes ) ) {
        node.conditionNodes.forEach( n => loop( n, callback, node ) );
      }
    };
    // eslint-disable-next-line no-return-assign
    loop( processData, () => valid = false );
    return valid;
  }

  /**
 * 更新数据
 */
  static getMockData (nodes, val, type) {
    console.log('🚀 ~ file: util.js ~ line 531 ~ NodeUtils ~ getMockData ~ val', val);
    console.log('🚀 ~ file: util.js ~ line 531 ~ NodeUtils ~ getMockData ~ type', type);
    let node = { ...nodes };
    console.log(val);
    function childNode(child){
      const result = {};
      // eslint-disable-next-line guard-for-in
      for (const key in child) {
        if (typeof (child[key]) === 'object' && !Array.isArray(child[key]) && child[key]!== 'bizData') {
          let x = {};
          if ((val.nodeId === child.nodeId) && (val.nodeType !== 'route') && (type === 'add')) {
            x = {
              ...child,
              childNode: val.childNode,
            };
            // x.childNode = val;
            Object.assign(result, x);
            return result;
          }
          if (val.prevId === child.nodeId && (val.nodeType === 'route')  && (type === 'add')) {
            x = {
              ...child,
              childNode: val,
            };
            // x.childNode = val;
            Object.assign(result, x);
            return result;
          }
          if ((val.nodeId === child.nodeId) && (val.nodeType === 'route') && (type === 'add')) {
            x = {
              ...child,
              childNode: val.childNode,
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
            x = val.childNode ? {
              ...val.childNode,
              prevId: val.prevId,
            } : null;
            return x;
          }
            x[key] = childNode(child[key]);
            Object.assign(result, x);

        } else {
          const c = {};
          c[key] = child[key];
          Object.assign(result, c);
        }
        if (Array.isArray(child[key]) && key === 'conditionNodes') {
          if (child[key].length > 0) {
            console.log(child[key]);
            const conditionNodes = [...child[key]];
            for(let i=0; i < child[key].length; i++) {
              const datas = {...child[key][i]};
              conditionNodes[i] = childNode(datas);
              console.log(conditionNodes);
              Object.assign(result, {
                conditionNodes,
              });
            }
          }
        }
      }
      return result;
    };
    node = childNode(node);
    console.log(`node${JSON.stringify(node)}`);
    return node;
  }

  /**
   * 审批流的一般方法
   * @export
   * @function getApprove
   */
  static getApprove(datas){
    let count = 0;
    function nodeSearch(list) {
      for(const key in list) {
        // console.log('NodeUtils -> nodeSearch -> key', key);
        if (key === 'childNode') {
          nodeSearch(list.childNode);
        } else if (key === 'nodeType' && list[key] === 'approver') {
          // console.log('NodeUtils -> nodeSearch -> list[key]', list[key]);
          count+=1;
        }
      }
    }
    // console.log('NodeUtils -> getApprove -> datas', datas);

    nodeSearch(datas);
    // console.log('count', count);
    return count;
  }

  static getEndNodeId(datas) {
    let nodeId = '';
    function nodeSearch(list) {
      for (const key in list) {
        if (key === 'childNode') {
          if (list.childNode && list.childNode.childNode && list.childNode.childNode.nodeId) {
            nodeSearch(list.childNode);
          } else if (list.childNode) {
            nodeId = list.childNode.nodeId;
          }
        }
      }
    }
    nodeSearch(datas);
    return nodeId;
  }
}



