/**
 * antd表格操作按钮
 * 使用场景：当表格的操作列有较多按钮，为了使操作列更简洁，将部分按钮以下拉菜单形式展示
 *
 * @param {object[]} source - 按钮数据集
 * @param {number} [size=2] - 默认显示个数
 * @param {string} [moreText='更多'] - 更多按钮文字
 *
 */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Dropdown,
  Divider,
  Icon,
} from 'antd';

function renderBtn(data) {
  return (
    data.map((el, index) => (
      <React.Fragment key={`tableBtn-${index}`}>
        {index !== 0 && <Divider type="vertical" />}
        {el.node}
      </React.Fragment>
    ))
  );
}

const App = ({
  source,
  size = 2,
  moreText = '更多',
}) => {
  if (source.length > size) {
    const menu = (
      <Menu>
        {
          source.slice(size - 1).map((el, index) => (
            <Menu.Item key={`tableBtn-${index}`}>
              {el.node}
            </Menu.Item>
          ))
        }
      </Menu>
    );
    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          {moreText}
          <Icon type="down" />
        </a>
      </Dropdown>
    );
    return (
      <div>
        {renderBtn(source.slice(0, size - 1))}
        <Divider type="vertical" />
        <MoreBtn />
      </div>
    );
  }

  return renderBtn(source);
};

App.propTypes = {
  source: PropTypes.array.isRequired,
  size: PropTypes.number,
  moreText: PropTypes.string,
};

export default App;
