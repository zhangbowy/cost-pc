import React, { Component } from 'react';
import { Modal, Row, Col, message, Button, Divider } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import fileIcon from '@/utils/fileIcon.js';
import { invoiceStatus, getArrayValue, approveStatus, loanStatus } from '@/utils/constants';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import style from './index.scss';
import constants, { accountType } from '../../../utils/constants';
import RefuseModal from './RefuseModal';
import Borrow from './Borrow';
import Apply from './Apply';
import { ddOpenLink } from '../../../utils/ddApi';
import AddInvoice from '../AddInvoice';
import RecordHistory from './RecordHistory';
import CostDetailTable from './CostDetailTable';
// import { DownloadFile } from '../../../utils/ddApi';

const { APP_API } = constants;
@connect(({ global, costGlobal, session }) => ({
  invoiceDetail: global.invoiceDetail,
  approvedUrl: global.approvedUrl,
  djDetail: global.djDetail,
  loanDetail: global.loanDetail,
  applyDetail: global.applyDetail,
  isApproval: global.isApproval,
  recordDetailInvoice: costGlobal.recordDetailInvoice,
  recordDetailLoan: costGlobal.recordDetailLoan,
  checkTemp: costGlobal.checkTemp,
  userInfo: session.userInfo,
}))
class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      category: [],
      receipt: {},
      showFields: {},
      details: {},
      invoiceLoanRepayRecords: [],
      invoiceLoanAssessVos: [],
      supplierAccountVo: {},
      applicationAssociageVOS: [],
      recordList: [],
      operateType: '',
      invoiceVisible: {},
    };
  }

  onShow = () => {
    const { id, templateType } = this.props;
    let url = 'global/invoiceDetail';
    let params = { id };
    if (Number(templateType) === 1) {
      url = 'global/loanDetail';
      params = { loanId: id };
    } else if (Number(templateType) === 2) {
      url = 'global/applyDetail';
      params = { applicationId: id };
    }
    this.props.dispatch({
      type: url,
      payload: params
    }).then(() => {
      const { invoiceDetail, loanDetail, applyDetail } = this.props;
      let details = invoiceDetail;
      if (Number(templateType) === 1) {
        details = loanDetail;
      } else if (Number(templateType) === 2) {
        details = applyDetail;
      }
      if (details.costDetailsVo) {
        this.setState({
          category: details.costDetailsVo,
        });
      }
      if (details.receiptNameJson) {
        const receipts = JsonParse(details.receiptNameJson);
        this.setState({
          receipt: receipts[0] || {},
        });
      }
      if (details.invoiceLoanRepayRecords) {
        this.setState({
          invoiceLoanRepayRecords: details.invoiceLoanRepayRecords,
        });
      }
      if (details.invoiceLoanAssessVos) {
        this.setState({
          invoiceLoanAssessVos: details.invoiceLoanAssessVos,
        });
      }
      if (details.applicationAssociageVOS) {
        this.setState({
          applicationAssociageVOS: details.applicationAssociageVOS,
        });
      }
      if (details.supplierAccountVo) {
        this.setState({
          supplierAccountVo: details.supplierAccountVo || {},
        });
      }
      if (details.applicationAssociageVOS) {
        details = {
          ...details,
          applicationIds: details.applicationAssociageVOS.map(it => it.applicationId)
        };
      }
      const showObj = {};
      if (details.showField) {
        const arr = JsonParse(details.showField);
        arr.forEach(it => {
          showObj[it.field] = {...it};
        });
      }
      this.setState({
        showFields: showObj,
      });
      this.setState({
        details,
        isModify: details.isModify,
      });
      this.props.dispatch({
        type: !Number(templateType) ? 'costGlobal/recordDetailInvoice' : 'costGlobal/recordDetailLoan',
        payload: {
          isMobile: false,
          id,
        }
      }).then(() => {
        console.log(this.props.recordDetailLoan);
        const { recordDetailLoan, recordDetailInvoice } = this.props;
        const recordList = Number(templateType) ? recordDetailLoan : recordDetailInvoice;
        console.log('InvoiceDetail -> onShow -> recordDetailLoan', recordDetailLoan);
        this.setState({
          visible: true,
          recordList,
        });
      });
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 审批详情跳转
  onLinkDetail = () => {
    const { templateType } = this.props;
    const { invoiceDetail, loanDetail, applyDetail } = this.props;
    let details = invoiceDetail;
    if (Number(templateType) === 1) {
      details = loanDetail;
    } else if (Number(templateType) === 2) {
      details = applyDetail;
    }
    if (details.proInsId) {
      this.props.dispatch({
        type: 'global/approveUrl',
        payload: {
          proInsId: details.proInsId
        }
      }).then(() => {
        const url = this.props.approvedUrl;
        if (!url) {
          message.error('钉钉处理中，请稍后再试');
        } else {
          ddOpenSlidePanel(url, '审批详情', (res) => {
            console.log(res);
          }, (e) => {
            console.log(e);
          });
        }
      });
    } else {
      message.error('钉钉处理中，请稍后再试');
    }
  }

  handelOk = () => {
    const { id, templateType } = this.props;
    if (Number(templateType) === 1) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Loan?token=${localStorage.getItem('token')}&id=${id}`;
    } else if (Number(templateType) === 0) {
      window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${id}`;
    } else {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Application?token=${localStorage.getItem('token')}&id=${id}`;
    }
  }

  handelOkPrint = () => {
    const { id, templateType } = this.props;
    if (Number(templateType) === 1) {
      ddOpenLink(`${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem('token')}&ids=${id}`);
    } else if (Number(templateType) === 0) {
      ddOpenLink(`${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${id}`);
    } else {
      ddOpenLink(`${APP_API}/cost/pdf/batch/application?token=${localStorage.getItem('token')}&ids=${id}`);
    }
  }

  // 拒绝
  handleRefuse = (rejectNote) => {
    const { id, refuse } = this.props;
    refuse({
      rejectNote,
      id
    });
  }

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  previewFiles = (options) => {
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

  onChangeType = (operateType) => {
    const { details } = this.state;
    this.props.dispatch({
      type: 'costGlobal/checkTemplate',
      payload: {
        invoiceTemplateId: details.invoiceTemplateId,
      }
    }).then(() => {
      const { checkTemp } = this.props;
      if(checkTemp.isDisabled){
        message.error('单据已停用，无法提交。' );
        return;
      }
      if(!checkTemp.isCanUse){
        message.error('不可使用该单据，请联系管理员“超管”' );
        return;
      }
      this.setState({
        operateType,
        visible: false,
      }, () => {
        this.setState({
          invoiceVisible: true,
        });
      });
    });
  }

  onChangeVi = () => {
    this.setState({
      invoiceVisible: false,
    });
  }

  render() {
    const {
      visible,
      category,
      receipt,
      showFields,
      details,
      invoiceLoanRepayRecords,
      invoiceLoanAssessVos,
      supplierAccountVo,
      applicationAssociageVOS,
      recordList,
      isModify,
      operateType,
      invoiceVisible,
    } = this.state;
    const {
      children,
      canRefuse,
      templateType,
      allow,
      userInfo
    } = this.props;

    return (
      <span>
        <span onClick={() => this.onShow()}>
          { children }
        </span>
        <Modal
          visible={visible}
          title="单据详情"
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          onCancel={() => this.onCancel()}
          footer={(
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {
                  canRefuse &&
                  <RefuseModal refuse={val => this.handleRefuse(val)}>
                    <Button key="refuse" className="m-r-16">拒绝</Button>
                  </RefuseModal>
                }
                <Button
                  key="cancel"
                  type="default"
                  onClick={() => this.handelOk()}
                >
                  下载
                </Button>
                <Button
                  key="print"
                  type="default"
                  onClick={() => this.handelOkPrint()}
                >
                  打印
                </Button>
                {
                  allow === 'copy' && (userInfo.userId === details.userId) &&
                    <Button
                      key="again"
                      type="default"
                      operateType="copy"
                      className="m-l-8"
                      onClick={() => this.onChangeType('copy')}
                    >
                      复制
                    </Button>
                }
                {
                  isModify && allow === 'modify' &&
                    <Button
                      key="again"
                      type="default"
                      operateType="copy"
                      className="m-l-8"
                      onClick={() => this.onChangeType('modify')}
                    >
                      改单
                    </Button>
                }
              </div>
              <div>
                <Button type="default" onClick={() => this.onCancel()}>关闭</Button>
              </div>
            </div>
          )}
        >
          <div className={cs(style.header)}>
            <div className={style.line} />
            <span>单据基础信息</span>
          </div>
          <Row className="fs-14 m-l-10">
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据类型：</span>
              <span className="fs-14 c-black-65">{details.invoiceTemplateName}</span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
              <span className="fs-14 c-black-65">{details.invoiceNo}</span>
            </Col>
            {
              Number(templateType) === 2 ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>关联单据：</span>
                  <span className="fs-14 c-black-65">{details.relevanceInvoiceNo ? details.relevanceInvoiceNo : '无'}</span>
                </Col>
                :
                null
            }
            {
              Number(templateType) === 0 || Number(templateType) === 1 ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{ Number(templateType) ? '借款总额(元)' : '报销总额(元)' }：</span>
                  <span className="fs-14 c-black-65">¥{ Number(templateType) ? details.loanSum/100 : details.submitSum/100}</span>
                </Col>
                :
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>申请金额：</span>
                  <span className="fs-14 c-black-65">¥{ details.applicationSum ? details.applicationSum/100 : 0}</span>
                </Col>
            }
            {
              !Number(templateType) &&
              <>
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>核销金额：</span>
                  <span className="fs-14 c-black-65">¥{ details.assessSum ? details.assessSum/100 : 0}</span>
                </Col>
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>收款金额：</span>
                  <span className="fs-14 c-black-65">¥{ details.receiveSum > 0 ? details.receiveSum/100 : 0}</span>
                </Col>
              </>
            }
            {
              !Number(templateType) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交人：</span>
                <span className="fs-14 c-black-65">{details.createName}</span>
              </Col>
            }
            {
              Number(templateType) === 2 &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>申请人：</span>
                <span className="fs-14 c-black-65">{details.userName}</span>
              </Col>
            }
            {
              !Number(templateType) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交人部门：</span>
                <span className="fs-14 c-black-65">{details.createDeptName}</span>
              </Col>
            }
            {
              Number(templateType) === 2 &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>申请人部门：</span>
                <span className="fs-14 c-black-65">{details.deptName}</span>
              </Col>
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交日期：</span>
              <span className="fs-14 c-black-65">{details.createTime && moment(details.createTime).format('YYYY-MM-DD')}</span>
            </Col>
            {
              Number(templateType) !== 2 &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发放状态：</span>
                <span className="fs-14 c-black-65">{Number(templateType) ? getArrayValue(details.grantStatus, invoiceStatus) : getArrayValue(details.status, invoiceStatus)}</span>
              </Col>
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>审批状态：</span>
              <span className="fs-14 c-black-65">
                {getArrayValue(details.approveStatus, approveStatus)}
                <span className="link-c m-l-8" onClick={() => this.onLinkDetail(details.approvedUrl, details.approveStatus)}>审批详情</span>
              </span>
            </Col>
            {
              Number(templateType) === 1 ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>还款状态：</span>
                  <span className="fs-14 c-black-65">
                    {getArrayValue(details.loanStatus, loanStatus)}
                  </span>
                </Col>
                :
                null
            }
            {
              Number(templateType) === 1 ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>预计还款日期：</span>
                  <span className="fs-14 c-black-65">{details.repaymentTime ? moment(details.repaymentTime).format('YYYY-MM-DD') : '-'}</span>
                </Col>
                :
                null
            }
            {
              showFields.happenTime && showFields.happenTime.status ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发生日期：</span>
                  <span className="fs-14 c-black-65">{details.startTime ? moment(details.startTime).format('YYYY-MM-DD') : '-'}</span>
                  <span className="fs-14 c-black-65">{details.endTime ? `-${moment(details.endTime).format('YYYY-MM-DD')}` : ''}</span>
                </Col>
                :
                null
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{Number(templateType) ? '提交人' : '报销人'}：</span>
              <span className="fs-14 c-black-65">{details.userName}</span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{Number(templateType) ? '提交人部门' : '报销人部门'}：</span>
              <span className="fs-14 c-black-65">{details.deptName}</span>
            </Col>
            {
              showFields.receiptId && showFields.receiptId.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>收款账户：</span>
                    <span className="fs-14 c-black-65" style={{flex: 1}}>
                      <span className="m-r-8">{ receipt.name }</span>
                      { receipt.type ? getArrayValue(receipt.type, accountType) : ''}
                      <span className="m-r-8">{ receipt.bankName }</span>
                      {receipt.account}
                    </span>
                  </div>
                </Col>
                :
                null
            }
            {
              showFields.project && showFields.project.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>项目：</span>
                    <span className="fs-14 c-black-65" style={{flex: 1}}>
                      {details.projectName}
                    </span>
                  </div>
                </Col>
                :
                null
            }
            {
              showFields.supplier && showFields.supplier.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商：</span>
                    <span className="fs-14 c-black-65" style={{flex: 1}}>
                      {details.supplierName}
                    </span>
                  </div>
                </Col>
                :
                null
            }
            {
              showFields.supplier && showFields.supplier.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商账户：</span>
                    <span className="fs-14 c-black-65" style={{flex: 1}}>
                      <span className="m-r-8">{ supplierAccountVo.supplierAccountName }</span>
                      { supplierAccountVo.accountType ? getArrayValue(supplierAccountVo.accountType, accountType) : ''}
                      <span className="m-r-8">{ supplierAccountVo.bankName }</span>
                      {supplierAccountVo.supplierAccount}
                    </span>
                  </div>
                </Col>
                :
                null
            }
            {
              details.reasonForRejection &&
              <Col span={8} className="m-t-16">
                <div style={{display: 'flex'}}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>拒绝原因：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                    {details.reasonForRejection}
                  </span>
                </div>
              </Col>
            }
            {
              details.expandSubmitFieldVos &&
              (details.expandSubmitFieldVos.length > 0) &&
              details.expandSubmitFieldVos.map(itField => {
                let texts = itField.msg;
                if (itField.startTime) {
                console.log('InvoiceDetail -> render -> moment(Number(itField.startTime)).format(\'YYYY-MM-DD\')', moment(Number(itField.startTime)).format('YYYY-MM-DD'));
                texts = itField.endTime ?
                `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}-${moment(Number(itField.endTime)).format('YYYY-MM-DD')}`
                  :
                  `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}`;
                }
                return (
                  <Col span={8} className="m-t-16" key={itField.field}>
                    <div style={{display: 'flex'}}>
                      <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{itField.name}：</span>
                      <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                        {texts}
                      </span>
                    </div>
                  </Col>
                );
              })
            }
            {
              details.selfSubmitFieldVos &&
              (details.selfSubmitFieldVos.length > 0) &&
              details.selfSubmitFieldVos.map(itField => {
                let texts = itField.msg;
                if (itField.startTime) {
                console.log('InvoiceDetail -> render -> moment(Number(itField.startTime)).format(\'YYYY-MM-DD\')', moment(Number(itField.startTime)).format('YYYY-MM-DD'));
                texts = itField.endTime ?
                `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}-${moment(Number(itField.endTime)).format('YYYY-MM-DD')}`
                  :
                  `${moment(Number(itField.startTime)).format('YYYY-MM-DD')}`;
                }
                return (
                  <Col span={8} className="m-t-16" key={itField.field}>
                    <div style={{display: 'flex'}}>
                      <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{itField.name}：</span>
                      <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                        {texts}
                      </span>
                    </div>
                  </Col>
                );
              })
            }
          </Row>
          <Divider type="horizontal" className="m-t-16 m-b-23" />
          <Row className="m-l-10">
            <Col span={24}>
              <div style={{display: 'flex'}}>
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{showFields.reason && showFields.reason.name ? showFields.reason.name : '事由'}：</span>
                <span className="fs-14 c-black-65" style={{flex: 1}}>{details.reason}</span>
              </div>
            </Col>
          </Row>
          {
            showFields.note && showFields.note.status ?
              <Row className="m-l-10">
                <Col span={24} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据备注：</span>
                    <span className="fs-14 c-black-65">{details.note}</span>
                  </div>
                </Col>
              </Row>
              :
              null
          }
          {
            showFields.imgUrl && showFields.imgUrl.status ?
              <Row className="m-l-10">
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>图片：</span>
                    <span className={cs(style.imgUrl, style.wraps)}>
                      {
                        details.imgUrl && details.imgUrl.length ? details.imgUrl.map((it, index) => (
                          <div className="m-r-8 m-b-8" onClick={() => this.previewImage(details.imgUrl, index)}>
                            <img alt="图片" src={it.imgUrl} className={style.images} />
                          </div>
                        ))
                        :
                        '-'
                      }
                    </span>
                  </div>
                </Col>
              </Row>
              :
              null
          }
          {
            showFields.fileUrl && showFields.fileUrl.status ?
              <Row className="m-l-10">
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>附件：</span>
                    <span className={cs('fs-14', 'c-black-65', style.file)}>
                      {
                        details.fileUrl && details.fileUrl.length ? details.fileUrl.map(it => (
                          <div className={style.files} onClick={() => this.previewFiles(it)}>
                            <img
                              className='attachment-icon'
                              src={fileIcon[it.fileType]}
                              alt='attachment-icon'
                            />
                            <p key={it.fileId} style={{marginBottom: '8px'}}>{it.fileName}</p>
                          </div>
                        ))
                        :
                        <span>-</span>
                      }
                    </span>
                  </div>
                </Col>
              </Row>
              :
              null
          }
          {
            invoiceLoanRepayRecords && invoiceLoanRepayRecords.length > 0 &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>核销记录（借款¥{details.loanSum/100} 待核销¥{details.waitAssessSum/100} ）</span>
              </div>
              <Borrow list={invoiceLoanRepayRecords} type={0} />
            </>
          }
          {
            invoiceLoanAssessVos && invoiceLoanAssessVos.length > 0 &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>借款核销</span>
              </div>
              <Borrow list={invoiceLoanAssessVos} type={1} />
            </>
          }
          {
            !Number(templateType) &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>费用明细（共{category.length}项，合计¥{ Number(templateType) ? details.loanSum/100 : details.submitSum/100}）</span>
              </div>
              <CostDetailTable
                list={category}
              />
            </>
          }
          {
            applicationAssociageVOS && applicationAssociageVOS.length > 0 &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>关联申请单</span>
              </div>
              <Apply list={applicationAssociageVOS} type={1} />
            </>
          }
          {
            recordList.length > 0 &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>改单历史</span>
              </div>
              <RecordHistory list={recordList} type={1} />
            </>
          }
        </Modal>
        <AddInvoice
          templateType={templateType}
          id={details.invoiceTemplateId}
          visible={invoiceVisible}
          contentJson={JSON.stringify(details)}
          onChangeVisible={() => this.onChangeVi()}
          onHandleOk={() => {
            if (this.props.onCallback) {
              this.props.onCallback();
            }
          }}
          operateType={operateType}
        />
      </span>
    );
  }
}

export default InvoiceDetail;
