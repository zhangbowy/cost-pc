import React, { Component } from 'react';
import { Button, message, Checkbox } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import PageHead from '@/components/PageHead';
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
    const { allUserCount, payUserCount, checkAll } = this.props;
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
    }, {
      max: checkAll ? allUserCount : payUserCount,
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
        {/* <div className="p-l-32" style={{backgroundColor: '#fff', minWidth: '1102px'}}>
          <p className="p-t-24 m-b-8 fs-20 c-black-85 fw-600">名额配置</p>
          <p className="p-b-24 fs-14 c-black-65">你可以在这里配置可用鑫支出的人员</p>
        </div> */}
        <PageHead title="人员配置" note="你可以在这里配置可用鑫支出的人员"  />
        <div className="content-dt" style={{height: '500px'}}>
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span>授权可用鑫支出的人员（购买规格：{payUserCount}人）</span>
            </div>
          </div>
          <div className={cs(style.btns, 'm-b-16')}>
            <Button
              type="primary"
              onClick={() => this.selectPeople()}
              className="m-r-16"
            >
              添加人员
            </Button>
            {
              checkAll &&
              <Checkbox
                checked={value}
                disabled={isAll}
                onChange={e => this.onChecked(e)}
              >
                全部人员
              </Checkbox>
            }
          </div>
          <span className="c-black-45 fs-14 m-l-10">
            已授权{users && users.length > 0 ? `${users[0].userName}、等${detail.useCount}人` : '0人'}，还可以授权{!checkAll ? (payUserCount-users.length) : (allUserCount-users.length)}人，
            <LookAll
              userVos={users}
              allUserCount={allUserCount}
              onChangePeo={(val) => this.onChange(val)}
              payUserCount={payUserCount}
              visible={visible}
              checkAll={checkAll}
            >
              <span className="sub-color" style={{cursor: 'pointer'}}>查看全部授权人员&gt;</span>
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
