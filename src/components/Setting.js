/**
 * 设置（包含分类设置和项目/供应商设置，操作有新增和编辑）
 * @param {string} type 目标类型：item：组员，group：分组
 * @param {string} target 操作的类型：project：项目 || supplier：供应商
 * @param {object} detail 编辑时的详情数据
 * @param {array} list 树结构分组数据
 */

import React, { Component } from 'react';
import { Modal, Button, Form, Input, Cascader, Radio, Switch, Table, message, DatePicker } from 'antd';
import { connect } from 'dva';
import RadioGroup from 'antd/lib/radio/group';
import moment from 'moment';
import update from 'immutability-helper';
import { formItemLayout, isAllUse } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import SelectPeople from '@/components/Modals/SelectPeople';
import { findIndexArray } from '@/utils/util';
import AccountSetting from '@/components/AccountSetting';
import UserSelector from '../pages/basicSetting/invoice/components/UserSelector';

const labelItem = {
  prodName: '名称',
  parentId: '所属分组',
  isAllUse: '参与人',
  account: '供应商账户',
  remakes: '备注',
  status: '启用',
  time: '项目期限'
};

const { TextArea } = Input;
const TAEGETS = {
  'supplier': '供应商',
  'project': '项目'
};
const accountType = {
  '0': '银行卡',
  '1': '支付宝',
  '2': '现金'
};
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ global }) => ({
  accountCanDelRes: global.accountCanDelRes,
  newDetail: global.newDetail,
}))
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.type === 'item' ? `${TAEGETS[props.target]}设置` : '分组设置',
      visible: false, // 控制modal显隐
      groupList: [], // 树形分组数据
      data: {}, // 父组件传入的详情数据
      delIds: [],
      action: '', // 供应商账户的操作
      editIndex: 0,
    };
  }

  // 初始化Modal
  show = async () => {
    const { list, detail = {}, type, target } = this.props;
    let datas = {};
    if (target === 'supplier' && !detail.supplierAccounts) {
      datas.supplierAccounts = [];
    }
    // 生成树形分组结构
    const lists = (list && list.filter(it => Number(it.type) === 0 && it.id !== detail.id)) || [];
    const groupList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'name',
      name: 'name',
      otherKeys: ['id']
    }, lists);
    if (detail && detail.id) { // 编辑
      await this.props.dispatch({
        type: `global/${target}_detail`,
        payload: {
          id: detail.id
        }
      }).then(() => {
        const { newDetail } = this.props;
        datas = {
          ...newDetail,
          parentId: findIndexArray(groupList, detail.parentId, []),
          status: Number(detail.status) === 1,
          userJson: !detail.userJson ? [] : JSON.parse(detail.userJson),
          deptJson: !detail.deptJson ? [] : JSON.parse(detail.deptJson),
        };
        if(newDetail.projectManagerJson) {
          Object.assign(datas, {
            projectManagerJson: !newDetail.projectManagerJson ? [] : JSON.parse(newDetail.projectManagerJson)
          });
        }
      });
    } else { // 新增
      Object.assign(datas, {
        isAllUse: true,
        type: type === 'group' ? 0 : 1,
        parentId: [],
        userJson: [],
        deptJson: [],
        status: 1
      });
    }
    this.setState({
      groupList,
      data: datas,
      visible: true
    });
  }

  // 关闭设置
  closeModal = () => {
    this.setState({
      visible: false
    });
    // 重置Form
    this.props.form.resetFields();
    this.setState({ delIds: [] });
  }

  // 可用人员选择事件监听
  onChange = (e) => {
    const { data } = this.state;
    data.isAllUse = e.target.value;
    this.setState({ data });

  }

  // 选人组件监听
  handleSelect = (res) => {
    const { data } = this.state;
    data.userJson = res.users || [];
    data.deptJson = res.depts || [];
    if (res.users || res.depts) {
      this.props.form.setFields({
        isAllUse: {
          errors: null
        }
      });
    }
    this.setState({ data });
  }

  selectPle = (res) => {
    const { data } = this.state;
    console.log(res);
    if (res.users.length) {
      this.props.form.setFieldsValue({
        projectManagerJson: res.users
      });
    }
    this.setState({
      data: update(data, {
        projectManagerJson: {
          $set: res.users || [],
        }
      })
    });
  }

  // 保存设置
  onSave = (e) => {
    e.preventDefault();
    const { form, onOk, target, type } = this.props;
    const { data, delIds } = this.state;
    const val = { ...data };
    const url = data.id ? `global/${target}_edit` : `global/${target}_add`;
    form.validateFields((err, values) => {
      if (!err) {
        Object.assign(val, {
          ...values,
          status: values.status ? 1 : 0,
        });
        if (target === 'project' && type !== 'group') {
          Object.assign(val, {
            projectManagerJson: JSON.stringify(data.projectManagerJson),
            startTime: moment(values.time[0]).format('x'),
            endTime: moment(values.time[1]).format('x'),
          });
          delete val.time;
        }
        if (!values.isAllUse && type !== 'group') {
          if (!data.userJson.length && !data.deptJson.length) {
            form.setFields({
              isAllUse: {
                value: values.isAllUse,
                errors: [new Error('请选择可用人员')]
              }
            });
            return;
          }
          Object.assign(val, {
            userJson: JSON.stringify(data.userJson),
            deptJson: JSON.stringify(data.deptJson),
          });
        } else {
          Object.assign(val, {
            userJson: '',
            deptJson: ''
          });
        }
        if(target === 'supplier' && type === 'item') {
          if(!this.checkAccounts(data)) {
            return;
          }
        }
        if(type === 'group') {
          val.status = 1;
        }
        if (delIds.length) {
          val.delAccountIds = delIds;
        }
        val.parentId = !val.parentId || val.parentId.length === 0 ? 0 : val.parentId[val.parentId.length - 1];
        onOk(val, url, this.closeModal);
      }
    });
  }

  // 标记编辑/新增 标记操作的内容位置
  setAction = (action, record) => {
    let editIndex = 0;
    this.state.data.supplierAccounts.forEach((item, index) => {
      if (record === item) {
        editIndex = index;
      }
    });
    this.setState({ action, editIndex });
  }

  // 保存供应商账号
  onSaveSupplierSet = (val, callback) => {
    const { data, action, editIndex } = this.state;
    const supplierAccounts = data.supplierAccounts ? [...data.supplierAccounts] : [];
    let datas = {...data};
    if (action === 'edit') {
      const newLists = [...supplierAccounts];
      newLists.splice(editIndex, 1, val);
      const res1 = newLists.map(item => item.name);
      const accounts1 = newLists.map(item => item.account);
      if (Array.from(new Set(res1)).length < res1.length) {
        callback('repeat');
      } else if (Array.from(new Set(accounts1)).length < accounts1.length) {
        callback('repeatAccount');
      } else {
        supplierAccounts.splice(editIndex, 1, val);
        callback();
      }
      // data.supplierAccounts[editIndex] = val;
      // callback();
    } else {
      const res = supplierAccounts.filter(item => item.name === val.name);
      const accounts = supplierAccounts.filter(item => item.account === val.account);
      if (res.length) {
        callback('repeat');
      } else if (accounts.length) {
        callback('repeatAccount');
      } else {
        supplierAccounts.push(val);
        callback();
      }
    }
    datas = {...datas, supplierAccounts};
    this.checkAccounts(datas);

    this.setState({
      data: datas,
      action: '',
      editIndex: 0
    });
  }

  // 删除供应商账户
  deleteAccount = (record) => {
    const { data, delIds } = this.state;
    // 对原有账户记录的删除需要校验是否可以删除
    if (record.id) {
      this.props.dispatch({
        type: 'global/accountCanDel',
        payload: {
          id: record.id
        }
      }).then(() => {
        const { accountCanDelRes: { canDel, msg } } = this.props;
        if (!canDel) {
          message.error(msg);
        } else {
          delIds.push(record.id);
          data.supplierAccounts = data.supplierAccounts.filter(item => item !== record);
          this.checkAccounts(data);
          this.setState({ data, delIds });
        }
      });
    } else {
      data.supplierAccounts = data.supplierAccounts.filter(item => item.name !== record.name);
      this.setState({ data });
      if(!data.supplierAccounts.length) {
        this.checkAccounts(data);
      }
    }
  }

  // 检查供应商账号是否为空
  checkAccounts = (data) => {
    let res = true;
    if(!data.supplierAccounts || !data.supplierAccounts.length) {
      this.props.form.setFields({
        supplierAccounts: {
          value: data.supplierAccounts,
          errors: [new Error('请提供供应商账户')]
        }
      });
      res = false;
    } else {
      this.props.form.setFields({
        supplierAccounts: {
          errors: null
        }
      });
    }
    return res;
  }

  render() {
    const { title, visible, data, groupList } = this.state;
    const { form: { getFieldDecorator }, type, target } = this.props;
    const columns = [
      {
        title: '账户名称',
        dataIndex: 'name'
      },
      {
        title: '账户类型',
        dataIndex: 'type',
        render: (_, record) => {
          return (
            <span>{accountType[record.type]}</span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => {
          return (
            <div className="table-buttons">
              <a onClick={() => this.deleteAccount(record)}>删除</a>
              <AccountSetting data={record} callback={this.onSaveSupplierSet}>
                <a onClick={() => this.setAction('edit', record)} >编辑</a>
              </AccountSetting>

            </div>
          );
        }
      }
    ];
    return (
      <span>
        <span onClick={() => this.show()}>{this.props.children}</span>
        <Modal
          title={title}
          visible={visible}
          key="setting"
          maskClosable={false}
          onCancel={() => this.closeModal()}
          onOk={e => this.onSave(e)}
          width={type === 'item' ? '660px' : '480px'}
          bodyStyle={type === 'item' ? {
            padding: 20,
            maxHeight: '440px',
            overflowY: 'scroll'
          } : {}}
          footer={[
            <Button key="cancel" onClick={() => this.closeModal()}>取消</Button>,
            <Button key="save" type="primary" onClick={e => this.onSave(e)}>保存</Button>
          ]}
        >
          <Form className="formItem" {...formItemLayout}>
            <Form.Item
              key="name"
              label={labelItem.prodName}
            >
              {
                getFieldDecorator('name', {
                  initialValue: data.name,
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }, {
                    max: 32,
                    message: '长度不能超过32个字符'
                  }]
                })(
                  <Input placeholder="请输入名称" />
                )
              }
            </Form.Item>
            {
              target === 'project' && type === 'item' &&
              <Form.Item label="负责人">
                {
                  getFieldDecorator('projectManagerJson', {
                    initialValue: data.projectManagerJson || null,
                    rules: [{ required: true, message: '请选择负责人' }]
                  })(
                    <SelectPeople
                      users={data.projectManagerJson || []}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val)}
                      invalid={false}
                      flag="users"
                      isInput
                      multiple={false}
                    />
                  )
                }
              </Form.Item>
            }
            <Form.Item
              key="parentId"
              label={labelItem.parentId}
            >
              {
                getFieldDecorator('parentId', {
                  initialValue: data.parentId
                })(
                  <Cascader
                    options={groupList}
                    placeholder="请选择"
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                    }}
                    notFoundContent="无"
                    showSearch
                    changeOnSelect
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  />
                )
              }
            </Form.Item>
            {type === 'item'
              ? (
                <>
                  {
                    target === 'project' &&
                    <Form.Item label={labelItem.time} key="time">
                      {
                        getFieldDecorator('time', {
                          initialValue: data.startTime ?
                          [moment(moment(Number(data.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                          moment(moment(Number(data.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : undefined,
                          rules: [{ required: true, message: '请选择项目期限' }]
                        })(
                          <RangePicker
                            placeholder="请选择项目期限"
                            format="YYYY-MM-DD"
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                            }}
                          />
                        )
                      }
                    </Form.Item>
                  }
                  <Form.Item key="isAllUse" label={labelItem.isAllUse}>
                    {
                      getFieldDecorator('isAllUse', {
                        initialValue: data.isAllUse,
                        rules: [{
                          required: true,
                          message: '请选择可用人员'
                        }]
                      })(
                        <RadioGroup onChange={e => this.onChange(e)}>
                          {
                            isAllUse.map(item => (
                              <Radio key={item.key} value={item.key}>{item.value}</Radio>
                            ))
                          }
                        </RadioGroup>
                      )
                    }
                    {
                      !data.isAllUse &&
                      <UserSelector
                        users={data.userJson}
                        depts={data.deptJson}
                        placeholder='请选择'
                        onSelectPeople={(val) => this.handleSelect(val)}
                        // invalid={[]}
                        disabled={false}
                      />
                    }
                  </Form.Item>
                  <Form.Item label={labelItem.remakes}>
                    {
                      getFieldDecorator('note', {
                        initialValue: data.note,
                        rules: [{ max: 128, message: '不能超过128字' }]
                      })(
                        <TextArea max={128} />
                      )
                    }
                  </Form.Item>
                  {/* 供应商账户 */}
                  {target === 'supplier' ? (
                    <Form.Item label={labelItem.account}>
                      {
                        getFieldDecorator('supplierAccounts', {
                          initialValue: data.supplierAccounts,
                          rules: [
                            {
                              required: true,
                              message: '请增加供应商账户'
                            }
                          ]
                        })(
                          <AccountSetting onClick={() => this.setAction('add')} callback={this.onSaveSupplierSet}>
                            <Button>新增</Button>
                          </AccountSetting>
                        )
                      }
                      <Table
                        columns={columns}
                        dataSource={data.supplierAccounts}
                        pagination={false}
                        bordered
                        defaultExpandAllRows
                      />
                    </Form.Item>
                  ) : null}
                  <Form.Item label={labelItem.status}>
                    {
                      getFieldDecorator('status', {
                        initialValue: data.status === undefined ? true : data.status,
                        valuePropName: 'checked'
                      })(
                        <Switch />
                      )
                    }
                  </Form.Item>
                </>
              )
              : null}
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Setting;
