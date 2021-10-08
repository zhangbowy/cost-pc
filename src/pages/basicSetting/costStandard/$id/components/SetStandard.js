import React, { PureComponent } from 'react';
import { Table, Form, InputNumber } from 'antd';
import add from '@/assets/img/addP.png';
import style from './index.scss';

let id = 1000;
class SetStandard extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      list: [{ key: '11111' }]
    };
  }

  onAdd = () => {
    const { list } = this.state;
    list.push({
      key: ++id,
    });
    this.setState({
      list,
    });
  }

  render() {
    const { list } = this.state;
    const columns = [{
      title: '适用人员',
      dataIndex: 'people',
      render: () => {
        return (
          <div className={style.people}>
            <img src={add} alt="部门/人"  />
            <span className={style.names}>选择适用人员/部门</span>
          </div>
        );
      }
    }, {
      title: '金额标准',
      dataIndex: 'money',
      render: () => {
        return (
          <div className={style.money}>
            <span>不超过</span>
            <Form.Item>
              <InputNumber style={{width: '88px'}} />
            </Form.Item>
            <span>元/晚</span>
            <Form.Item>
              <InputNumber style={{width: '88px'}} />
            </Form.Item>
          </div>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: () => (
        <span className="deleteColor">删除</span>
      ),
      width: '80px'
    }];
    return (
      <div className="m-t-24">
        <Table
          columns={columns}
          pagination={false}
          dataSource={list}
          rowKey='key'
        />
        <div className={style.adds}>
          <div className={style.add} onClick={() => this.onAdd()}>
            <span className="fs-14 c-black-65">+</span>
            <span className="fs-14 c-black-65 m-l-8">继续添加</span>
          </div>
        </div>
      </div>
    );
  }
}

export default SetStandard;
