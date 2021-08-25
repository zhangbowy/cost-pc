/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  // Dropdown,
  // Menu,
  // Icon,
  Tooltip,
  Breadcrumb,
} from 'antd';
import { withRouter } from 'react-router';
import styles from './index.scss';

@withRouter
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
            <a onClick={()=>{
              if(this.props.history){
                console.log(9999999999999999,this.props.history);
                this.props.history.goBack();
              }
            }}
            >返回上一页
            </a>
          </Breadcrumb.Item>
          {
            typeof(title) === 'string'?
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            : <div style={{display: 'inline-block'}}>{title}</div>
          }
        </Breadcrumb>
        {
          typeof(title) === 'string' &&
          <div className={styles.title}>
            {title}{note?(
              <Tooltip title={note}>
                <i className="iconfont iconIcon-yuangongshouce fs-14 c-black-45 m-l-8" />
              </Tooltip>
            ):''}
          </div>
        }
      </div>
    );
  }
}

export default App;
