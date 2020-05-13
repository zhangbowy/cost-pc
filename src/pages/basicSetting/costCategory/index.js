import React from 'react';
import { Button, Form, Input, Table } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
import SortModal from './components/SortModal';


const CostCategory = () => {

  const columns = [{
    title: '名称',
    dataIndex: 'costName'
  }, {
    title: '图标',
    dataIndex: 'icon',
    render: (_, record) => (
      record.icon ?
      (<img alt="" src={record.icon} />) :
      (<span>-</span>)
    )
  }, {
    title: '描述',
    dataIndex: 'note'
  }, {
    title: '操作',
    dataIndex: 'operate',
    render: () => (
      <a>编辑组</a>
    )
  }];
  return (
    <div className="content-dt">
      <div>
        <div>
          <Button type="primary">新增费用类别</Button>
          <Button>新增分组</Button>
          <Form style={{display: 'inline-block'}}>
            <Form.Item>
              <Input
                placeholder="输入关键字，按回车搜索"
                suffix={
                  <span className="iconfont " />
                }
                style={{ width: '272px' }}
              />
            </Form.Item>
          </Form>
        </div>
        <div style={{float: 'right', marginTop: '-30px'}}>
          <SortModal>
            <span>排序</span>
          </SortModal>
        </div>
      </div>
      <Table
        columns={columns}
      />
    </div>
  );
};

export default CostCategory;
