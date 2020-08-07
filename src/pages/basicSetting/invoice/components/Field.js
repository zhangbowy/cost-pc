import React from 'react';
import { Table, Switch, Form, Button } from 'antd';
import style from './classify.scss';
import AddFieldStr from '../../../../components/Modals/AddFieldStr';

@Form.create()
class Field extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onRest() {
    this.props.form.resetFields();
  }

  onAdd = () => {

  }

  getFormItem = () => {
    const {
      form,
      showFields,
    } = this.props;
    let list = [...showFields];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        list.forEach(item => {
          Object.assign(item, {
            status: values[`status_${item.key}`],
            isWrite: values[`isWrite_${item.key}`],
            note: values[`note_${item.key}`],
          });
        });
      } else {
        list = null;
      }
    });
    return list;
  }

  render() {
    const {
      form: { getFieldDecorator },
      showFields,
    } = this.props;
    const columns = [{
      title: '字段',
      dataIndex: 'name',
      render: (_, record) => (
        <div>
          <Form.Item key="name">
            {
              getFieldDecorator(`name_${record.key}`, {
                initialValue: record.name,
              })(
                <span>{record.name}</span>
              )
            }
          </Form.Item>
        </div>
      )
    }, {
      title: '是否启用',
      dataIndex: 'status',
      render: (_, record) => (
        <div>
          <Form.Item key="status">
            {
              getFieldDecorator(`status_${record.key}`, {
                initialValue: record.status,
                valuePropName: 'checked'
              })(
                <Switch
                  disabled={record.key === 'reason'
                    || record.key === 'undertakerIson'
                    || record.key === 'deptId'
                    || record.key === 'userJson'}
                />
              )
            }
          </Form.Item>
        </div>
      )
    }, {
      title: '是否必填',
      dataIndex: 'isWrite',
      render: (_, record) => (
        <div>
          {
          record.field !== 'imgUrl' &&
          record.field !== 'fileUrl' &&
          <Form.Item key="isWrite">
            {
              getFieldDecorator(`isWrite_${record.key}`, {
                initialValue: record.isWrite,
                valuePropName: 'checked'
              })(
                <Switch
                  disabled={record.key === 'reason'
                    || record.key === 'undertakerIson'
                    || record.key === 'deptId'
                    || record.key === 'userJson'}
                />
              )
            }
          </Form.Item>
        }
        </div>
      )
    }
  ];
    return (
      <div style={{ padding: '16px 19px 0 29px', width: '100%' }} className={style.field}>
        <AddFieldStr>
          <Button onClick={() => this.onAdd()} className="m-b-16">添加自定义字段</Button>
        </AddFieldStr>
        <Form>
          <Table
            columns={columns}
            dataSource={showFields}
            pagination={false}
            scroll={{y: '320px'}}
          />
        </Form>
      </div>
    );
  }
}

export default Field;
