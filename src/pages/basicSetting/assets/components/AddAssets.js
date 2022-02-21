/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import { Form, Modal, Tree, TreeSelect } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { PureComponent } from 'react';
import CostTreeSelect from '../../../../components/FormItems/CostTreeSelect';
import { getTimeIdNo } from '../../../../utils/common';

const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
@Form.create()
class AddAssets extends PureComponent {
  state={
    visible: false,
    assetsList: [],
    listIds: [],
    list: [],
  }

  onShow = async() => {
    const { tree, lists } = await this.props.getAssets();
    const { list } = this.props;
    // const ids = this.lookForAllId(tree);
    this.setState({
      assetsList: tree,
      visible: true,
      listIds: list.map(it => it.assetsTypeId),
      list: lists,
    });
  }

  getChildren = (id = '', data = [], res = []) => {

  }

  onOk = () => {
    const { list } = this.state;
    const { details, onOk } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const params = {};
        const newList = [];
        if(details.id) {
          Object.assign(params, {
            ...details,
            note: val.note,
            categoryId: val.categoryId.value,
            categoryName: val.categoryId.label,
          });
        } else {
          val.assetsTypeId.forEach((item, index) => {
            const obj = list.filter(it => it.id === item.value)[0];
            newList.push({
              categoryId: val.categoryId.value,
              categoryName: val.categoryId.label,
              assetsTypeId: obj.id,
              assetsTypeName: obj.name,
              path: obj.path,
              parentId: obj.parentId,
              id: `add_${getTimeIdNo()}_${index}`,
              note: val.note,
            });
          });
        }
        console.log(newList);
        onOk({
          type: details.id ? 'edit' : 'add',
          editList: details.id ? params : newList
        });
        this.onCancel();
      }
    });
  }

  lookForAllId = (data = [], arr = []) => {
    for (const item of data) {
        arr.push(item.assetsTypeId);
        if (item.children && item.children.length) this.lookForAllId(item.children, arr);
    }
    return arr;
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  loopData = data => {
    const { listIds } = this.state;
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.label}
            key={item.value}
            dataRef={item}
            disabled={listIds.includes(item.value)}
            value={item.value}
          >
            {this.loopData(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.value} title={item.label} {...item} value={item.value} disabled={listIds.includes(item.value)} />;
    });
  }

  render() {
    const { children, details, costList } = this.props;
    const { visible, assetsList } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          title="新增类目映射"
          visible={visible}
          wrapClassName="centerModal"
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
          onCancel={() => this.onCancel()}
          onOk={this.onOk}
          width="580px"
          bodyStyle={{
            height: '380px'
          }}
        >
          <Form layout="vertical">
            <Form.Item label="鑫资产分类">
              {
                getFieldDecorator('assetsTypeId', {
                  initialValue: details.assetsTypeId ? [{key: details.assetsTypeId, label: details.assetsTypeName}] : undefined,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <TreeSelect
                    style={{width: '248px'}}
                    showSearch
                    treeCheckable
                    placeholder="请选择"
                    showCheckedStrategy={SHOW_PARENT}
                    labelInValue
                    disabled={details.id}
                  >
                    {this.loopData(assetsList)}
                  </TreeSelect>
                )
              }
            </Form.Item>
            <Form.Item label="鑫支出对应类别">
              {
                getFieldDecorator('categoryId', {
                  initialValue: details.categoryId ? [{ key: details.categoryId, label: details.categoryName }] : undefined,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <CostTreeSelect
                    list={costList || []}
                    style={{width: '248px'}}
                    labelInValue
                  />
                )
              }
            </Form.Item>
            <Form.Item label="备注">
              {
                getFieldDecorator('note', {
                  initialValue: details.note || '',
                  rules: [{ max: 128, message: '不能多于128' }]
                })(
                  <TextArea placeholder="请输入" rows={4} maxLength={128} />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default AddAssets;
