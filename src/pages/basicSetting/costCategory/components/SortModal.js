import React, { useState } from 'react';
import { Modal } from 'antd';
import Sort from '../../../../components/Sort';



const SortModal = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <span onClick={() => setVisible(!visible)}>
      { props.children }
      <Modal
        title="费用类型排序"
        visible={visible}
        onCancel={() => setVisible(!visible)}
      >
        <Sort
          treeList={[{
            id: '12',
            name: '测试',
            sort: 1,
          }]}
        />
      </Modal>
    </span>
  );
};
export default SortModal;
