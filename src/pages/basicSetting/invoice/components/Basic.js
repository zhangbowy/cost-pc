/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Form, Input, Select, Switch, Radio, TreeSelect } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { formItemLayout, isAllUse, isAllCostCategory } from '@/utils/constants';
import RadioGroup from 'antd/lib/radio/group';
// import { setCommand } from '@/utils/jsapi-auth';
import UserSelector from './UserSelector';

const labelInfo = {
  name: '名称',
  parentId: '所属分组',
  note: '描述',
  isAllUse: '可用人员',
  isAllCostCategory: '可选费用类别',
  approveId: '审批流',
  icon: '图标',
  status: '启用'
};
const {Option} = Select;
const { SHOW_CHILD } = TreeSelect;
@Form.create()
class Basic extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.data.isAllUse);
    this.state = {
      user: !props.data || (props.data && props.data.isAllUse === undefined) ? true : props.data.isAllUse,
      cost: !props.data || (props.data && props.data.isAllCostCategory=== undefined) ? true : props.data.isAllCostCategory,
      category: props.category || [],
      users: (props.data && props.data.userJson) || [], // 选择的人员是空
      deptJson: (props.data && props.data.deptJson) || [], // 选择部门
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.data !==  this.props.data) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          user: !this.props.data ||
            (this.props.data && this.props.data.isAllUse === undefined)
            ? true : this.props.data.isAllUse,
          cost: !this.props.data ||
          (this.props.data && this.props.data.isAllCostCategory=== undefined)
          ? true : this.props.data.isAllCostCategory,
          category: this.props.category || [],
          users: (this.props.data && this.props.data.userJson) || [], // 选择的人员是空
          deptJson: (this.props.data && this.props.data.deptJson) || [], // 选择部门
        });
    }
}

  onRest() {
    this.setState({
      user: true,
      cost: true,
      category: [],
      users: [], // 选择的人员是空
      deptJson: [], // 选择部门
    });
    this.props.form.resetFields();
  }

  getFormItem = () => {
    const {
      form,
      costCategoryList,
    } = this.props;
    let val = {};
    const { category, users, deptJson } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const arr = [];
        if (category && category.length > 0) {
          console.log(category);
          category.forEach(item => {
            arr.push(this.findIndex(costCategoryList, item));
          });
          Object.assign(val, {
            costCategoryJson: arr.length > 0 && JSON.stringify(arr),
          });
        }
        if (!values.isAllUse) {
          if (users && users.length > 0) {
            Object.assign(val, {
              userJson: users,
            });
          }
          if (deptJson && deptJson.length > 0) {
            Object.assign(val, {
              deptJson
            });
          }
        }
        Object.assign(val, {
          ...val,
          ...values,
        });
      } else {
        val = null;
      }
    });
    return val;
  }

  findIndex = (arr, key) => {
    let obj = {};
    // eslint-disable-next-line no-unused-vars
    function find(data){
      data.forEach(item => {
        if (item.value === key) {
          obj = {
            id: item.value,
            costName: item.label,
          };
          return;
        }
        if (item.children && item.children.length > 0) {
          find(item.children, key);
        }
      });
    }
    find(arr);
    return obj;
  }

  onChange = (e, value) => {
    this.setState({
      [value]: e.target.value,
    });
    if (value === 'user') {
      this.setState({
        users: [],
        deptJson: [],
      });
    } else {
      this.setState({
        category: [],
      });
    }
  }

  getChild=(arr)=>{
    const newArr = [];
      for(let item = 0;item < arr.length; item+=1){
          newArr.push(arr[item].props.value);
          if(arr[item].props.children.length>0){
              newArr.push(...this.getChild(arr[item].props.children));
          }
      }
      return newArr;
  }

  onChangeTree = (value, label, extra) => {
    console.log(this.getChild(extra.triggerNode.props.children));
    console.log(extra);
    this.setState({
      category: value,
    });
  }

  selectPle = (res) => {
    this.setState({
      users: res.users || [],
      deptJson: res.depts || [],
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      list,
      costCategoryList,
      approveList,
    } = this.props;
    const lists = (list && list.filter(it => Number(it.type) === 0)) || [];
    const { cost, user, category, users, deptJson } = this.state;
    return (
      <div style={{ width: '100%', paddingTop: '24px' }}>
        <Form {...formItemLayout} className="formItem">
          <Form.Item label={labelInfo.name}>
            {
              getFieldDecorator('name', {
                initialValue: data && data.name,
                rules: [{ required: true, message: '请输入名称' }]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.parentId}>
            {
              getFieldDecorator('parentId', {
                initialValue: (data && data.parentId) || '0',
              })(
                <Select>
                  <Option key="0">无</Option>
                  {
                    lists.map(item => (
                      <Option key={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item
            label={labelInfo.note}
          >
            {
              getFieldDecorator('note', {
                initialValue: data && data.note,
                rules: [{ max: 50, message: '不能超过50字' }]
              })(
                <TextArea max={50} />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.isAllUse}>
            {
              getFieldDecorator('isAllUse', {
                initialValue: user,
              })(
                <RadioGroup onChange={e => this.onChange(e, 'user')}>
                  {
                    isAllUse.map(item => (
                      <Radio key={item.key} value={item.key}>{item.value}</Radio>
                    ))
                  }
                </RadioGroup>
              )
            }
            {
              !user &&
              <UserSelector
                users={users}
                depts={deptJson}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val)}
                invalid={false}
                disabled={false}
              />
            }
          </Form.Item>
          <Form.Item label={labelInfo.isAllCostCategory}>
            {
              getFieldDecorator('isAllCostCategory', {
                initialValue: cost,
              })(
                <RadioGroup onChange={e => this.onChange(e, 'cost')}>
                  {
                    isAllCostCategory.map(item => (
                      <Radio key={item.key} value={item.key}>{item.value}</Radio>
                    ))
                  }
                </RadioGroup>
              )
            }
            {
              !cost &&
              getFieldDecorator('costCategory', {
                initialValue: category,
              })(
                <TreeSelect
                  onChange={(value, label, extra) => this.onChangeTree(value, label, extra)}
                  treeData={costCategoryList}
                  treeCheckable
                  style={{width: '100%'}}
                  showCheckedStrategy={SHOW_CHILD}
                  dropdownStyle={{height: '300px'}}
                />
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.approveId}>
            {
              getFieldDecorator('approveId', {
                initialValue: data && data.approveId && `${data.approveId}`,
                rules: [{ required: true, message: '请选择审批流' }]
              })(
                <Select placeholder="请选择">
                  {
                    approveList.map(it => (
                      <Select.Option key={it.id}>{it.templateName}</Select.Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label={labelInfo.status}>
            {
              getFieldDecorator('status', {
                initialValue: data && data.status === undefined ? true : (data.status === 1),
                valuePropName: 'checked'
              })(
                <Switch />
              )
            }
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Basic;
