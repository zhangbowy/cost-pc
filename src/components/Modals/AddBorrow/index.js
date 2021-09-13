/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Icon, Select, message, TreeSelect, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import fileIcon from '@/utils/fileIcon.js';
import style from './index.scss';
import UploadImg from '../../UploadImg';
import SelectPeople from '../SelectPeople';
import { fileUpload, previewFile } from '../../../utils/ddApi';
import ApproveNode from '../ApproveNode';

const {Option} = Select;
const { TreeNode } = TreeSelect;
const labelInfo = {
  userId: '借款人',
  deptId: '借款部门',
  reason: '借款事由',
  loanSum:'借款金额',
  repaymentTime:'预计还款日期',
  note: '单据备注',
  project: '项目',
  supplier: '供应商/账户',
  imgUrl: '图片',
  fileUrl: '附件',
  receiptId: '收款账户',
};

@connect(({ session, global, loading }) => ({
  userInfo: session.userInfo,
  deptInfo: global.deptInfo,
  receiptAcc: global.receiptAcc,
  djDetail: global.djDetail,
  uploadSpace: global.uploadSpace,
  nodes: global.nodes,
  userId: global.userId,
  usableSupplier: global.usableSupplier,
  usableProject: global.usableProject,
  loading: loading.effects['global/addLoan'] || false,
}))
@Form.create()
class AddInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgUrl: [],
      depList: [], // 所在部门
      // createDepList: [], // 报销部门
      accountList: [], // 收款账户
      details: {}, // 详情
      inDetails: {},
      users: [],
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      total: 0,
      loanUserId: '', // 审批人的userId
      expandField: [], // 扩展字段
      loanSum:''
      // loading: false,
    };
  }

  onShowHandle = async() => {
    let detail = this.state.details;
    const { id, userInfo, templateType } = this.props;
    const _this = this;
    const userJson = [{
      userName: userInfo.name,
      userId: userInfo.dingUserId,
      avatar: userInfo.avatar,
      name: userInfo.name,
    }];
    await this.props.dispatch({
      type: 'global/users',
      payload: {
        userJson: JSON.stringify(userJson),
      }
    });
    const create = await _this.props.deptInfo;
    await this.setState({
      depList: create,
      users: userJson,
      loanUserId: userInfo.dingUserId,
    });
    if (create && create.length > 0) {
      this.props.form.setFieldsValue({
        deptId: `${create[0].deptId}`,
      });
      detail = await {
        ...detail,
        userId: this.props.userId,
        userName: userInfo.name,
        deptId: create[0].deptId,
        loanUserId: userInfo.dingUserId,
        loanDeptId: create[0].deptId,
        createDingUserId: userInfo.dingUserId,
      };
    } else {
      message.error('部门无法同步，请联系管理员检查应用可见范围设置');
    }

    await this.props.dispatch({
      type: 'global/users',
      payload: {}
    });
    const dep = await _this.props.deptInfo;
    if (dep && dep.length > 0) {
      detail = {
        ...detail,
        createDeptId: `${dep[0].deptId}`,
        createDepName: dep[0].name,
      };
    }
    // this.setState({
    //   createDepList: dep
    // });
    await this.props.dispatch({
      type: 'global/djDetail',
      payload: {
        id,
        type: 1,
        templateType
      }
    });
    const djDetails = await this.props.djDetail;
    console.log('detail=====',djDetails);
    const obj = {};
    if (djDetails.showField && djDetails.showField.length > 5) {
      JSON.parse(djDetails.showField).forEach(item => {
        obj[item.field] = {...item};
      });
    }
    this.setState({
      inDetails: djDetails,
      showField: obj,
      expandField: djDetails.expandField,
    });
    await this.props.dispatch({
      type: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    });
    const account = await _this.props.receiptAcc;
    const arr = account.filter(it => it.isDefault);

    if (arr && arr.length > 0) {
      detail = {
        ...detail,
        receiptId: arr[0].id,
        receiptName: arr[0].name,
        receiptNameJson: JSON.stringify(arr),
      };
    }
    const params = {
      creatorDeptId: detail.createDeptId || '',
      processPersonId: djDetails.approveId,
      loanUserId: detail.loanUserId,
      loanDeptId: detail.loanDeptId,
      createDingUserId: detail.createDingUserId,
    };
    this.getNode(params);
    this.setState({
      accountList: account,
      details: {
        ...detail,
        processPersonId: djDetails.approveId
      },
    });
    this.setState({
      visible: true
    });
    this.props.dispatch({
      type: 'global/usableSupplier',
      payload: {},
    });
    this.props.dispatch({
      type: 'global/usableProject',
      payload: {
        type: 1,
      },
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      imgUrl: [],
      depList: [], // 所在部门
      // createDepList: [], // 报销部门
      accountList: [], // 收款账户
      details: {}, // 详情
      inDetails: {},
      users: [],
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      total: 0,
      loanUserId: '', // 审批人的userId
    });
  }

  selectPle = (val) => {
    let detail = this.state.details;
    const { total } = this.state;
    let params = {};
    console.log(val.users);
    if (val.users && val.users.length > 0) {
      this.props.dispatch({
        type: 'global/users',
        payload: {
          userJson: JSON.stringify(val.users),
        }
      }).then(() => {
        const { deptInfo } = this.props;
        this.setState({
          users: val.users,
          depList: deptInfo,
        });
        if (deptInfo.length === 1) {
          this.props.form.setFieldsValue({
            deptId: `${deptInfo[0].deptId}`,
          });
          detail = {
            ...detail,
            userId: this.props.userId,
            deptId: deptInfo[0].deptId,
          };
          params = {
            loanEntities: detail.loanEntities || [],
            categorySumEntities: detail.categorySumEntities || [],
            creatorDeptId: detail.createDeptId,
            loanUserId: val.users[0].userId,
            loanDeptId: deptInfo[0].deptId,
            processPersonId: detail.processPersonId,
            createDingUserId: detail.createDingUserId,
            total: (total * 1000)/10,
            projectId: detail.projectId || '',
            supplierId: detail.supplierId || ''
          };
        } else {
          this.props.form.setFieldsValue({
            deptId: '',
          });
          detail = {
            ...detail,
            userId: this.props.userId,
          };
          params = {
            loanEntities: detail.loanEntities || [],
            categorySumEntities: detail.categorySumEntities || [],
            creatorDeptId: detail.createDeptId,
            loanUserId: val.users[0].userId,
            processPersonId: detail.processPersonId,
            createDingUserId: detail.createDingUserId,
            total: (total * 1000)/10,
            projectId: detail.projectId || '',
            supplierId: detail.supplierId || ''
          };
        }
        this.getNode(params);
        this.setState({
          users: val.users,
          details: {
            ...detail,
            userName: val.users[0].userName,
            loanUserId: val.users[0].userId,
          },
          loanUserId: val.users[0].userId,
        });
      });
    }
  }

  onChangeAcc = (val) => {
    let detail = this.state.details;
    const { accountList } = this.state;
    accountList.forEach(item => {
      if (item.id === val) {
        const arr = [item];
        detail = {
          ...detail,
          receiptId: val,
          receiptName: item.name,
          receiptNameJson: JSON.stringify(arr),
        };
      }
    });
    this.props.form.setFieldsValue({
      receiptId: val,
    });
    this.setState({
      details: detail,
    });
  }

  // 上传附件
  uploadFiles = () => {
    console.log('上传');
    const _this = this;
    this.props.dispatch({
      type: 'global/grantUpload',
      payload: {},
    }).then(() => {
      const { uploadSpace } = this.props;
      fileUpload({spaceId: uploadSpace, max: 9}, (arr) => {
        let file = _this.state.fileUrl;
        file = [...file, ...arr];
        _this.setState({
          fileUrl: file,
        });
      });
    });
  }

  //  预览附件
  previewFiless = (options) => {
    this.props.dispatch({
      type: 'global/isApproval',
      payload: {
        spaceId: options.spaceId
      }
    }).then(() => {
      const { isApproval } = this.props;
      if (isApproval) {
        this.preview(options, 'global/newGrantDownload', true);
      } else {
        this.preview(options, 'global/grantDownload');
      }
    });
  }

  preview = (options, url, flag) => {
    const { details } = this.state;
    const params = {
      fileIds: options.fileId
    };
    if (flag) {
      Object.assign(params, { processInstanceId: details.proInsId });
    }
    this.props.dispatch({
      type: url,
      payload: {
        ...params,
      }
    }).then(() => {
      console.log(options);
      previewFile(options);
      // DownloadFile(options.file, options.fileName);
    });
  }

  getNode = (payload) => {
    Object.assign(payload, {
      deepQueryFlag: true,
    });
    this.props.dispatch({
      type: 'global/approveList',
      payload,
    }).then(() => {
      const { nodes } = this.props;
      this.setState({
        nodes,
      });
    });
  }

  onChangeNode = (val) => {
    this.setState({
      nodes: val
    });
  }

  onDelFile = (index) => {
    const files = this.state.fileUrl;
    files.splice(index, 1);
    this.setState({
      fileUrl: files,
    });
  }

  onChangeImg = (val) => {
    this.setState({
      imgUrl: val,
    });
  }

  handleOk = () => {
    const {
      imgUrl,
      fileUrl,
      nodes,
      depList,
      users,
      details,
      total,
      expandField,
    } = this.state;
    const that = this;
    const { id, dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
        // const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
        const expandSubmitFieldVos = [];
        if (expandField && expandField.length > 0) {
          expandField.forEach(it => {
            if (it.status) {
              expandSubmitFieldVos.push({
                ...it,
                field: it.field,
                name: it.name,
                msg: val[it.field],
              });
            }
          });
        }
        let params = {
          ...details,
          invoiceTemplateId: id,
          reason: val.reason,
          note: val.note || '',
          loanSum: this.state.loanSum,
          userId: details.userId || '',
          deptId: val.deptId,
          deptName: dep && dep.length > 0 ? dep[0].name : '',
          userJson: users,
          createDeptId: val.deptId,
          createDeptName: dep && dep.length > 0 ? dep[0].name : '',
          nodeConfigInfo: nodes,
          projectId: val.projectId || '',
          supplierAccountId: val.supplier ? val.supplier.split('_')[0] : '',
          supplierId: val.supplier ? val.supplier.split('_')[1] : '',
          imgUrl,
          fileUrl,
          submitSum: (total * 1000)/10,
          expandSubmitFieldVos
        };
        params = {
          ...params
        };
        dispatch({
          type: 'global/addLoan',
          payload : {
            ...params,
          }
        }).then(() => {
          that.onCancel();
          message.success('发起单据成功');
          this.props.onHandleOk();
        });
      }
    });
  }

  // onChangeData = (val) => {
  //   this.setState({
  //     costDetailsVo: val,
  //   });
  // }

  onChangeCreate = (val) => {
    const detail = this.state.details;
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: val,
      loanUserId: loanUserId || '',
      loanDeptId: detail.deptId || '',
      loanEntities: detail.loanEntities || [],
      categorySumEntities: detail.categorySumEntities || [],
      processPersonId: detail.processPersonId,
      createDingUserId: detail.createDingUserId,
      total: (total * 1000)/10,
      projectId: detail.projectId || '',
      supplierId: detail.supplierId || ''
    });
    this.setState({
      details: {
        ...detail,
        createDeptId: val,
      },
    });
  }

  onChangeDept = (val) => {
    const detail = this.state.details;
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: detail.createDeptId,
      loanUserId: loanUserId || '',
      loanDeptId: val,
      loanEntities: detail.loanEntities || [],
      categorySumEntities: detail.categorySumEntities || [],
      processPersonId: detail.processPersonId,
      createDingUserId: detail.createDingUserId,
      total: (total * 1000)/10,
      projectId: detail.projectId || '',
      supplierId: detail.supplierId || ''
    });
    this.setState({
      details: {
        ...detail,
        loanDeptId: val,
      },
    });
  }

  handelAcc = () => {
    let detail = this.state.details;
    this.props.dispatch({
      type: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    }).then(() => {
      const account = this.props.receiptAcc;
      const arr = account.filter(it => it.isDefault && (it.status === 1));
      if (arr && arr.length > 0) {
        detail = {
          ...detail,
          receiptId: arr[0].id,
          receiptName: arr[0].name,
          receiptNameJson: JSON.stringify(arr),
        };
      }
      this.setState({
        details: detail,
        accountList: account,
      });
    });
  }

  check = (rule, value, callback) => {
    const { showField } = this.state;
    if (showField[rule.field].isWrite) {
      if (value) {
        callback();
      } else  {
        callback('请选择收款账户');
      }
    } else {
      callback();
    }
  }

  onSelectTree = () => {
    const { usableSupplier } = this.props;
    const list = [];
    usableSupplier.forEach(item => {
      const obj = {
        value: item.id,
        title: item.name,
        children: [],
        disabled: true,
      };
      item.supplierAccounts.forEach(it => {
        obj.children.push({
          value: `${it.id}_${it.supplierId}`,
          title: it.name,
          parentId: it.supplierId,
          type: it.type,
          account: it.account
        });
      });
      list.push(obj);
    });
    return list;
  }

  treeNodeRender = (treeNode) => {

  if(!treeNode || !treeNode.length){
    return;
  }
    return treeNode.map((v) => {
      return (
        <TreeNode
          value={v.value}
          title={(
            <span className="c-black-85" style={{color: 'rgba(0,0,0,0.85)!important'}}>{v.title}</span>
          )}
          key={v.value}
          disabled
        >
          {v.children && this.treeNodeChildRender(v.children)}
        </TreeNode>
      );
    });
  }

  treeNodeChildRender = (list) => {
    return list.map(it => (
      <TreeNode
        key={it.value}
        value={it.value}
        name={it.title}
        title={(
          <div>
            <div className={style.treeOption}>
              {
                it.type === 0 &&
                <i className="iconfont iconyinhangka" />
              }
              {
                it.type === 1 &&
                <i className="iconfont iconzhifubao" />
              }
              {
                it.type === 2 &&
                <i className="iconfont iconxianjin" />
              }
              {it.title}
            </div>
            <p className="c-black-36 m-l-20 fs-12" style={{marginBottom: 0}} >
              {it.type === 0 && '银行卡'}
              {it.type === 1 && '支付宝'}
              {it.type === 2 && '现金'}
              {it.account}
            </p>
          </div>
        )}
      />
    ));
  }

  onChangePro = (val, name) => {
    let data = this.state.details;
    if (name === 'project') {
      data = {
        ...data,
        projectId: val,
      };
    } else {
      data = {
        ...data,
        supplierId: val.split('_')[1],
      };
    }
    const { loanUserId, total } = this.state;
    this.getNode({
      creatorDeptId: data.createDeptId || '',
      loanUserId: loanUserId || '',
      loanDeptId: data.deptId || '',
      loanEntities: data.loanEntities || [],
      categorySumEntities: data.categorySumEntities || [],
      processPersonId: data.processPersonId,
      createDingUserId: data.createDingUserId,
      total: (total * 1000)/10,
      projectId: data.projectId || '',
      supplierId: data.supplierId || ''
    });
    this.setState({
      details: data,
    });
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      userInfo,
      // id,
      loading,
      usableProject,
    } = this.props;
    const supplierList = this.onSelectTree();
    const {
      visible,
      imgUrl,
      depList,
      details,
      inDetails,
      users,
      nodes,
      fileUrl,
      showField,
      // total,
      expandField,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <span>
        <span onClick={() => this.onShowHandle()}>{ children }</span>
        <Modal
          visible={visible}
          width="980px"
          bodyStyle={{height: '550px', overflowY: 'scroll'}}
          title={inDetails.name}
          onCancel={this.onCancel}
          maskClosable={false}
          onOk={this.handleOk}
          footer={(
            <div className={style.footerBtn}>
              <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>
              <div>
                <span className="fs-15 c-black-85 m-r-8">借款金额：¥
                  <span className="fs-20 fw-500">{this.state.loanSum}</span>
                </span>
                <Button key="save" type="primary" onClick={() => this.handleOk()} loading={loading}>确定</Button>
              </div>
            </div>
          )}
        >
          <div className={style.addInvoice}>
            <div className={style.header}>
              <div className={style.line} />
              <span>基本信息</span>
            </div>
            <Form className="formItem" refs={forms => {this.invoice = forms;}}>
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.userId} {...formItemLayout}>
                    <SelectPeople
                      users={users}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val)}
                      invalid={false}
                      disabled
                      flag="users"
                      multiple={false}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.deptId} {...formItemLayout}>
                    {
                      getFieldDecorator('deptId', {
                        rules: [{ required: true, message: '请选择借款部门' }]
                      })(
                        <Select placeholder="请选择" onChange={this.onChangeDept}>
                          {
                            depList.map(it => (
                              <Option key={it.deptId}>{it.name}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                <Col span={12}>
                  <Form.Item label={labelInfo.reason} {...formItemLayout}>
                    {
                      getFieldDecorator('reason', {
                        initialValue: details.reason || '',
                        rules:[{ required: true, message: '请输入事由' }]
                      })(
                        <Input placeholder="请输入"  />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.loanSum} {...formItemLayout}>
                    {
                      getFieldDecorator('loanSum', {
                        initialValue: details.loanSum || '',
                        rules:[{ required: true, message: '请输入借款金额' }]
                      })(
                        <Input
                          placeholder="请输入"
                          onChange={(e) => {
                          this.setState({loanSum: e.target.value});
                        }}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  showField.note && showField.note.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.note} {...formItemLayout}>
                      {
                        getFieldDecorator('note',{
                          rules: [{ required: !!(showField.note.isWrite), message: '请输入备注' }]
                        })(
                          <Input placeholder="请输入"  />
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.repaymentTime && showField.repaymentTime.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.repaymentTime} {...formItemLayout}>
                      {
                        getFieldDecorator('repaymentTime',{
                          rules: [{ required: !!(showField.repaymentTime.isWrite), message: '请选择预计还款日期' }]
                        })(
                          <DatePicker placeholder="请选择" disabledDate={this.disabledDate} />
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.project && showField.project.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.project} {...formItemLayout}>
                      {
                        getFieldDecorator('projectId', {
                          initialValue: details.projectId || '',
                          rules: [{ required: !!(showField.project.isWrite), message: '请选择项目' }]
                        })(
                          <Select
                            placeholder={`请选择${labelInfo.project}`}
                            onChange={(val) => this.onChangePro(val, 'project')}
                            dropdownClassName="selectClass"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              usableProject.map(it => (
                                <Option key={it.id}>{it.name}</Option>
                              ))
                            }
                          </Select>
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.supplier && showField.supplier.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.supplier} {...formItemLayout}>
                      {
                        getFieldDecorator('supplier', {
                          rules: [{ required: !!(showField.supplier.isWrite), message: '请选择供应商账号' }]
                        })(
                          <TreeSelect
                            placeholder="请选择"
                            style={{width: '100%'}}
                            treeDefaultExpandAll
                            dropdownStyle={{height: '300px'}}
                            onChange={(val) => this.onChangePro(val, 'supplier')}
                            treeNodeLabelProp="name"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {this.treeNodeRender(supplierList)}
                          </TreeSelect>
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.imgUrl && showField.imgUrl.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.imgUrl} {...formItemLayout}>
                      <UploadImg onChange={(val) => this.onChangeImg(val)} imgUrl={imgUrl} userInfo={userInfo} />
                    </Form.Item>
                  </Col>
                }
                {
                  showField.fileUrl && showField.fileUrl.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.fileUrl} {...formItemLayout}>
                      <Button onClick={() => this.uploadFiles()}>
                        <Icon type="upload" /> 上传文件
                      </Button>
                      <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
                      {
                        fileUrl.map((it, index) => (
                          <div key={it.fileId} className={style.fileList} onClick={() => this.previewFiless(it)}>
                            <div className={style.fileIcon}>
                              <img
                                className='attachment-icon'
                                src={fileIcon[it.fileType]}
                                alt='attachment-icon'
                              />
                              <span className="eslips-1">{it.fileName}</span>
                            </div>
                            <i className="iconfont icondelete_fill" onClick={() => this.onDelFile(index)} />
                          </div>
                        ))
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.project && showField.project.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.project} {...formItemLayout}>
                      {
                        getFieldDecorator('projectId', {
                          initialValue: details.projectId || '',
                          rules: [{ required: !!(showField.project.isWrite), message: '请选择项目' }]
                        })(
                          <Select
                            placeholder={`请选择${labelInfo.project}`}
                            onChange={(val) => this.onChangePro(val, 'project')}
                            dropdownClassName="selectClass"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              usableProject.map(it => (
                                <Option key={it.id}>{it.name}</Option>
                              ))
                            }
                          </Select>
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  showField.supplier && showField.supplier.status &&
                  <Col span={12}>
                    <Form.Item label={labelInfo.supplier} {...formItemLayout}>
                      {
                        getFieldDecorator('supplier', {
                          rules: [{ required: !!(showField.supplier.isWrite), message: '请选择供应商账号' }]
                        })(
                          <TreeSelect
                            placeholder="请选择"
                            style={{width: '100%'}}
                            treeDefaultExpandAll
                            dropdownStyle={{height: '300px'}}
                            onChange={(val) => this.onChangePro(val, 'supplier')}
                            treeNodeLabelProp="name"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {this.treeNodeRender(supplierList)}
                          </TreeSelect>
                        )
                      }
                    </Form.Item>
                  </Col>
                }
                {
                  expandField && (expandField.length > 0) &&
                  expandField.map(itw => {
                    let renderForm = null;
                    let rule = [];
                    console.log(itw.fieldType);
                    if (Number(itw.fieldType) === 2) {
                      renderForm = (
                        <Select placeholder='请选择'>
                          {
                            itw.options && itw.options.map(iteems => (
                              <Select.Option key={iteems}>{iteems}</Select.Option>
                            ))
                          }
                        </Select>
                      );
                    } else if (Number(itw.fieldType) === 1) {
                      renderForm = (<TextArea placeholder='请输入' />);
                      rule = [{ max: 128, message: '限制128个字' }];
                    } else {
                      renderForm = (<Input placeholder='请输入' />);
                      rule = [{ max: 20, message: '限制20个字' }];
                    }
                    return (
                      <>
                        {
                          itw.status ?
                            <Col span={12}>
                              <Form.Item label={itw.name} {...formItemLayout}>
                                {
                                  getFieldDecorator(itw.field, {
                                    initialValue: itw.msg,
                                    rules: [
                                      { required: !!(itw.isWrite), message: `请${Number(itw.fieldType === 2) ? '选择' : '输入'}${itw.name}` },
                                      ...rule,
                                    ],
                                  })(
                                    renderForm
                                  )
                                }
                              </Form.Item>
                            </Col>
                            :
                            null
                        }
                      </>
                    );
                  })
                }
              </Row>
            </Form>
            <Divider type="horizontal" />
            <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
              <div className={style.header} style={{padding: 0}}>
                <div className={style.line} />
                <span>审批流程</span>
              </div>
              <ApproveNode
                approveNodes={nodes}
                onChangeForm={(val) => this.onChangeNode(val)}
              />
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddInvoice;
