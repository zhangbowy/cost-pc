import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Form, Input, Cascader } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeopleNew';
import { formItemLayout } from '../../../../utils/constants';
import { findIndexArray } from '../../../../utils/common';


const { TextArea } = Input;
@Form.create()
@connect(({ companySet }) => ({
  look: companySet.look,
}))
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
    const { details } = this.props;
    this.props.dispatch({
      type: 'companySet/look',
      payload: {
        exceptionId: details && details.id ? details.id : '',
      },
    }).then(() => {
      const { look } = this.props;
      const newArr = treeConvert({
        rootId: 0,
        pId: 'parentId',
        name: 'officeName',
        otherKeys: ['note','parentId', 'officeName']
      }, look);
      this.setState({
        options: newArr,
        details: details || {},
        parentId: details && details.parentId ? findIndexArray(newArr, details.parentId, []) : [],
        users: details && details.userVos ? details.userVos : [],
        depts: details && details.deptVos ? details.deptVos : [],
        visible: true,
      });
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
          id: details && details.id ? details.id : '',
          deptVos: depts,
          userVos: users,
        };
        if (val.parentId) {
          const len = val.parentId.length;
          Object.assign(newVal, {
            parentId: val.parentId[len-1],
          });
        }
        // if (details && (details.id === newVal.parentId)) {
        //   message.error('??????????????????????????????');
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
      callback('???????????????/??????');
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
          title={`${details && details.id ? '??????' : '??????'}??????`}
          visible={visible}
          onCancel={() => this.onCancel()}
          onOk={this.onConfirm}
          confirmLoading={loading}
          maskClosable={false}
        >
          <Form>
            <Form.Item label="????????????" {...formItemLayout}>
              {
                getFieldDecorator('officeName', {
                  initialValue: details.officeName,
                  rules: [{
                    required: true, message: '?????????????????????'
                  }, {
                    max: 32, message: '??????32???'
                  }]
                })(
                  <Input placeholder="?????????" />
                )
              }
            </Form.Item>
            <Form.Item label="????????????" {...formItemLayout}>
              {
                getFieldDecorator('parentId', {
                  initialValue: parentId,
                })(
                  <Cascader
                    options={options}
                    placeholder="?????????"
                    changeOnSelect
                    fieldNames={{
                      label: 'officeName',
                      value: 'id',
                    }}
                  />
                )
              }
            </Form.Item>
            <Form.Item label={<span className="isRequired">????????????/???</span>} {...formItemLayout}>
              {
                getFieldDecorator('dept', {
                  initialValue: users.length ? users : depts,
                  rules: [{
                    validator: this.check,
                  }]
                })(
                  <UserSelector
                    placeholder="?????????"
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
            <Form.Item label="??????" {...formItemLayout}>
              {
                getFieldDecorator('note', {
                  initialValue: details.note,
                  rules: [{
                    max: 128, message: '??????128???'
                  }]
                })(
                  <TextArea placeholder="???????????????" />
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
