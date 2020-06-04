import React from 'react';
import { Modal, Button, message } from 'antd';
import constants, { defaultTitle, costClassify } from '@/utils/constants';
import cs from 'classnames';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import { JsonParse } from '@/utils/common';
import styles from './classify.scss';
import Basic from './Basic';
import Field from './Field';

@connect(({ loading, session, costCategory }) => ({
  loading: loading.effects['costCategory/add'] || loading.effects['costCategory/edit'],
  userInfo: session.userInfo,
  details: costCategory.details,
  allList: costCategory.allList,
}))
class AddClassify extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      left: 'basic',
      data: {},
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

  show = async() => {
    await this.props.dispatch({
      type: 'costCategory/allList',
      payload: {}
    });
    const { data, userInfo, allList, title } = this.props;
    let datas = {...data};
    const _this = this;
    if (title === 'add') {
      Object.assign(datas, {
        showFields: costClassify,
      });
      this.setState({
        visible: true,
        data: datas,
      });
    } else {
      const lists = treeConvert({
        rootId: 0,
        pId: 'parentId',
        tName: 'costName',
        name: 'costName',
        otherKeys: ['icon', 'note', 'type']
      }, allList);
      this.props.dispatch({
        type: 'costCategory/detail',
        payload: {
          id: data.id,
          companyId: userInfo.companyId || ''
        }
      }).then(() => {
        const { details } = _this.props;
        console.log(details.status);
        datas = {
          ...details,
          parentId: _this.findIndexArray(lists, details.parentId, []),
          showFields: (details.showField && JsonParse(details.showField)) || [],
          status: Number(details.status) === 1,
        };
        if (title === 'copy') {
          Object.assign(datas, {
            costName: `${details.costName}的副本`
          });
        }
        _this.setState({
          visible: true,
          data: datas,
        });
      });
    }
  }

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

  onCancel = () => {
    this.onReset();
    this.setState({
      visible: false,
      left: 'basic',
    });
  }

  setLeft = (left) => {
    const { data } = this.state;
    const datas = {...data};
    if (left !== 'basic') {
      if (this.formRef && this.formRef.getFormItems) {
        const values = this.formRef.getFormItems();
        console.log(values);
        if (!values) {
          return;
        }
        Object.assign(datas, {
          ...values,
        });
      }
    } else if (this.saveFormRef && this.saveFormRef.getFormItem) {
      const values = this.saveFormRef.getFormItem();
      if (!values) {
        return;
      }
      Object.assign(datas, {
        showFields: [...values],
      });
    }
    this.setState({
      left,
      data: datas,
    });
  }

  onSave = e => {
    e.preventDefault();
    const { data } = this.state;
    const datas = {...data};
    const {
      dispatch,
      userInfo,
      onOk,
      title,
    } = this.props;
    const url = title === 'edit' ? 'costCategory/edit' : 'costCategory/add';
    if (this.formRef && this.formRef.getFormItems) {
      const values = this.formRef.getFormItems();
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
      parentId: (datas.parentId && datas.parentId[datas.parentId.length-1]) || '',
      status: datas.status ? 1: 0,
    });
    if (datas.showFields) delete datas.showFields;
    dispatch({
      type: url,
      payload: {
        ...datas,
      }
    }).then(() => {
      onOk();
      message.success(`${defaultTitle[title]}费用类别成功`);
      this.onCancel();
    });
  }

  render() {
    const {
      children,
      title,
      allList
    } = this.props;
    const {
      visible,
      left,
      data,
    } = this.state;
    return (
      <span className={styles.content}>
        <span onClick={() => this.show()}>{ children }</span>
        <Modal
          title={title && `${defaultTitle[title]}费用类别`}
          visible={visible}
          key="addInvoice"
          bodyStyle={{
            padding: 0,
            height: '550px',
            overflowY: 'scroll'
          }}
          width='780px'
          onCancel={() => this.onCancel()}
          onOk={e => this.onSave(e)}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="saves" type="primary" onClick={e => this.onSave(e)}>保存</Button>
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
                  list={allList}
                  data={data}
                  title={title}
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

export default AddClassify;
