import React from 'react';
import { Modal, Form, Input, Button, message, Radio, Cascader, Select } from 'antd';
import { connect } from 'dva';
import { formItemLayout, defaultTitle } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import { findIndexArray } from '@/utils/common';
import fields from '@/utils/fields';

const labelItem = {
  costName: '名称',
  parentId: '所属分组',
  attribute: '类型'
};
const urlObj = {
  add: 'costCategory/add',
  edit: 'costCategory/edit',
  copy: 'costCategory/copy'
};
const { Option } = Select;
@Form.create()
@connect(({ loading, session, costCategory }) => ({
  loading: loading.effects['costCategory/add'] ||
  loading.effects['costCategory/edit']||
  loading.effects['costCategory/copy'] || false,
  userInfo: session.userInfo,
  allList: costCategory.allList,
}))
class AddGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
      lists: [],
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
      type,
    } = this.props;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const payload = {
          ...value,
          companyId: userInfo.companyId || '',
          type: 0,
          costItem: type,
        };
        if (value.parentId && (typeof value.parentId !== 'string')) {
          Object.assign(payload, {
            parentId: value.parentId && value.parentId[value.parentId.length -1],
          });
        } else {
          Object.assign(payload, {
            parentId: (data && data.parentId) || 0,
          });
        }
        if (title !== 'add') {
          Object.assign(payload, {
            id: data.id,
          });
        }
        if (title === 'copy') {
          Object.assign(payload, {
            isGroup: 1,
          });
        }
        console.log('🚀 ~ file: AddGroup.js ~ line 91 ~ AddGroup ~ form.validateFieldsAndScroll ~ urlObj[title]', urlObj[title]);

        dispatch({
          type: urlObj[title],
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

  onShow = () => {
    const { type } = this.props;
    console.log('🚀 ~ file: AddGroup.js ~ line 95 ~ AddGroup ~ onShow=async ~ type', type);
    this.props.dispatch({
      type: type === '0' ? 'costCategory/allList' : 'costCategory/allIncomeList',
      payload: {}
    }).then(() => {
      const {  data, title, allList } = this.props;
      const listTree = (allList && allList.filter(it => Number(it.type) === 0)) || [];
      const lists = treeConvert({
        rootId: 0,
        pId: 'parentId',
        tName: 'costName',
        name: 'costName',
        otherKeys: ['icon', 'note', 'type', 'parentId', 'attribute']
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
        data: datas,
        lists,
      });
    });

  }

  onCancel = () => {
    this.onRest();
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, data, lists } = this.state;
    const {
      children,
      title,
      type,
      form: { getFieldDecorator },
    } = this.props;
    const { costType } = fields;
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
            {
              title === 'add' &&
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
                      changeOnSelect
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                  )
                }
              </Form.Item>
            }
            {
              Number(type) === 0 &&
              <Form.Item label="类型选择" {...formItemLayout}>
                {
                  getFieldDecorator('attribute', {
                    initialValue: (data && data.attribute) || 0,
                  })(
                    <Radio.Group
                      disabled={title === 'edit' || title === 'copy'}
                    >
                      {
                        costType.map(it => (
                          <Radio key={it.key} value={it.key}>{it.value}</Radio>
                        ))
                      }
                    </Radio.Group>
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

export default AddGroup;
