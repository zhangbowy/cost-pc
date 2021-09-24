import React from 'react';
import PropTypes from 'prop-types';
import {
  ConfigProvider,
  Layout,
} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from '@/components/Layout/Header';
import Sider from '@/components/Layout/Sider';
import styles from './index.scss';
import logo from '../../../assets/img/dyxd.png';

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

  render() {
    const { collapsed, visible } = this.state;
    const { children } = this.props;

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
            <div
              style={{ position: 'fixed', bottom: '74px', right: '23px', zIndex: '100' }}
              onClick={() => this.onLink()}
            >
              <img src={logo} alt="logo" style={{ width: '84px' }} />
              <iframe
                title="外部链接"
                scrolling="yes"
                frameBorder="0"
                className={visible ? styles.dyxd : styles.disabled}
                src="https://cschat.antcloud.com.cn/index.htm?tntInstId=UMNPKHCN&scene=SCE00001384&source=dingadmin#/"
              />
            </div>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default App;
