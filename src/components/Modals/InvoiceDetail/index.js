/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Modal, Row, Col, message, Button, Divider, Tooltip } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import fileIcon from '@/utils/fileIcon.js';
import { invoiceStatus, getArrayValue, approveStatus, loanStatus } from '@/utils/constants';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import fields from '@/utils/fields';
import style from './index.scss';
import constants, { accountType } from '../../../utils/constants';
import RefuseModal from './RefuseModal';
import Borrow from './Borrow';
import Apply from './Apply';
import { ddOpenLink } from '../../../utils/ddApi';
import AddInvoice from '../AddInvoice';
import RecordHistory from './RecordHistory';
import CostDetailTable from './CostDetailTable';
import ProductTable from './ProductTable';
import { numAdd } from '../../../utils/float';
import { handleProduction, compare, getParams } from '../../../utils/common';
import AliLink from './AliLink';
import aliLogo from '@/assets/img/aliTrip/alitrip.png';
import DisabledTooltip from './DisabledTooltip';
// import { DownloadFile } from '../../../utils/ddApi';

const { aliTraffic } = fields;
const { APP_API } = constants;
@connect(({ global, costGlobal, session }) => ({
  invoiceDetail: global.invoiceDetail,
  approvedUrl: global.approvedUrl,
  djDetail: global.djDetail,
  loanDetail: global.loanDetail,
  applyDetail: global.applyDetail,
  salaryDetail: global.salaryDetail,
  isApproval: global.isApproval,
  recordDetailInvoice: costGlobal.recordDetailInvoice,
  recordDetailLoan: costGlobal.recordDetailLoan,
  checkTemp: costGlobal.checkTemp,
  userInfo: session.userInfo,
  aliTripLink: costGlobal.aliTripLink
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
      productSum: 0,
      totalCost: 0,
      expandSubmitFieldVos: [],
      selfSubmitFieldVos: [],
      aliTrip: {},
      isSign: false,
    };
  }

  onShow = () => {
    const { id, templateType } = this.props;
    console.log('InvoiceDetail -> onShow -> templateType', templateType);
    let url = 'global/invoiceDetail';
    let params = { id };
    if (Number(templateType) === 1) {
      url = 'global/loanDetail';
      params = { loanId: id };
    } else if (Number(templateType) === 2) {
      url = 'global/applyDetail';
      params = { applicationId: id };
    } else if (Number(templateType) === 3) {
      url = 'global/salaryDetail';
      params = { id };
    }
    this.props.dispatch({
      type: url,
      payload: params
    }).then(() => {
      const { invoiceDetail, loanDetail, applyDetail, salaryDetail } = this.props;
      let details = invoiceDetail;
      let productSum = 0;
      if (Number(templateType) === 1) {
        details = loanDetail;
      } else if (Number(templateType) === 2) {
        details = applyDetail;
      } else if (Number(templateType) === 3) {
        details = salaryDetail;
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
      if (details.trip) {
        const { alitripCostCenterJson, alitripInvoiceTitleJson } = details.trip;
        console.log('InvoiceDetail -> onShow -> alitripCostCenterJson', alitripCostCenterJson);
        this.setState({
          aliTrip: {
            ...details.trip,
            alitripCostCenterJson: alitripCostCenterJson ? JSON.parse(alitripCostCenterJson) : {},
            alitripInvoiceTitleJson: alitripInvoiceTitleJson ? JSON.parse(alitripInvoiceTitleJson) : {},
          },
        });
      }
      let totalCost = 0;
      if (details.costDetailsVo) {
        details.costDetailsVo.forEach(it => {
          totalCost+=Number(it.costSum);
        });
      }
      if (details.detailList) {
        details.detailList.forEach(it => {
          productSum=numAdd(productSum, it.detail_money);
        });
      }
      let expandSubmitFieldVos = [];
      let selfSubmitFieldVos = [];
      const showObj = {};
      if (details.showField) {
        const arr = JsonParse(details.showField);
        const newEx = details.expandSubmitFieldVos;
        const selfs = details.selfSubmitFieldVos;
        const newArr = [...arr, ...newEx, ...selfs];
        const sortNew = newArr.sort(compare('sort'));
        let newArrs = [];
        if (newArr.filter(it => it.fieldType === 9) &&
          newArr.filter(it => it.fieldType === 9).length) {
            newArrs = handleProduction(sortNew);
        } else {
          newArrs = [...sortNew];
        }
        expandSubmitFieldVos = newArrs.filter(it => it.field.indexOf('expand_') > -1);
        selfSubmitFieldVos = newArrs.filter(it => it.field.indexOf('self_') > -1);
        newArrs.filter(it =>
          it.field.indexOf('expand_') === -1 && it.field.indexOf('self_') === -1).
          forEach(it => {
          showObj[it.field] = {...it};
        });
      }
      this.setState({
        details,
        isModify: details.isModify,
        productSum,
        totalCost,
        showFields: showObj,
        expandSubmitFieldVos,
        selfSubmitFieldVos,
        isSign: details.isSign,
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
    const { invoiceDetail, loanDetail, applyDetail, salaryDetail } = this.props;
    let details = invoiceDetail;
    if (Number(templateType) === 1) {
      details = loanDetail;
    } else if (Number(templateType) === 2) {
      details = applyDetail;
    } else if (Number(templateType) === 3) {
      details = salaryDetail;
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
    } else if (Number(templateType) === 3) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Salary?token=${localStorage.getItem('token')}&id=${id}`;
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
    } else if (Number(templateType) === 2) {
      ddOpenLink(`${APP_API}/cost/pdf/batch/application?token=${localStorage.getItem('token')}&ids=${id}`);
    } else {
      ddOpenLink(`${APP_API}/cost/pdf/batch/salary?token=${localStorage.getItem('token')}&ids=${id}`);
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

  previewImage = (arr, index, flag) => {
    ddPreviewImage({
      urlArray: !flag ? arr.map(it => it.imgUrl) : arr,
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

  onAliTrip = payload => {
    const { details } = this.state;
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/aliTripLink',
        payload: {
          ddUserId: details.userJson[0].userId,
          invoiceId: details.id,
          ...payload
        },
      }).then(() => {
        const { aliTripLink } = this.props;
        resolve(aliTripLink);
      });
    });
  }

  onChangeSign = async() => {
    const { details, isSign } = this.state;
    const { templateType, signCallback } = this.props;
    if (signCallback) {
      try {
        const res = await signCallback({
          isSign: !isSign,
          invoiceIds: [details.id],
          templateType,
        });
        if (res) {
          this.setState({
            isSign: !isSign,
          });
        }
      } catch (error) {
        console.log(error);
      }

    }
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
      productSum,
      totalCost,
      expandSubmitFieldVos,
      selfSubmitFieldVos,
      aliTrip,
      isSign
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
          closable={false}
          title={(
            <div className={style.modalBtn}>
              <span>单据详情</span>
              <div className={style.btnIcon}>
                <Tooltip title="打印">
                  <i className="iconfont icona-dayin3x" onClick={() => this.handelOkPrint()} />
                </Tooltip>
                <Tooltip title="下载">
                  <i className="iconfont icona-xiazai3x" onClick={() => this.handelOk()} />
                </Tooltip>
                {
                  allow === 'copy' && (userInfo.userId === details.userId) && !details.isEnterpriseAlitrip &&
                    <Tooltip title="复制">
                      <i className="iconfont icona-fuzhi3x" onClick={() => this.onChangeType('copy')} />
                    </Tooltip>
                }
                {
                  details.isEnterpriseAlitrip && (userInfo.userId === details.userId) &&
                  allow === 'copy' &&
                  <Tooltip title="阿里商旅自动导入单据，不支持复制">
                    <i className="iconfont icona-fuzhi3x c-black-25" />
                  </Tooltip>
                }
                <i className="iconfont icona-guanbi3x" onClick={() => this.onCancel()} />
              </div>
            </div>
          )}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          footer={(
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {
                  canRefuse &&
                  <Button className="m-r-8" onClick={() => this.onChangeSign()}>
                    { isSign ? '移回待发放' : '移至已票签' }
                  </Button>
                }
                {
                  canRefuse &&
                  <RefuseModal refuse={val => this.handleRefuse(val)}>
                    <Button key="refuse">拒绝发放</Button>
                  </RefuseModal>
                }
                {
                  isModify && allow === 'modify' ?
                    details.isModifySelect ?
                      <Button
                        key="again"
                        type="default"
                        operateType="copy"
                        className="m-l-8"
                        onClick={() => this.onChangeType('modify')}
                      >
                        改单
                      </Button>
                      :
                      <Tooltip title="请联系管理员设置可改单字段">
                        <Button
                          key="again"
                          className="m-l-8"
                          disabled
                        >
                          改单
                        </Button>
                      </Tooltip>
                    :
                    null
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
          <Row className="fs-14 m-l-10" style={{display: 'flex',flexWrap: 'wrap'}}>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据类型：</span>
              <span className="fs-14 c-black-65">{details.invoiceTemplateName}</span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
              <span className="fs-14 c-black-65">
                {details.invoiceNo}
                {
                  details.isEnterpriseAlitrip &&
                  <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
                }
              </span>
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
                  {
                    Number(templateType === 2) ?
                      <span className="fs-14 c-black-65">
                        ¥{ details.applicationSum ? details.applicationSum/100 : 0}
                      </span>
                      :
                      <span className="fs-14 c-black-65">
                        ¥{ details.salaryAmount ? details.salaryAmount/100 : 0}
                      </span>
                  }
                </Col>
            }
            {
              !Number(templateType) && details.isRelationLoan &&
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
                <span className="fs-14 c-black-65">
                  {details.createName}
                </span>
              </Col>
            }
            {
              (Number(templateType) === 2 || Number(templateType) === 3) &&
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
              (Number(templateType) === 2 || Number(templateType) === 3) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>申请人部门：</span>
                <span className="fs-14 c-black-65">{details.deptName}</span>
              </Col>
            }
            {
              Number(templateType) === 3 &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>所属月份：</span>
                <span className="fs-14 c-black-65">{moment(details.month).format('YYYY-MM')}</span>
              </Col>
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交日期：</span>
              <span className="fs-14 c-black-65">{details.createTime && moment(details.createTime).format('YYYY-MM-DD')}</span>
            </Col>
            {
              (Number(templateType) !== 2 && Number(templateType) !== 3) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发放状态：</span>
                <span className="fs-14 c-black-65">{Number(templateType) ? getArrayValue(details.grantStatus, invoiceStatus) : getArrayValue(details.status, invoiceStatus)}</span>
              </Col>
            }
            {
              (Number(templateType) === 3) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发放状态：</span>
                <span className="fs-14 c-black-65">{getArrayValue(details.status, invoiceStatus)}</span>
              </Col>
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>审批状态：</span>
              <span className="fs-14 c-black-65">
                {getArrayValue(details.approveStatus, approveStatus)}
                {
                  details.isEnterpriseAlitrip ?
                    <DisabledTooltip title="阿里商旅自动导入单据，无审批环节" name="审批详情" />
                  :
                    <span className="link-c m-l-8" onClick={() => this.onLinkDetail(details.approvedUrl, details.approveStatus)}>审批详情</span>

                }
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
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>预计还款日期：</span>
                    <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                      <p className="fs-14 c-black-65" style={{marginBottom: 0}}>{details.repaymentTime ? moment(details.repaymentTime).format('YYYY-MM-DD') : '-'}</p>
                      {
                        showFields.repaymentTime &&
                        showFields.repaymentTime.itemExplain && showFields.repaymentTime.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.repaymentTime.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
                    </span>
                  </div>
                </Col>
                :
                null
            }
            {
              showFields.happenTime && showFields.happenTime.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发生日期：</span>
                    <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                      <span className="fs-14 c-black-65">{details.startTime ? moment(details.startTime).format('YYYY-MM-DD') : '-'}</span>
                      <span className="fs-14 c-black-65">{details.endTime ? `-${moment(details.endTime).format('YYYY-MM-DD')}` : ''}</span>
                      {
                        showFields.happenTime.itemExplain && showFields.happenTime.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.happenTime.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
                    </span>
                  </div>
                </Col>
                :
                null
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{Number(templateType) ? '提交人' : '报销人'}：</span>
              <span className="fs-14 c-black-65">
                {
                  details.userId !== details.createId && Number(templateType) === 1 ?
                  `${details.createName}已移交给${details.userName}` : details.userName
                }
              </span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{Number(templateType) ? '提交人部门' : '报销人部门'}：</span>
              <span className="fs-14 c-black-65">{details.deptName}</span>
            </Col>
            {
              details.officeName &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>所在公司：</span>
                <span className="fs-14 c-black-65">{details.officeName}</span>
              </Col>
            }
            {
              showFields.receiptId && showFields.receiptId.status ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>收款账户：</span>
                    <span className="fs-14 c-black-65" style={{flex: 1}}>
                      <span className="m-r-8">{ receipt.name }</span>
                      { receipt.type ? getArrayValue(receipt.type, accountType) : ''}
                      <span className="m-r-8">{ receipt.bankName }</span>
                      {receipt.account}<br />
                      {
                        !!receipt.bankNameBranch &&
                        <span className="m-r-8">{receipt.bankNameBranch}</span>
                      }
                      {
                        !!receipt.qrUrl &&
                        <img
                          src={receipt.qrUrl}
                          alt="二维码"
                          style={{ width: '58px', height: '58px' }}
                          onClick={() => this.previewImage([{ imgUrl: receipt.qrUrl }], 0)}
                        />
                      }
                      {
                        showFields.receiptId.itemExplain && showFields.receiptId.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.receiptId.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
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
                      {
                        showFields.project.itemExplain && showFields.project.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.project.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
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
                      {
                        showFields.supplier.itemExplain && showFields.supplier.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.supplier.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
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
                      <span className="m-r-8">{supplierAccountVo.supplierAccount}</span>
                      {supplierAccountVo.bankNameBranch || ''}
                      {
                        !!supplierAccountVo.qrUrl &&
                        <img
                          src={supplierAccountVo.qrUrl}
                          alt="二维码"
                          style={{ width: '58px', height: '58px' }}
                          onClick={() => this.previewImage([{ imgUrl: supplierAccountVo.qrUrl }], 0)}
                        />
                      }
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
              aliTrip && aliTrip.alitripCostCenterId &&
              <Col span={8} className="m-t-16">
                <div style={{display: 'flex'}}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>成本中心：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                    {aliTrip.alitripCostCenterJson.label || aliTrip.alitripCostCenterJson.title}
                  </span>
                </div>
              </Col>
            }
            {
              aliTrip && aliTrip.alitripCostCenterId &&
              <Col span={8} className="m-t-16">
                <div style={{display: 'flex'}}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发票抬头：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                    {aliTrip.alitripInvoiceTitleJson.label || aliTrip.alitripInvoiceTitleJson.title}
                  </span>
                </div>
              </Col>
            }
            {
              aliTrip && aliTrip.alitripExpensesOwner &&
              <Col span={8} className="m-t-16">
                <div style={{display: 'flex'}}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>同行人：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex, style.wraps)}>
                    <Tooltip
                      title={aliTrip.fellowTravelers && aliTrip.fellowTravelers.length ?
                        aliTrip.fellowTravelers.map(it => it.userName).join(',') : '-'}
                    >
                      <p className={style.overFlowSl}>
                        {aliTrip.fellowTravelers && aliTrip.fellowTravelers.length ?
                        aliTrip.fellowTravelers.map(it => it.userName).join(',') : ''}
                      </p>
                    </Tooltip>
                  </span>
                </div>
              </Col>
            }
            {
              aliTrip && aliTrip.alitripExpensesOwner &&
              <Col span={8} className="m-t-16">
                <div style={{display: 'flex'}}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>费用归属：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                    {aliTrip.alitripExpensesOwner}
                  </span>
                </div>
              </Col>
            }
            {
              expandSubmitFieldVos &&
              (expandSubmitFieldVos.length > 0) &&
              expandSubmitFieldVos.filter(
                it => (Number(it.fieldType) !== 3 && it.name !== '明细' && Number(it.fieldType) !== 9)
              ).map(itField => {
                let texts = itField.msg;
                if (itField.startTime) {
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
                        <p style={{marginBottom: 0}}>{texts}</p>
                        {
                          itField.itemExplain && itField.itemExplain.map((its, i) => {
                            return(
                              <p className="c-black-45 fs-12 m-b-0">
                                {i===0 ? '(' : ''}
                                {its.msg}
                                {(i+1) === itField.itemExplain.length ? ')' : ''}
                              </p>
                            );
                          })
                        }
                      </span>
                    </div>
                  </Col>
                );
              })
            }
            {
              selfSubmitFieldVos &&
              (selfSubmitFieldVos.length > 0) &&
              selfSubmitFieldVos.filter(it =>
                (Number(it.fieldType) !== 3 && Number(it.fieldType) !== 10
                && it.name !== '明细' && it.fieldType !== 9)
              ).map(itField => {
                let texts = itField.msg;
                if (itField.startTime) {
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
                        <p style={{marginBottom: 0}}>{texts}</p>
                        {
                          itField.itemExplain && itField.itemExplain.map((its, i) => {
                            return(
                              <p className="c-black-45 fs-12 m-b-0">
                                {i===0 ? '(' : ''}
                                {its.msg}
                                {(i+1) === itField.itemExplain.length ? ')' : ''}
                              </p>
                            );
                          })
                        }
                      </span>
                    </div>
                  </Col>
                );
              })
            }
            {
              details.payVoucher && details.payVoucher.length ?
                <Col span={8} className="m-t-16">
                  <div style={{display: 'flex'}}>
                    <span className={cs('fs-14', 'c-black-85', style.nameTil)}>付款凭证：</span>
                    <span className={cs(style.imgUrl, style.wraps)}>
                      {
                        details.payVoucher && details.payVoucher.length ? details.payVoucher.map((it, index) => (
                          <div className="m-r-8 m-b-8" onClick={() => this.previewImage(details.payVoucher, index, true)}>
                            <img alt="图片" src={it} className={style.images} />
                          </div>
                        ))
                        :
                        '-'
                      }
                    </span>
                  </div>
                </Col>
                :
                null
            }
          </Row>
          <Divider type="horizontal" className="m-t-16" />
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
                      {
                        showFields.imgUrl.itemExplain && showFields.imgUrl.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.imgUrl.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
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
                      {
                        showFields.fileUrl.itemExplain && showFields.fileUrl.itemExplain.map((its, i) => {
                          return(
                            <p className="c-black-45 fs-12 m-b-0">
                              {i===0 ? '(' : ''}
                              {its.msg}
                              {(i+1) === showFields.fileUrl.itemExplain.length ? ')' : ''}
                            </p>
                          );
                        })
                      }
                    </span>
                  </div>
                </Col>
              </Row>
              :
              null
          }
          {
            aliTrip.alitripCostCenterId && (userInfo.userId === details.userId) &&
            <>
              <AliLink
                status={details.approveStatus}
                onGetLink={this.onAliTrip}
                subTrip={aliTrip.subTrip || []}
              />
              <Divider type="horizontal" />
            </>
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
            aliTrip.subTrip && aliTrip.subTrip.length &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>行程（共{aliTrip.subTrip.length}个行程）</span>
              </div>
              <div style={{ display: 'flex' }}>
                {
                  aliTrip.subTrip.map(item => (
                    <div className={style.singleContent} key={item.startDate}>
                      <div className={style.iconImg}>
                        <img
                          src={getParams({res: item.traffic, list: aliTraffic, key: 'label', resultKey: 'icon'})}
                          alt="模式"
                        />
                      </div>
                      <div className="m-t-16">
                        <p className="c-black-85 fs-16 fw-500 m-b-6">{item.startCity} - {item.endCity}({item.way})</p>
                        <p className="c-black-65 fs-14">
                          {moment(Number(item.startDate)).format('YYYY-MM-DD')} - {moment(Number(item.endDate)).format('YYYY-MM-DD')}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </>
          }
          {
            (!Number(templateType) ||
            (Number(templateType) === 2 && category.length > 0)
            || Number(templateType) === 3)&&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>支出明细（共{category.length}项，合计¥{
                  Number(templateType) ? totalCost/100 : details.submitSum/100
                  }）
                </span>
              </div>
              <CostDetailTable
                list={category}
                previewImage={this.previewImage}
              />
            </>
          }
          {
            details.detailList &&  details.detailList.length > 0 &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>明细（共{details.detailList.length}项，合计¥{productSum/100}）</span>
              </div>
              <ProductTable cols={details.detailJson} list={details.detailList || []} />
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
              <RecordHistory
                list={recordList}
                type={1}
                previewImage={this.previewImage}
                previewFiles={this.previewFiles}
              />
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
