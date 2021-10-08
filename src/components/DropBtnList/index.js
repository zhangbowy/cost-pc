import React, { Component } from 'react';
import { Dropdown, Button, Menu, Icon } from 'antd';
import styles from './index.scss';

class DropBtnList extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  handleMenuClick = (e) => {
    this.props.handleClick(e.key);
  }

  render() {
    const {
      list,
      title,
      params,
      dorpProps,
      btnProps,
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {
          list.map(it => (
            <Menu.Item key={it[params.value]}><span className="pd-20-9 c-black-65">{it[params.label]}</span></Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <Dropdown overlay={menu} overlayClassName={styles.menuBtn} {...dorpProps}>
        <Button {...btnProps}>
          {title}<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

export default DropBtnList;
