import React from 'react';
import PropTypes from 'prop-types';
import style from './index.scss';

function FooterBar(props) {
  return (
    <div className={style.footerBar}>
      <div className={style.footerBarLeft}>{ props.left }</div>
      <div className={style.right}>
        {
          props.right
        }
      </div>
    </div>
  );
}

FooterBar.propTypes = {
  right: PropTypes.object,
};

export default FooterBar;

