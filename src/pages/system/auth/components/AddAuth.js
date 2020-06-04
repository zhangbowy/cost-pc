/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { Modal, Form, Input, Divider, message, Row, Col, Tree, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { connect } from 'dva';
import { formItemLayout } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
import { choosePeople, ddDepartmentsPicker } from '@/utils/ddApi';
import style from './index.scss';

const labelInfo = {
  roleName: '角色名称',
  note: '备注'
};
const { TreeNode } = Tree;
@Form.create()
@connect(({ loading, auth }) => ({
  loading: loading.effects['account/add'] || false,
  menuList: auth.menuList,
  detailRoleList: auth.detailRoleList,
  rolePurviewDataVos: auth.rolePurviewDataVos
}))
class AddAuth extends Component {

  state = {
    visible: this.props.visible || false,
    treeData: [],
    selectedKeys: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    dataRole: [],
    checkKeys: {},
    dep: {},
  };

  static defaultProps = {
    title: '',
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys) => {
    this.setState({ selectedKeys });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onRest = () => {
    this.props.form.resetFields();
  }

  showHandle = () => {
    const {
      data,
      dispatch
    } = this.props;
    const { checkKeys } = this.state;
    dispatch({
      type: 'auth/detail',
      payload: {
        id: (data && data.id) || '',
      }
    }).then(() => {
      const detailList = this.props.detailRoleList || [];
      const roleData = this.props.rolePurviewDataVos || [];
      const checkedKeys = [];
      detailList.forEach(item => {
        if (item.isSelect) {
          checkedKeys.push(item.id);
        }
      });
      const check = checkKeys;
      roleData.forEach(item => {
        Object.assign(check, {
          [item.invoiceId]: ['4'],
        });
        item.purviewDataVos.forEach(it => {
          if (it.isSelect) {
            check[item.invoiceId].push(`${item.invoiceId}_${it.type}`);
          }
        });
      });
      this.setState({
        visible: true,
        checkedKeys,
        checkKeys: check,
        dataRole: roleData,
        treeData: treeConvert({
          rootId: 0,
          pId: 'parentId',
          tName: 'menuName',
          name: 'menuName'
        }, detailList),
      });
    });
  }

  onCancel = (visible) => {
    this.onRest();
    this.setState({
      visible,
    });
  }

  handleOk = () => {
    const {
      data,
      form,
      onOk,
      dispatch,
      detailRoleList,
    } = this.props;
    const { checkedKeys, checkKeys, dep } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const menus = [];
        const rolePurviewDataVOS = []; // 数据权限
        if (checkedKeys.length > 0) {
          detailRoleList.forEach(item => {
            if (checkedKeys.includes(item.id)) {
              menus.push({
                id: item.id,
                menuName: item.menuName
              });
            }
          });
        }
        for(const iKey in checkKeys) {
          let arr = {};
          if (checkKeys[iKey].includes(`${iKey}_0`) || checkKeys[iKey].includes(`${iKey}_1`)) {
            arr = {
              invoiceId: iKey,
              purviewDataVos: [],
            };
            if (dep[iKey]) {
              arr.purviewDataVos.push({
                type: 0,
                deptJson: JSON.stringify(dep[iKey])
              });
            }
            if (checkKeys[iKey].includes(`${iKey}_1`)) {
              arr.purviewDataVos.push({
                type: 1,
              });
            }
            rolePurviewDataVOS.push(arr);
          }
        }
        const payload = { ...values, menus, rolePurviewDataVOS };
        let action = 'auth/add';
        let cont = '新增成功';
        if (data) {
          action = 'auth/edit';
          cont = '编辑成功';
          Object.assign(payload, {
            id: data.id,
          });
        }
        dispatch({
          type: action,
          payload,
        }).then(() => {
          message.success(cont);
          onOk();
          this.onCancel();
        });
      }
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.menuName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.menuName} {...item} />;
    });

  onChecks = (e, code) => {
    const { checkKeys, dep } = this.state;
    const checkKey = checkKeys;
    const depJson = dep;
    if (e.target.value === `${code}_0`) {
      if (e.target.checked) {
        ddDepartmentsPicker({
          departments: depJson[code] && depJson[code].map(it => it.deptId),
        }, res => {
          const arr = [];
          if (res.departments) {
            res.departments.forEach(it => {
              arr.push({
                deptId: it.id,
                name: it.name,
                number:it.number,
              });
            });
          }
          depJson[code] = arr;
        });
      } else {
        delete depJson[code];
      }
    }

    if (e.target.checked) {
      checkKey[code] = [...checkKey[code], e.target.value];
    } else {
      const index = checkKey[code].indexOf(e.target.value);
      checkKey[code].splice(index, 1);
    }
    this.setState({
      checkKeys: checkKey,
    });
  }

  render() {
    const {
      children,
      data,
      title,
      form: { getFieldDecorator },
      loading,
      isSupperAdmin,
    } = this.props;
    const { visible, treeData, dataRole, checkKeys } = this.state;
    const myTitle = data ? `编辑${title}` : `添加${title}`;
    return (
      <span>
        <span onClick={() => this.showHandle()}>{ children }</span>
        <Modal
          title={myTitle}
          visible={visible}
          width="980px"
          height="550px"
          bodyStyle={{
            height: '550px',
            overflowY: 'scroll'
          }}
          onCancel={() => this.onCancel(false)}
          onOk={this.handleOk}
          confirmLoading={loading}
        >
          <div>
            <Form layout="inline" className="formItem">
              <Row>
                <Col span={10}>
                  <Form.Item
                    style={{ width: '100%' }}
                    label={labelInfo.roleName}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('roleName', {
                        initialValue: data && data.roleName,
                      })(
                        <Input placeholder="请输入" disabled={isSupperAdmin} />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item
                    label={labelInfo.note}
                    style={{ width: '100%' }}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('note', {
                        initialValue: data && data.note,
                      })(
                        <TextArea placeholder="请输入" disabled={isSupperAdmin} />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Divider />
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span>操作权限</span>
            </div>
          </div>
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            selectedKeys={this.state.selectedKeys}
            autoExpandParent={this.state.autoExpandParent}
            disabled={isSupperAdmin}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span>数据权限</span>
            </div>
          </div>
          {
            dataRole.map(item => (
              <div key={item.invoiceId} style={{display: 'flex'}}>
                <p>{item.invoiceName}：</p>
                <Checkbox.Group value={checkKeys[item.invoiceId]} disabled={isSupperAdmin}>
                  <Checkbox value="4" checked>我负责的</Checkbox>
                  {
                    item.purviewDataVos.map(it => (
                      <Checkbox
                        key={it.type}
                        value={`${item.invoiceId}_${it.type}`}
                        onClick={e => this.onChecks(e, item.invoiceId, item.type)}
                      >
                        {it.purviewDataName}
                      </Checkbox>
                    ))
                  }
                </Checkbox.Group>
              </div>
            ))
          }
        </Modal>
      </span>
    );
  }
}

export default AddAuth;
