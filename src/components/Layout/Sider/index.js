/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-deprecated */
import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import {
  Layout,
  Menu,
  Icon,
  Button,
} from 'antd';
import left from '@/assets/img/left.png';
import right from '@/assets/img/right.png';
import { urlToList } from '@/utils/common';
// import constants from '@/utils/constants';
import styles from './index.scss';
import InitModal from '../../Modals/InitModal';
import Services from '../../Modals/Services';

const getMenuKey = (props) => {
  console.log(3415234235423,props);
  let url = props.menuKey || props.location.pathname;
  if (url.indexOf('/_aliPayConfirms') !== -1) {
    const indexs = url.indexOf('/_aliPayConfirms');
    url = url.substring(0, indexs);
  }
  if(props.location.params&&props.location.params.selectUrl){
    url = props.location.params.selectUrl;
  }
  console.log('url', url);
  return urlToList(url);
};
// Allow menu.js config icon
// icon: 'setting',
// myIcon: 'user',
const getIcon = (menu) => {
  console.log(222222222222,menu);
  if (menu.icon) {
    return <Icon type={menu.icon} />;
  }
  return <i className={cs('iconfont', menu.myIcon)} style={{marginRight: '6px'}} />;
};

@withRouter
@connect(({ session, global }) => ({
  menus: session.menus,
  menuKey: global.menuKey,
  userInfo: session.userInfo,
  status: session.status,
  approvalNum: session.approvalNum
}))
class App extends React.PureComponent {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    menuKey: PropTypes.string,
    collapsed: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func.isRequired,
  };

  state = {
    openKeys: getMenuKey(this.props),
    prevPath: '',
    collapsed: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('走了没有啊，走了就不用了', nextProps);
    if (nextProps.location.pathname !== prevState.prevPath) {
      return {
        openKeys: getMenuKey(nextProps),
        prevPath: nextProps.location.pathname
      };
    }
    return null;
	}

  // 获取菜单节点
  getMenuItems = (data = []) => {
    // const { approvalNum } = this.props;
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu
            key={item.path}
            title={
              (item.icon || item.myIcon) ? (
                <span>
                  {getIcon(item)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
          >
            {this.getMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          <Link to={item.path}>
            {(item.icon || item.myIcon) && getIcon(item)}
            <span>{item.name}</span>
            {/* {
              item.name === '审批' &&
              <div className={styles.corner}>{approvalNum}</div>
            } */}
          </Link>
        </Menu.Item>
      );
    });
  };

  // 判断是否为一级导航
  isMainMenu = (key) => {
    const { menus } = this.props;
    return menus.some(item => item.path === key);
  };

  onOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    // 判断是否有多个一级导航同时展开，若有，则只展开最后一个
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };

  // 是否折叠
  toggle = () => {
    this.setState({
      collapsed:!this.state.collapsed,
    });
  };

  render() {
    const {
      collapsed,
      onCollapse,
      menus,
      userInfo,
      status,
    } = this.props;
    const { openKeys } = this.state;
    // 是否折叠
    const isCollapsed = this.state.collapsed;
    const selectedKeys = getMenuKey(this.props);
    const menuProps = collapsed ? {} : { openKeys };
    const costConfigCheckVo = userInfo.costConfigCheckVo || {};
    return (
      <Layout.Sider
        trigger={null}
        // collapsible
        collapsed={isCollapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        className={styles.sider}
        collapsedWidth='64'
        width="190"
      >
        {/* 是否折叠 */}

        <div className={styles.trigger} onClick={this.toggle}>
          <img src={isCollapsed?left:right} alt=""/>
        </div>
        <div className={styles.logo}>
          <Link to="/">
            <div className={styles.logoContainer}>
              <span className={styles.newLogo} />
              {isCollapsed?'':<span className={styles.logoFont} />}
            </div>
            {/* <h1>{constants.APP_NAME}</h1> */}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          className={isCollapsed ? cs('app-menu', styles.menuStyle) : 'app-menu'}
          {...menuProps}
          selectedKeys={selectedKeys}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          onOpenChange={this.onOpenChange}
          expandIcon={(prop) => {
            console.log('App -> render -> prop', prop);
            if (isCollapsed) return null;
            return(
              <i className={prop.isOpen ? 'iconfont icona-shangjiantou3x' : 'iconfont icona-xiajiantou3x'} />
            );
          }}
        >
          {this.getMenuItems(menus)}
        </Menu>
        <div className={styles.footerSider}>
          {isCollapsed?'':<i className={styles.lines} />}
          <InitModal>
            <div className="f-c m-b-8 cur-p t-l" style={{width: '100%'}}>
              <i className="iconfont iconlianxikefu m-r-8"/>
              {isCollapsed?'':<span>联系我们</span>}
            </div>
          </InitModal>
          <p className="f-c-85 fs-12 m-b-16" > {isCollapsed ? null: '遇到问题？想开通更多功能请联系我们'}</p>
          <Services costConfigCheckVo={costConfigCheckVo} status={status} visible={Number(status) === 2}>
            {isCollapsed ? <i className="iconfont iconxufeishengji m-r-4" style={{color:'#ffcb37',fontSize:'16px'}}/>: <Button type="primary" className={styles.footBtn}> <i className="iconfont iconxufeishengji m-r-4" style={{fontSize:'16px'}}/><span>版本升级</span></Button>}
          </Services>
          <p className="f-c-cost fs-12 m-t-8" style={{marginBottom: '24px'}}> </p>
        </div>
      </Layout.Sider>
    );
  }
}

export default App;
