import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button, TreeSelect, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeople';
import styles from './index.scss';

const { SHOW_CHILD, SHOW_ALL } = TreeSelect;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ global, costGlobal }) => ({
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: global.projectList,
  supplierList: global.supplierList,
  officeTree: costGlobal.officeTree,
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
      type: 'costGlobal/officeTree',
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
        console.log(val.costTime);
        if (val.costTime) {
          if (val.costTime.length > 1) {
            Object.assign(detail, {
              costTimeStart: moment(val.costTime[0]).format('x'),
              costTimeEnd: moment(val.costTime[1]).format('x'),
            });
          }
          delete detail.costTime;
        }
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
      officeTree,
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
    const officeList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'officeName',
      tName: 'title',
      tId: 'value'
    }, officeTree);
    const { visible, deptVos, details } = this.state;

    return (
      <span>
        <span onClick={this.onShow}>{children}</span>
        <Modal
          title="????????????"
          visible={visible}
          onCancel={this.onCancel}
          width="680px"
          bodyStyle={{ height: '373px', overflowY: 'scroll' }}
          footer={(
            <div className={styles.footerBtn}>
              <Button key="reset" onClick={() => this.onReset()}>??????</Button>
              <div>
                <Button key="cancel" onClick={() => this.onCancel()}>??????</Button>
                <Button type="primary" key="save" onClick={() => this.onSubmit()}>??????</Button>
              </div>
            </div>
          )}
        >
          <Form className="formItem">
            <Row>
              {
                type === 'project' &&
                <Col span={12}>
                  <Form.Item label="??????" {...formItemLayout}>
                    {
                      getFieldDecorator('projectIds', {
                        initialValue: details.projectIds || [],
                      })(
                        <TreeSelect
                          treeData={project}
                          placeholder="???????????????"
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
                  <Form.Item label="?????????" {...formItemLayout}>
                    {
                      getFieldDecorator('supplierIds', {
                        initialValue: details.supplierIds || [],
                      })(
                        <TreeSelect
                          showSearch
                          treeData={supplierList}
                          treeNodeFilterProp='title'
                          placeholder="??????????????????"
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
                type === 'branch' &&
                <Col span={12}>
                  <Form.Item label="?????????" {...formItemLayout}>
                    {
                      getFieldDecorator('officeIds', {
                        initialValue: details.officeIds || [],
                      })(
                        <TreeSelect
                          showSearch
                          treeData={officeList}
                          treeNodeFilterProp='title'
                          placeholder="??????????????????"
                          treeCheckable
                          style={{width: '100%'}}
                          showCheckedStrategy={SHOW_ALL}
                          dropdownStyle={{height: '300px'}}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
              }
              {
                type !== 'project' && type !== 'supplier' && type !== 'branch' &&
                <Col span={12}>
                  <Form.Item label="??????" {...formItemLayout}>
                    <UserSelector
                      depts={deptVos}
                      placeholder='?????????'
                      onSelectPeople={(val) => this.selectPle(val, 'dept')}
                      invalid={false}
                      disabled={false}
                      flag="dept"
                    />
                  </Form.Item>
                </Col>
              }
              <Col span={12}>
                <Form.Item label="????????????" {...formItemLayout}>
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
                        placeholder="?????????"
                        treeNodeFilterProp="title"
                      />
                    )
                  }
                </Form.Item>
              </Col>
              {
                type === 'classify' &&
                <Col span={12}>
                  <Form.Item label="????????????" {...formItemLayout}>
                    {
                      getFieldDecorator('costTime', {
                      initialValue: details.costTimeStart && details.costTimeEnd ?
                        [moment(moment(Number(details.costTimeStart)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                        moment(moment(Number(details.costTimeEnd)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                        :
                        [],
                    })(
                      <RangePicker
                        placeholder='???????????????'
                        format="YYYY-MM-DD"
                        style={{width: '100%'}}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                      />
                    )
                    }
                  </Form.Item>
                </Col>
              }
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default LevelSearch;
