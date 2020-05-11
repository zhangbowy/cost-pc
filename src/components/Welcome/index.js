import React from 'react';
import constants from '@/utils/constants';
import styles from './index.scss';

export default () => (
  <h2 className={styles.title}>
    欢迎使用
    {constants.APP_NAME}
  </h2>
);
