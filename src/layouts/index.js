import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Main from '@/components/Layout/Main';
import NoDing from '@/components/NoDing';
import constants from '../utils/constants';

const { isInDingTalk } = constants;
@connect(({ session }) => ({
  isLogin: session.isLogin,
  status: session.status,
}))
class BasicLayout extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isLogin: PropTypes.bool,
  };

  render() {
    const { children, isLogin, status } = this.props;
    if (!isLogin && isInDingTalk) {
      return null;
    }
    if (Number(status) === 1) {
      return <NoDing type="403" />;
    }
    if (!isInDingTalk) {
      return <NoDing type="500" />;
    }

    return (
      <Main>
        {children}
      </Main>
    );
  }
}

export default BasicLayout;
