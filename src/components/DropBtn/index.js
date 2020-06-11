import React, { Component } from 'react';
import { Dropdown, Button, Icon, Menu } from 'antd';
import styles from './index.scss';

class DropBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  handleMenuClick = (e) => {
    this.props.onExport(e.key);
  }

  render() {
    const {
      selectKeys,
      total,
      noLevels
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1"><span className="pd-20-9 c-black-65">导出选中（{selectKeys.length}）</span></Menu.Item>
        {!noLevels && <Menu.Item key="2"><span className="pd-20-9 c-black-65">导出高级搜索结果（{total}）</span></Menu.Item>}
        <Menu.Item key="3"><span className="pd-20-9 c-black-65">导出全部</span></Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} overlayClassName={styles.menuBtn}>
        <Button>
          导出 <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

export default DropBtn;
