import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import style from './index.scss';
import { choosePeople } from '../../../utils/ddApi';

class PeopleSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  selectPeople = () => {
    const { users } = this.state;
    const _this = this;
    choosePeople(users.map(it => it.userId), (res) => {
      // const user = res.map(it =>  {...it, userId: it.emptId});
      _this.setState({
        users: res,
      });
    });
  }

  render() {
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
          <Radio.Group value="select">
            <Radio value="all" className="m-b-12" style={{display: 'block'}}>
              全部人员
            </Radio>
            <Radio value="select" className="m-b-12" style={{display: 'block'}}>
              部分人员
            </Radio>
          </Radio.Group>
          <div className={style.btns}>
            <Button type="primary" onClick={() => this.selectPeople()}>添加人员</Button>
            <span className="c-black-45 fs-14 m-l-16">购买人数</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PeopleSetting;
