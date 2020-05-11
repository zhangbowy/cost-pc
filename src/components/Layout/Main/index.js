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

class App extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    collapsed: false, // 侧边导航栏折叠标识
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
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
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default App;
