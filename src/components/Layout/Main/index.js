import React from 'react';
import PropTypes from 'prop-types';
import {
  ConfigProvider,
  Layout,
} from 'antd';
import { connect } from 'dva';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from '@/components/Layout/Header';
import Sider from '@/components/Layout/Sider';
import styles from './index.scss';
import logo from '../../../assets/img/dyxd.png';

@connect(({ session }) => ({
  userInfo: session.userInfo,
}))
class App extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    collapsed: false, // 侧边导航栏折叠标识
    visible: false
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onLink = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  stopPro = (e) => {
    e.stopPropagation();
    return false;
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { collapsed, visible } = this.state;
    const { children, userInfo } = this.props;

    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ width: '100vw', height: '100vh' }}>
          <Sider
            collapsed={collapsed}
            onCollapse={this.onCollapse}
          />
          <Layout>
            <Layout.Header className={styles.header}>
              <Header
                collapsed={collapsed}
                onCollapse={this.onCollapse}
              />
            </Layout.Header>
            <Layout.Content className="app-content">
              {children}
            </Layout.Content>
            {
              userInfo.xding &&
              <>
                <div
                  // style={{ position: 'fixed', bottom: '74px', right: '-42px', zIndex: '100' }}
                  onClick={() => this.onLink()}
                  className={styles.ding}
                >
                  <img src={logo} alt="logo" style={{ width: '84px' }} />
                </div>
                <div className={!visible ? styles.alertBg : styles.alertShow} onTouchStart={e => this.stopPro(e)} onClick={() => this.onClose()}>
                  <iframe
                    title="外部链接"
                    scrolling="yes"
                    frameBorder="0"
                    className={visible ? styles.dyxd : styles.disabled}
                    src={userInfo.xding}
                  />
                </div>
              </>
            }
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default App;
