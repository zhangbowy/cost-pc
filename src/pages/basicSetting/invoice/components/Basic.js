/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Form, Input, Select, Switch, Radio, TreeSelect, Divider, Icon, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isAllUse, isAllCostCategory, templateTypeList } from '@/utils/constants';
import RadioGroup from 'antd/lib/radio/group';
// import { setCommand } from '@/utils/jsapi-auth';
import UserSelector from './UserSelector';
import AddFlow from '../../approvalFlow/components/AddFlow';
import style from './classify.scss';

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
      flowId: (props.data && props.data.approveId) || '',
      approveList: props.approveList || [], // 审批列表
      visible: false,
      title: 'add',
      name: '',
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
          flowId: (this.props.data && this.props.data.approveId) || '',
          title: 'add',
          name: '',
        });
    }
    if (prevProps.approveList !== this.props.approveList) {
      this.setState({
        approveList: this.props.approveList,
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
      templateType
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
        if (values.relation && values.relation.length) {
          const obbj = {
            isRelationApply: false,
          };
          if (Number(templateType) === 0) {
            Object.assign(obbj, {
              isRelationLoan: false,
            });
          }
          values.relation.forEach(its => {
            obbj[its] = true;
          });
          Object.assign(values, {
            ...obbj,
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

  onChangeSelect = (type) => {
    this.onCancel();
    this.props.dispatch({
      type: 'addInvoice/approveList',
      payload: {}
    }).then(() => {
      const { approveList, onChangeData } = this.props;
      console.log('Basic -> onChangeSelect -> approveList', approveList);
      onChangeData('approveList', approveList);
      this.setState({
        approveList,
      }, () => {
        if (type === 'add') {
          const len = approveList.length;
          this.setState({
            flowId: approveList[len-1].id,
          });
        }
      });
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  edit = (title, del) => {
    console.log('点击一下');
    const { templateType } = this.props;
    let name = templateType ? `${templateTypeList[templateType]}审批流` : '报销单审批流';
    if (title === 'edit') {
      name = del.templateName;
    }
    this.setState({
      visible: true,
      name,
      title,
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      list,
      costCategoryList,
      templateType,
      dispatch,
    } = this.props;
    const { cost, user, category, users, deptJson, flowId, approveList, visible, name, title } = this.state;
    console.log('data', data);
    // eslint-disable-next-line
    const lists = (list && list.filter(it => (Number(it.type) === 0 && (it.templateType == templateType)))) || [];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <div style={{ width: '100%', paddingTop: '24px', overflowY: 'scroll' }}>
        <Form {...formItemLayout} className="formItem" style={{ width: '450px' }}>
          <Form.Item label={labelInfo.name}>
            {
              getFieldDecorator('name', {
                initialValue: data && data.name,
                rules: [{ required: true, message: '请输入名称' }]
              })(
                <Input placeholder="请输入名称" />
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
          {
            !Number(templateType) &&
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
          }
          <Form.Item label={labelInfo.approveId}>
            {
              getFieldDecorator('approveId', {
                initialValue: flowId,
                rules: [{ required: true, message: '请选择审批流' }]
              })(
                <Select
                  key="flow"
                  placeholder="请选择"
                  optionLabelProp="label"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  dropdownClassName={style.addSel}
                  onChange={(val) => { this.setState({ flowId: val }); }}
                  dropdownStyle={{height: '300px'}}
                  dropdownRender={(menu) => {
                    return (
                      <div>
                        <span onMouseDown={(e) => { e.preventDefault();}}>
                          {menu}
                        </span>
                        {
                          approveList.length && !approveList[0].processOperationPermission &&
                          <>
                            <Divider style={{margin: '0'}} />
                            <div
                              key="event"
                              style={{height: '50px', textAlign: 'center', lineHeight: '50px'}}
                              onClick={() => this.edit('add')}
                              onMouseDown={e => {e.preventDefault();}}
                            >
                              <Icon type="plus" className="sub-color m-r-8" />
                              <a className="fs-14">新建审批流</a>
                            </div>
                          </>
                        }
                      </div>
                    );
                  }}
                >
                  {
                    approveList.filter(it => (it.templateType === Number(templateType))).map(it => (
                      <Option
                        key={it.id}
                        label={it.templateName}
                        className={style.flowOption}
                      >
                        <span>
                          <span className="m-r-8">{it.templateName}</span>
                          {
                            this.state.flowId === it.id &&
                            <i className="iconfont icondui sub-color" />
                          }
                        </span>
                        {
                          !it.processOperationPermission &&
                          <span
                            key="flowEdit"
                          >
                            <a
                              className={style.editFlow}
                              onClick={() => this.edit('edit', it)}
                              onMouseDown={(e) => { e.preventDefault();}}
                            >
                              编辑
                            </a>
                          </span>
                        }
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
          {
            Number(templateType) !== 2 &&
            <Form.Item label="单据相关">
              {
                getFieldDecorator('relation', {
                  initialValue: data && data.relation ? data.relation : [],
                })(
                  <Checkbox.Group>
                    {
                      Number(templateType) === 0 &&
                      <Checkbox value="isRelationLoan">关联借款单</Checkbox>
                    }
                    <Checkbox value="isRelationApply">关联申请单</Checkbox>
                  </Checkbox.Group>
                )
              }
            </Form.Item>
          }
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
        <AddFlow
          // {...this.props}
          templateType={templateType}
          title={title}
          name={name}
          processPersonId={flowId}
          onOk={() => this.onChangeSelect(title)}
          dispatch={dispatch}
          visible={visible}
          onCancel={() => this.onCancel()}
        />
      </div>
    );
  }
}

export default Basic;
