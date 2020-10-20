import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import cs from 'classnames';
import { Modal } from 'antd';
import style from './index.scss';

function SelectInvoice(props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {


    // return;
  }, []);

  return (
    <span>
      <span>{props.children}</span>
      <Modal
        title={null}
        footer={null}
        onCancel={() => setVisible(false)}
        visible={visible}
        width="780px"
        bodyStyle={{
          height: '500px',
          padding: '38px 40px 34px'
        }}
      >
        <p className="fs-24 fw-500 m-b-24 c-black-85">选择单据模板</p>
        <div className={style.scrollCont}>
          <div className={style.slInLeft}>
            <p className="c-black-25 fs-14">选择分组</p>
            <div className={style.scroll}>
              <p className={cs(style.namePro, 'm-b-16')}>
                <span className={cs(style.name, 'c-black-65')}>这里是分组名称</span>
                <span className="c-black-25">10</span>
              </p>
            </div>
          </div>
          <div className={style.slRight}>
            <div className="m-b-20">
              <p className="c-black-85 fs-16 fw-500">常用单据</p>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
              </div>
            </div>
            <div className="m-b-20">
              <p className="c-black-85 fs-16 fw-500">常用单据</p>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
                <div className={style.tags}>
                  <p className="c-black-85 fs-14">XX报销单据模板</p>
                  <p className="fs-12 c-black-36">这里是简介，最多展示一行</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </span>
  );
}

SelectInvoice.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    prop: state.prop
  };
};

export default connect(mapStateToProps)(SelectInvoice);

