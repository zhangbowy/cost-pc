

import React from 'react';
import { message, Menu } from 'antd';
import { connect } from 'dva';
import Auth from './reimburse';
import ApproveIndex from './approve';

@connect(({ loading, summary }) => ({
  loading: loading.effects['summary/list'] || false,
  list: summary.list,
  query: summary.query,
  total: summary.total,
}))
class AuthIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 'reimburse'
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({...query});
  }

  onOk = () => {
    const {
      query,
    } = this.props;
    this.onQuery({
      ...query
    });
  }

  // onLink = (id) => {
  //   if (this.state.current === 'summary') {
  //     this.props.history.push(`/system/summary/${id}`);
  //   } else {
  //     this.props.history.push(`/system/summary/approve/${id}`);
  //   }
  // }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'summary/list',
      payload,
    });
  }

  onDelete = (id) => {
    const {
      query,
      dispatch,
    } = this.props;
    dispatch({
      type: 'summary/del',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({
        ...query
      });
    });
  }

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    console.log(555555,this.props);
    return (
      <div>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          {/* <p className="m-l-32 p-t-16 m-b-16"><span style={{cursor:'pointer'}} className="c-black-36 fs-14" onClick={()=>{this.props.history.goBack();}}>返回上一级</span> / <span className="c-black-65 fs-14">角色管理</span></p> */}
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>台账汇总</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[this.state.current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key="reimburse">报销单</Menu.Item>
            <Menu.Item key="borrow">借款单</Menu.Item>
            <Menu.Item key="application ">申请单</Menu.Item>
          </Menu>
        </div>
        {
          this.state.current === 'reimburse' ?
            <Auth onLink={this.onLink} />
            :
            <ApproveIndex onLink={this.onLink} />
        }
      </div>
    );
  }
}

export default AuthIndex;
