/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { Form, Radio, Select, Button, InputNumber, TreeSelect } from 'antd';
import { formItemLayout, condExclude, condThan } from '@/utils/constants';
import UserSelector from '@/components/Modals/SelectPeople';
import treeConvert from '@/utils/treeConvert';
import { connect } from 'dva';
import { onSelectDis } from '@/utils/common';
import style from './index.scss';

const { Option } = Select;
const { SHOW_CHILD } = TreeSelect;
let id = 0;
const condition = [{
  key: 'condition_creator_user_dept',
  value: '制单人/部门',
  sel: condExclude,
  type: 'people',
  ruleType: 'people',
}, {
  key: 'condition_bear_user_dept',
  value: '承担人/部门',
  sel: condExclude,
  type: 'people',
  ruleType: 'people',
}, {
  key: 'cost_category',
  value: '费用类别',
  sel: condExclude,
  type: 'selectTree',
  ruleType: 'category',
}, {
  key: 'invoice_submit_sum',
  value: '报销金额',
  sel: condThan,
  type: 'inputNumber',
  ruleType: 'submit_sum',
}, {
  key: 'cost_detail',
  value: '费用金额',
  sel: condThan,
  type: 'inputNumber',
  ruleType: 'detail_sum',
}];

@Form.create()
@connect(({ global }) => ({
  costCategoryList: global.costCategoryList,
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
    lists: [{
      key: 'cost_category',
      value: '费用类别',
      sel: condExclude,
      type: 'selectTree',
      id,
      ruleType: 'category'
    }],
    method: 'OR',
  }

  /**
   * 切换条件选择
   * @param { Object } 包含val（key值）和index（位置）两个参数
   * @memberof Conditions
   */
  onChange = (val, index) => {
    const {lists} = this.state;
    const list = [...lists];
    const items = lists[index];
    const { form } = this.props;
    condition.forEach(item => {
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
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{
      id: ++id,
      key: 'condition_creator_user_dept',
      value: '制单人/部门',
      sel: condExclude,
      type: 'people',
      ruleType: 'people',
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
    } = this.props;
    let vals = null;
    form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let content = '';
        const conditions = [];
        if (val.keys) {
          val.keys.forEach((it) => {
            content+=`${it.value}、`;
            let rules = {};
            let values = [];
            if (it.type === 'people') {
              values = [{
                type: 'user',
                value: it.users && it.users.map(its => its.userId).toString(),
              }, {
                type: 'dept',
                value: it.depts && it.depts.map(its => its.deptId).toString(),
              }];
            } else {
              values = [{
                type: it.ruleType,
                value: val.value && it.type === 'inputNumber' ? (val.value[`${it.id}`] * 1000)/10 :  val.value[`${it.id}`].toString(),
                categoryId: val.categoryId || '',
              }];
            }
            rules = {
              type: it.key,
              typeName: it.value,
              method: val.method,
              rule: {
                method: val.methods && val.methods[`${it.id}`],
                values,
              },
            };
            conditions.push(rules);
          });
        }
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
    return vals;
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      costCategoryList,
      priorityLength,
      details,
    } = this.props;
    const PriArr = this.numToArr(priorityLength);
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, costCategoryList);
    const disList = this.onSelectTree();
    const { lists, method } = this.state;
    getFieldDecorator('keys', { initialValue: lists });
    const keys = getFieldValue('keys');
    const formItems = keys.map((item, index) => {
      return (
        <Form.Item
          key={item.id}
          label={`条件${index+1}`}
          {...formItemLayout}
          style={{marginBottom: '0'}}
        >
          <div
            style={{display: 'flex', flexWrap: 'wrap', position: 'relative'}}
            className="m-b-16"
          >
            {
              getFieldDecorator(`type[${item.id}]`, {
                initialValue: item.key,
              })(
                <Select
                  onChange={val => this.onChange(val, index)}
                  style={{width: '180px'}}
                  className="m-b-16 m-r-16"
                >
                  {
                    condition.map(it => (
                      <Option key={it.key}>{it.value}</Option>
                    ))
                  }
                </Select>
              )
            }
            {
              item && item.key === 'cost_detail' &&
              getFieldDecorator(`categoryId[${item.id}]`, {
                rules: [{ required: true, message: '请选择' }]
              })(
                <TreeSelect
                  treeData={disList}
                  style={{width: '100%', marginBottom: '16px'}}
                  dropdownStyle={{height: '300px'}}
                  placeholder="请选择"
                />
              )
            }
            {
              item && item.sel &&
              getFieldDecorator(`methods[${item.id}]`, {
                rules: [{ required: true, message: '请选择' }]
              })(
                <Select
                  style={{width: '100px'}}
                  className="m-r-16 m-b-16"
                  getPopupContainer={triggerNode => triggerNode.parentElement}
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
                rules: [{ required: true, message: '请输入' }]
              })(
                <InputNumber placeholder="请输入" style={{width: '150px'}} />
              )
            }
            {
              item && item.type === 'selectTree' &&
              getFieldDecorator(`value[${item.id}]`, {
                rules: [{ required: true, message: '请选择' }]
              })(
                <TreeSelect
                  treeData={list}
                  treeCheckable
                  style={{width: '100%'}}
                  showCheckedStrategy={SHOW_CHILD}
                  dropdownStyle={{height: '300px'}}
                  placeholder="请选择"
                />
              )
            }
            {
              keys.length > 1 &&
              <span
                className={cs('deleteColor', style.del)}
                onClick={() => this.remove(item.id)}
              >
                删除
              </span>
            }
            {
              (keys.length > 0) && (index < (keys.length -1)) &&
              <p
                className="m-t-16"
                style={{lineHeight: 1, marginBottom: 0}}
              >
                {method === 'OR' ? '或' : '且'}
              </p>
            }
          </div>
        </Form.Item>
      );
    });
    return (
      <Form className="formItem">
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
          <p>条件之间的关系</p>
          {
            getFieldDecorator('method', {
              initialValue: 'OR'
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
          style={{marginLeft: '25%'}}
          key="add"
          onClick={this.onAdd}
          disabled={keys.length > 5}
        >
          添加条件
        </Button>
      </Form>
    );
  }
}

export default Conditions;
