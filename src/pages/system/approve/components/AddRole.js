import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, TreeSelect, Button, Select } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '../../../../components/Modals/SelectPeople';
import { formItemLayout, defaultTitle } from '../../../../utils/constants';
import Lines from '../../../../components/StyleCom/Lines';

const { SHOW_CHILD } = TreeSelect;
@Form.create()
@connect(({ global, loading, approveRole, costGlobal }) => ({
  costCategoryList: global.costCategoryList,
  loading: loading.effects['approveRole/add'] ||
           loading.effects['approveRole/edit'] || false,
  details: approveRole.details,
  officeList: costGlobal.officeList,
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
      type: 'costGlobal/officeList',
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
    console.log(value, 'value');
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
      officeList,
    } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value',
      other: 'type'
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
          title={`${defaultTitle[title]}??????`}
          onCancel={this.onCancel}
          bodyStyle={{
            height: '470px',
            overflowY: 'scroll'
          }}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>??????</Button>,
            <Button key="save" onClick={this.handleOk} type="primary" disabled={loading}>??????</Button>
          ]}
        >
          <Form>
            <Form.Item label="??????" {...formItemLayout}>
              <UserSelector
                users={userVo || []}
                placeholder='?????????'
                onSelectPeople={(val) => this.selectPle(val, 'userVo')}
                invalid={false}
                disabled={false}
                flag="users"
                multiple={false}
              />
            </Form.Item>
            <div className="m-b-16">
              <Lines name='????????????' fontSize="fs-14" />
            </div>
            <Form.Item label="?????????/??????" {...formItemLayout}>
              <UserSelector
                users={bearUser || []}
                depts={bearDept || []}
                placeholder='?????????'
                onSelectPeople={(val) => this.selectPle(val, 'bear')}
                invalid={false}
                disabled={false}
                flag="useApep"
                multiple
              />
            </Form.Item>
            <Form.Item label="?????????/??????" {...formItemLayout}>
              <UserSelector
                users={makeUser || []}
                depts={makeDept || []}
                placeholder='?????????'
                onSelectPeople={(val) => this.selectPle(val, 'make')}
                invalid={false}
                disabled={false}
                flag="useApep"
                multiple
              />
            </Form.Item>
            <Form.Item label="????????????" {...formItemLayout}>
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
            {
              officeList.length > 0 &&
              <Form.Item label="????????????" {...formItemLayout}>
                {
                  getFieldDecorator('officeVos', {
                    initialValue: category,
                  })(
                    <Select>
                      {
                        officeList.map(it => (
                          <Select.Option key={it.id}>{it.officeName}</Select.Option>
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
