import React from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
// import cs from 'classnames';
// import treeConvert from '@/utils/treeConvert';
// import Search from 'antd/lib/input/Search';

const namespace = 'supplier';

@connect((state) => ({
  userInfo: state.session.userInfo,
  loading: state.loading.models[namespace],
  list: state[namespace].list,
  query: state[namespace].query,
}))

class Supplier extends React.PureComponent {
  constructor(props){
    super(props);
    this.setate = {

    };
  }

  render() {
    return (
      <div>
        供应商
      </div>
    );
  }
}

export default Supplier;
