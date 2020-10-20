import React from 'react';
// import PropTypes from 'prop-types';
import banner from '@/assets/img/banner2.png';
import style from './index.scss';

function HeadRight() {
  return (
    <div className={style.banner}>
      <img src={banner} alt="广告" />
    </div>
  );
}

// HeadRight.propTypes = {

// };

export default HeadRight;

