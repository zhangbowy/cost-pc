/**
 * 表单搜索
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Icon,
} from 'antd';

class App extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    multiple: PropTypes.bool,
    expand: PropTypes.bool,
    size: PropTypes.number,
    loading: PropTypes.bool,
    onSearch: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    multiple: false, // 多功能标识
    expand: false, // 搜索框展开标识
    size: 3, // 简易搜索条数
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    expandForm: this.props.expand || false, // 搜索框展开标识
  };

  // 高级/简易搜索切换
  toggleForm = () => {
    const { onToggle } = this.props;
    this.setState((prevState) => ({
      expandForm: !prevState.expandForm,
    }), () => {
      if (onToggle) {
        onToggle(this.state.expandForm);
      }
    });
  };

  renderChild = () => {
    const {
      children,
      multiple,
      size,
    } = this.props;
    if (multiple && !this.state.expandForm) {
      return children.slice(0, size);
    }
    return children;
  };

  render() {
    const {
      multiple,
      loading,
      onSearch,
      onReset,
    } = this.props;
    const { expandForm } = this.state;

    return (
      <Form
        className="app-searchForm"
        layout="inline"
        onSubmit={onSearch}
      >
        {this.renderChild()}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            查询
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            disabled={loading}
            onClick={onReset}
          >
            重置
          </Button>
          {
            multiple && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.toggleForm}
              >
                <span>{expandForm ? '简易搜索' : '高级搜索'}</span>
                <Icon type={expandForm ? 'caret-up' : 'caret-down'} />
              </Button>
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default App;
