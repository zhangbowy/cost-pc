/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Icon, Select, message } from 'antd';
import { connect } from 'dva';
import fileIcon from '@/utils/fileIcon.js';
import style from './index.scss';
import AddCost from './AddCost';
import UploadImg from '../../UploadImg';
import SelectPeople from '../SelectPeople';
import { fileUpload } from '../../../utils/ddApi';
import CostTable from './CostTable';
import ApproveNode from '../ApproveNode';
import ReceiptModal from '../ReceiptModal';

const {Option} = Select;
const labelInfo = {
  reason: '事由',
  userId: '承担人',
  deptId: '承担部门',
  note: '单据备注',
  receiptId: '收款账户',
  createDeptId: '所在部门',
  imgUrl: '图片',
  fileUrl: '附件'
};

@connect(({ session, global }) => ({
  userInfo: session.userInfo,
  deptInfo: global.deptInfo,
  receiptAcc: global.receiptAcc,
  djDetail: global.djDetail,
  uploadSpace: global.uploadSpace,
  nodes: global.nodes,
}))
@Form.create()
class AddInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgUrl: [],
      depList: [], // 所在部门
      createDepList: [], // 承担部门
      accountList: [], // 收款账户
      details: {}, // 详情
      inDetails: {},
      users: [],
      costDetailsVo: [], // 分摊
      nodes: {},
      fileUrl: [], // 附件
      showField: {}, // 是否显示输入框
      total: 0,
      // loading: false,
    };
  }

  onShowHandle = async() => {
    let detail = this.state.details;
    const { id } = this.props;
    const _this = this;
    await this.props.dispatch({
      type: 'global/users',
      payload: {
        type: 1,
      }
    });
    const create = await _this.props.deptInfo;
    await this.setState({
      depList: create
    });
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
    this.setState({
      createDepList: dep
    });
    await this.props.dispatch({
      type: 'global/djDetail',
      payload: {
        id,
        type: 1,
      }
    });
    const djDetails = await this.props.djDetail;
    const obj = {};
    if (djDetails.showField) {
      JSON.parse(djDetails.showField).forEach(item => {
        obj[item.field] = {...item};
      });
    }
    this.setState({
      inDetails: djDetails,
      showField: obj,
    });
    await this.props.dispatch({
      type: 'global/receiptAcc',
      payload: {
        pageNo: 1,
        pageSize: 100,
      }
    });
    const account = await _this.props.receiptAcc;
    const arr = account.filter(it => it.isDefault && (it.status === 1));
    if (arr && arr.length > 0) {
      detail = {
        ...detail,
        receiptId: arr[0].id,
        receiptName: arr[0].name,
        receiptNameJson: JSON.stringify(arr),
        creatorDeptId: arr[0].id,
        processPersonId: djDetails.approveId
      };
      const params = {
        creatorDeptId: arr[0].id,
        processPersonId: djDetails.approveId
      };
      this.getNode(params);
    }
    this.setState({
      accountList: account,
      details: detail,
    });
    this.setState({
      visible: true
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  selectPle = (val) => {
    const detail = this.state.details;
    if (val.users) {
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
        }
        this.getNode({
          loanEntities: detail.loanEntities || [],
          creatorDeptId: detail.createDeptId,
          loanUserId: val.users[0].userId,
          loanDeptId: deptInfo[0].deptId,
          processPersonId: detail.processPersonId,
        });
        this.setState({
          users: val.users,
          details: {
            ...detail,
            userId: val.users[0].userId,
            deptId: deptInfo[0].deptId,
          }
        });
      });
    }
  }

  onChangeAcc = (val) => {
    let detail = this.state.details;
    const { accountList } = this.state;
    accountList.forEach(item => {
      if (item.id === val) {
        detail = {
          ...detail,
          receiptId: val,
          receiptName: item.name,
          receiptNameJson: JSON.stringify([val]),
        };
      }
    });
    this.setState({
      details: detail,
    });
  }

  //  添加费用成功
  onAddCost = (val, index) => {
    const  share = this.state.costDetailsVo;
    const detail = this.state.details;
    if (index) {
      share.splice(index, 1, val);
    } else {
      share.push(val);
    }
    let mo = 0;
    const loanEntities = [];
    share.forEach(it => {
      mo+=it.costSum;
      if (it.costDetailShareVOS) {
        it.costDetailShareVOS.forEach(item => {
          loanEntities.push({
            loanUserId: item.userId,
            loanDeptId: item.deptId,
          });
        });
      }
    });
    this.getNode({
      loanEntities,
      creatorDeptId: detail.creatorDeptId,
      loanUserId: detail.userId || '',
      loanDeptId: detail.deptId || '',
      processPersonId: detail.processPersonId,
    });
    this.setState({
      costDetailsVo: share,
      total: mo,
      details: {
        ...detail,
        loanEntities,
      }
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
      fileUpload({spaceId: uploadSpace}, (arr) => {
        let file = _this.state.fileUrl;
        file = [...file, ...arr];
        _this.setState({
          fileUrl: file,
        });
      });
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
      costDetailsVo,
      depList,
      users,
      details,
      createDepList,
      total,
    } = this.state;
    const { id, dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        const dep = depList.filter(it => `${it.deptId}` === `${val.deptId}`);
        const dept = createDepList.filter(it => `${it.deptId}` === `${val.createDeptId}`);
        let params = {
          invoiceTemplateId: id,
          reason: val.reason,
          note: val.note || '',
          userId: users && users.length > 0 ? users[0].userId : '',
          deptId: val.deptId,
          deptName: dep && dep.length > 0 ? dep[0].name : '',
          userJson: JSON.stringify(users),
          ...details,
          createDeptId: val.createDeptId,
          createDeptName: dept && dept.length > 0 ? dept[0].name : '',
          nodeConfigInfo: nodes,
          imgUrl,
          fileUrl,
          submitSum: (total * 1000)/10
        };
        const arr = [];
        costDetailsVo.forEach((item, index) => {
          arr.push({
            'categoryId': item.categoryId,
            'categoryName': item.categoryName,
            'costSum': ((item.costSum) * 1000)/10,
            'note': item.note,
            'costDate':item.costDate,
            'startTime':item.startTime || '',
            'endTime':item.endTime || '',
            'imgUrl':item.imgUrl,
            'invoiceBaseId':id,
            costDetailShareVOS: [],
          });
          if (item.costDetailShareVOS) {
            item.costDetailShareVOS.forEach(it => {
              arr[index].costDetailShareVOS.push({
                'shareAmount': (it.shareAmount * 1000)/10,
                'shareScale': it.shareScale,
                'deptId': it.deptId,
                'userId': it.userId,
                'userJson':JSON.stringify(it.users),
              });
            });
          }
        });
        params = {
          ...params,
          costDetailsVo: arr,
        };
        dispatch({
          type: 'global/addInvoice',
          payload : {
            ...params,
          }
        }).then(() => {
          this.onCancel();
          message.success('发起单据成功');
        });
      }
    });
  }

  onChangeData = (val) => {
    this.setState({
      costDetailsVo: val,
    });
  }

  onChangeCreate = (val) => {
    const detail = this.state.details;
    this.getNode({
      creatorDeptId: val,
      loanUserId: detail.userId || '',
      loanDeptId: detail.deptId || '',
      loanEntities: detail.loanEntities || [],
      processPersonId: detail.processPersonId,
    });
    this.setState({
      details: {
        ...detail,
        creatorDeptId: val,
      },
    });
  }

  onChangeDept = (val) => {
    const detail = this.state.details;
    this.getNode({
      creatorDeptId: detail.creatorDeptId,
      loanUserId: detail.userId || '',
      loanDeptId: val,
      loanEntities: detail.loanEntities || [],
      processPersonId: detail.processPersonId,
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
    });
    this.setState({
      details: detail,
    });
  }

  render() {
    const {
      children,
      form: { getFieldDecorator },
      userInfo,
      id,
    } = this.props;
    const {
      visible,
      imgUrl,
      depList,
      createDepList,
      accountList,
      details,
      inDetails,
      users,
      costDetailsVo,
      nodes,
      fileUrl,
      showField,
      total,
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
    const formItemLayouts = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
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
                <span className="fs-15 c-black-85 m-r-8">合计：¥<span className="fs-20 fw-500">{total}</span></span>
                <Button key="save" type="primary" onClick={() => this.handleOk()}>确定</Button>
              </div>
            </div>
          )}
        >
          <div className={style.addInvoice}>
            <div className={style.header}>
              <div className={style.line} />
              <span>基本信息</span>
            </div>
            <Form className="formItem">
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.reason} {...formItemLayout}>
                    {
                      getFieldDecorator('reason', {
                        rules:[{ required: true, message: '请输入事由' }]
                      })(
                        <Input placeholder="请输入"  />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.userId} {...formItemLayout}>
                    <SelectPeople
                      users={users}
                      placeholder='请选择'
                      onSelectPeople={(val) => this.selectPle(val)}
                      invalid={[]}
                      disabled={false}
                      flag="users"
                      multiple={false}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.deptId} {...formItemLayout}>
                    {
                      getFieldDecorator('deptId', {
                        rules: [{ required: true, message: '请选择承担人' }]
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
                  showField.note && showField.note.status &&
                  <Col span={12} style={{position: 'relative'}}>
                    <Form.Item label={labelInfo.receiptId} {...formItemLayouts}>
                      {
                        getFieldDecorator('receiptId', {
                          initialValue: details.receiptId || '',
                          rules: [{ required: !!(showField.note.isWrite), message: '请选择收款账户' }]
                        })(
                          <div style={{ display: 'flex' }}>
                            <Select
                              placeholder="请选择"
                              dropdownClassName={style.opt}
                              onChange={(val) => this.onChangeAcc(val)}
                              optionLabelProp="label"
                            >
                              {
                                accountList.map(it => (
                                  <Option key={it.id} label={it.name}>
                                    <div className={style.selects}>
                                      <p className="c-black fs-14">{it.name} </p>
                                      <p className="c-black-36 fs-13">{it.account}</p>
                                    </div>
                                    <Divider type="horizontal" />
                                  </Option>
                                ))
                              }
                            </Select>
                          </div>
                        )
                      }
                    </Form.Item>
                    <ReceiptModal title="add" onOk={this.handelAcc}>
                      <a className={style.addReceipt}>新增</a>
                    </ReceiptModal>
                  </Col>
                }
                <Col span={12}>
                  <Form.Item label={labelInfo.createDeptId} {...formItemLayout}>
                    {
                      getFieldDecorator('createDeptId', {
                        initialValue: details.createDeptId || '',
                        rules: [{ required: true, message: '请选择部门' }]
                      })(
                        <Select placeholder="请选择" onChange={this.onChangeCreate}>
                          {
                            createDepList.map(it => (
                              <Option key={it.deptId}>{it.name}</Option>
                            ))
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={labelInfo.imgUrl} {...formItemLayout}>
                    <UploadImg onChange={(val) => this.onChangeImg(val)} imgUrl={imgUrl} userInfo={userInfo} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={labelInfo.fileUrl} {...formItemLayout}>
                    <Button onClick={() => this.uploadFiles()}>
                      <Icon type="upload" /> 上传文件
                    </Button>
                    <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
                    {
                      fileUrl.map((it, index) => (
                        <div key={it.fileId} className={style.fileList}>
                          <div>
                            <img
                              className='attachment-icon'
                              src={fileIcon[it.fileType]}
                              alt='attachment-icon'
                            />
                            <span>{it.fileName}</span>
                          </div>
                          <i className="iconfont icondelete_fill" onClick={() => this.onDelFile(index)} />
                        </div>
                      ))
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider type="horizontal" />
            <div style={{paddingTop: '24px', paddingBottom: '30px'}}>
              <div className={style.header}>
                <div className={style.line} />
                <span>费用明细</span>
              </div>
              <div style={{textAlign: 'center'}} className={style.addbtn}>
                <AddCost userInfo={userInfo} invoiceId={id} onAddCost={this.onAddCost}>
                  <Button icon="plus" style={{ width: '231px' }}>添加费用</Button>
                </AddCost>
                {
                  costDetailsVo && costDetailsVo.length > 0 &&
                  <CostTable
                    list={costDetailsVo}
                    userInfo={userInfo}
                    invoiceId={id}
                    onChangeData={(val) => this.onChangeData(val)}
                  />
                }
              </div>
            </div>
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
