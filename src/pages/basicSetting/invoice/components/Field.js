import React from 'react';
import { Table, Switch, Form } from 'antd';
import style from './classify.scss';

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
    // {
    //   title: '备注（选填）',
    //   dataIndex: 'note',
    //   render: (_, record) => (
    //     <div>
    //       <Form.Item key="note">
    //         {
    //           getFieldDecorator(`note_${record.key}`, {
    //             initialValue: record.note,
    //             rules: [{ max: 20, message: '不超过20个字' }]
    //           })(
    //             <Input placeholder="请输入" />
    //           )
    //         }
    //       </Form.Item>
    //     </div>
    //   )
    // }
  ];
    return (
      <div style={{ padding: '32px 19px 0 29px', width: '100%' }} className={style.field}>
        <Form>
          <Table
            columns={columns}
            dataSource={showFields}
            pagination={false}
          />
        </Form>
      </div>
    );
  }
}

export default Field;
