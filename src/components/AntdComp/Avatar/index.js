import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import { Avatar as AntdAvatar } from 'antd';
import style from './index.scss';

const DEFAULT_AVATAR = 'https://media.forwe.store/community/avatar/avatar.png';

const Avatar = ({ className, avatar, name = '', size = 32 }) => {
  const _className = cs(
    style['pmc-avatar'],
    className,
    { 'use_text': !avatar || avatar === DEFAULT_AVATAR }
  );
  if (avatar && avatar !== DEFAULT_AVATAR) {
    return <AntdAvatar className={_className} size={size} src={avatar} />;
  }
  return (
    <AntdAvatar className={_className} size={size}>
      { name.substr(-2) }
    </AntdAvatar>
  );
};
Avatar.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Avatar;
