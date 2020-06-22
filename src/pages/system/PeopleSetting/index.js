import React, { Component } from 'react';
import { Radio, Button, message } from 'antd';
import { connect } from 'dva';
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
              <span>授权可用鑫支出的人员</span>
            </div>
          </div>
          <Radio.Group value={value} onChange={(e) => this.handleChange(e)}>
            <Radio value className="m-b-12" style={{display: 'block'}}>
              全部人员
            </Radio>
            <Radio value={false} className="m-b-12" style={{display: 'block'}}>
              部分人员
            </Radio>
          </Radio.Group>
          <div className={style.btns}>
            <Button type="primary" onClick={() => this.selectPeople()} disabled={value}>添加人员</Button>
            <span className="c-black-45 fs-14 m-l-16">{detail.useCount}/{detail.payUserCount}购买人数</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PeopleSetting;
