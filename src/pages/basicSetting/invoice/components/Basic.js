/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Form, Input, Select, Switch, Radio, TreeSelect, Divider, Icon, Checkbox, Tooltip, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import RadioGroup from 'antd/lib/radio/group';
import CheckboxGroup from 'antd/lib/checkbox/group';
import { isAllUse, isAllCostCategory, templateTypeList } from '@/utils/constants';
// import { setCommand } from '@/utils/jsapi-auth';
import UserSelector from './UserSelector';
import AddFlow from '../../approvalFlow/components/AddFlow';
import style from './classify.scss';

const labelInfo = {
  name: '名称',
  parentId: '所属分组',
  note: '描述',
  isAllUse: '可用人员',
  isAllCostCategory: '可选支出类别',
  approveId: '审批流',
  icon: '图标',
  status: '启用'
};
const {Option} = Select;
const { SHOW_CHILD } = TreeSelect;
const categoryStatus = [{
  key: '0',
  value: '禁用'
}, {
  key: '1',
  value: '启用非必填'
}, {
  key: '2',
  value: '启用必填'
}];
const CONTRACT_OPTIONS = [
  {
    key: '0',
    value: '允许关联'
  },
  {
    key: '0',
    value: '允许关联1'
  },
]

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
      costStatus: (this.props.data && this.props.data.categoryStatus) ?
      `${this.props.data.categoryStatus}` : '0'
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
          costStatus: (this.props.data && this.props.data.categoryStatus) ?
            `${this.props.data.categoryStatus}` : '0'
        });
    }
    if (prevProps.approveList.length !== this.props.approveList.length) {
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
      templateType,
    } = this.props;
    let val = {};
    const { category, users, deptJson } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Basic -> getFormItem -> values', values);

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
        if (values.relation) {
          const obbj = {
            isRelationLoan: false,
            isWriteByRelationLoan: false,
          };
          values.relation.forEach(its => {
            obbj[its] = true;
          });
          Object.assign(values, {
            ...obbj,
          });
        }
        if (values.relations) {
          const obbj = {
            isRelationApply: false,
            isWriteByRelationApply: false,
          };
          values.relations.forEach(its => {
            obbj[its] = true;
          });
          Object.assign(values, {
            ...obbj,
          });
        }
        if (!values.isAllUse) {
          Object.assign(val, {
            userJson: users || [],
            deptJson: deptJson || []
          });
        }
        if (templateType === 2) {
          Object.assign(values, {
            categoryStatus: Number(values.categoryStatus),
          });
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
    } else if (value === 'cost') {
      this.setState({
        category: [],
      });
    } else if (value === 'costStatus' && e.target.value === '0') {
      this.setState({
        category: [],
        cost: true,
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
    console.log('Basic -> selectPle -> res', res);
    this.setState({
      users: res.users || [],
      deptJson: res.depts || [],
    });
  }

  onChangeSelect = (type) => {
    this.onCancel();
    const { templateType } = this.props;
    this.props.dispatch({
      type: 'addInvoice/approveList',
      payload: {
        templateType,
      }
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

  onChangeRelation = (e, key) => {
    this.props.onChanges(key, e);
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      list,
      costCategoryList,
      templateType,
      dispatch,
      reApply,
      reLoan,
    } = this.props;
    const { cost, user, category, users,
      deptJson, flowId, approveList,
      visible, name, title, costStatus } = this.state;
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
      <Spin spinning={this.props.detailLoading}>
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
                  <CheckboxGroup onChange={e => this.onChange(e, 'user')}>
                    {
                      isAllUse.map(item => (
                        <Radio key={item.key} value={item.key}>{item.value}</Radio>
                      ))
                    }
                  </CheckboxGroup>
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
              (templateType === 2) &&
              <Form.Item label="支出明细">
                {
                  getFieldDecorator('categoryStatus', {
                    initialValue: costStatus,
                  })(
                    <RadioGroup onChange={e => this.onChange(e, 'costStatus')}>
                      {
                        categoryStatus.map(item => (
                          <Radio key={item.key} value={item.key}>
                            {item.value}
                            {
                              item.key === '0' &&
                              <Tooltip title="禁用后，该申请单模版不支持添加支出明细">
                                <i className="iconfont iconIcon-yuangongshouce fs-14 m-l-8" />
                              </Tooltip>
                            }
                          </Radio>
                        ))
                      }
                    </RadioGroup>
                  )
                }
              </Form.Item>
            }
            {
              (!templateType || (templateType === 3) ||
              templateType === 20 ||
              ((templateType === 2) && costStatus !== '0')) &&
              <Form.Item label={templateType !== 20 ? labelInfo.isAllCostCategory : '可选收入类别'}>
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
                      treeNodeFilterProp="label"
                      autoClearSearchValue
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
              !Number(templateType) &&
              <Form.Item label="借款核销">
                {
                  getFieldDecorator('relation', {
                    initialValue: data && data.relation ? data.relation : [],
                  })(
                    <Checkbox.Group onChange={e => this.onChangeRelation(e, 'reLoan')}>
                      <Checkbox value="isRelationLoan">允许关联</Checkbox>
                      {
                        reLoan.includes('isRelationLoan') &&
                          <Checkbox value="isWriteByRelationLoan">必填</Checkbox>
                      }
                    </Checkbox.Group>
                  )
                }
              </Form.Item>
            }
            {
              Number(templateType) !== 2 && (Number(templateType) !== 3) &&
              Number(templateType) !== 20 &&
              <Form.Item label="申请单">
                {
                  getFieldDecorator('relations', {
                    initialValue: data && data.relations ? data.relations : [],
                  })(
                    <Checkbox.Group onChange={e => this.onChangeRelation(e, 'reApply')}>
                      <Checkbox value="isRelationApply">允许关联</Checkbox>
                      {
                        reApply.includes('isRelationApply') &&
                          <Checkbox value="isWriteByRelationApply">必填</Checkbox>
                      }
                    </Checkbox.Group>
                  )
                }
              </Form.Item>
            }
            <Form.Item label={'收入合同'}>
              {
                getFieldDecorator('contract', {
                  initialValue: CONTRACT_OPTIONS,
                })(
                  <Checkbox.Group onChange={e => this.onChangeRelation(e, 'reApply')}>
                    <Checkbox value="isRelationApply">允许关联合同</Checkbox>
                    {
                      reApply.includes('isRelationApply') &&
                      <Checkbox value="isWriteByRelationApply">必填</Checkbox>
                    }
                  </Checkbox.Group>                )
              }
            </Form.Item>

            <Form.Item label={labelInfo.status}>
              {
                getFieldDecorator('status', {
                  initialValue: data.status === undefined ? true :!!(data.status),
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
      </Spin>
    );
  }
}

export default Basic;
