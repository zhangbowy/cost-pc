import React, { Component } from 'react';
import { Button, message, Checkbox } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import style from './index.scss';
import { choosePeople } from '../../../utils/ddApi';

@connect(({ peopleSet }) => ({
  detail: peopleSet.detail,
  isAll: peopleSet.isAll,
}))
class PeopleSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      value: false,
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
      const { detail, isAll } = this.props;
      if (detail.msg) {
        message.error(detail.msg);
      }
      this.setState({
        users: detail.userVos || [],
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
    this.setState({
      value: e.target.value,
    });
  }

  selectPeople = () => {
    const { users } = this.state;
    const _this = this;
    choosePeople(users.map(it => it.userId), (res) => {
      const user = res.map(it =>  {
        return {
          avatar: it.avatar,
          userName: it.name,
          userId: it.emplId
        };
      });
      if (res.length > 0) {
        _this.props.dispatch({
          type: 'peopleSet/add',
          payload: {
            isAll: false,
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

  render() {
    const { detail } = this.props;
    const { value } = this.state;
    return (
      <div>
        <div className="p-l-32" style={{backgroundColor: '#fff'}}>
          <p className="p-t-24 m-b-8 fs-20 c-black-85 fw-600">名额配置</p>
          <p className="p-b-24 fs-14 c-black-65">您可以在这里配置可用鑫支出的人员</p>
        </div>
        <div className="content-dt" style={{height: '500px'}}>
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span>授权可用鑫支出的人员（购买规格：{detail.payUserCount}人）</span>
            </div>
          </div>
          <div className={cs(style.btns, 'm-b-16')}>
            <Button
              type="primary"
              onClick={() => this.selectPeople()}
              disabled={value}
              className="m-r-16"
            >
              添加人员
            </Button>
            <Checkbox>全部人员</Checkbox>
          </div>
          <span className="c-black-45 fs-14 m-l-16">已授权桔梗、{detail.useCount}等人，还可以授权{detail.payUserCount}人，
            <span className="sub-color">查看全部授权人员&gt;</span>
          </span>
        </div>
      </div>
    );
  }
}

export default PeopleSetting;
