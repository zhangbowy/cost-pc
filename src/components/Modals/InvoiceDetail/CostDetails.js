import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col } from 'antd';
import moment from 'moment';
import cs from 'classnames';
import style from './index.scss';

function CostDetails({ children, record }) {
  const [visible, setVisible] = useState(false);
  console.log(record);

  return (
    <span>
      <span onClick={() => setVisible(true)}>{children}</span>
      <Modal
        visible={visible}
        title="支出类别详情"
        footer={null}
        onCancel={() => setVisible(false)}
        width="980px"
        bodyStyle={{
          minHeight: '300px',
          maxHeight: '470px',
          overflowY: 'scroll'
        }}
      >
        <Row>
          <Col span={8}>
            <div style={{display: 'flex'}}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>支出类别名称：</span>
              <span className="fs-14 c-black-65" style={{flex: 1}}>{record.categoryName}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{display: 'flex'}}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>金额：</span>
              <span className="fs-14 c-black-65" style={{flex: 1}}>
                {record.currencySumStr ? `${record.costSumStr}(${record.currencySumStr})` : `¥${record.costSum/100}`}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{display: 'flex'}}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>支出类别备注：</span>
              <span className="fs-14 c-black-65" style={{flex: 1}}>{record.note}</span>
            </div>
          </Col>
          {
            record.expandCostDetailFieldVos &&
            (record.expandCostDetailFieldVos.length > 0) &&
            record.expandCostDetailFieldVos.map(itField => {
              let texts = itField.msg;
              if (itField.startTime) {
              console.log('InvoiceDetail -> render -> moment(Number(itField.startTime)).format(\'YYYY-MM-DD\')', moment(Number(itField.startTime)).format('YYYY-MM-DD'));
              texts = itField.endTime ?
              `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}-${moment(Number(itField.endTime)).format('YYYY-MM-DD')}`
                :
                `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}`;
              }
              return (
                <Col span={8} className="m-t-16" key={itField.field}>
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{itField.name}：</span>
                    <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                      {texts}
                    </span>
                  </div>
                </Col>
              );
            })
          }
          {
            record.selfCostDetailFieldVos &&
            (record.selfCostDetailFieldVos.length > 0) &&
            record.selfCostDetailFieldVos.map(itField => {
              let texts = itField.msg;
              if (itField.startTime) {
              console.log('InvoiceDetail -> render -> moment(Number(itField.startTime)).format(\'YYYY-MM-DD\')', moment(Number(itField.startTime)).format('YYYY-MM-DD'));
              texts = itField.endTime ?
              `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}-${moment(Number(itField.endTime)).format('YYYY-MM-DD')}`
                :
                `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}`;
              }
              return (
                <Col span={8} className="m-t-16" key={itField.field}>
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{itField.name}：</span>
                    <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                      {texts}
                    </span>
                  </div>
                </Col>
              );
            })
          }
        </Row>
      </Modal>
    </span>
  );
}

CostDetails.propTypes = {
  record: PropTypes.object,
};

export default CostDetails;

