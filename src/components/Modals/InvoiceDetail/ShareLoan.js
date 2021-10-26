/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import { connect } from 'dva';
import addAvatars from '@/assets/img/addAvatar.png';
import dept from '@/assets/img/dept.png';
import style from './index.scss';
import Avatar from '../../AntdComp/Avatar';
import { ddComplexPicker } from '../../../utils/ddApi';

// const { SHOW_PARENT } = TreeSelect;
@connect(({ costGlobal, session }) => ({
  userInfo: session.userInfo,
  deptAndUser: costGlobal.deptAndUser,
}))
class ShareLoan extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      list: [],
    };
  }

  onCancel = () => {
    this.setState({
      list: [],
    });
  }

  onShow = () => {
    const { list } = this.props;
    this.setState({
      // inputValue: '',
      list,
    });
  }

  onDel = (i, e) => {
    e.stopPropagation();
    const { list } = this.state;
    const newArr = [...list];
    newArr.splice(i,1);
    this.setState({
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
    const { list } = this.state;
    const { invoiceId } = this.props;
    console.log('ShareLoan -> handelPop -> list', list);
    const userList = list.filter(it => it.userId);
    const deptList = list.filter(it => !it.userId);
    const { userInfo } = this.props;
    ddComplexPicker({
      users: userList.map(it => it.userId) || [],
      departments: deptList.map(it => it.deptId) || [],
      disabledUsers: [userInfo.dingUserId]
    }, async(res) => {
      console.log(res);
      const users = [];
      const depts = [];
      if (res.users && res.users.length) {
        const listUser = await this.looUser(res.users.map(it => it.emplId));
        res.users.forEach(it => {
          users.push({
            avatar: it.avatar,
            userName: it.name,
            userId: it.emplId,
            deptId: listUser[it.emplId][0].deptId,
            deptName: listUser[it.emplId][0].name,
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
      this.props.dispatch({
        type: 'costGlobal/shareLoan',
        payload: {
          invoiceId,
          list: [...users, ...depts],
        },
      }).then(() => {
        if (this.props.onCanel) {
          this.props.onCanel();
        }
        this.setState({
          list: [...users, ...depts]
        });
      });
    });
  }

  render() {
    const { children } = this.props;
    const { list } = this.state;
    return (
      <span>
        <Popover
          trigger="click"
          onOk={this.onOk}
          overlayClassName={style.oldPop}
          placement="topLeft"
          content={(
            <div className={style.popNew}>
              <p className={style.title}>添加共享人</p>
              <p className="fs-14 c-black-65">共享是将该借款单共享给其他人，共享后其他人也可核销该借款或手动还款。适用于部门备用金申请等情况</p>
              <div className={style.shareAdd}>
                <div className={style.addBtn}>
                  <div className={style.addBtns}>
                    <img src={addAvatars} alt="添加" onClick={() => this.handelPop()} />
                  </div>
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
            </div>
          )}
        >
          <span>{children}</span>
        </Popover>
      </span>
    );
  }
}

export default ShareLoan;
