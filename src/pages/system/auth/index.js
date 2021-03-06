

import React from 'react';
import { message, Menu, Tooltip } from 'antd';
import { connect } from 'dva';
import Auth from './auth';
import ApproveIndex from './approve';

@connect(({ loading, auth }) => ({
  loading: loading.effects['auth/list'] || false,
  list: auth.list,
  query: auth.query,
  total: auth.total,
}))
class AuthIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 'auth'
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

  onLink = (id) => {
    if (this.state.current === 'auth') {
      this.props.history.push(`/system/auth/${id}`);
    } else {
      this.props.history.push(`/system/auth/approve/${id}`);
    }
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'auth/list',
      payload,
    });
  }

  onDelete = (id) => {
    const {
      query,
      dispatch,
    } = this.props;
    dispatch({
      type: 'auth/del',
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
          <p className="m-l-32 p-t-16 m-b-16"><span style={{cursor:'pointer'}} className="c-black-36 fs-14" onClick={()=>{this.props.history.goBack();}}>返回上一级</span> / <span className="c-black-65 fs-14">角色管理</span></p>
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>角色管理</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[this.state.current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key="auth">系统角色</Menu.Item>
            <Menu.Item key="approve">
              <Tooltip
                title={(
                  <div>
                    <p style={{marginBottom: 0}}>1.审核角色是什么？</p>
                    <p className="m-b-8">可以将有相同审批职能的人设置为同一角色，并将角色添加为审批人。</p>
                    <p style={{marginBottom: 0}}>2.角色的管理范围？</p>
                    <p className="m-b-8">角色中的每个人可以指定管理的部门/支出类别，设置后对应部门/支出类别的员工的审批就由对应的人审批</p>
                  </div>
                )}
                placement="bottomLeft"
              >
                <span>审批角色</span>
              </Tooltip>
            </Menu.Item>
          </Menu>
        </div>
        {
          this.state.current === 'auth' ?
            <Auth onLink={this.onLink} />
            :
            <ApproveIndex onLink={this.onLink} />
        }
      </div>
    );
  }
}

export default AuthIndex;
