/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import { Form, Modal, Select, Tooltip, Tree, TreeSelect } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { PureComponent } from 'react';
import CostTreeSelect from '../../../../components/FormItems/CostTreeSelect';
import ModalTemp from '../../../../components/ModalTemp';
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
  }

  onShow = async() => {
    const { lists } = await this.props.getAssets();
    const { list } = this.props;
    // const ids = this.lookForAllId(tree);
    this.setState({
      assetsList: lists,
      visible: true,
      listIds: list.map(it => it.humanCapitalId),
      list: lists,
    });
  }

  onOk = () => {
    const { list } = this.state;
    const { details, onOk } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let params = {};
        if(details.id) {
          params = {
            ...details,
            note: val.note,
            categoryId: val.categoryId.value,
            categoryName: val.categoryId.label,
          };
        } else {
          params={
            ...val,
            categoryId: val.categoryId.value,
            categoryName: val.categoryId.label,
          };
        }
        onOk(params);
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
    console.log('🚀 ~ file: AddAssets.js ~ line 128 ~ AddAssets ~ render ~ costList', costList);
    const { visible, assetsList, listIds } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <ModalTemp
          title="新增类目映射"
          visible={visible}
          closeIcon={(
            <div className="modalIcon">
              <i className="iconfont icona-guanbi3x1" />
            </div>
          )}
          onCancel={() => this.onCancel()}
          onOk={this.onOk}
          size="small"
        >
          <Form layout="vertical" className={style.formLabel}>
            <Form.Item label="智能薪酬">
              {
                getFieldDecorator('humanCapitalIds', {
                  initialValue: details.humanCapitalId
                    ? [details.humanCapitalId]
                    : undefined,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <Select style={{width: '248px'}} placeholder="请选择" disabled={details.humanCapitalId} mode="multiple">
                    {
                      assetsList.map(it => (
                        <Select.Option disabled={listIds.includes(it.id)} key={it.id}>{it.name}</Select.Option>
                      ))
                    }
                  </Select>
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
                  <TextArea placeholder="请输入" rows={4} maxLength={128} style={{width: '516px'}} />
                )
              }
            </Form.Item>
          </Form>
        </ModalTemp>
      </span>
    );
  }
}

export default AddAssets;
