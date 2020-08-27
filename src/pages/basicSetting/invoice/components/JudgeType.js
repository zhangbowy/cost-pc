import React, { useState } from 'react';
import { Modal } from 'antd';

export default function JudgeType(props) {
  const [visible, setVisible] = useState(false);


  return (
    <div>
      <span onClick={() => setVisible(true)}>{props.children}</span>
      <Modal
        title="请选择您要创建的单据类型"
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div>
          <div>
            <p>报销单</p>
            <p>这里是辅助的功能</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
