/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import { Form, Modal, Tooltip, Tree, TreeSelect } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { PureComponent } from 'react';
import CostTreeSelect from '../../../../components/FormItems/CostTreeSelect';
import { getTimeIdNo } from '../../../../utils/common';
import style from '../index.scss';

const { TreeNode } = Tree;
const { SHOW_ALL } = TreeSelect;
@Form.create()
class AddAssets extends PureComponent {
  state={
    visible: false,
    assetsList: [],
    listIds: [],
    list: [],
    listMap: []
  }

  onShow = async() => {
    const { tree, lists } = await this.props.getAssets();
    const { list } = this.props;
    // const ids = this.lookForAllId(tree);
    this.setState({
      assetsList: tree,
      visible: true,
      listIds: list.map(it => it.assetsTypeId),
      listMap: list.map(it => { return { value: it.assetsTypeId, label: it.assetsTypeName}; }),
      list: lists,
    });
  }

  getChildren = (id = '', data = [], res = []) => {

  }

  onOk = () => {
    const { list } = this.state;
    const { details, onOk } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      console.log('valsssss', val);
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
            title={listIds.includes(item.value) ? (<Tooltip title="该类别已有映射关系">{item.label}</Tooltip>) : item.label}
            key={item.value}
            dataRef={item}
            disabled={listIds.includes(item.value)}
            value={item.value}
          >
            {this.loopData(item.children)}
          </TreeNode>
        );
      }
      return (
        <>
          <TreeNode
            key={item.value}
            title={listIds.includes(item.value) ? (<Tooltip title="该类别已有映射关系">{item.label}</Tooltip>) : item.label}
            {...item}
            value={item.value}
            disabled={listIds.includes(item.value)}
          />
        </>
      );
    });
  }

  filterTreeNode = (inputValue, treeNode) => {
  console.log('🚀 ~ file: AddAssets.js ~ line 115 ~ AddAssets ~ treeNode', treeNode);
  console.log('🚀 ~ file: AddAssets.js ~ line 115 ~ AddAssets ~ inputValue', inputValue);
    return treeNode.title.indexOf(inputValue) > -1;
  }

  addBtn = () => {
    const dropdown = document.getElementsByClassName('_slslsl');
    if (dropdown && dropdown.length) {
      dropdown[0].firstChild.setAttribute('style', 'max-height: 300px;overflow-y: auto;padding-bottom:16px;');
      const buttonBox = document.getElementById('_slsl_button');
      if (buttonBox) {
        return;
      }
      const buttonBoxEl = document.createElement('div');
      buttonBoxEl.setAttribute('id', '_slsl_button');
      buttonBoxEl.setAttribute('class', 'slsl_button');
      const button = document.createElement('button');
      button.setAttribute('class', 'ant-btn pmc-buttons-button ant-btn-primary');
      button.setAttribute('style',
      `float: right;margin: 16px;
      height: 24px;
      width: 50px;
      padding: 0px;
      font-size: 12px;`);
      buttonBoxEl.appendChild(button);
      const text = document.createTextNode('确定');
      button.appendChild(text);
      button.addEventListener(
        'click',
        e => {
          e.stopPropagation();
          const slslslBox = document.getElementsByClassName('_slslsl_box')[0];
          slslslBox.click();
        }
      );
      dropdown[0].appendChild(buttonBoxEl);
    } else {
      setTimeout(() => this.addBtn(), 50);
    }
  }

  render() {
    const { children, details, costList } = this.props;
    const { visible, assetsList, listMap } = this.state;
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
          <Form layout="vertical" className={style.formLabel}>
            <Form.Item label="鑫资产分类">
              {
                getFieldDecorator('assetsTypeId', {
                  initialValue: details.assetsTypeId
                    ? [{value: details.assetsTypeId, label: details.assetsTypeName}]
                    : undefined,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <TreeSelect
                    style={{width: '248px'}}
                    showSearch
                    treeCheckable
                    placeholder="请选择"
                    showCheckedStrategy={SHOW_ALL}
                    labelInValue
                    disabled={details.id}
                    filterTreeNode={this.filterTreeNode}
                    treeCheckStrictly
                    className='_slslsl_box'
                    dropdownClassName='_slslsl'
                    onClick={this.addBtn}
                  >
                    {this.loopData(assetsList)}
                  </TreeSelect>
                )
              }
            </Form.Item>
            <Form.Item label="鑫支出对应类别">
              {
                getFieldDecorator('categoryId', {
                  initialValue: details.categoryId
                  ? { key: details.categoryId, value: details.categoryId, label: details.categoryName }
                  : undefined,
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
