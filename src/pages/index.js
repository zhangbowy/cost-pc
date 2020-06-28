import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Redirect from 'umi/redirect';
import { getRedirect } from '@/utils/authority';
import Welcome from '@/components/Welcome';
import NoDing from '@/components/NoDing';

console.log('进入页面');
@connect((state) => ({
  isMenuReady: state.session.isMenuReady,
  status: state.session.status,
}))
class App extends React.PureComponent {
  static propTypes = {
    isMenuReady: PropTypes.bool,
  };

  render() {
    const { status } = this.props;
    if (Number(status) === 2) {
      return <NoDing type="403" />;
    }
    if (this.props.isMenuReady) {
      return <Redirect to={getRedirect()} />;
    }
    return <Welcome />;
  }
}

export default App;
