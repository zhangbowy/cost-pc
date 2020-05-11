import React from 'react';
import PropTypes from 'prop-types';
import Link from 'umi/link';
import {
  Result,
  Button,
} from 'antd';

const config = {
  403: '你没有此页面的访问权限',
  404: '页面不存在',
};

const App = ({ type }) => (
  <Result
    status={type}
    title={type}
    subTitle={config[type]}
    extra={<Button type="primary"><Link to="/">返回首页</Link></Button>}
  />
);

App.propTypes = {
  type: PropTypes.string.isRequired,
};

export default App;
