import React, { Component } from 'react';
import { Table, Switch, Form, Select } from 'antd';
import { costClassify, dataType } from '@/utils/constants';
import style from './classify.scss';

const { Option } = Select;
@Form.create()
class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFields: props.showFields,
    };
  }

  componentDidUpdate(prevProps){
    if (prevProps.showFields !== this.props.showFields) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        showFields: this.props.showFields,
      });
    }
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
          if (item.key === 'happenTime') {
            Object.assign(item, {
              dateType: values[`dateType_${item.key}`],
            });
          }
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
    } = this.props;
    const { showFields } = this.state;
    console.log(showFields);
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
                  disabled={record.key === 'costCategory' || record.key === 'amount'}
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
            <Form.Item key="isWrite">
              {
                getFieldDecorator(`isWrite_${record.key}`, {
                  initialValue: record.isWrite,
                  valuePropName: 'checked'
                })(
                  <Switch
                    disabled={record.key === 'costCategory' || record.key === 'amount'}
                  />
                )
              }
            </Form.Item>
          }
        </div>
      )
    },
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
    // },
    {
      title: '其他操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <div>
          {
            record.key === 'happenTime' &&
            <Form.Item key="dateType">
              {
                getFieldDecorator(`dateType_${record.key}`, {
                  initialValue: '1',
                })(
                  <Select style={{width: '100px'}}>
                    {
                      dataType.map(item => (
                        <Option key={item.key}>{item.value}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          }
        </div>
      )
    }];
    return (
      <div style={{ padding: '32px 19px 0 29px', width: '100%' }} className={style.field}>
        <Table
          columns={columns}
          dataSource={showFields || costClassify}
          pagination={false}
        />
      </div>
    );
  }
}

export default Field;
