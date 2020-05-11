import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Main from '@/components/Layout/Main';

@connect(({ session }) => ({
  isLogin: session.isLogin,
}))
class BasicLayout extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isLogin: PropTypes.bool,
  };

  render() {
    const { children, isLogin } = this.props;
    if (!isLogin) {
      return null;
    }

    return (
      <Main>
        {children}
      </Main>
    );
  }
}

export default BasicLayout;
