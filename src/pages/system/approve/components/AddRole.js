import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, TreeSelect, Button } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '../../../../components/Modals/SelectPeople';
import { formItemLayout, defaultTitle } from '../../../../utils/constants';

const { SHOW_CHILD } = TreeSelect;
@Form.create()
@connect(({ global, loading, approveRole }) => ({
  costCategoryList: global.costCategoryList,
  loading: loading.effects['approveRole/add'] ||
           loading.effects['approveRole/edit'] || false,
  details: approveRole.details,
}))
class AddRole extends Component {
  static propTypes = {
    costCategoryList: PropTypes.array,
  }

  state = {
    visible: this.props.visible,
    category: [],
    userVo: [],
    makeUser: [],
    bearUser: [],
    makeDept: [],
    bearDept: [],
  }

  onShow = () => {
    const { title, detail } = this.props;
    this.props.dispatch({
      type: 'global/costList',
      payload: {},
    }).then(() => {
      if (title === 'edit') {
        this.props.dispatch({
          type: 'approveRole/detail',
          payload: {
            id: detail.id,
          }
        }).then(() => {
          const { details } = this.props;
          this.setState({
            userVo: details.userName && [{ userName: details.userName, userId: details.userId, name: details.userName }],
            makeUser: details.makeUser && details.makeUser.map(it => { return { ...it,userName: it.name }; }),
            bearUser: details.bearUser && details.bearUser.map(it => { return { ...it,userName: it.name }; }),
            bearDept: details.bearDept,
            makeDept: details.makeDept,
            category: details.categoryVos && details.categoryVos.map(it => {
              return {
                label: it.costName,
                value: it.id,
              };
            }),
            visible: true,
          });
        });
      }
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const {
      form,
      dispatch,
      loading,
      title,
      id,
      onOk,
    } = this.props;
    const {
      userVo,
      makeUser,
      bearUser,
      makeDept,
      bearDept,
    } = this.state;
    if (loading) return;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: `approveRole/${title}`,
          payload: {
            categoryVos: values.categoryVos.map(it => {
              return {
                costName: it.label,
                id: it.value,
              };
            }),
            userVo: userVo[0],
            makeUser,
            bearUser,
            makeDept,
            bearDept,
            approveRoleId: id,
          }
        }).then(() => {
          this.onCancel();
          onOk();
        });
      }
    });
  }

  selectPle = (val, type) => {
    if (type !== 'userVo') {
      this.setState({
        [`${type}User`]: val.users,
        [`${type}Dept`]: val.depts,
      });
    } else {
      this.setState({
        userVo: val.users,
      });
    }
  }

  onChangeTree = (value, label, extra) => {
    console.log(extra);
    this.setState({
      category: value,
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      costCategoryList,
      loading,
      title,
    } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, costCategoryList);
    const {
      visible,
      category,
      userVo,
      makeUser,
      bearUser,
      makeDept,
      bearDept,
    } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          visible={visible}
          title={`${defaultTitle[title]}人员`}
          onCancel={this.onCancel}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={this.handleOk} type="primary" disabled={loading}>保存</Button>
          ]}
        >
          <Form>
            <Form.Item label="人员" {...formItemLayout}>
              <UserSelector
                users={userVo || []}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val, 'userVo')}
                invalid={false}
                disabled={false}
                flag="users"
                multiple={false}
              />
            </Form.Item>
            <Form.Item label="承担人/部门" {...formItemLayout}>
              <UserSelector
                users={bearUser || []}
                depts={bearDept || []}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val, 'bear')}
                invalid={false}
                disabled={false}
                flag="useApep"
                multiple
              />
            </Form.Item>
            <Form.Item label="制单人/部门" {...formItemLayout}>
              <UserSelector
                users={makeUser || []}
                depts={makeDept || []}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val, 'make')}
                invalid={false}
                disabled={false}
                flag="useApep"
                multiple
              />
            </Form.Item>
            <Form.Item label="费用类别" {...formItemLayout}>
              {
                getFieldDecorator('categoryVos', {
                  initialValue: category,
                })(
                  <TreeSelect
                    onChange={(value, label, extra) => this.onChangeTree(value, label, extra)}
                    treeData={list}
                    labelInValue
                    treeCheckable
                    style={{width: '100%'}}
                    showCheckedStrategy={SHOW_CHILD}
                    dropdownStyle={{height: '300px'}}
                  />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddRole;
