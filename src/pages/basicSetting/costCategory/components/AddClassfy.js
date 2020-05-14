import React, { useState } from 'react';
import { Modal } from 'antd';
import constants from '@/utils/constants';
import cs from 'classnames';
import styles from './classify.scss';
import Basic from './Basic';
import Field from './Field';

const AddClassify= (props) => {

  const [left, setLeft] = useState('basic');
  const [visible, setVisible] = useState(false);
  return (
    <span className={styles.content}>
      <span onClick={() => setVisible(!visible)}>{ props.children }</span>
      <Modal
        title="新增费用类别"
        visible={visible}
        onCancel={() => setVisible(!visible)}
        bodyStyle={{
          padding: 0,
          height: '441px',
        }}
        width='780px'
      >
        <div className={styles.classify}>
          <div className={styles.lefts}>
            {
              constants.classify.map(item => (
                <div
                  className={left === item.key ? cs(styles.leftTl, styles.active) : styles.leftTl}
                  key={item.key}
                  onClick={() => setLeft(item.key)}
                >
                  {item.value}
                </div>
              ))
            }
          </div>
          {
            left === 'basic' ?
              <Basic />
            :
              <Field />
          }
        </div>
      </Modal>
    </span>
  );
};

export default AddClassify;
