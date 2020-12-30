import React, { useState } from 'react';
import { Modal } from 'antd';
import role1 from '../../../assets/img/role1.png';
import role2 from '../../../assets/img/role2.png';

function NoRole({ children }) {
  const [visible, setVisible] = useState(false);
  return (
    <span>
      <span onClick={() => setVisible(true)}>{children}</span>
      <Modal
        onCancel={() => setVisible(false)}
        footer={null}
        visible={visible}
        width="980px"
        bodyStyle={{
          height: '550px',
          overflow: 'scroll'
        }}
      >
        <div style={{ overflow: 'scroll', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="m-b-32 fs-16 c-black-85" style={{fontWeight: 'bold', display: 'inline-block', marginTop: '30px'}}>可见范围需如下图所示，勾选全部员工，才可查看部门支出表。请联系超级管理员设置后查看</span>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={role1} alt="没有数据" style={{width: '800px'}} />
            <img src={role2} alt="没有数据" style={{width: '800px'}} />
          </div>
        </div>
      </Modal>
    </span>
  );
}

export default NoRole;
