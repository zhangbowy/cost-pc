import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button, DatePicker, Select, TreeSelect } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import UserSelector from '@/components/Modals/SelectPeople';
import { newInvoiceStatus, newLoanStatus, newApplyStatus } from '../../../../utils/constants';
// import styles from './index.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;
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
      createUserVOS: [],
      createDeptVOS: [],
      details: {},
    };
  }

  onShow = async () => {
    const { templateType } = this.props;
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
          templateType,
        },
      }).then(() => {
        const { details } = this.props;
        if (details) {
          const {
            createUserVOS,
            createDeptVOS,
          } = details;
          this.setState({
            createUserVOS,
            createDeptVOS,
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
      createUserVOS,
      createDeptVOS,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const createTime = val.time;
        let startTime = '';
        let endTime = '';
        if (createTime && createTime.length > 0) {
          startTime = moment(moment(createTime[0]).format('YYYY-MM-DD 00:00:00')).format('x');
          endTime = moment(moment(createTime[1]).format('YYYY-MM-DD 23:59:59')).format('x');
        }
        // eslint-disable-next-line no-param-reassign
        if (val.time) delete val.time;
        const detail = {
          ...val,
          createUserVOS,
          createDeptVOS,
          endTime,
          startTime,
        };
        this.onCancel();
        this.props.onOk(detail);
      }
    });
  }

  selectPle = (res, name, dep) => {
    this.setState({
      [`${name}VOS`]: res.users || [],
      [`${dep}VOS`]: res.depts || [],
    });
  }

  onReset = () => {
    this.setState({
      createUserVOS: [],
      createDeptVOS: [],
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

  render() {
    const {
      children,
      form: { getFieldDecorator },
      invoiceList,
      projectList,
      supplierList,
      templateType
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
    const invList = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'name',
      tName: 'title',
      tId: 'value'
    }, invoiceList);
    const project = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'name',
      tName: 'title',
      tId: 'value'
    }, projectList);
    const { visible, createUserVOS, createDeptVOS, details } = this.state;
    let selectList = newInvoiceStatus;
    if (templateType === 1) {
      selectList = newLoanStatus;
    } else if (templateType === 2) {
      selectList = newApplyStatus;
    }
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <Col span={12}>
                <Form.Item label="提交人/部门" {...formItemLayout}>
                  <UserSelector
                    users={createUserVOS}
                    depts={createDeptVOS}
                    placeholder='请选择'
                    onSelectPeople={(val) => this.selectPle(val, 'createUser', 'createDept')}
                    invalid={[]}
                    disabled={false}
                    flag="useApep"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="单据状态" {...formItemLayout}>
                  {
                    getFieldDecorator('status', {
                      initialValue: details.status || '',
                    })(
                      <Select placeholder="请选择">
                        { selectList.map(item => (
                          <Option key={item.key}>{item.value}</Option>
                        )) }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="提交时间" {...formItemLayout}>
                  {
                    getFieldDecorator('time', {
                      initialValue: details.startTime && details.endTime ?
                        [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                        :
                        [],
                    })(
                      <RangePicker />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="单据类型" {...formItemLayout}>
                  {
                    getFieldDecorator('invoiceTemplateIds', {
                      initialValue: details.invoiceTemplateIds || [],
                    })(
                      <TreeSelect
                        showSearch={false}
                        treeData={invList}
                        treeCheckable
                        style={{width: '100%'}}
                        showCheckedStrategy={SHOW_CHILD}
                        dropdownStyle={{height: '300px'}}
                        placeholder="请选择"
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="项目名称" {...formItemLayout}>
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
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="供应商" {...formItemLayout}>
                  {
                    getFieldDecorator('supplierIds', {
                      initialValue: details.supplierIds || [],
                    })(
                      <TreeSelect
                        treeData={supplierList}
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
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default LevelSearch;
