import React from 'react';
import { Modal, Form, Input, Select, Button, message, Cascader } from 'antd';
import { formItemLayout, defaultTitle } from '@/utils/constants';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import { findIndexArray } from '@/utils/common';

const labelItem = {
  costName: '名称',
  parentId: '所属分组'
};
const {Option} = Select;
@Form.create()
@connect(({ loading, session, costCategory }) => ({
  loading: loading.effects['costCategory/add'] || loading.effects['costCategory/edit'],
  userInfo: session.userInfo,
  allList: costCategory.allList,
}))
class AddGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lists: [],
      data: {},
    };
  }

  onRest = () => {
    this.props.form.resetFields();
  }

  handleOk = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      onOk,
      data,
      userInfo,
      title,
    } = this.props;

    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const payload = {
          ...value,
          companyId: userInfo.companyId || '',
          type: 0,
        };
        if (value.parentId && (typeof value.parentId !== 'string')) {
          Object.assign(payload, {
            parentId: value.parentId && value.parentId[value.parentId.length -1],
          });
        } else {
          Object.assign(payload, {
            parentId: 0,
          });
        }
        let action = 'costCategory/add';
        if (title === 'edit') {
          action = 'costCategory/edit';
          Object.assign(payload, {
            id: data.id,
          });
        }
        dispatch({
          type: action,
          payload,
        }).then(() => {
          message.success(`${defaultTitle[title]}成功`);
          this.setState({
            visible: false,
          });
          this.onRest();
          onOk();
        });
      }
    });
  }

  onShow = async() => {
    await this.props.dispatch({
      type: 'costCategory/allList',
      payload: {}
    });
    const { allList, data, title } = this.props;
    const listTree = (allList && allList.filter(it => Number(it.type) === 0)) || [];
    const lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'costName',
      name: 'costName',
      otherKeys: ['icon', 'note', 'type', 'parentId']
    }, listTree);
    const datas = {...data};
    if (data && data.parentId) {
      if (data && data.parentId !== '0') {
        console.log(findIndexArray(lists, data.parentId, []));
        Object.assign(datas, {
           parentId: findIndexArray(lists, data.parentId, []),
        });
      }
    }

    if (title === 'copy') {
      Object.assign(datas, {
        costName: `${data.costName}的副本`,
     });
    }
    this.setState({
      visible: true,
      lists,
      data: datas,
    });
  }

  onCancel = () => {
    this.onRest();
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, lists, data } = this.state;
    const {
      children,
      title,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title={title && `${defaultTitle[title]}分组`}
          visible={visible}
          onCancel={this.onCancel}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="save" type="primary" onClick={e => this.handleOk(e)}>保存</Button>
          ]}
        >
          <Form className="formItem">
            <Form.Item
              key="costName"
              label={labelItem.costName}
              {...formItemLayout}
            >
              {
                getFieldDecorator('costName', {
                  initialValue: data && data.costName,
                  rules: [{ required: true, message: '请输入名称' }]
                })(
                  <Input placeholder="请输入名称" />
                )
              }
            </Form.Item>
            <Form.Item
              key="parentId"
              label={labelItem.parentId}
              {...formItemLayout}
            >
              {
                (lists && lists.length === 0) ?
                getFieldDecorator('parentId', {
                  initialValue: (data && data.parentId) || '0',
                })(
                  <Select disabled={title === 'edit'}>
                    <Option key="0">无</Option>
                    {
                      lists.map(item => (
                        <Option key={item.value}>{item.costName}</Option>
                      ))
                    }
                  </Select>
                )
                :
                getFieldDecorator('parentId', {
                  initialValue: data && data.parentId,
                })(
                  <Cascader
                    options={lists}
                    placeholder="请选择"
                    fieldNames={{
                      label: 'costName',
                      value: 'id',
                    }}
                    disabled={title === 'edit'}
                    showSearch={this.filter}
                    changeOnSelect
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddGroup;
