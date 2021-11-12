/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'umi/link';
import cs from 'classnames';
import { connect } from 'dva';
import { Dropdown, Avatar, Icon, Menu ,
  Breadcrumb,
} from 'antd';
import withRouter from 'umi/withRouter';
import acc from '@/assets/img/account.png';

import styles from './index.scss';
import XfwProducts from '../../XfwProducts';

@withRouter
@connect(({ session, global }) => ({
  userInfo: session.userInfo,
  breadcrumbs: global.breadcrumbs,
}))
class App extends React.PureComponent {

  static propTypes = {
    breadcrumbs: PropTypes.array,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
  };

  state = {
    isBoss: localStorage.getItem('workbenchIsBoss') === 'true',
  }

  // 设置面包屑
  setBreadcrumb = () => {
    const { breadcrumbs } = this.props;
    // console.log(breadcrumbs);
    return (
      <Breadcrumb className={styles.breadcrumb}>
        {breadcrumbs.map((item) => (
          <Breadcrumb.Item key={item.name}>
            {item.path ? (
              <Link to={item.path}>
                {item.name}
              </Link>
            ) : item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  // 登出
  logout = () => {
    window.APPSSO.logout();
  };

  // 菜单折叠回调
  toggle = () => {
    const {
      collapsed,
      onCollapse,
    } = this.props;
    onCollapse(!collapsed);
  };

  changeLink = (url) => {
    const { isBoss } = this.state;
    if (url === '/workbench') {
      this.props.dispatch({
        type: 'session/setUserRole',
        payload: {
          isBoss: !isBoss
        }
      }).then(() => {
        this.setState({
          isBoss: !isBoss,
        });
        localStorage.removeItem('workbenchIsBoss');
        localStorage.setItem('workbenchIsBoss', !isBoss);
        this.props.history.replace({
          pathname: this.props.location.pathname.indexOf('workbench') > -1 ? '/' : url,
          state: isBoss ? 2 : 1,
        });
      });
    }
    this.props.history.push(url);
  }

  render() {
    const {
      userInfo,
      // collapsed,
    } = this.props;
    const { isBoss } = this.state;
    // const breadcrumbList = this.setBreadcrumb();
    // const sysList = [];
    const menu = (
      <Menu style={{ minWidth: 120 }}>
        <Menu.Item
          key="basicSetting_receiptAccount"
        >
          <span
            className={styles.headMenu}
            onClick={() => this.changeLink('/basicSetting/receiptAccount')}
          >
            <img src={acc} alt="账户" />
            <span className="fs-14 c-black-65">个人收款账户</span>
          </span>
          {/* <Link to="/basicSetting/receiptAccount">个人收款账户</Link> */}
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        {/* <div className="app-left">
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          { breadcrumbList }
        </div> */}
        <span
          className={cs('app-left', styles.headLeft)}
          onClick={() => this.changeLink('/workbench')}
        >
          <i className="iconfont iconqiehuan1" />
          <span className="fs-14 c-black-65">{ isBoss ? '切换为员工' : '切换为老板' }</span>
        </span>
        <div
          className="app-right"
          style={{ marginRight: 12 }}
        >
          <XfwProducts current="鑫支出">
            <a className="m-r-32">其他产品</a>
          </XfwProducts>
          <a href="https://www.yuque.com/yifei-zszlu/ref3g8/pn19b4" target="_blank" rel="noreferrer" className="m-r-32">帮助中心</a>
          <Dropdown
            overlay={menu}
            overlayClassName={styles.overlayMenu}
          >
            <a style={{ color: '#333' }}>
              {
                userInfo.avatar?
                  <Avatar src={userInfo.avatar} />
                : (
                  <Avatar style={{ background: '#2680F2',color: '#fff',marginRight:'10px',fontSize: '' }} >
                    {userInfo.name.substring(userInfo.name.length-2<0?0:userInfo.name.length-2,userInfo.name.length) || ''}
                  </Avatar>
                )
              }
              <span className="m-l-8 c-black-65">{userInfo.name || ''}</span>
              <Icon
                type="down"
                style={{
                  marginLeft: 5,
                  color: 'rgba(0,0,0,0.65)'
                }}
              />
            </a>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default App;
