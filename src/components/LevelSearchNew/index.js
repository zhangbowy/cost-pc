import React, { Component } from 'react';
import { Form, Row, DatePicker, Select, TreeSelect, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import treeConvert from '@/utils/treeConvert';
import TreeSelectNew from '@/components/TreeSelectNew';
import { approveStatus } from '../../utils/constants';
import styles from './index.scss';
import UserSelector from '../Modals/SelectPeopleNew';

const { TreeNode } = TreeSelect;

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
      deptVOS: [],
      userVOS: [],
      createUserVOS: [],
      createDeptVOS: [],
      details: {},
      expandedKeys: []
    };
  }

  componentDidMount(){
    window.onclick = (e) => {
      const docs = document.getElementsByClassName(styles.model);
      const boxdocs = document.getElementsByClassName(styles.modelBox);
      let isFalse = true;
      console.log(1111,e);
      Array.prototype.forEach.call(docs, (item) => {
        if(e.path.indexOf(item) !== -1){
          isFalse = false;
        }
      });
      Array.prototype.forEach.call(boxdocs, (item) => {
        if(e.path.indexOf(item) !== -1){
          isFalse = false;
        }
      });
      if(isFalse){
        this.onCancel();
      }
    };
  }

  onShow = async () => {
    const { visible } = this.state;
    console.log(11111,visible);
    if(visible){
      this.setState({visible: false});
      return;
    }
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
        payload: {},
      }).then(() => {
        const { details } = this.props;
        if (details) {
          const {
            userVOS,
            deptVOS,
            createUserVOS,
            createDeptVOS,
          } = details;
          this.setState({
            userVOS,
            deptVOS,
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
      deptVOS,
      userVOS,
      createUserVOS,
      createDeptVOS,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const createTime = val.time;
        let payStartTime = '';
        let payEndTime = '';
        if (createTime && createTime.length > 0) {
          payStartTime = moment(createTime[0]).format('x');
          payEndTime = moment(createTime[1]).format('x');
        }
        // eslint-disable-next-line no-param-reassign
        if (val.time) delete val.time;
        const detail = {
          ...val,
          userVOS,
          deptVOS,
          createUserVOS,
          createDeptVOS,
          payEndTime,
          payStartTime,
        };
        this.onCancel();
        this.props.onOk(detail);
      }
    });
  }

  selectPle = (res, name, dep) => {
    console.log(this.state.visible);
    this.setState({visible: true});
    this.setState({
      [`${name}VOS`]: res.users || [],
      [`${dep}VOS`]: res.depts || [],
    });
    this.onSubmit();
  }

  onReset = () => {
    this.setState({
      deptVOS: [],
      userVOS: [],
      createUserVOS: [],
      createDeptVOS: [],
      details: {},
    });
    this.props.form.resetFields();
    this.onSubmit();
  }

  onCancel = () => {
    console.log(555555);
    this.setState({
      visible: false,
    });
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.value} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.value} {...item} />;
    });
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      // autoExpandParent: false,
    });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  onSearch = e => {
    const { invoiceList } = this.props;
    // const invList = treeConvert({
    //   rootId: 0,
    //   pId: 'parentId',
    //   name: 'name',
    //   tName: 'title',
    //   tId: 'value'
    // }, invoiceList);
    const { value } = e.target;
    const expandedKeys = invoiceList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, this.state.invList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      // searchValue: value,
      // autoExpandParent: true,
    });
  };

  render() {
    const {
      children,
      form: { getFieldDecorator },
      costCategoryList,
      invoiceList,
      projectList,
      supplierList,
    } = this.props;
    const {expandedKeys} = this.state;
    console.log(expandedKeys);
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
    console.log('lists',list);
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
    const { visible, userVOS, deptVOS, details } = this.state;
    return (
      <span>
        <span className={styles.modelBox} onClick={this.onShow}>{
            children || (
              <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle'}}>
                <div className={`${styles.iconBox } m-r-8 ${ visible?' active-bg':''}`}>
                  <Icon className="sub-color" type="filter" />
                </div>
                <span className="fs-14 sub-color">筛选</span>
              </div>
            )
          }
          <div className={styles.model} style={{display: (visible?'block':'none')}} onClick={(e)=> {e.stopPropagation();}} >
            <Form className="formItem">
              <Row>
                <Form.Item label="承担人/部门" {...formItemLayout}>
                  <UserSelector
                    users={userVOS}
                    depts={deptVOS}
                    isinput={false}
                    onChange={this.onChange}
                    placeholder={<div className="c-black-50 cur-p"><Icon className="fs-20 m-r-4 c-black-50" type="user-add" />待选择</div>}
                    onSelectPeople={(val) => this.selectPle(val, 'user', 'dept')}
                    invalid={false}
                    disabled={false}
                    flag="useApep"
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="付款时间" {...formItemLayout}>
                  {
                    getFieldDecorator('time', {
                      initialValue: details.payStartTime && details.payEndTime ?
                        [moment(moment(Number(details.payStartTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(details.payEndTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                        :
                        [],
                    })(
                      <RangePicker />
                    )
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="单据类型" {...formItemLayout}>
                  {
                    getFieldDecorator('invoiceTemplateIds', {
                      initialValue: details.invoiceTemplateIds || [],
                    })(
                      <TreeSelectNew onChange={this.onChange} treeData={invList}  />
                      // <TreeSelect
                      //   showSearch
                      //   style={{ width: '100%' }}
                      //   value={this.state.value}
                      //   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      //   treeData={invList}
                      //   placeholder="Please select"
                      //   allowClear
                      //   treeCheckable= {true}
                      //   treeDefaultExpandAll
                      //   onChange={this.onChange}
                      // >
                      // </TreeSelect>
                    )
                  }
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="审批状态" {...formItemLayout}>
                  {
                    getFieldDecorator('approveStatus', {
                      initialValue: details.approveStatus || '',
                    })(
                      <Select placeholder="请选择">
                        { approveStatus.map(item => (
                          <Option key={item.key}>{item.value}</Option>
                        )) }
                      </Select>
                    )
                  }
                </Form.Item>
              </Row>
              <Row>
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
                      />
                    )
                  }
                </Form.Item>
              </Row>
              <Row>
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
              </Row>
            </Form>
            <div className={`${styles.modelBottom} cur-p`} onClick={this.onReset} >
              <span className="iconfont iconshanchu fs-24 vt-m"  />
              清空所有筛选条件
            </div>
          </div>
          
          {/* <Modal
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
                <Col span={12}>
                  <Form.Item label="费用类别" {...formItemLayout}>
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
                <Col span={12}>
                  <Form.Item label="承担人/部门" {...formItemLayout}>
                    <UserSelector
                      users={userVOS}
                      depts={deptVOS}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val, 'user', 'dept')}
                      invalid={false}
                      disabled={false}
                      flag="useApep"
                    />
                  </Form.Item>
                </Col>
              </Row>
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
                  <Form.Item label="审批状态" {...formItemLayout}>
                    {
                      getFieldDecorator('approveStatus', {
                        initialValue: details.approveStatus || '',
                      })(
                        <Select placeholder="请选择">
                          { approveStatus.map(item => (
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
                  <Form.Item label="发放状态" {...formItemLayout}>
                    {
                      getFieldDecorator('status', {
                        initialValue: details.status || '',
                      })(
                        <Select placeholder="请选择">
                          { statusList.map(item => (
                            <Option key={item.key}>{item.value}</Option>
                          )) }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="付款时间" {...formItemLayout}>
                    {
                      getFieldDecorator('time', {
                        initialValue: details.payStartTime && details.payEndTime ?
                          [moment(moment(Number(details.payStartTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment(Number(details.payEndTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
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
          </Modal> */}
        </span>
      </span>
    );
  }
}

export default LevelSearch;
