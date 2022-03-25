/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  Modal,
  message,
  Button,
  Divider,
  Tooltip,
} from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { withRouter } from 'react-router';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import fields from '@/utils/fields';
import style from './index.scss';
import constants from '../../../utils/constants';
import RefuseModal from './RefuseModal';
import { ddOpenLink, ddComplexPicker } from '../../../utils/ddApi';
import { numAdd } from '../../../utils/float';
import {
  handleProduction,
  compare,
} from '../../../utils/common';
import VerificationBasicText from './verification/BasicText';
import IncomeDetailTable from './verification/incomeDetailTable';
// import { DownloadFile } from '../../../utils/ddApi';

const { aliTraffic, signName } = fields;
const { APP_API } = constants;
@withRouter
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
  aliTripLink: costGlobal.aliTripLink,
  cityInfo: costGlobal.cityInfo,
  deptAndUser: costGlobal.deptAndUser
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
      productSum: 0,
      totalCost: 0,
      expandSubmitFieldVos: [],
      selfSubmitFieldVos: [],
      aliTrip: {},
      isSign: false,
      list: []
    };
  }

  onShow = () => {
    this.onInit(true);
  };

  onInit = flag => {
    const { id, templateType } = this.props;
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
    } else if (Number(templateType) === 4) {
      url = 'global/loanDetail';
      params = { loanId: id };
    }
    this.props
      .dispatch({
        type: url,
        payload: params
      })
      .then(async () => {
        const {
          invoiceDetail,
          loanDetail,
          applyDetail,
          salaryDetail
        } = this.props;
        let details = invoiceDetail;
        let productSum = 0;
        if (Number(templateType) === 1) {
          details = loanDetail;
        } else if (Number(templateType) === 2) {
          details = applyDetail;
        } else if (Number(templateType) === 3) {
          details = salaryDetail;
        } else if (Number(templateType) === 4) {
          details = loanDetail;
        }
        if (details.costDetailsVo) {
          this.setState({
            category: details.costDetailsVo
          });
        }
        if (details.receiptNameJson) {
          const receipts = JsonParse(details.receiptNameJson);
          this.setState({
            receipt: receipts[0] || {}
          });
        }
        if (details.invoiceLoanRepayRecords) {
          this.setState({
            invoiceLoanRepayRecords: details.invoiceLoanRepayRecords
          });
        }
        if (details.invoiceLoanAssessVos) {
          this.setState({
            invoiceLoanAssessVos: details.invoiceLoanAssessVos
          });
        }
        if (details.applicationAssociageVOS) {
          this.setState({
            applicationAssociageVOS: details.applicationAssociageVOS
          });
        }
        if (details.supplierAccountVo) {
          this.setState({
            supplierAccountVo: details.supplierAccountVo || {}
          });
        }
        if (details.applicationAssociageVOS) {
          details = {
            ...details,
            applicationIds: details.applicationAssociageVOS.map(
              it => it.applicationId
            )
          };
        }
        if (details.trip) {
          const {
            alitripCostCenterJson,
            alitripInvoiceTitleJson
          } = details.trip;
          console.log(
            'InvoiceDetail -> onShow -> alitripCostCenterJson',
            alitripCostCenterJson
          );
          this.setState({
            aliTrip: {
              ...details.trip,
              alitripCostCenterJson: alitripCostCenterJson
                ? JSON.parse(alitripCostCenterJson)
                : {},
              alitripInvoiceTitleJson: alitripInvoiceTitleJson
                ? JSON.parse(alitripInvoiceTitleJson)
                : {}
            }
          });
        }
        let totalCost = 0;
        if (details.costDetailsVo) {
          details.costDetailsVo.forEach(it => {
            totalCost += Number(it.costSum);
          });
        }
        if (details.detailList) {
          details.detailList.forEach(it => {
            productSum = numAdd(productSum, it.detail_money);
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
          if (
            newArr.filter(it => it.fieldType === 9) &&
            newArr.filter(it => it.fieldType === 9).length
          ) {
            newArrs = handleProduction(sortNew);
          } else {
            newArrs = [...sortNew];
          }
          expandSubmitFieldVos = newArrs.filter(
            it => it.field.indexOf('expand_') > -1
          );
          selfSubmitFieldVos = newArrs.filter(
            it => it.field.indexOf('self_') > -1
          );
          newArrs
            .filter(
              it =>
                it.field.indexOf('expand_') === -1 &&
                it.field.indexOf('self_') === -1
            )
            .forEach(it => {
              showObj[it.field] = { ...it };
            });
        }
        let cityInfo = {};
        const { costDetailsVo } = details;
        if (costDetailsVo && costDetailsVo.length > 0) {
          const cityArr = costDetailsVo
            .map(it => it.belongCity)
            .filter(item => item);
          if (Array.from(new Set(cityArr)).length > 0) {
            cityInfo = await this.cityInfo(Array.from(new Set(cityArr)));
          }
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
          cityInfo
        });
        this.props
          .dispatch({
            type: !Number(templateType)
              ? 'costGlobal/recordDetailInvoice'
              : 'costGlobal/recordDetailLoan',
            payload: {
              isMobile: false,
              id
            }
          })
          .then(() => {
            console.log(this.props.recordDetailLoan);
            const { recordDetailLoan, recordDetailInvoice } = this.props;
            const recordList = Number(templateType)
              ? recordDetailLoan
              : recordDetailInvoice;
            this.setState({
              recordList
            });
            if (flag) {
              this.setState({
                visible: true,
                list:
                  details.invoiceLoanShare && details.invoiceLoanShare.list
                    ? details.invoiceLoanShare.list
                    : []
              });
            }
          });
      });
  };

  onCancel = () => {
    this.setState({
      visible: false
    });
  };

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
      this.props
        .dispatch({
          type: 'global/approveUrl',
          payload: {
            proInsId: details.proInsId
          }
        })
        .then(() => {
          const url = this.props.approvedUrl;
          if (!url) {
            message.error('钉钉处理中，请稍后再试');
          } else {
            ddOpenSlidePanel(
              url,
              '审批详情',
              res => {
                console.log(res);
              },
              e => {
                console.log(e);
              }
            );
          }
        });
    } else {
      message.error('钉钉处理中，请稍后再试');
    }
  };

  handelOk = () => {
    const { id, templateType } = this.props;
    if (Number(templateType) === 1) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Loan?token=${localStorage.getItem(
        'token'
      )}&id=${id}`;
    } else if (Number(templateType) === 0) {
      window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem(
        'token'
      )}&id=${id}`;
    } else if (Number(templateType) === 3) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Salary?token=${localStorage.getItem(
        'token'
      )}&id=${id}`;
    } else {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Application?token=${localStorage.getItem(
        'token'
      )}&id=${id}`;
    }
  };

  handelOkPrint = () => {
    const { id, templateType } = this.props;
    if (Number(templateType) === 1) {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem(
          'token'
        )}&ids=${id}`
      );
    } else if (Number(templateType) === 0) {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem(
          'token'
        )}&ids=${id}`
      );
    } else if (Number(templateType) === 2) {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/application?token=${localStorage.getItem(
          'token'
        )}&ids=${id}`
      );
    } else {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/salary?token=${localStorage.getItem(
          'token'
        )}&ids=${id}`
      );
    }
  };

  // 拒绝
  handleRefuse = rejectNote => {
    const { id, refuse } = this.props;
    refuse({
      rejectNote,
      id
    });
  };

  previewFileOss = val => {
    window.open(val);
  };

  previewImage = (arr, index, flag) => {
    ddPreviewImage({
      urlArray: !flag ? arr.map(it => it.imgUrl) : arr,
      index
    });
  };

  previewFiles = (options, field) => {
    if (field === 'ossFileUrl' || options.fileUrl) {
      window.open(options.fileUrl);
      return;
    }
    this.props
      .dispatch({
        type: 'global/isApproval',
        payload: {
          spaceId: options.spaceId
        }
      })
      .then(() => {
        const { isApproval } = this.props;
        if (isApproval) {
          this.preview(options, 'global/newGrantDownload', true);
        } else {
          this.preview(options, 'global/grantDownload');
        }
      });
  };

  cityInfo = codes => {
    return new Promise(resolve => {
      this.props
        .dispatch({
          type: 'costGlobal/cityInfo',
          payload: {
            codes
          }
        })
        .then(() => {
          const { cityInfo } = this.props;
          const arr = {};
          if (cityInfo.success) {
            cityInfo.result.forEach(it => {
              Object.assign(arr, {
                [it.areaCode]: it.areaName
              });
            });
          } else {
            message.error(cityInfo.message);
          }
          resolve(arr);
        });
    });
  };

  preview = (options, url, flag) => {
    const { details } = this.state;
    const params = {
      fileIds: options.fileId
    };
    if (flag) {
      Object.assign(params, { processInstanceId: details.proInsId });
    }
    this.props
      .dispatch({
        type: url,
        payload: {
          ...params
        }
      })
      .then(() => {
        console.log(options);
        previewFile(options);
        // DownloadFile(options.file, options.fileName);
      });
  };

  render() {
    const {
      visible,
      category,
      receipt,
      showFields,
      details,
      totalCost,
      expandSubmitFieldVos,
      selfSubmitFieldVos,
      aliTrip,
      isSign,
      list
    } = this.state;
    const {
      children,
      templateType,
      userInfo,
      title
    } = this.props;

    const getFooter = () => {
      let footerDom;
      switch (templateType) {
        case 4:
          footerDom = (
            <div className={style.footerWrap}>
              <div />
              <div>
                <RefuseModal refuse={val => this.handleRefuse(val)}>
                  <Button key="refuse">拒绝核销</Button>
                </RefuseModal>
              </div>
            </div>
          );
          break;
        default:
          footerDom = (
            <div className={style.footerWrap}>
              <div />
              <div>
                <RefuseModal refuse={val => this.handleRefuse(val)}>
                  <Button key="refuse">拒绝核销</Button>
                </RefuseModal>
              </div>
            </div>
          );
          break;
      }
      return footerDom;
    };

    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          visible={visible}
          closable={false}
          title={
            <div className={style.modalBtn}>
              <span>{title || '单据详情'}</span>
              <div className={style.btnIcon}>
                <Tooltip title="打印">
                  <i
                    className="iconfont icona-dayin3x"
                    onClick={() => this.handelOkPrint()}
                  />
                </Tooltip>
                <Tooltip title="下载">
                  <i
                    className="iconfont icona-xiazai3x"
                    onClick={() => this.handelOk()}
                  />
                </Tooltip>
                <i
                  className="iconfont icona-guanbi3x"
                  onClick={() => this.onCancel()}
                />
              </div>
            </div>
          }
          width="980px"
          bodyStyle={{ height: '630px', overflowY: 'scroll' }}
          footer={getFooter()}
        >
          <div className={cs(style.header)}>
            <div className={style.line} />
            <span>单据基础信息</span>
          </div>
          {/* 基础信息 */}
          <VerificationBasicText
            details={details}
            selfSubmitFieldVos={selfSubmitFieldVos}
            templateType={Number(templateType)}
            onLinkDetail={this.onLinkDetail}
            showFields={showFields}
            receipt={receipt}
            previewImage={this.previewImage}
          />
          {/* 收入明细 */}
          <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
            <div className={style.line} />
            <span>
              收入明细（共{category.length}项，合计¥
              {Number(templateType)
                    ? totalCost / 100
                    : details.submitSum / 100}
              ）
            </span>
          </div>
          <IncomeDetailTable
            list={category}
            previewImage={this.previewImage}
            previewFiles={this.previewFiles}
          />
        </Modal>
      </span>
    );
  }
}

export default InvoiceDetail;
