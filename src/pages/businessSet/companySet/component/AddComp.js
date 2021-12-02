import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Form, Input, Cascader } from 'antd';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeopleNew';
import { formItemLayout } from '../../../../utils/constants';
import { findIndexArray } from '../../../../utils/common';


const { TextArea } = Input;
@Form.create()
class AddComp extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      users: [],
      depts: [],
      options: [],
      details: {},
      parentId: [],
    };
  }

  onShow = () => {
    const { list, details } = this.props;
    const newArr = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'officeName',
      otherKeys: ['note','parentId', 'officeName']
    }, list);
    const roots = list.filter(it => !it.parentId);
    this.setState({
      options: newArr,
      details: details || {},
      parentId: details && details.parentId ? findIndexArray(newArr, details.parentId, []) : [roots[0].id],
      users: details && details.userVos ? details.userVos : [],
      depts: details && details.deptVos ? details.deptVos : [],
      visible: true,
    });
  }

  onConfirm = () => {
    const { details, onOk } = this.props;
    const { users, depts } = this.state;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        console.log(val);
        const newVal = {
          note: val.note,
          officeName: val.officeName,
          id: details && details.id ? details.id : ''
        };
        if (val.parentId) {
          const len = val.parentId.length;
          Object.assign(newVal, {
            parentId: val.parentId[len-1],
            deptVos: depts,
            userVos: users,
          });
        }
        // if (details && (details.id === newVal.parentId)) {
        //   message.error('上级公司不能选择自己');
        // }
        new Promise((resolve) => {
          onOk(newVal, resolve);
        }).then(() => {
          this.onCancel();
        });
      }
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onSelectPeople = (val) => {
    this.setState({
      ...val,
    }, () => {
      const { form: { validateFields } } = this.props;
      validateFields(['dept'], { force: true });
    });
  }

  check = (rule, value, callback) => {
    console.log('checks');
    const { users, depts } = this.state;
    if (users.length || depts.length) {
      callback();
    } else {
      callback('请选择部门/人员');
    }
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { visible, users, depts, options, details, parentId } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={`${details && details.id ? '编辑' : '新增'}公司`}
          visible={visible}
          onCancel={() => this.onCancel()}
          onOk={this.onConfirm}
          confirmLoading={loading}
          maskClosable={false}
        >
          <Form>
            <Form.Item label="公司名称" {...formItemLayout}>
              {
                getFieldDecorator('officeName', {
                  initialValue: details.officeName,
                  rules: [{
                    required: true, message: '请输入公司名称'
                  }, {
                    max: 32, message: '最多32字'
                  }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </Form.Item>
            {
              details.parentId !== 0 &&
              <Form.Item label="上级公司" {...formItemLayout}>
                {
                  getFieldDecorator('parentId', {
                    initialValue: parentId,
                  })(
                    <Cascader
                      options={options}
                      placeholder="请选择"
                      changeOnSelect
                      fieldNames={{
                        label: 'officeName',
                        value: 'id',
                      }}
                    />
                  )
                }
              </Form.Item>
            }
            {
              details.parentId !== 0 &&
              <Form.Item label="关联部门/人" {...formItemLayout}>
                {
                  getFieldDecorator('dept', {
                    initialValue: users.length ? users : depts,
                    rules: [{
                      validator: this.check,
                    }]
                  })(
                    <UserSelector
                      placeholder="请选择"
                      users={users}
                      depts={depts}
                      invalid={false}
                      disabled={false}
                      isinput
                      flag="useApep"
                      onSelectPeople={this.onSelectPeople}
                    />
                  )
                }
              </Form.Item>
            }
            <Form.Item label="备注" {...formItemLayout}>
              {
                getFieldDecorator('note', {
                  initialValue: details.note,
                  rules: [{
                    max: 128, message: '最多128字'
                  }]
                })(
                  <TextArea placeholder="请输入备注" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddComp;
