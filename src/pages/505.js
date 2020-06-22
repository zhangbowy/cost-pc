import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Exception from '@/components/Exception';

@connect()
class App extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'global/save',
      payload: {
        breadcrumbs: [],
        menuKey: '',
      },
    });
  }

  render() {
    return (
      <Exception type="505" />
    );
  }
}

export default App;
