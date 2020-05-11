import PropTypes from 'prop-types';

const App = ({ visible, children }) => {
  return visible ? children : null;
};

App.defaultProps = {
  visible: false,
};

App.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
};

export default App;
