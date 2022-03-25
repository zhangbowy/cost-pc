/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';

class Redirect extends PureComponent {

  componentDidMount() {
    const url = window.location.href.split('redirect=')[1];
    window.location.href = url;
  }

  render() {
    return (
      <div />
    );
  }
}

export default Redirect;
