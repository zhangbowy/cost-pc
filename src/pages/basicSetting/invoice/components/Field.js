/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { Table, Switch, Form, Button, Divider, Popconfirm, message } from 'antd';
import style from './classify.scss';
import AddFieldStr from '../../../../components/Modals/AddFieldStr/add';

@Form.create()
class Field extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFields: props.showFields,
      expandField: props.expandField || [],
    };
  }

  onRest() {
    this.props.form.resetFields();
  }

  onAddStr = (arr) => {
    const arrs = this.state.showFields.filter(it => !(it.field.indexOf('expand_field')> -1));
    const oldArr = [...arr];
    arr.unshift(4,0);
    Array.prototype.splice.apply(arrs, arr);
    this.setState({
      showFields: arrs,
      expandField: oldArr,
    });
  }

  getFormItem = () => {
    const {
      form,
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
        });
        expandList = list.filter(it => (it.field.indexOf('expand_field')> -1));
      } else {
        list = null;
      }
    });
    console.log('expandList', expandList);
    const obj = {
      list,
      expandField: expandList,
    };
    return obj;
  }

  handleVisibleChange = (field) => {
    this.props.dispatch({
      type: 'invoice/delCheck',
      payload: {
        field
      }
    }).then(() => {
      const { checkDel } = this.props;
      const { showFields, expandField } = this.state;
      if (checkDel) {
        this.setState({
          showFields: showFields.filter(it => it.field !== field),
          expandField: expandField.filter(it => it.field !== field)
        });
      } else {
        message.error('有进行中或已完成已拒绝的单据用到了该字段');
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { showFields, expandField } = this.state;
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
                initialValue: record.status,
                valuePropName: 'checked'
              })(
                <Switch
                  disabled={record.field === 'reason'
                    || record.field === 'undertakerIson'
                    || record.field === 'deptId'
                    || record.field === 'userJson'}
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
              getFieldDecorator(`isWrite_${record.field}`, {
                initialValue: record.isWrite,
                valuePropName: 'checked'
              })(
                <Switch
                  disabled={record.field === 'reason'
                    || record.field === 'undertakerIson'
                    || record.field === 'deptId'
                    || record.field === 'userJson'}
                />
              )
            }
          </Form.Item>
        }
        </div>
      )
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => {
        return (
          <span>
            {
              (record.expand) || (record.field && record.field.indexOf('expand_field') > -1) &&
              <span>
                <Popconfirm
                  title="确认删除吗？"
                  onConfirm={() => this.handleVisibleChange(record.field)}
                >
                  <span className="deleteColor">删除</span>
                </Popconfirm>
                <Divider type="vertical" />
                <AddFieldStr
                  type="edit"
                  onAddStr={(arr) => this.onAddStr(arr)}
                  expandField={expandField}
                  detail={record}
                  getParams={() => this.getFormItem()}
                >
                  <a>编辑</a>
                </AddFieldStr>
              </span>
            }
          </span>
        );
      }
    }
  ];
    return (
      <div style={{ padding: '16px 19px 0 29px', width: '100%' }} className={style.field}>
        <AddFieldStr
          type="add"
          onAddStr={(arr) => this.onAddStr(arr)}
          expandField={expandField}
          detail={{}}
        >
          <Button
            className="m-b-16"
            type="primary"
            disabled={expandField && (expandField.length > 5 || (expandField.length === 5))}
          >
            添加自定义字段
          </Button>
        </AddFieldStr>
        <Form>
          <Table
            columns={columns}
            dataSource={showFields}
            pagination={false}
            scroll={{y: '320px'}}
            rowKey="field"
          />
        </Form>
      </div>
    );
  }
}

export default Field;
