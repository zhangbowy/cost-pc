import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Table } from 'antd';
import cs from 'classnames';
import style from './index.scss';

function CostDetails({ children, record }) {
  const [visible, setVisible] = useState(false);
  console.log(record);

  return (
    <Modal
      visible={visible}
      title="费用类别详情"
    >
      <span onClick={() => setVisible(true)}>{children}</span>
      <Row>
        <Col span={8}>
          <div style={{display: 'flex'}}>
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>：</span>
            <span className="fs-14 c-black-65" style={{flex: 1}}>{record.categoryName}</span>
          </div>
        </Col>
        {
          record.selfCostDetailFieldVos &&
          (record.selfCostDetailFieldVos.length > 0) &&
          record.selfCostDetailFieldVos.map(it => (
            <Col span={8} className="m-t-16" key={it.field}>
              <div style={{display: 'flex'}}>
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{it.name}：</span>
                <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                  {it.msg}
                </span>
              </div>
            </Col>
          ))
        }
      </Row>
      <Table />
    </Modal>
  );
}

CostDetails.propTypes = {
  record: PropTypes.object,
};

export default CostDetails;

