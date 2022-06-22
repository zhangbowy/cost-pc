import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Form, TreeSelect, Button, Select, Row, Col, Switch, message} from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeople';
import { defaultTitle } from '@/utils/constants';
import Lines from '@/components/StyleCom/Lines';
import ModalTemp from '../../../../../components/ModalTemp';
import style from './index.scss';

const { SHOW_PARENT } = TreeSelect;
@Form.create()
@connect(({ global, loading, approveRole, costGlobal, session }) => ({
  costCategoryList: global.costCategoryList,
  incomeCategoryList: global.incomeCategoryList,
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
    officeIds: [],
    openCost: true,
    openIncome: true,
    income: {
      makeUser: [],
      incomeUser: [],
      makeDept: [],
      incomeDept: [],
      officeIds: [],
      incomeCategory: [],
    }
  }

  fetchList = (callback) => {
    const { dispatch } = this.props;
    const fetchList = [{
      url: 'global/incomeCategoryList',
      params: {}
    }, {
      url: 'global/costList',
      params: {}
    }, {
      url: 'costGlobal/officeTree',
      params: {},
    }];
    const fetchs = fetchList.map(it => it.url);
    const arr = fetchs.map((it, index) => {
      return dispatch({
        type: it,
        payload: {
          ...fetchList[index].params
        },
      });
    });
    Promise.all(arr).then(() => {
      if (callback) {
        callback();
      }
    });
  }

  onShow = () => {
    const { title, detail } = this.props;
    this.fetchList(() => {
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
            openCost: details.inCost,
            openIncome: details.inIncome,
            income: {
              ...details.income,
              incomeCategory: details.income.incomeCategory ? details.income.incomeCategory.map(it => {
                return {
                  label: it.costName,
                  value: it.id,
                };
              }) : [],
              officeVOS: [],
              officeIds: details.income.officeVOS ? details.income.officeVOS.map(it => it.id) : [],
            }
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
      incomeCategoryList,
    } = this.props;
    const {
      userVo,
      makeUser,
      bearUser,
      makeDept,
      bearDept,
      income,
      openCost,
    openIncome,
    } = this.state;

    if (loading) return;
    form.validateFieldsAndScroll((err, values) => {
      if(values.openIncome) {
        const {
          categoryVos = [],
          incomeCategory = [],
          incomeOfficeIds = [],
          officeIds = []
        } = values;
        if (
          !categoryVos.length
          || !incomeCategory.length
          || !incomeOfficeIds.length
          || !officeIds.length
        ) {

          return message.error('收入管理范围至少选择一个')
        }
      }

        const group = costCategoryList.filter(it => !it.type);
        const groupArr = group && group.length ? group.map(it => it.id) : [];
        const incomeGroup = incomeCategoryList.filter(it => !it.type);
        const incomeGroupArr = incomeGroup && incomeGroup.length ? incomeGroup.map(it => it.id) : [];
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
            openCost,
            openIncome,
            income: {
              ...income,
              incomeCategory: values.incomeCategory.map(it => {
                return {
                  costName: it.label,
                  id: it.value,
                  isGroup: incomeGroupArr.includes(it.value),
                };
              }),
              officeIds: values.incomeOfficeIds || [],
            }
          }
        }).then(() => {
          this.onCancel();
          onOk();
        });
    });
  }

  selectPle = (val, type, flag) => {
    const { income } = this.state;
    if (flag) {
      if (type !== 'userVo') {
        this.setState({
          income: {
            ...income,
            [`${type}User`]: val.users,
            [`${type}Dept`]: val.depts,
          }
        });
      } else {
        this.setState({
          income: {
            ...income,
            userVo: val.users,
          }
        });
      }
    } else if (type !== 'userVo') {
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

  onChangeTree = (value, label, extra, flag) => {
    console.log(extra);
    console.log(value);
    const { income } = this.state;
    if (flag) {
      this.setState({
        income: {
          ...income,
          incomeCategory: value,
        }
      });
    } else {
      this.setState({
        category: value,
      });
    }

  }

  onChangeS = (e, key) => {
    this.setState({
      [key]: e,
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      costCategoryList,
      incomeCategoryList,
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
    const incomeList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value',
      otherKeys: ['type']
    }, incomeCategoryList);
    const {
      visible,
      category,
      userVo,
      makeUser,
      bearUser,
      makeDept,
      bearDept,
      officeIds,
      openCost,
      openIncome,
      income,
    } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <ModalTemp
          visible={visible}
          title={`${defaultTitle[title]}人员`}
          onCancel={this.onCancel}
          size="default"
          bodyStyle={{
            overflowY: 'scroll'
          }}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="save" onClick={this.handleOk} type="primary" disabled={loading}>保存</Button>
          ]}
        >
          <Form layout="vertical" className={style.forms}>
            <Form.Item label="人员">
              <UserSelector
                users={userVo || []}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val, 'userVo')}
                invalid={false}
                disabled={false}
                flag="users"
                multiple={false}
                style={{width: '320px'}}
              />
            </Form.Item>
            <div className="m-b-16">
              <Lines name='管理范围' fontSize="fs-14" />
            </div>
            <Form.Item label="支出权限管理：" className={style.formItems}>
              {
                getFieldDecorator('openCost', {
                  initialValue: openCost,
                  valuePropName: 'checked1'
                })(
                  <Switch onChange={e => this.onChangeS(e, 'openCost')} />
                )
              }
            </Form.Item>
            <Row>
              <Col span="12">
                <Form.Item label="承担人/部门">
                  <UserSelector
                    users={bearUser || []}
                    depts={bearDept || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'bear')}
                    invalid={false}
                    flag="useApep"
                    multiple
                    style={{width: '320px'}}
                    disabled={!openCost}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item label="提交人/部门">
                  <UserSelector
                    users={makeUser || []}
                    depts={makeDept || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'make')}
                    invalid={false}
                    disabled={!openCost}
                    flag="useApep"
                    multiple
                    style={{width: '320px'}}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item label="支出类别">
                  {
                    getFieldDecorator('categoryVos', {
                      initialValue: category,
                    })(
                      <TreeSelect
                        onChange={(value, label, extra) => this.onChangeTree(value, label, extra)}
                        treeData={list}
                        labelInValue
                        treeCheckable
                        disabled={!openCost}
                        placeholder="请选择"
                        showCheckedStrategy={SHOW_PARENT}
                        dropdownStyle={{height: '300px'}}
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span="12">
                {
                  officeTree && officeTree.length > 0 &&
                  <Form.Item label="所在公司">
                    {
                      getFieldDecorator('officeIds', {
                        initialValue: officeIds,
                      })(
                        <Select mode="multiple" placeholder="请选择" disabled={!openCost}>
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
              </Col>
            </Row>
            <Form.Item label="收入权限管理：" className={style.formItems}>
              {
                getFieldDecorator('openIncome', {
                  initialValue: openIncome,
                  valuePropName: 'checked'
                })(
                  <Switch onChange={e => this.onChangeS(e, 'openIncome')} />
                )
              }
            </Form.Item>
            <Row>
              <Col span="12">
                <Form.Item label="业务员/部门">
                  <UserSelector
                    users={income.incomeUser || []}
                    depts={income.incomeDept || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'income', 'income')}
                    invalid={false}
                    disabled={!openIncome}
                    flag="useApep"
                    multiple
                    style={{width: '320px'}}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item label="提交人/部门">
                  <UserSelector
                    users={income.makeUser || []}
                    depts={income.makeDept || []}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'make', 'income')}
                    invalid={false}
                    disabled={!openIncome}
                    flag="useApep"
                    multiple
                    style={{width: '320px'}}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item label="收入类别">
                  {
                    getFieldDecorator('incomeCategory', {
                      initialValue: income.incomeCategory,
                    })(
                      <TreeSelect
                        onChange={(value, label, extra) => this.onChangeTree(value, label, extra, 'income')}
                        treeData={incomeList}
                        labelInValue
                        disabled={!openIncome}
                        treeCheckable
                        placeholder="请选择"
                        showCheckedStrategy={SHOW_PARENT}
                        dropdownStyle={{height: '300px'}}
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span="12">
                {
                  officeTree && officeTree.length > 0 &&
                  <Form.Item label="所在公司">
                    {
                      getFieldDecorator('incomeOfficeIds', {
                        initialValue: income.officeIds,
                      })(
                        <Select mode="multiple" placeholder="请选择" disabled={!openIncome}>
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
              </Col>
            </Row>
          </Form>
        </ModalTemp>
      </span>
    );
  }
}

export default AddRole;
