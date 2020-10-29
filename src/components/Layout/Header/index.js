/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'umi/link';
import { connect } from 'dva';
import { Dropdown, Avatar, Icon, Menu ,
  // Dropdown,
  // Menu,
  // Icon,
  Breadcrumb,
} from 'antd';

import styles from './index.scss';

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

  render() {
    const {
      userInfo,
      // collapsed,
    } = this.props;
    // const breadcrumbList = this.setBreadcrumb();
    // const sysList = [];
    const menu = (
      <Menu style={{ minWidth: 120 }}>
        <Menu.Item 
          key="basicSetting_receiptAccount"
        >
          <Link to="/basicSetting/receiptAccount">个人收款账户</Link>
        </Menu.Item>
        {/* <Menu.Divider />
        {
          sysList.map((el) => (
            <Menu.Item key={el.sysId}>
              <a href={el.url}>{el.name}</a>
            </Menu.Item>
          ))
        } */}
      </Menu>
    );
    console.log('11111',userInfo);
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
        <div
          className="app-right"
          style={{ marginRight: 12 }}
        >
          <a href="https://www.yuque.com/ed3xn3/lbawoz" target="_blank" rel="noreferrer" className="m-r-32">帮助中心</a>
          <Dropdown overlay={menu}>
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
              <span>{userInfo.name || ''}</span>
              <Icon
                type="down"
                style={{ marginLeft: 5 }}
              />
            </a>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default App;
