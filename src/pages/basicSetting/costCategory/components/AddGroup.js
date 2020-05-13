import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const labelItem = {
  costName: '名称',
  parentId: '所属分组'
};

const AddGroup = (props) => {
  return (
    <span>
      <span>{props.children}</span>
      <Modal>
        <Form>
          <Form.Item
            key="costName"
            label={labelItem.costName}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            key="parentId"
            label={labelItem.parentId}
          >
            <Select>
              <Select.Option key="0">无</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </span>
  );
};

export default AddGroup;
