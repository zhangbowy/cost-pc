import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Main from '@/components/Layout/Main';
import NoDing from '@/components/NoDing';
import constants from '../utils/constants';
import Transform from '../components/Transform';

const { isInDingTalk } = constants;
@connect(({ session }) => ({
  isLogin: session.isLogin,
  status: session.status,
  userInfo: session.userInfo,
}))
class BasicLayout extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isLogin: PropTypes.bool,
  };

  render() {
    const { children, isLogin, status, userInfo } = this.props;
    let url = window.location.href;
    if (url.indexOf('transformPage') > -1) {
      return (
        <Transform />
      );
    }
    if (!isLogin && isInDingTalk) {
      return null;
    }
    if (Number(status) === 1) {
      return <NoDing type="403" configs={userInfo.costConfigCheckVo || {}} />;
    }
    if (!isInDingTalk) {
      return <NoDing type="500" />;
    }
    if (url.indexOf('/_aliPayConfirms') !== -1) {
      const indexs = url.indexOf('/_aliPayConfirms');
      url = url.substring(0, indexs);
      window.location.href = url;
    }
    return (
      <Main>
        {children}
      </Main>
    );
  }
}

export default BasicLayout;
