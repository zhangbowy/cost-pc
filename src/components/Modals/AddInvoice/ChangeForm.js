import React, { Component } from 'react';
import { Form, Input, Row, Col, Divider, Button,
  Icon, Select, TreeSelect, InputNumber, DatePicker, message } from 'antd';
import moment from 'moment';
import fileIcon from '@/utils/fileIcon.js';
import TextArea from 'antd/lib/input/TextArea';
import UploadImg from '../../UploadImg';
import SelectPeople from '../SelectPeople';
import ReceiptModal from '../ReceiptModal';
import { placeholderType } from '../../../utils/constants';
import { compare } from '../../../utils/common';
import defaultFunc from './utils';
import style from './index.scss';

const {Option} = Select;
const { RangePicker } = DatePicker;
const labelInfo = {
  reason: '事由',
  userId: '报销人',
  deptId: '报销部门',
  note: '单据备注',
  receiptId: '收款账户',
  createDeptId: '所在部门',
  imgUrl: '图片',
  fileUrl: '附件',
  project: '项目',
  supplier: '供应商'
};
const { TreeNode } = TreeSelect;
@Form.create()
class ChangeForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      depList: [],
      loanUserId: [],
    };
  }

  checkMoney = (rule, value, callback) => {
    if (value) {
      if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
        callback('请输入正确的金额');
      }
      if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback('金额小数不能超过2位');
      }
      if (value > 100000000 || value === 100000000) {
        callback('金额需小于1个亿');
      }
      if (value < 0) {
        callback('金额不能小于零');
      }
      callback();
    } else {
      callback();
    }
  }

  selectPle = (val) => {
    let detail = this.state.details;
    const { total } = this.state;
    let params = {};
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

  onChangePro = (val, name) => {
    let data = this.props.details;
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
          searchs={v.title}
          disabled
        >
          {v.children && this.treeNodeChildRender(v.children, v.title)}
        </TreeNode>
      );
    });
  }

  treeNodeChildRender = (list, titles) => {
    return list.map(it => (
      <TreeNode
        key={it.value}
        value={it.value}
        name={it.title}
        newName={it.names}
        searchs={titles}
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
            <p className="c-black-36 m-l-20 fs-12" style={{marginBottom: 0}}>
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

  inputMoney = (value) => {
    const { details } = this.state;
    const { djDetail } = this.props;
    const { costDetailsVo } = this.state;
    if (!djDetail.categoryStatus || (costDetailsVo.length === 0)) {
      this.setState({
        total: value
      }, () => {
        if(!/((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/.test(value)) {
          return;
        }
        if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
          return;
        }
        if (value > 100000000 || value === 100000000) {
          return;
        }
        if (value < 0) {
          return;
        }
        this.getNode({
          projectId: details.projectId || '',
          supplierId: details.supplierId || '',
          createDingUserId: details.createDingUserId,
          creatorDeptId: details.createDeptId || '',
          processPersonId: details.processPersonId,
        });
    });
  }
  }

  onChangeImg = (val) => {
    const { onChangeData } = this.props;
    onChangeData(val, 'imgUrl');
  }

  onDelFile = (index, e, flag) => {
    const { onChangeData } = this.props;
    e.stopPropagation();
    if (flag) {
      message.error('不允许删除');
      return;
    }
    const files = this.props.fileUrl;
    files.splice(index, 1);
    onChangeData(files, 'fileUrl');
  }

  //  预览附件
  previewFiless = () => {
    message.error('钉钉暂时不支持未提交单据附件的预览，请提交后预览/下载');
    // this.props.dispatch({
    //   type: 'global/grantDownload',
    //   payload: {
    //     fileIds: options.fileId
    //   }
    // }).then(() => {
    //   previewFile(options);
    // });
  }

  onChangeAcc = (val) => {
    let detail = this.props.details;
    const { accountList } = this.props;
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

  render () {
    const {
      showField,
      newshowField,
      expandField,
      form: { getFieldDecorator },
      usableProject,
      imgUrl,
      // depList,
      createDepList,
      accountList,
      details,
      fileUrl,
      userInfo,
      modify,
      templateType,
      supplierList,
      handelAcc,
      uploadFiles,
    } = this.props;
    const {
      users,
      depList,
    } = this.state;
    const newForm = [...newshowField, ...expandField].sort(compare('sort'));
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
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <Form className="formItem" refs={forms => {this.invoice = forms;}}>
        <Row>
          <Col span={12}>
            <Form.Item label={showField.reason && showField.reason.name} {...formItemLayout}>
              {
                getFieldDecorator('reason', {
                  initialValue: details.reason || '',
                  rules:[{ required: true, message: '请输入事由' }]
                })(
                  <Input
                    disabled={modify && showField.reason && !showField.reason.isModify}
                    placeholder={showField.reason && showField.reason.note ? showField.reason.note : '请输入'}
                  />
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={showField.userJson && showField.userJson.name} {...formItemLayout}>
              <SelectPeople
                users={users}
                placeholder='请选择'
                onSelectPeople={(val) => this.selectPle(val)}
                invalid={false}
                disabled={Number(templateType) || modify}
                flag="users"
                isInput
                multiple={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{display: 'flex', flexWrap: 'wrap'}}>
          <Col span={12}>
            <Form.Item label={showField.deptId && showField.deptId.name} {...formItemLayout}>
              {
                getFieldDecorator('deptId', {
                  rules: [{ required: true, message: `请选择${showField.deptId && showField.deptId.name}` }]
                })(
                  <Select
                    placeholder={showField.deptId && showField.deptId.note ? showField.deptId.note : '请选择'}
                    onChange={this.onChangeDept}
                    disabled={modify}
                  >
                    {
                      depList && depList.map(it => (
                        <Option key={it.deptId}>{it.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          {
            !modify &&
              <Col span={12}>
                <Form.Item label={labelInfo.createDeptId} {...formItemLayout}>
                  {
                    getFieldDecorator('createDeptId', {
                      initialValue: details.createDeptId ? `${details.createDeptId}` : '',
                      rules: [{ required: true, message: '请选择部门' }]
                    })(
                      <Select
                        placeholder={showField.createDeptId && showField.createDeptId.note
                        ? showField.createDeptId.note : '请选择'}
                        onChange={this.onChangeCreate}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        disabled={modify}
                      >
                        {
                          createDepList && createDepList.map(it => (
                            <Option key={`${it.deptId}`}>{it.name}</Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
          }
          {
            newForm && (newForm.length > 0) &&
            newForm.map(itw => {
              if (itw.field.indexOf('expand_') > -1 || itw.field.indexOf('self_') > -1) {
                let renderForm = null;
                let rule = [];
                let initMsg = itw.msg || '';
                if (Number(itw.fieldType) === 0) {
                  renderForm = (
                    <Input
                      placeholder={itw.note ? itw.note : '请输入'}
                      disabled={modify && !itw.isModify}
                    />
                  );
                  rule = [{ max: 20, message: '限制20个字' }];
                } else if (Number(itw.fieldType) === 1) {
                  renderForm = (
                    <TextArea
                      placeholder={itw.note ? itw.note : '请输入'}
                      disabled={modify && !itw.isModify}
                    />
                  );
                  rule = [{ max: 128, message: '限制128个字' }];
                } else if(Number(itw.fieldType) === 2) {
                  renderForm = (
                    <Select
                      placeholder={itw.note ? itw.note : '请选择'}
                      disabled={modify && !itw.isModify}
                    >
                      {
                        itw.options && itw.options.map(iteems => (
                          <Select.Option key={iteems}>{iteems}</Select.Option>
                        ))
                      }
                    </Select>
                  );
                } else if (itw.fieldType === 5) {
                  if (itw.dateType === 1) {
                    initMsg = itw.startTime ? moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '';
                    renderForm = (
                      <DatePicker
                        style={{width: '100%'}}
                        placeholder={itw.note ? itw.note : '请选择'}
                        disabled={modify && !itw.isModify}
                      />
                    );
                  } else {
                    initMsg = itw.startTime && itw.endTime ?
                        [moment(moment(Number(itw.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                        moment(moment(Number(itw.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')] : [];
                    renderForm = (
                      <RangePicker
                        style={{width: '280px' }}
                        placeholder={itw.note ? itw.note : '请选择时间'}
                        format="YYYY-MM-DD"
                        disabled={modify && itw.isModify}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                      />
                    );
                  }
                }
                console.log('itw.field', itw.field);
                return (
                  <>
                    {
                      itw.status && (itw.fieldType !== 3) ?
                        <Col span={12}>
                          <Form.Item label={itw.name} {...formItemLayout}>
                            {
                              getFieldDecorator(itw.field, {
                                initialValue: initMsg || undefined,
                                rules: [
                                  {
                                    required: !!(itw.isWrite),
                                    message: `请${Number(itw.fieldType === 2) ? '选择' : '输入'}${itw.name}`
                                  },
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
              }
                return (
                  <>
                    {
                      itw.field === 'loanSum' && itw.status ?
                        <Col span={12}>
                          <Form.Item label={showField.loanSum && showField.loanSum.name} {...formItemLayout}>
                            {
                              getFieldDecorator('loanSum', {
                                initialValue: details.loanSum || '',
                                rules: [{
                                  required: !!(showField.loanSum && showField.loanSum.isWrite),
                                  message: `请输入${showField.loanSum && showField.loanSum.name}`
                                }, {
                                  validator: this.checkMoney
                                }]
                              })(
                                <InputNumber
                                  disabled={modify && !showField.loanSum.isModify}
                                  onChange={val => this.inputMoney(val)}
                                  placeholder={showField.loanSum && showField.loanSum.note ?
                                    showField.loanSum.note : `请输入${showField.loanSum && showField.loanSum.name}`}
                                  style={{width: '100%'}}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'applicationSum' && itw.status ?
                        <Col span={12}>
                          <Form.Item label={showField.applicationSum && showField.applicationSum.name} {...formItemLayout}>
                            {
                              getFieldDecorator('applicationSum', {
                                initialValue: details.applicationSum || '',
                                rules: [{
                                  required: !!(showField.applicationSum && showField.applicationSum.isWrite),
                                  message: `请输入${showField.applicationSum && showField.applicationSum.name}`
                                }, {
                                  validator: this.checkMoney
                                }]
                              })(
                                <InputNumber
                                  disabled={modify && !showField.applicationSum.isModify}
                                  onChange={val => this.inputMoney(val)}
                                  placeholder={showField.applicationSum && showField.applicationSum.note ?
                                    showField.applicationSum.note : `请输入${showField.applicationSum && showField.applicationSum.name}`}
                                  style={{width: '100%'}}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'repaymentTime' && itw.status ?
                        <Col span={12}>
                          <Form.Item label={showField.repaymentTime && showField.repaymentTime.name} {...formItemLayout}>
                            {
                              getFieldDecorator('repaymentTime', {
                                initialValue: details.repaymentTime ?
                                moment(moment(Number(details.repaymentTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                                rules: [{
                                  required: !!(showField.repaymentTime && showField.repaymentTime.isWrite),
                                  message: `请选择${showField.repaymentTime && showField.repaymentTime.name}`
                                }]
                              })(
                                <DatePicker
                                  disabledDate={defaultFunc.disabledDate}
                                  disabledTime={defaultFunc.disabledDateTime}
                                  disabled={modify && !showField.repaymentTime.isModify}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'happenTime' && itw.status ?
                        <Col span={12}>
                          <Form.Item label={showField.happenTime && showField.happenTime.name} {...formItemLayout}>
                            {
                              Number(showField.happenTime.dateType) === 1 &&
                              getFieldDecorator('time', {
                                initialValue: details.startTime ?
                                moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD') : '',
                                rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                              })(
                                <DatePicker
                                  style={{width: '100%'}}
                                  disabled={modify && !showField.happenTime.isModify}
                                />
                              )
                            }
                            {
                              Number(showField.happenTime.dateType) === 2 &&
                              getFieldDecorator('time', {
                                initialValue: details.startTime && details.endTime ?
                                  [moment(moment(Number(details.startTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
                                  moment(moment(Number(details.endTime)).format('YYYY-MM-DD'), 'YYYY-MM-DD')]
                                  :
                                  [],
                                rules: [{ required: !!(showField.happenTime.isWrite), message: '请选择时间' }]
                              })(
                                <RangePicker
                                  style={{width: '280px' }}
                                  placeholder={showField.happenTime && showField.happenTime.note ?
                                  showField.happenTime.note : '请选择时间'}
                                  disabled={modify && !showField.happenTime.isModify}
                                  format="YYYY-MM-DD"
                                  showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                  }}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'imgUrl' && showField.imgUrl.status ?
                        <Col span={12}>
                          <Form.Item
                            label={labelInfo.imgUrl}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('img', {
                                initialValue: imgUrl && imgUrl.length ? imgUrl : null,
                                rules: [{
                                  required: !!(showField.imgUrl.isWrite),
                                  message: '请选择图片'
                                }]
                              })(
                                <UploadImg
                                  onChange={(val) => this.onChangeImg(val)}
                                  imgUrl={imgUrl}
                                  userInfo={userInfo}
                                  disabled={modify && !showField.imgUrl.isModify}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'fileUrl' && showField.fileUrl.status ?
                        <Col span={12}>
                          <Form.Item label={labelInfo.fileUrl} {...formItemLayout}>
                            <Button
                              onClick={() => uploadFiles()}
                              disabled={(fileUrl && (fileUrl.length > 9 || fileUrl.length === 9))
                                || (modify && !showField.fileUrl.isModify)}
                            >
                              <Icon type="upload" /> 上传文件
                            </Button>
                            <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>
                              支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                            </p>
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
                                  <i
                                    className="iconfont icondelete_fill"
                                    onClick={(e) => this.onDelFile(index, e, modify && !showField.fileUrl.isModify)}
                                  />
                                </div>
                              ))
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'project' && showField.project.status ?
                        <Col span={12}>
                          <Form.Item label={labelInfo.project} {...formItemLayout}>
                            {
                              getFieldDecorator('projectId', {
                                initialValue: details.projectId || undefined,
                                rules: [{ required: !!(showField.project.isWrite), message: '请选择项目' }]
                              })(
                                <Select
                                  placeholder={showField.project && showField.project.note ?
                                  showField.project.note : `请选择${labelInfo.project}`}
                                  onChange={(val) => this.onChangePro(val, 'project')}
                                  dropdownClassName="selectClass"
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                                  disabled={modify && !showField.project.isModify}
                                  showSearch
                                  optionFilterProp="name"
                                  filterOption={(input, option) =>
                                    option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        :
                        null
                    }
                    {
                      itw.field === 'supplier' && showField.supplier.status ?
                        <Col span={12}>
                          <Form.Item label={labelInfo.supplier} {...formItemLayout}>
                            {
                              getFieldDecorator('supplier', {
                                initialValue: details.supplier || undefined,
                                rules: [{ required: !!(showField.supplier.isWrite), message: '请选择供应商账号' }]
                              })(
                                <TreeSelect
                                  showSearch
                                  treeNodeFilterProp='searchs'
                                  placeholder={showField.supplier && showField.supplier.note ?
                                  showField.supplier.note : '请选择'}
                                  style={{width: '100%'}}
                                  treeDefaultExpandAll
                                  dropdownStyle={{height: '300px'}}
                                  onChange={(val) => this.onChangePro(val, 'supplier')}
                                  treeNodeLabelProp="newName"
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                                  disabled={modify}
                                >
                                  {this.treeNodeRender(supplierList)}
                                </TreeSelect>
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'note' && showField.note.status ?
                        <Col span={12}>
                          <Form.Item label={labelInfo.note} {...formItemLayout}>
                            {
                              getFieldDecorator('note',{
                                initialValue: details.note || '',
                                rules: [{ required: !!(showField.note.isWrite), message: '请输入备注' }]
                              })(
                                <Input
                                  placeholder={showField.note && showField.note.note ? showField.note.note : '请输入'}
                                  disabled={modify && !showField.note.isModify}
                                />
                              )
                            }
                          </Form.Item>
                        </Col>
                        :
                        null
                    }
                    {
                      itw.field === 'receiptId' && showField.receiptId.status ?
                        <Col span={12} style={{position: 'relative'}}>
                          <Form.Item label={labelInfo.receiptId} {...formItemLayouts}>
                            {
                              getFieldDecorator('receiptId', {
                                initialValue: details.receiptId ? [details.receiptId] : undefined,
                                rules: [{ required: !!(showField.receiptId && showField.receiptId.isWrite), message: '请输入收款账户' }],
                              })(
                                <Select
                                  placeholder={showField.receiptId && showField.receiptId.note ?
                                  showField.receiptId.note : placeholderType[showField.receiptId.fieldType]}
                                  dropdownClassName={style.opt}
                                  onChange={(val) => this.onChangeAcc(val)}
                                  optionLabelProp="label"
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                                  disabled={modify && !showField.receiptId.isModify}
                                >
                                  {
                                    accountList.map(it => (
                                      <Option key={it.id} value={it.id} label={it.name}>
                                        <div className={style.selects}>
                                          <p className="c-black fs-14">{it.name} </p>
                                          <p className="c-black-36 fs-13">{it.account}</p>
                                        </div>
                                        <Divider type="horizontal" />
                                      </Option>
                                    ))
                                  }
                                </Select>
                              )
                            }
                          </Form.Item>
                          {
                            !modify &&
                            <ReceiptModal title="add" onOk={handelAcc}>
                              <a className={style.addReceipt}>新增</a>
                            </ReceiptModal>
                          }
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
    );
  }
}

export default ChangeForm;
