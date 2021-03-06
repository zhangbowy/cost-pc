import React, { Component } from 'react';
import { Button, message, Checkbox } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import PageHead from '@/components/pageHead';
import ControllerCom from '@/components/ControllerCom';
import style from './index.scss';
import { choosePeople } from '../../../utils/ddApi';
import LookAll from './components/LookAll';

@connect(({ peopleSet, session }) => ({
  detail: peopleSet.detail,
  isAll: peopleSet.isAll,
  userVos: peopleSet.userVos,
  allUserCount: peopleSet.allUserCount,
  checkAll: peopleSet.checkAll,
  payUserCount: peopleSet.payUserCount,
  userInfo: session.userInfo,
  synCompanyTime: peopleSet.synCompanyTime,
  queryUsers: peopleSet.queryUsers,
}))
class PeopleSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      value: false,
      visible: false,
    };
  }

  componentDidMount() {
    this.onInit();
  }

  onInit = () => {
    this.props.dispatch({
      type: 'peopleSet/detail',
      payload: {}
    }).then(() => {
      const { detail, isAll, userVos } = this.props;
      if (detail.msg) {
        message.error(detail.msg);
      }
      this.setState({
        users: userVos || [],
        value: isAll,
      });
    });
  }

  handleChange = (e) => {
    if (e.target.value) {
      this.props.dispatch({
        type: 'peopleSet/add',
        payload: {
          isAll: true,
        }
      }).then(() => {
        this.onInit();
      });
    } else {
      this.selectPeople();
    }
    // this.setState({
    //   value: e.target.value,
    // });
  }

  selectPeople = () => {
    const { users } = this.state;
    const { allUserCount, checkAll } = this.props;
    const _this = this;
    choosePeople(users.map(it => it.userId) || [], (res) => {
      let user = users;
      if (res.length > 0) {
        user = res.map(it =>  {
          return {
            avatar: it.avatar,
            userName: it.name,
            userId: it.emplId
          };
        });
        _this.props.dispatch({
          type: 'peopleSet/add',
          payload: {
            isAll: checkAll ? !((allUserCount - user.length) > 0) : false,
            userVos: user,
          }
        }).then(() => {
          _this.onInit();
        });
      }
      _this.setState({
        users: user,
      });
    });
  }

  onChange = (users) => {
    const { allUserCount } = this.props;
    const { value } = this.state;
    this.props.dispatch({
      type: 'peopleSet/add',
      payload: {
        isAll: value ? !((allUserCount - users.length) > 0) : false,
        userVos: users,
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
      this.onInit();
    });
  }

  onChecked = (e) => {
    this.props.dispatch({
      type: 'peopleSet/add',
      payload: {
        isAll: e.target.value,
      }
    }).then(() => {
      this.onInit();
    });
  }

  render() {
    const { detail, allUserCount, checkAll, isAll, payUserCount } = this.props;
    const { value, users, visible } = this.state;
    return (
      <div>
        <PageHead title="????????????" note="????????????????????????????????????????????????"  />
        <div className="content-dt">
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span>????????????????????????????????????????????????{payUserCount}??????</span>
            </div>
          </div>
          <div className={cs(style.btns, 'm-b-16')}>
            <Button
              type="primary"
              onClick={() => this.selectPeople()}
              className="m-r-16"
            >
              ????????????
            </Button>
            {
              checkAll &&
              <Checkbox
                checked={value}
                disabled={isAll}
                onChange={e => this.onChecked(e)}
              >
                ????????????
              </Checkbox>
            }
          </div>
          <span className="c-black-45 fs-14 m-l-10">
            ?????????{users && users.length > 0 ? `${users[0].userName}??????${detail.useCount}???` : '0???'}??????????????????{!checkAll ? (payUserCount-users.length) : (allUserCount-users.length)}??????
            <LookAll
              userVos={users}
              allUserCount={allUserCount}
              onChangePeo={(val) => this.onChange(val)}
              payUserCount={payUserCount}
              visible={visible}
              checkAll={checkAll}
            >
              <span className="sub-color" style={{cursor: 'pointer'}}>????????????????????????&gt;</span>
            </LookAll>
          </span>
          <ControllerCom
            dispatch={this.props.dispatch}
            userInfo={this.props.userInfo}
            synCompanyTime={this.props.synCompanyTime}
            queryUsers={this.props.queryUsers}
          />
        </div>
      </div>
    );
  }
}

export default PeopleSetting;
