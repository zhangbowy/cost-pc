import React from 'react';
import { Modal, Button, message } from 'antd';
import constants, { defaultTitle, costCategoryJson, templateTypeList } from '@/utils/constants';
import cs from 'classnames';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import { JsonParse } from '@/utils/common';
import styles from './classify.scss';
import Basic from './Basic';
import Field from './Field';
import { borrowJson } from '../../../../utils/constants';

@connect(({ global, session, invoice }) => ({
  costCategoryList: global.costCategoryList,
  userInfo: session.userInfo,
  allList: invoice.allList,
  detail: invoice.detail,
  approveList: invoice.approveList,
  checkDel: invoice.checkDel,
  expandLists: invoice.expandLists,
}))
class AddInvoice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      left: 'basic',
      categoryList: [],

      data: {
        showFields: Number(props.templateType) ? borrowJson : costCategoryJson,
        expandField: []
      }
    };
  }

  onReset() {
    if (this.formRef && this.formRef.onRest) {
      this.formRef.onRest();
    }
    if (this.saveFormRef && this.saveFormRef.onRest) {
      this.saveFormRef.onRest();
    }
  }

   show = () => {
    const { userInfo, dispatch, data, title, templateType, changeVisible } = this.props;
    dispatch({
      type: 'global/costList',
      payload: {
        companyId: userInfo.companyId,
      }
    }).then(() => {
      this.props.dispatch({
        type: 'invoice/allList',
        payload: {}
      }).then(() => {
        const { costCategoryList } = this.props;
        const lists = costCategoryList;
        const list = treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: 'costName',
          tName: 'label',
          tId: 'value'
        }, lists);
        this.setState({
          categoryList: list,
          data,
        });
        if (title !== 'add') {
          dispatch({
            type: 'invoice/detail',
            payload: {
              id: data.id,
              type: 1,
              templateType,
            }
          }).then(() => {
            const { detail } = this.props;
            const datas = {...data};
            let costCategory = [];
            let userJson = [];
            let deptJson = [];
            if (detail.costCategoryJson) {
              costCategory = JsonParse(detail.costCategoryJson).map(it => it.id);
            }
            if (detail.useJson) {
              userJson = JsonParse(detail.useJson);
            }
            if (detail.deptJson) {
              deptJson = JsonParse(detail.deptJson);
            }
            if (detail.showField) {
              const arr = JsonParse(detail.showField);
              if (detail.expandField) {
                const oldArr = [...detail.expandField];
                oldArr.unshift(4,0);
                Array.prototype.splice.apply(arr, oldArr);
              }
              Object.assign(datas, {
                showFields: arr,
              });
            }
            Object.assign(datas, {
              ...detail,
              costCategory,
              userJson,
              deptJson,
              sttaus: detail.status === 1,
            });
            if (title === 'copy') {
              Object.assign(datas, {
                name: `${detail.name}的副本`,
              });
            }
            this.setState({
              data: datas,
              visible: true,
            });
          });
        } else {
          this.props.dispatch({
            type: 'invoice/expandLists',
            payload: {
              templateType
            },
          }).then(() => {
            const { expandLists } = this.props;
            const showDefault = templateType && Number(templateType) ? [...borrowJson] : [...costCategoryJson];
            if (expandLists && expandLists.length > 0) {
              const oldArr = [...expandLists];
              oldArr.unshift(2,0);
              Array.prototype.splice.apply(showDefault, oldArr);
            }
            Object.assign(data, {
              showFields: showDefault,
              expandField: expandLists,
            });
            this.setState({
              visible: true,
            });
            changeVisible();
          });
        }
      });
    });
  }

  ObjToArray = (oldJson, newArr) => {
    const arr = (oldJson && JsonParse(oldJson)) || [];
    let resultArr = [];
    if (arr && arr.length > 0) {
      const obj = {};
      arr.forEach(item => {
        obj[item.field] = item;
      });
      newArr.forEach(item => {
        if (item.field) {
          resultArr.push({
            ...item,
            ...obj[item.field],
          });
        }
      });
    } else {
      resultArr = newArr;
    }
    console.log(resultArr);
    return resultArr;
  }

  onCancel = () => {
    this.onReset();
    this.setState({
      data: {},
      visible: false,
      left: 'basic',
    });
  }

  setLeft = (left) => {
    const { data } = this.state;
    const datas = {...data};
    if (this.formRef && this.formRef.getFormItem) {
      const values = this.formRef.getFormItem();
      if(!values) {
        return;
      }
      Object.assign(datas, {
        ...values,
        status: values.status ? 1 : 0,
      });
    }
    if (this.saveFormRef && this.saveFormRef.getFormItem) {
      const values = this.saveFormRef.getFormItem();
      Object.assign(datas, {
        showFields: values.list,
        expandField: values.expandField,
      });
    }
    this.setState({
      left,
      data: datas,
    });
  }

  onSubmit = () => {
    const { data } = this.state;
    const datas = {...data};
    const {
      dispatch,
      userInfo,
      onOk,
      title,
      templateType,
    } = this.props;
    const url = title === 'edit' ? 'invoice/edit' : 'invoice/add';
    if (this.formRef && this.formRef.getFormItem) {
      const values = this.formRef.getFormItem();
      if(!values) {
        return;
      }
      Object.assign(datas, {
        ...values,
        status: values.status ? 1 : 0,
      });
    }
    if (this.saveFormRef && this.saveFormRef.getFormItem) {
      const fieldVal = this.saveFormRef.getFormItem();
      if(!fieldVal) {
        return;
      }
      let expandArr = [];
      if (fieldVal.expandField) {
        expandArr = fieldVal.expandField.map(it => {
          return {
            ...it,
            status: it.status ? 1 : 0,
          };
        });
      }
      Object.assign(datas, {
        showFields: fieldVal.list.filter(it => it.field.indexOf('expand_field') === -1),
        expandField: expandArr,
      });
    }
    Object.assign(datas, {
      showField: JSON.stringify(datas.showFields),
      companyId: userInfo.companyId || '',
      type: 1,
      useJson: !datas.isAllUse && datas.userJson ? JSON.stringify(datas.userJson) : '',
      deptJson: !datas.isAllUse && datas.deptJson ?
                JSON.stringify(datas.deptJson) : '',
    });
    if (datas.showFields) delete datas.showFields;
    dispatch({
      type: url,
      payload: {
        ...datas,
        templateType,
      }
    }).then(() => {
      this.onReset();
      this.setState({
        visible: false,
      });
      onOk();
      message.success(`${defaultTitle[title]}${templateTypeList[templateType]}据模板成功`);
    });
  }

  render() {
    const { children, title, allList, approveList, checkDel, dispatch, templateType } = this.props;
    const { visible, left, categoryList, data } = this.state;
    return (
      <span className={styles.content}>
        <span onClick={() => this.show()}>{ children }</span>
        <Modal
          title={title && `${defaultTitle[title]}${templateTypeList[templateType]}据模板`}
          visible={visible}
          key="addInvoice"
          bodyStyle={{
            padding: 0,
            height: '442px',
          }}
          width='780px'
          onCancel={this.onCancel}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>保存</Button>
          ]}
        >
          <div className={styles.classify}>
            <div className={styles.lefts}>
              {
                constants.classify.slice(0,2).map(item => (
                  <div
                    className={left === item.key ? cs(styles.leftTl, styles.active) : styles.leftTl}
                    key={item.key}
                    onClick={() => this.setLeft(item.key)}
                  >
                    {item.value}
                  </div>
                ))
              }
            </div>
            {
              left === 'basic' ?
                <Basic
                  {...this.props}
                  wrappedComponentRef={form => {this.formRef = form;}}
                  costCategoryList={categoryList}
                  list={allList}
                  data={data}
                  category={data.costCategory}
                  approveList={approveList}
                  templateType={templateType}
                  dispatch={dispatch}
                />
              :
                <Field
                  checkDel={checkDel}
                  dispatch={dispatch}
                  wrappedComponentRef={form => {this.saveFormRef = form;}}
                  // viewShowModal={fn => this.saveFormRef(fn)}
                  showFields={data.showFields}
                  expandField={data.expandField}
                />
            }
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddInvoice;
