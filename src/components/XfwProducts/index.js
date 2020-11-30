/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { ddOpenLink } from '@/utils/ddApi';

import style from './index.scss';

export default function XfwProducts({ current, children }) {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const getProducts = () => {
    return new Promise((resolve) => {
      fetch('https://comimg.forwe.store/community/common/drainage/project.json',
      {
        method: 'GET', mode: 'cors'
      }).then(res => {
        try {
          if (!res.body.locked) {
            return res.clone().json();
          }
            return res.json();

        } catch (e) {
          throw new Error(e);
        }
      }).then(res => {
        console.log(res.result);
        resolve(res.result);
      }).catch(e => {
        console.log(e);
      });
    });
  };
  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res);
    });
  }, []);

  const toggleModal = () => {
    setVisible(!visible);
  };
  // const openLink = (link) => {
  //   console.log(link);
  // };
  return (
    <span>
      <span onClick={toggleModal}>{children}</span>
      <Modal
        className={style['xfw-products-modal']}
        visible={visible}
        footer={null}
        onCancel={toggleModal}
        centered
        bodyStyle={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E9F9FF 100%)',
          padding: '60px 50px 67px 50px'
        }}
        width="728px"
      >
        <div className={style['xfw-products-container']}>
          <img
            alt="测试"
            className={style['xfw-products-title']}
            src="http://xfw-marketing.oss-cn-hangzhou.aliyuncs.com/Public/xfw-products/pc-title.png"
          />
          <div className={style['xfw-products-wrap']}>
            {products.map((item) => {
              if (item.name !== current) {
                return (
                  <img
                    alt="测试"
                    key={item.name}
                    className={style['xfw-products-item']}
                    src={item.pcPicUrl}
                    onClick={() => ddOpenLink(item.pcLink)}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </Modal>
    </span>
  );
}
