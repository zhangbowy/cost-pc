import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Icon } from 'antd';
import Avatar from '../../../components/AntdComp/Avatar';
import style from './index.scss';

function Header(props) {
  return (
    <div className={style.header}>
      <div>
        <Avatar avatar={props.userInfo && props.userInfo.avatar} name="谈薇" size={36} />
        <p>
          <p>你好，幺幺！</p>
          <p>你好，幺幺！</p>
        </p>
      </div>
      <div>
        <div>
          <p>
            <Icon type="tag" />
            <span className="c-black-45 fs-14">待还款3单</span>
          </p>
          <p className="c-black-85 fs-30">¥5600</p>
        </div>
      </div>
    </div>
  );
}

// Header.propTypes = {
//   datas: PropTypes.object,
// };

const mapStateToProps = (state) => {
  return {
    userInfo: state.session.userInfo,
  };
};

export default connect(mapStateToProps)(Header);

