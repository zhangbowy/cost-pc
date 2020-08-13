/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Table, Switch, Form, Select, Button, Divider } from 'antd';
import { costClassify, dataType } from '@/utils/constants';
import style from './classify.scss';
import AddFieldStr from '../../../../components/Modals/AddFieldStr/add';

const { Option } = Select;
@Form.create()
class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFields: props.showFields,
      expandField: props.expandField || [],
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

  onAddStr = (arr) => {
    const arrs = this.state.showFields.filter(it => it.field.indexOf('expand_field') === -1);
    const oldArr = [...arr];
    arr.unshift(2,0);
    Array.prototype.splice.apply(arrs, arr);
    console.log(arrs);
    this.setState({
      showFields: arrs,
      expandField: oldArr,
    });
  }

  onRest() {
    this.props.form.resetFields();
  }

  getFormItem = () => {
    const {
      form,
      left
    } = this.props;
    const { showFields, expandField } = this.state;
    let list = [...showFields];
    let expandList = [...expandField];
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        list.forEach(item => {
          Object.assign(item, {
            status: values[`status_${item.field}`],
            isWrite: values[`isWrite_${item.field}`],
            note: values[`note_${item.field}`],
          });
          if (item.key === 'happenTime') {
            Object.assign(item, {
              dateType: values[`dateType_${item.key}`],
            });
          }
        });
        expandList = list.filter(it => (it.field.indexOf('expand_field')> -1));
      } else {
        list = null;
      }
    });
    const obj = {
      list,
      expandField: expandList,
    };
    if (left === 'shareField') {
      return list;
    }
      return obj;
  }

  render() {
    const {
      form: { getFieldDecorator },
      left,
    } = this.props;
    const { showFields, expandField } = this.state;
    console.log('expandField', expandField);
    const columns = [{
      title: '字段',
      dataIndex: 'name',
      render: (_, record) => (
        <div>
          <Form.Item key="name">
            {
              getFieldDecorator(`name_${record.field}`, {
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
              getFieldDecorator(`status_${record.field}`, {
                initialValue: !!record.status,
                valuePropName: 'checked'
              })(
                <Switch
                  disabled={record.field === 'costCategory'
                  || record.field === 'amount'
                  || record.disabled}
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
                getFieldDecorator(`isWrite_${record.field}`, {
                  initialValue: record.isWrite,
                  valuePropName: 'checked'
                })(
                  <Switch
                    disabled={record.field === 'costCategory'
                    || record.field === 'amount'
                    || record.disabled}
                  />
                )
              }
            </Form.Item>
          }
        </div>
      )
    },
    {
      title: '其他操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <div>
          {
            record.field === 'happenTime' &&
            <Form.Item key="dateType">
              {
                getFieldDecorator(`dateType_${record.field}`, {
                  initialValue: record.dateType || '1',
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
          {
            (record.expand) || (record.field && record.field.indexOf('expand_field') > -1) &&
            <span>
              <span className="deleteColor" onClick={() => this.handleVisibleChange(record.field)}>删除</span>
              <Divider type="vertical" />
              <AddFieldStr
                type="edit"
                onAddStr={(arr) => this.onAddStr(arr)}
                expandField={expandField}
                detail={record}
              >
                <a>编辑</a>
              </AddFieldStr>
            </span>
          }
        </div>
      )
    }];
    return (
      <div style={{ padding: '32px 19px 0 29px', width: '100%' }} className={style.field}>
        {
          left !== 'shareField' &&
          <AddFieldStr
            type="add"
            onAddStr={(arr) => this.onAddStr(arr)}
            expandField={expandField}
            detail={{}}
          >
            <Button className="m-b-16" type="primary" disabled={expandField && (expandField.length > 5 || expandField.length === 5)}>添加自定义字段</Button>
          </AddFieldStr>
        }
        <Table
          columns={columns}
          dataSource={showFields || costClassify}
          pagination={false}
          rowKey="field"
        />
      </div>
    );
  }
}

export default Field;
