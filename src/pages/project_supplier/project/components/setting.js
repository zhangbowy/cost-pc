/**
 * 设置（包含分类设置和项目设置，操作有新增和编辑）
 * @param {string} type 目标类型：project：项目，group：分组
 * @param {string} action 操作的类型：add：新增 edit：编辑
 * @param {object} data 编辑需要传入的数据
 */

import React, { PureComponent } from 'react';
import { Modal, Button, message, Form, Input, Cascader, Radio, Switch } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import { defaultTitle, targets, formItemLayout, isAllUse } from '@/utils/constants';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import styles from './index.scss';
import UserSelector from '../../../basicSetting/invoice/components/UserSelector';

const labelItem = {
  prodName: '名称',
  parentId: '所属分组',
  isAllUse: '可用人员',
  remakes: '备注',
  status: '启用'
};

const { TextArea } = Input;

@Form.create()
@connect(({ session, projects }) => ({
  userInfo: session.userInfo,
  detail: projects.detail,
  list: projects.list,
}))
class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: props.type === 'project' ? '项目' : '分组',
      visible: false, // 控制modal显隐
      groupList: [],
      data: {}, // 父组件传入的详情数据
      userJson: !props.data || !props.data.userJson ? [] : JSON.parse(props.data.userJson),
      deptJson: !props.data || !props.data.deptJson ? [] : JSON.parse(props.data.deptJson),
    };
  }

  // 关闭设置
  closeModal = () => {
    this.setState({
      visible: false
    });
    // 重置Form
    this.props.form.resetFields();
  }

  // 保存设置
  onSave = (e) => {
    e.preventDefault();
    const { type, action, form, dispatch, onOk } = this.props;
    const { data, userJson, deptJson } = this.state;
    const url = action === 'edit' ? 'projects/projectEdit' : 'projects/projectAdd';
    const val = { ...data };
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        Object.assign(val, {
          ...values,
          status: val.status ? 1 : 0,
        });
        if(type === 'project') {
          val.status = values.status ? 1 : 0;
          if(!values.isAllUse) {
            Object.assign(val, {
              userJson: JSON.stringify(userJson),
              deptJson: JSON.stringify(deptJson)
            });
          } else {
            Object.assign(val, {
              userJson: '',
              deptJson: ''
            });
          }
        }
        if(!values.parentId || values.parentId.length === 0) {
          val.parentId = 0;
        } else {
          // eslint-disable-next-line prefer-destructuring
          val.parentId = values.parentId.pop();
        }
        dispatch({
          type: url,
          payload: {
            ...val,
            status: val.status ? 1 : 0,
          }
        }).then(() => {
          onOk();
          message.success(`${defaultTitle[action]}${targets[type]}成功`);
          this.closeModal();
        });
      }
    });
  }

  // 可用人员选择事件监听
  onChange = (e) => {
    const { data } = this.state;
    data.isAllUse = e.target.value;
    this.setState({ data });
  }

  selectPle = (res) => {
    this.setState({
      userJson: res.users || [],
      deptJson: res.depts || [],
    });
    if(res.users || res.depts) {
      this.props.form.setFields({
        isAllUse: {
          errors: null
        }
      });
    }
  }

  // 初始化Modal
  show = async () => {
    // 获取最新的list
    await this.props.dispatch({
      type: 'products/getList',
      payload: {}
    });
    const { list, action, type, data, userInfo } = this.props;
    let datas = {...data};
    const lists = (list && list.filter(it => Number(it.type) === 0)) || [];
    // 生成分组选择列表
    const groupList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'name',
      name: 'name',
      otherKeys: ['id']
    }, lists);
    if(action === 'add') {
      if(type === 'project') {
        datas.isAllUse = true;
        datas.type = 1;
      } else {
        datas.type = 0;
      }
      datas.parentId = [];
    } else {
      await this.props.dispatch({
        type: 'projects/getDetail',
        payload: {
          id: data.id,
          companyId: userInfo.companyId || ''
        }
      }).then(() => {
        const { detail } = this.props;
        datas = {
          ...detail,
          parentId: this.findIndexArray(groupList, detail.parentId, []),
          status: Number(detail.status) === 1,
        };
      });
    }

    this.setState({
      groupList,
      data: datas,
      visible: true
    });
  }

  // 工具函数，获取树parentId
  findIndexArray  = (data, id, indexArray) => {
    const arr = Array.from(indexArray);
    for (let i = 0, len = data.length; i < len; i+=1) {
      arr.push(data[i].id);
      if (data[i].id === id) {
        return arr;
      }
      const {children} = data[i];
      if (children && children.length) {
        const result = this.findIndexArray(children, id, arr);
        if (result) return result;
      }
      arr.pop();
    }
    return false;
  }

  render() {
    const { title, visible, data, groupList, userJson, deptJson } = this.state;
    const { form: { getFieldDecorator }, type } = this.props;
    return (
      <span className={styles.content}>
        <span onClick={() => this.show()}>{this.props.children}</span>
        <Modal
          title={`${title}设置`}
          visible={visible}
          key="setting"
          maskClosable={false}
          onCancel={() => this.closeModal()}
          onOk={e => this.onSave(e)}
          width="660px"
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
                    message: `请输入${title}名称`
                  }]
                })(
                  <Input placeholder="请输入名称" />
                )
              }
            </Form.Item>
            <Form.Item
              key="parentId"
              label={labelItem.parentId}
            >
              {
                getFieldDecorator('parentId', {
                  initialValue: data.parentId,
                  rules: [{
                    required: false
                  }]
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
            {type === 'project'
              ? (
                <>
                  <Form.Item label={labelItem.isAllUse}>
                    {
                      getFieldDecorator('isAllUse', {
                        initialValue: data.isAllUse,
                        rules: [{
                          required: true
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
                        users={userJson}
                        depts={deptJson}
                        placeholder='请选择'
                        onSelectPeople={(val) => this.selectPle(val)}
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
