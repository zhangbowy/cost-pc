import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, TreeSelect, Button, Select } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeople';
import { formItemLayout, defaultTitle } from '@/utils/constants';
import Lines from '@/components/StyleCom/Lines';

const { SHOW_PARENT } = TreeSelect;
@Form.create()
@connect(({ global, loading, approveRole, costGlobal, session }) => ({
  costCategoryList: global.costCategoryList,
  loading: loading.effects['approveRole/add'] ||
           loading.effects['approveRole/edit'] || false,
  details: approveRole.details,
  officeTree: costGlobal.officeTree,
  userInfo: session.userInfo,
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
    officeIds: []
  }

  onShow = () => {
    const { title, detail } = this.props;
    this.props.dispatch({
      type: 'costGlobal/officeTree',
      payload: {},
    });
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
          console.log(details.userVo);
          this.setState({
            userVo: details.userVo ? [details.userVo].map(it => { return { ...it,userName: it.name }; }) : [],
            makeUser: details.makeUser ? details.makeUser.map(it => { return { ...it,userName: it.name }; }) : [],
            bearUser: details.bearUser ? details.bearUser.map(it => { return { ...it,userName: it.name }; }) : [],
            bearDept: details.bearDept ? details.bearDept.map(it => { return { ...it,deptId: `${it.deptId}` }; }) : [],
            makeDept: details.makeDept ? details.makeDept.map(it => { return { ...it,deptId: `${it.deptId}` }; }) : [],
            category: details.categoryVos ? details.categoryVos.map(it => {
              return {
                label: it.costName,
                value: it.id,
              };
            }) : [],
            officeIds: details.officeVOS ? details.officeVOS.map(it => it.id) : [],
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
    this.props.form.resetFields();
    this.setState({
      visible: false,
      category: [],
      userVo: [],
      makeUser: [],
      bearUser: [],
      makeDept: [],
      bearDept: [],
      officeIds: []
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
      detail,
      costCategoryList,
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
        const group = costCategoryList.filter(it => !it.type);
        const groupArr = group && group.length ? group.map(it => it.id) : [];
        dispatch({
          type: `approveRole/${title}`,
          payload: {
            categoryVos: values.categoryVos.map(it => {
              return {
                costName: it.label,
                id: it.value,
                isGroup: groupArr.includes(it.value),
              };
            }),
            userVo: userVo[0],
            makeUser,
            bearUser,
            makeDept,
            bearDept,
            approveRoleId: id,
            officeIds: values.officeIds || [],
            id: detail && detail.id ? detail.id : '',
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
    console.log(value);
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
      officeTree
    } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value',
      otherKeys: ['type']
    }, costCategoryList);
    const {
      visible,
      category,
      userVo,
      makeUser,
      bearUser,
      makeDept,
      bearDept,
      officeIds
    } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          visible={visible}
          title={`${defaultTitle[title]}人员`}
          onCancel={this.onCancel}
          bodyStyle={{
            overflowY: 'scroll'
          }}
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
            <div className="m-b-16">
              <Lines name='管理范围' fontSize="fs-14" />
            </div>
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
            <Form.Item label="提交人/部门" {...formItemLayout}>
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
            <Form.Item label="支出类别" {...formItemLayout}>
              {
                getFieldDecorator('categoryVos', {
                  initialValue: category,
                })(
                  <TreeSelect
                    onChange={(value, label, extra) => this.onChangeTree(value, label, extra)}
                    treeData={list}
                    labelInValue
                    treeCheckable
                    placeholder="请选择"
                    style={{width: '100%'}}
                    showCheckedStrategy={SHOW_PARENT}
                    dropdownStyle={{height: '300px'}}
                  />
                )
              }
            </Form.Item>
            {
              officeTree && officeTree.length > 0 &&
              <Form.Item label="所在公司" {...formItemLayout}>
                {
                  getFieldDecorator('officeIds', {
                    initialValue: officeIds,
                  })(
                    <Select mode="multiple" placeholder="请选择">
                      {
                        officeTree.map(it => (
                          <Select.Option key={it.id}>
                            {it.officeName}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddRole;
