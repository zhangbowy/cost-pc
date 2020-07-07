/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import nodeConfig from './config.js';
import { timeStampToHex } from '../../../../../../utils/common.js';

const isEmpty = data => data === null || data === undefined || data === '';
const isEmptyArray = data => Array.isArray( data ) ? data.length === 0 : true;

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
    do {
      const mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] );
    } while ( qutient );
    return `${nodeType}_${res.join('')}`;

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
    res.nodeId = this.idGenerator(type);
    res.prevId = previousNodeId;
    return res;
  }

  /**
   * 获取指定节点的父节点（前一个节点）
   * @param { String } prevId - 父节点id
   * @param { Object } processData - 流程图全部数据
   * @returns { Object } 父节点
   */
  static getPreviousNode ( prevId, processData ) {
    if ( processData.nodeId === prevId ) return processData;
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
      prev.conditionNodes && prev.conditionNodes.forEach( c => c.prevId = prev.nodeId );
    };
    if ( this.isConditionNode( nodeData ) ) {
      const conditions = [...prevNode.conditionNodes];
      const cons = [...conditions];
      const index = cons.findIndex( c => c.nodeId === nodeData.nodeId );
      if ( cons.length > 2 ) {
        cons.splice( index, 1 );
      } else {
        const anotherCon = cons[+( !index )];
        delete prevNode.conditionNodes;
        if ( prevNode.childNode ) {
          let endNode = {...anotherCon};
          while ( endNode.childNode ) {
            endNode = endNode.childNode;
          }
          endNode.childNode = {
            ...prevNode.childNode,
            prevId: endNode.nodeId
          };
          return this.getMockData(data, prevNode, 'del');
        }
        concatChild( prevNode, anotherCon );
      }
      // 重新编排优先级
      console.log(prevNode);
      // cons.forEach(( c, i ) => {
      //   c.priority = i+1;
      // });
      return this.getMockData(data, prevNode, 'del');
    }
    concatChild( prevNode, nodeData );
    console.log(nodeData);
  }
  // TODO:
  // static copyNode ( nodeData, processData ) {
  //   let prevNode = this.getPreviousNode( nodeData.prevId, processData )
  //   let index = prevNode.conditionNodes.findIndex( c => c.nodeId === nodeData.nodeId )

  // }

  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审核节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNodes ( data, isBranchAction, newChildNode = undefined, flag ) {
    const datas = {...data};
    const oldChildNode = {...data.childNode};
    newChildNode = newChildNode || this.createNode( 'approver', data.nodeId );
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
    if ( oldChildNode && oldChildNode.nodeType === 'route' ) {
      this.deleteNode( oldChildNode, datas );
    }
  }

  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审核节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNode ( oldData, data, isBranchAction, newChildNode = undefined ) {
    const datas = {...data};
    const oldChildNode = data.childNode || {};
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
    if ( oldChildNode && oldChildNode.nodeType === 'route' ) {
      this.deleteNode( oldChildNode, datas );
    }
    return this.getMockData(oldData, datas, 'add');
  }

  /**
   * 添加空节点
   * @param { Object } data - 空节点的父级节点
   * @return { Object } emptyNode - 空节点数据
   */
  static addEmptyNode ( data ) {
    const emptyNode = this.createNode( 'route', data.nodeId );
    this.addApprovalNodes( data, true, emptyNode );
    return emptyNode;
  }

  static addCopyNode ( oldData, data, isBranchAction ) {
    // 复用addApprovalNode  因为抄送人和审批人基本一致
    this.addApprovalNodes( data, isBranchAction, this.createNode( 'notifier', data.nodeId ) );
    return this.getMockData(oldData, data, 'add');
  }

  /**
   * 添加条件节点 condition 通过点击添加条件进入该操作
   * @param { Object } data - 目标节点所在分支数据，在该分支最后添加条件节点
   */
  static appendConditionNode ( oldData, data ) {
    console.log(data);
    const conditions = [...data.conditionNodes];
    const node = this.createNode( 'condition', data.nodeId );
    node.priority = conditions.length;
    conditions.push( node );
    this.setDefaultCondition( node, data );
    console.log(node);
  }

  /**
   * 添加条件分支 branch
   * @param { Object } data - 目标节点所在节点数据，在该节点最后添加分支节点
   */
  static appendBranch ( oldData, data, isBottomBtnOfBranch ) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = {...data};
    nodeData = this.addEmptyNode( nodeData, true );
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
    const preNodes = [...prevNode.conditionNodes];
    const newPriority = (cnode.priority-1);
    console.log(preNodes.splice( newPriority, 1, cnode ));
    const objs = preNodes.splice( newPriority, 1, cnode );
    const delNode = objs[0];
    delNode.priority = oldPriority;
    preNodes[oldPriority-1] = delNode;
    prevNode.conditionNodes = preNodes;
    return this.getMockData(processData, prevNode, 'edit');
  }

  /**
   * 提升条件节点优先级——排序在前
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static increasePriority ( data, processData ) {
    if ( data.bizData.isDefault ) {  // 默认节点不能修改优先级
      return;
    }
    // 分支节点数据 包含该分支所有的条件节点
    const prevNode = this.getPreviousNode( data.prevId, processData );
    const branchData = prevNode.conditionNodes;
    const index = branchData.findIndex( c => c === data );
    if ( index ) {
      // 和前一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index - 1].priority = index;
      branchData[index].priority = index - 1;
      branchData[index - 1] = branchData.splice( index, 1, branchData[index - 1] )[0];
    }
  }

  /**
   * 降低条件节点优先级——排序在后
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static decreasePriority ( data, processData ) {
    // 分支节点数据 包含该分支所有的条件节点
    const prevNode = this.getPreviousNode( data.prevId, processData );
    const branchData = prevNode.conditionNodes;
    const index = branchData.findIndex( c => c.nodeId === data.nodeId );
    if ( index < branchData.length - 1 ) {
      const lastNode = branchData[index + 1];
      if ( lastNode.bizData.isDefault ) {  // 默认节点不能修改优先级
        return;
      }
      // 和后一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      lastNode.bizData.priority = index;
      branchData[index].bizData.priority = index + 1;
      branchData[index + 1] = branchData.splice( index, 1, branchData[index + 1] )[0];
    }
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
    this.isStartNode( node )
      && !props.initiator
      && ( valid = false );

    this.isConditionNode( node )
      && !props.isDefault
      && !props.initiator
      && isEmptyArray( props.conditions )
      && ( valid = false );

    const customSettings = ['myself', 'optional', 'director'];
    this.isApproverNode( node )
      && !customSettings.includes( props.assigneeType )
      && isEmptyArray( props.approvers )
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
    let node = { ...nodes };
    function childNode(child){
      const result = {};
      for (const key in child) {
        if (typeof (child[key]) === 'object' && !Array.isArray(child[key])) {
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

        } else if (Array.isArray(child[key]) && key === 'conditionNodes') {
          if (child[key].length > 0) {
            const y = {
              conditionNodes: child[key],
            };
            for(let i=0; i < child[key].length; i++) {
              console.log(y[key]);
              y.conditionNodes[i] = childNode(child[key][i]);
              Object.assign(result, y);
            }
          }
        } else {
          const c = {};
          c[key] = child[key];
          Object.assign(result, c);
        }
      }
      return result;
    };
    node = childNode(node);
    console.log(`node${JSON.stringify(node)}`);
    return node;
  }
}



