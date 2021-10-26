/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { Modal, Tree } from 'antd';
import { connect } from 'dva';
import addAvatars from '@/assets/img/addAvatar.png';
import dept from '@/assets/img/dept.png';
import style from './index.scss';
import Avatar from '../../AntdComp/Avatar';
import { ddComplexPicker } from '../../../utils/ddApi';

const { TreeNode } = Tree;
// const { SHOW_PARENT } = TreeSelect;
@connect(({ costGlobal, session }) => ({
  deptTree: costGlobal.deptTree,
  userInfo: session.userInfo,
  deptAndUser: costGlobal.deptAndUser,
}))
class ShareLoan extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      list: [],
      // popVisible: false,
      // inputValue: '',
      selectRows: [],
      selectKey: [],
    };
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'costGlobal/deptTree',
      payload: {},
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
      // popVisible: false,
      // inputValue: '',
      selectRows: [],
      selectKey: [],
      list: [],
    });
  }

  onShow = () => {
    const { list } = this.props;
    const newArr = [];
    if (list.length > 0) {
      list.forEach(item => {
        const obj = {
          type: item.userId ? 1 : 0,
          deptId: item.deptId,
          deptName: item.deptName,
          key: item.userName ? `${item.deptId}${item.userId}` : `${item.deptId}`,
        };
        if (item.userId) {
          Object.assign(obj, {
            userId: item.userId,
            userName: item.userName,
            avatar: item.avatar,
          });
        }
        newArr.push(obj);
      });
    }
    this.setState({
      // inputValue: '',
      visible: true,
      list: newArr,
      selectRows: newArr,
      selectKey: newArr.length > 0 ? newArr.map(it => it.key) : [],
    });
  }

   // 循环渲染树结构
   loop = data => data.map(item => {
    const { userInfo } = this.props;
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.type ? item.key : item.value}
          label={item.title}
          value={item.type ? item.key : item.value}
          dataRef={item}
          disabled={userInfo.dingUserId === item.value}
          title={(
            <div>
              {
                item.type ?
                  <Avatar avatar={item.avatar} name={item.title} size={24} />
                  :
                  null
              }
              <span>{item.title}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.type ? item.key : item.value}
      label={item.title}
      value={item.type ? item.key : item.value}
      dataRef={item}
      disabled={userInfo.dingUserId === item.value}
      title={(
        <div className="icons">
          {
            item.type !== 0 &&
            <Avatar avatar={item.avatar} name={item.title} size={24} />
          }
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  onChangeNode = (value, label, extra) => {
    console.log('ShareLoan -> onChangeNode -> value', extra.triggerNode.props);
    console.log('ShareLoan -> onChangeNode -> value', label);
    const { dataRef } = extra.triggerNode.props;
    const { selectRows } = this.state;
    const arr = [...selectRows];
    const obj = {};
    const len = label.length;
    if (dataRef.deptName === label[len-1]) {
      Object.assign(obj, {
        key: `${dataRef.deptId}`,
        deptName: dataRef.deptName,
        deptId: `${dataRef.deptId}`,
        type: 0,
      });
    } else {
      Object.assign(obj, {
        key: dataRef.type ? dataRef.key : dataRef.value,
        deptName: dataRef.deptName || dataRef.title,
        deptId: dataRef.deptId || dataRef.value,
        type: dataRef.type,
        userName: dataRef.type ? dataRef.title : '',
        userId: dataRef.type ? dataRef.value : '',
        avatar: dataRef.avatar,
      });
    }
    if (arr.findIndex(it => it.key === obj.key) === -1) {
      arr.push(obj);
    }
    this.setState({
      selectKey: value,
      selectRows: arr,
    });
  }

  confirm = () => {
    const { selectKey, selectRows } = this.state;
    console.log('ShareLoan -> confirm -> selectRows', selectRows);
    console.log('ShareLoan -> confirm -> selectKey', selectKey);
    const newArr = [];
    selectRows.forEach(it => {
      if (selectKey.includes(it.key) || selectKey.includes(it.value)) {
        const obj = {
          key: it.type ? it.key : (it.value || it.deptId),
          deptId: it.deptId || it.value,
          deptName: it.deptName || it.title,
          type: it.type,
        };
        if (it.type) {
          Object.assign(obj, {
            userId: it.value || it.userId,
            userName: it.title || it.userName,
            avatar: it.avatar
          });
        }
        newArr.push(obj);
      }
    });
    console.log('走了没', newArr);
    this.setState({
      list: newArr,
      // popVisible: false,
    });
  }

  onDel = (i, e) => {
    e.stopPropagation();
    const { list } = this.state;
    const newArr = [...list];
    newArr.splice(i,1);
    this.setState({
      // selectKey: selectKey.filter(it => it.key != key),
      // selectRows: selectRows.filter(it => it.key != key),
      list: newArr,
    });
  }

  onOk = async() => {
    const { invoiceId } = this.props;
    const { list } = this.state;
    const dingUserId = list.filter(it => it.userId);
    const newList = [];
    if (dingUserId && dingUserId.length) {
      const userList = await this.looUser(dingUserId.map(it => it.userId));
      dingUserId.forEach(it => {
        newList.push({
          ...it,
          deptId: userList[it.userId][0].deptId,
          deptName: userList[it.userId][0].name,
        });
      });
    }
    const deptList = list.filter(it => !it.userId) || [];
    this.props.dispatch({
      type: 'costGlobal/shareLoan',
      payload: {
        invoiceId,
        list: [...newList, ...deptList],
      },
    }).then(() => {
      if (this.props.onCanel) {
        this.props.onCanel();
      }
      this.setState({
        visible: false,
        // inputValue: '',
      });
    });
  }

  looUser = (dingUserIds) => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/lookDept',
        payload: {
          dingUserIds
        }
      }).then(() => {
        const { deptAndUser } = this.props;
        resolve(deptAndUser);
      });
    });
  }

  handelPop = () => {
    // const { list } = this.state;
    // this.setState({
    //   popVisible: true,
    //   inputValue: '',
    //   selectKey: list.map(it => {
    //     if (it.type) {
    //       return it.key;
    //     }
    //     return it.deptId;
    //   }),
    //   selectRows: list,
    // });
    const { list } = this.state;
    console.log('ShareLoan -> handelPop -> list', list);
    const userList = list.filter(it => it.userId);
    const deptList = list.filter(it => !it.userId);
    const { userInfo } = this.props;
    ddComplexPicker({
      users: userList.map(it => it.userId) || [],
      departments: deptList.map(it => it.deptId) || [],
      disabledUsers: [userInfo.dingUserId]
    }, (res) => {
      console.log(res);
      const users = [];
      const depts = [];
      if (res.users) {
        res.users.forEach(it => {
          users.push({
            avatar: it.avatar,
            userName: it.name,
            userId: it.emplId,
          });
        });
      }
      if (res.departments) {
        res.departments.forEach(it => {
          depts.push({
            deptName: it.name,
            deptId: it.id,
          });
        });
      }
      this.setState({
        list: [...users, ...depts]
      });
    });
  }

  render() {
    const { children } = this.props;
    const { visible, list } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          visible={visible}
          title="添加共享人"
          centered
          onCancel={() => this.onCancel()}
          width="580px"
          bodyStyle={{
            height: '292px',
            padding: '16px 24px',
            overflow: 'scroll'
          }}
          onOk={() => this.onOk()}
        >
          <p className="fs-14 c-black-65">共享是将该借款单共享给其他人，共享后其他人也可核销该借款或手动还款。适用于部门备用金申请等情况</p>
          <div className={style.shareAdd}>
            <div className={style.addBtn}>
              <div className={style.addBtns}>
                <img src={addAvatars} alt="添加" onClick={() => this.handelPop()} />
              </div>
              {/* <div className={style.popStyle} style={{ display: popVisible ? 'block' : 'none' }}>
                <div className="m-l-12 m-r-12 m-t-8">
                  <TreeSelect
                    autoClearSearchValue
                    open
                    treeNodeFilterProp="label"
                    placeholder='请选择'
                    value={selectKey}
                    style={{width: '100%'}}
                    dropdownStyle={{height: '296px'}}
                    treeCheckable
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    showSearch
                    onChange={this.onChangeNode}
                    treeNodeLabelProp="label"
                    treeDefaultExpandedKeys={deptTree.length ?  [deptTree[0].value] : []}
                    showCheckedStrategy={SHOW_PARENT}
                    inputValue={this.state.inputValue}
                    onSearch={(inputValue) => this.setState({ inputValue })}
                  >
                    { this.loop(deptTree) }
                  </TreeSelect>
                  <div className={style.footCont}>
                    <div style={{display: 'flex'}}>
                      <div
                        className={style.footerBtns}
                        onClick={() => this.setState({popVisible: false, selectKey: [], selectRows: []})}
                        style={{background: '#fff', color: 'rgba(0, 0, 0, 0.65)', border: '1px solid #D9D9D9', marginRight: '8px'}}
                      >
                        取消
                      </div>
                      <div onClick={this.confirm} className={style.footerBtns}>确定</div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            {
              list.map((it, index) => (
                <div className={style.peoples} key={it.userId || it.deptId}>
                  {
                    it.userName ?
                      <Avatar name={it.userName} size={40} avatar={it.avatar} />
                      :
                      <img src={dept} alt="部门" style={{ width: '40px', height: '40px' }} />
                  }
                  <span className={style.names}>{it.userName || it.deptName}</span>
                  <i className="iconfont icondelete_fill" onClick={e => this.onDel(index, e)} />
                </div>
              ))
            }
          </div>
        </Modal>
      </span>
    );
  }
}

export default ShareLoan;
