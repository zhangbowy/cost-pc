/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  // Dropdown,
  // Menu,
  // Icon,
  Tooltip,
  Breadcrumb,
} from 'antd';
import styles from './index.scss';

@connect(({ session, global }) => ({
  userInfo: session.userInfo,
  breadcrumbs: global.breadcrumbs,
}))
class App extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    note: PropTypes.string,
    // isMenu: PropTypes.bool
  };

  render() {
    const {
      title,
      note,
      // collapsed,
    } = this.props;
    
    return (
      <div className={styles.headerBox}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/basicSettings">返回上一页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.title}>
          {title}{note?(
            <Tooltip title={note}>
              <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
            </Tooltip>
          ):''}
        </div>
      </div>
    );
  }
}

export default App;
