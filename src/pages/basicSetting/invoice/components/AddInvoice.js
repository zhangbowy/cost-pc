import React from 'react';
import { Modal, Button, message } from 'antd';
import constants, { defaultTitle, costCategoryJson } from '@/utils/constants';
import cs from 'classnames';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import { JsonParse } from '@/utils/common';
import styles from './classify.scss';
import Basic from './Basic';
import Field from './Field';

@connect(({ global, session, invoice }) => ({
  costCategoryList: global.costCategoryList,
  userInfo: session.userInfo,
  allList: invoice.allList,
  detail: invoice.detail,
  approveList: invoice.approveList,
}))
class AddInvoice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      left: 'basic',
      categoryList: [],
      data: {
        showFields: costCategoryJson,
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
    const { userInfo, dispatch, data, title } = this.props;
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
              Object.assign(datas, {
                showFields: JsonParse(detail.showField),
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
          Object.assign(data, {
            showFields: costCategoryJson,
          });
          this.setState({
            visible: true,
          });
        }
      });
    });
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
        showFields: [...values],
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
      const values = this.saveFormRef.getFormItem();
      if(!values) {
        return;
      }
      Object.assign(datas, {
        showFields: [...values],
      });
    }
    Object.assign(datas, {
      showField: JSON.stringify(datas.showFields),
      companyId: userInfo.companyId || '',
      type: 1,
      useJson: !datas.isAllUse && JSON.stringify(datas.userJson),
      deptJson: !datas.isAllUse &&
                JSON.stringify(datas.deptJson),
    });
    if (datas.showFields) delete datas.showFields;
    dispatch({
      type: url,
      payload: {
        ...datas,
      }
    }).then(() => {
      this.onReset();
      this.setState({
        visible: false,
      });
      onOk();
      message.success(`${defaultTitle[title]}单据成功`);
    });
  }

  render() {
    const { children, title, allList, approveList } = this.props;
    const { visible, left, categoryList, data } = this.state;
    return (
      <span className={styles.content}>
        <span onClick={() => this.show()}>{ children }</span>
        <Modal
          title={title && `${defaultTitle[title]}单据`}
          visible={visible}
          key="addInvoice"
          bodyStyle={{
            padding: 0,
            height: '442px',
            overflowY: 'scroll'
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
                constants.classify.map(item => (
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
                  wrappedComponentRef={form => {this.formRef = form;}}
                  costCategoryList={categoryList}
                  list={allList}
                  data={data}
                  category={data.costCategory}
                  approveList={approveList}
                />
              :
                <Field
                  wrappedComponentRef={form => {this.saveFormRef = form;}}
                  showFields={data.showFields}
                />
            }
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddInvoice;
