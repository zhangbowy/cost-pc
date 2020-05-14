import React from 'react';
import { Modal, Form, Input, Divider, message, Row, Col, Tree } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { connect } from 'dva';
import { formItemLayout } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
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
}))
class AddAuth extends React.PureComponent {

  state = {
    visible: this.props.visible || false,
    treeData: [],
    selectedKeys: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
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

  showHandle = () => {
    this.props.dispatch({
      type: 'auth/menu',
      payload: {}
    }).then(() => {
      const { menuList } = this.props;
      console.log(menuList);
      const treeData = treeConvert({
        rootId: 0,
        pId: 'parentId',
        name: 'menuName',
        tId: 'id',
        tName: 'menuName',
      }, menuList);
      this.setState({
        treeData,
      });
      console.log(treeData);
      this.onCancel(true);
    });
  }

  onCancel = (visible) => {
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
      menuList,
    } = this.props;
    const { checkedKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const menus = [];
        if (checkedKeys.length > 0) {
          menuList.forEach(item => {
            if (checkedKeys.includes(item.id)) {
              menus.push({
                id: item.id,
                menuName: item.menuName
              });
            }
          });
        }
        const payload = { ...values, menus };
        let action = 'auth/add';
        if (data) {
          action = 'auth/edit';
          Object.assign(payload, {
            id: data.id,
          });
        }
        dispatch({
          type: action,
          payload,
        }).then(() => {
          message.success('操作成功');
          onOk();
        });
      }
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      console.log(item);
      if (item.children) {
        return (
          <TreeNode title={item.menuName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.menuName} {...item} />;
    });

  render() {
    const {
      children,
      data,
      title,
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { visible, treeData } = this.state;
    const myTitle = data ? `编辑${title}` : `添加${title}`;
    return (
      <span>
        <span onClick={() => this.showHandle()}>{ children }</span>
        <Modal
          title={myTitle}
          visible={visible}
          width="68%"
          onCancel={() => this.onCancel(false)}
          onOk={this.handleOk}
          confirmLoading={loading}
        >
          <div>
            <Form layout="inline">
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
                        <Input />
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
                        initialValue: data && data.roleName,
                      })(
                        <TextArea />
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
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </Modal>
      </span>
    );
  }
}

export default AddAuth;
