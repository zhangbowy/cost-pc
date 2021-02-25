import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button, TreeSelect } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeople';
import styles from './index.scss';

const { SHOW_CHILD } = TreeSelect;
@Form.create()
@connect(({ global }) => ({
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: global.projectList,
  supplierList: global.supplierList,
}))
class LevelSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      deptVos: [],
      details: {},
    };
  }

  onShow = async () => {
    await this.props.dispatch({
      type: 'global/projectList',
      payload: {}
    });
    await this.props.dispatch({
      type: 'global/supplierList',
      payload: {}
    });
    await this.props.dispatch({
      type: 'global/costList',
      payload: {},
    }).then(() => {
      this.props.dispatch({
        type: 'global/invoiceList',
        payload: {
          templateType: 0
        },
      }).then(() => {
        const { details } = this.props;
        if (details) {
          const {
            deptVos,
          } = details;
          this.setState({
            deptVos: deptVos || [],
            details,
          });
        }
        this.setState({
          visible: true,
        });
      });
    });
  }

  onSubmit = () => {
    const {
      deptVos,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        if (val.time) delete val.time;
        const detail = {
          ...val,
          deptVos,
        };
        this.onCancel();
        this.props.onOk(detail);
      }
    });
  }

  selectPle = (res, dep) => {
    this.setState({
      [`${dep}Vos`]: res.depts || [],
    });
  }

  onReset = () => {
    this.setState({
      deptVos: [],
      details: {},
    });
    this.props.form.resetFields();
  }

  onCancel = () => {
    this.onReset();
    this.setState({
      visible: false,
    });
  }

  // treeNodeRender = () => {

  //   const { treeNode } = this.state;

  //   if(!treeNode || !treeNode.length){
  //     return;
  //   }

  //   return treeNode.map((v, i) => {
  //     return (
  //       <TreeNode

  //         value={v.medicalInstitutionId}
  //         title={v.medicalInstitutionSimpleCode}
  //         key={i}
  //       >
  //         {v.children && this.treeNodeChildRender(v.children)}
  //       </TreeNode>
  //     );
  //   });
  // }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      costCategoryList,
      projectList,
      supplierList,
      type,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const lists = costCategoryList;
    const list = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, lists);
    const project = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'name',
      tName: 'title',
      tId: 'value'
    }, projectList);
    console.log(supplierList);
    const { visible, deptVos, details } = this.state;
    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title="高级搜索"
          visible={visible}
          onCancel={this.onCancel}
          width="680px"
          bodyStyle={{ height: '373px', overflowY: 'scroll' }}
          footer={(
            <div className={styles.footerBtn}>
              <Button key="reset" onClick={() => this.onReset()}>重置</Button>
              <div>
                <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>
                <Button type="primary" key="save" onClick={() => this.onSubmit()}>确定</Button>
              </div>
            </div>
          )}
        >
          <Form className="formItem">
            <Row>
              {
                type === 'project' &&
                <Col span={12}>
                  <Form.Item label="项目" {...formItemLayout}>
                    {
                      getFieldDecorator('projectIds', {
                        initialValue: details.projectIds || [],
                      })(
                        <TreeSelect
                          treeData={project}
                          placeholder="请选择项目"
                          treeCheckable
                          style={{width: '100%'}}
                          showCheckedStrategy={SHOW_CHILD}
                          dropdownStyle={{height: '300px'}}
                          showSearch
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
              }
              {
                type === 'supplier' &&
                <Col span={12}>
                  <Form.Item label="供应商" {...formItemLayout}>
                    {
                      getFieldDecorator('supplierIds', {
                        initialValue: details.supplierIds || [],
                      })(
                        <TreeSelect
                          showSearch
                          treeData={supplierList}
                          treeNodeFilterProp='title'
                          placeholder="请选择供应商"
                          treeCheckable
                          style={{width: '100%'}}
                          showCheckedStrategy={SHOW_CHILD}
                          dropdownStyle={{height: '300px'}}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
              }
              {
                type !== 'project' && type !== 'supplier' &&
                <Col span={12}>
                  <Form.Item label="部门" {...formItemLayout}>
                    <UserSelector
                      depts={deptVos}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val, 'dept')}
                      invalid={false}
                      disabled={false}
                      flag="dept"
                    />
                  </Form.Item>
                </Col>
              }
              <Col span={12}>
                <Form.Item label="支出类别" {...formItemLayout}>
                  {
                    getFieldDecorator('categoryIds', {
                      initialValue: details.categoryIds || [],
                    })(
                      <TreeSelect
                        showSearch
                        // onChange={(value, label, extra) => this.onChangeTree(value, label, extra)}
                        treeData={list}
                        treeCheckable
                        style={{width: '100%'}}
                        showCheckedStrategy={SHOW_CHILD}
                        dropdownStyle={{height: '300px'}}
                        placeholder="请选择"
                        treeNodeFilterProp="title"
                      />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default LevelSearch;
