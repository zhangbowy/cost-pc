import React, { Component } from 'react';
import { Menu } from 'antd';

class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.status || '',
    };
  }

  handleClick = (e) => {
    const {
      onHandle
    } = this.props;
    this.setState({
      status: e.key,
    });
    // eslint-disable-next-line no-unused-expressions
    onHandle && onHandle(e.key);
  }

  render() {
    const {
      lists,
      params,
    } = this.props;
    const { status } = this.state;
    return (
      <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
        {
          lists.map(item => (
            <Menu.Item key={item[(params && params.key) || 'key']}>
              {item[(params && params.value) || 'value']}
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

export default MenuItems;
