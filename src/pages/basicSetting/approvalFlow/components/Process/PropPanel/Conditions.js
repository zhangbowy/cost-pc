/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { Form, Radio, Select, Button, InputNumber, TreeSelect } from 'antd';
import { connect } from 'dva';
import { condExclude } from '@/utils/constants';
import UserSelector from '@/components/Modals/SelectPeople';
import treeConvert from '@/utils/treeConvert';
import { onSelectDis } from '@/utils/common';
import style from './index.scss';
import { getArrayValue } from '../../../../../../utils/constants';

const { Option } = Select;
const { SHOW_CHILD, SHOW_PARENT } = TreeSelect;
let id = 0;
const defaultList = {
  '0': [{
    key: 'cost_category',
    value: '支出类别',
    sel: condExclude,
    type: 'selectTree',
    id,
    ruleType: 'category'
  }],
  '1': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    id,
    ruleType: 'people',
  }],
  '2': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    id,
    ruleType: 'people',
  }],
  '3': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    id,
    ruleType: 'people',
  }],
  '20': [{
    key: 'condition_creator_user_dept',
    value: '提交人/部门',
    sel: condExclude,
    type: 'people',
    id,
    ruleType: 'people',
  }],
};
@Form.create()
@connect(({ global }) => ({
  costCategoryList: global.costCategoryList,
  incomeCategoryList: global.incomeCategoryList,
  projectList: global.projectList,
  supplierList: global.supplierList,
}))
class Conditions extends Component {
  static propTypes = {
    form: PropTypes.object,
  }

  constructor(props) {
    super(props);
    props.viewShowModal(this.getItems);
  }

  state = {
    lists: this.props.conditions && this.props.conditions.length > 0 ?
    this.props.conditions : defaultList[this.props.templateType],
    method: this.props.conditionNode && this.props.conditionNode.method ? this.props.conditionNode.method : 'OR',
  }

  /**
   * 切换条件选择
   * @param { Object } 包含val（key值）和index（位置）两个参数
   * @memberof Conditions
   */
  onChange = (val, index) => {
    console.log(val,'是什么');
    const {lists} = this.state;
    const { getCondition } = this.props;
    const list = [...lists];
    const items = lists[index];
    const { form } = this.props;
    getCondition.forEach(item => {
      if (item.key === val) {
        list[index] = {
          id: items.id,
          ...item,
        };
      }
    });
    form.setFieldsValue({
      keys: list,
    });
    this.setState({
      lists: list,
    });
  }

  /**
   * 新增条件
   * @memberof Conditions
   */
  onAdd = () => {
    const { form, templateType } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{
      ...defaultList[templateType],
      id: ++id,
    }]);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      lists: nextKeys,
    });
  }

  /**
   * 删除条件
   * @param { String } 包含k(删除的id值)
   * @memberof Conditions
   */
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    this.setState({
      lists: keys.filter(key => key.id !== k),
    });
    form.setFieldsValue({
      keys: keys.filter(key => key.id !== k),
    });

  };

  /**
   *
   * @param { Number } num是传入的数字
   * @memberof 把数字转化成数组
   */
  numToArr = (num) => {
    const arr = [];
    console.log(num);
    for(let i=0;i < Number(num); i++) {
      arr.push(i+1);
    }
    return arr;
  }

  /**
   * 下拉树形选择框禁止一些条件
   * @param { Array } list 传入的数组
   * @memberof Conditions
   */
  onSelectTree = () => {
    const { costCategoryList } = this.props;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tId: 'value',
      tName: 'title',
      otherKeys: ['type','showField']
    }, costCategoryList);
    return onSelectDis(list);
  }

  onChangeMethod = (e) => {
    this.setState({
      method: e.target.value
    });
  }

  selectPle = (val, index) => {
    console.log(val,'val选择的值');
    const { lists } = this.state;
    const list = [...lists];
    const { form } = this.props;
    list[index] = {
      ...list[index],
      ...val,
    };
    this.setState({
      lists: list,
    });
    form.setFieldsValue({
      keys: list,
    });
  }

  getItems = () => {
    const {
      form,
      getCondition
    } = this.props;
    let vals = null;
    form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let content = '';
        const conditions = [];
        let flag = true;
        if (val.keys) {
          val.keys.forEach((it, index) => {
            content+=`${getArrayValue(it.key, getCondition)}${index !== (val.keys.length-1) ? '、' : ''}`;
            let rules = {};
            let values = [];
            if (it.type === 'people') {
              if ((!it.users || (it.users && it.users.length === 0)) &&
                  (!it.depts || (it.depts && it.depts.length === 0))) {
                flag = false;
              }
              values = [{
                type: 'user',
                value: it.users && it.users.map(its => its.userId).toString(),
                others: it.users && it.users.map(its => its.userName).toString(),
              }, {
                type: 'dept',
                value: it.depts && it.depts.map(its => its.deptId).toString(),
                others: it.depts && it.depts.map(its => its.name).toString(),
              }];
            } else {
              const projectValue = [];
              // if (it.ruleType === 'project') {
              //   val.value.a_0.map(selectValue => projectValue.push(selectValue.value)
              //   );
              //   console.log(projectValue,'projectValue');
              //   console.log(it.id,val.value.a_0, it.ruleType, 'project类型中value的值');
              // }
              console.log(val.value.a_0,val.value[0], it.ruleType, '类型中value的值');
              console.log(projectValue,val.value,'235');
              values = [{
                type: it.ruleType,
                value: val.value && it.type === 'inputNumber' ? (val.value[`${it.id}`] * 1000)/10 :  val.value[`${it.id}`].toString(),
                categoryId: val.categoryId ? val.categoryId[`${it.id}`] : '',
              }];
            }
            console.log(values,'values值');
            rules = {
              type: it.key.indexOf('other') > -1 ? 'other' : it.key,
              typeName: it.value,
              method: val.method,
              rule: {
                method: val.methods && val.methods[`${it.id}`],
                values,
              },
            };
            if (it.key.indexOf('other') > -1) {
              Object.assign(rules, {
                childType: it.key.split('~')[1],
              });
            }
            conditions.push(rules);
          });
        }
        if (!flag) {
          vals = null;
          return vals;
        }
        console.log(conditions,'conditions的值');
        vals = {
          bizData: {
            conditionNode: {
              method: val.method,
              conditions,
            }
          },
          content,
          priority: val.priority,
        };
      }
    });
    console.log(vals, 'vals参数');
    return vals;
  }

  checkMoney = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000000000 || value === 100000000000000) {
        callback('金额需小于1万个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      callback();
    } else {
      callback();
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      costCategoryList,
      priorityLength,
      details,
      conditions,
      conditionNode,
      projectList,
      // templateType,
      supplierList,
      getCondition,
      incomeCategoryList,
    } = this.props;
    console.log(projectList, '原数据');
    console.log(costCategoryList, '原数据');
    const PriArr = this.numToArr(priorityLength);
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, costCategoryList);
    const incomeList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, incomeCategoryList);
    const projectLists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'name',
      tName: 'title',
      tId: 'value'
    }, projectList);
    console.log(projectLists,'树projectLists');
    const disList = this.onSelectTree();
    const { lists, method } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    getFieldDecorator('keys', { initialValue: conditions && conditions.length > 0 ? conditions : lists });
    console.log('🚀 ~ file: Conditions.js ~ line 345 ~ Conditions ~ render ~ lists', lists);
    let SHOW = SHOW_CHILD;
    const keys = getFieldValue('keys');
    const formItems = keys && keys.map((item, index) => {
      let valueList = [];
      if (item.key === 'project') {
        console.log(item,'item.ruleValue');
        valueList = projectLists;
        SHOW = SHOW_PARENT;
      } else if (item.key === 'supplier') {
        valueList = supplierList;
      } else if (item.key === 'income_category'){
        valueList = incomeList;
      } else {
        valueList = list;
      }
      console.log(item.key,'34300000');
      return (
        <Form.Item
          key={item.id}
          {...formItemLayout}
          style={{marginBottom: '0', marginLeft: '12.7%'}}
        >
          <div
            className={cs('m-b-8', style.formCondi)}
          >
            {
              getFieldDecorator(`type[${item.id}]`, {
                initialValue: item.key,
                rules: [{ required: true, message: '请选择' }]
              })(
                <Select
                  onChange={val => this.onChange(val, index)}
                  style={{width: '180px', height: '32px'}}
                  className="m-r-16"
                >
                  {
                    getCondition.map(it => (
                      <Option key={it.key}>{it.value}</Option>
                    ))
                  }
                </Select>
              )
            }
            {
              item && item.key === 'cost_detail' &&
              getFieldDecorator(`categoryId[${item.id}]`, {
                initialValue: item.categoryId || '',
                rules: [{ required: true, message: '请选择' }]
              })(
                <TreeSelect
                  treeData={disList}
                  style={{width: '250px', margin: '0 16px 0 0', height: '32px'}}
                  dropdownStyle={{height: '300px'}}
                  placeholder="请选择"
                />
              )
            }
            {
              item && item.sel &&
              getFieldDecorator(`methods[${item.id}]`, {
                initialValue: item.methods || '',
                rules: [{ required: true, message: '请选择' }]
              })(
                <Select
                  style={{width: '100px', height: '32px'}}
                  className="m-r-16"
                >
                  {
                    item.sel.map(it => (
                      <Option key={it.key}>{it.value}</Option>
                    ))
                  }
                </Select>
              )
            }
            {
              item && item.type === 'people' &&
              <UserSelector
                users={item.users || []}
                depts={item.depts || []}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val, index)}
                invalid={false}
                disabled={false}
                flag="useApep"
              />
            }
            {
              item && item.type === 'inputNumber' &&
              getFieldDecorator(`value[${item.id}]`, {
                initialValue: item.ruleValue ? (item.ruleValue[0]/100) : '',
                rules: [
                  { required: true, message: '请输入' },
                  { validator: this.checkMoney }
                ]
              })(
                <InputNumber placeholder="请输入" style={{width: '150px'}} />
              )
            }
            {
              // [{label:'123',value:'1235689'},{label:'234',value:'123568'}]
              item && item.type === 'selectTree' &&
              getFieldDecorator(`value[${item.id}]`, {
                initialValue: item.ruleValue ? item.ruleValue : [],
                rules: [{ required: true, message: '请选择' }]
              })(
                <TreeSelect
                  treeData={valueList}
                  treeCheckable
                  style={{width: '100%'}}
                  showCheckedStrategy={SHOW}
                  dropdownStyle={{height: '300px'}}
                  placeholder="请选择"
                />
              )
            }
            {
              item && item.type === 'select' &&
              getFieldDecorator(`value[${item.id}]`, {
                initialValue: item.ruleValue ? item.ruleValue : [],
                rules: [{ required: true, message: '请选择' }]
              })(
                <Select
                  style={{ width: '100%', height: '32px'}}
                  className="m-r-16"
                  mode="multiple"
                >
                  {
                    item.options.map(it => (
                      <Option key={it}>{it}</Option>
                    ))
                  }
                </Select>
              )
            }
            {
              keys.length > 1 &&
              <span
                className={cs('deleteColor', style.del)}
                onClick={() => this.remove(item.id, index)}
              >
                删除
              </span>
            }
          </div>
          {
            (keys.length > 0) && (index < (keys.length -1)) &&
            <p
              className="m-t-16"
              style={{lineHeight: 1, marginBottom: '8px'}}
            >
              {method === 'OR' ? '或' : '且'}
            </p>
          }
        </Form.Item>
      );
    });
    return (
      <Form className="formItems">
        <Form.Item label="优先级" {...formItemLayout}>
          {
            getFieldDecorator('priority', {
              initialValue: `${details.priority}`,
            })(
              <Select>
                {
                  PriArr.map(item => (
                    <Option key={item}>{`优先级${item}`}</Option>
                  ))
                }
              </Select>
            )
          }
        </Form.Item>
        <Form.Item label="条件" {...formItemLayout}>
          <p className="c-black-25" style={{marginBottom: '0'}}>条件之间的关系</p>
          {
            getFieldDecorator('method', {
              initialValue: conditionNode.method || 'OR'
            })(
              <Radio.Group onChange={e => this.onChangeMethod(e)}>
                <Radio key="OR" value="OR">或的关系（当满足以下任意一个条件时进入此流程）</Radio>
                <Radio key="AND" value="AND">且的关系（当满足以下条件时进入此流程）</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        {formItems}
        <Button
          style={{marginLeft: '12.7%'}}
          key="add"
          onClick={this.onAdd}
          disabled={lists.length > 4}
        >
          添加条件
        </Button>
      </Form>
    );
  }
}

export default Conditions;
