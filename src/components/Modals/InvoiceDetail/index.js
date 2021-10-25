/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Modal, message, Button, Divider, Tooltip, Timeline } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import fields from '@/utils/fields';
import style from './index.scss';
import constants from '../../../utils/constants';
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
import ShareLoan from './ShareLoan';
import MainText from './MainText';
import BasicText from './BasicText';
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
  aliTripLink: costGlobal.aliTripLink,
  cityInfo: costGlobal.cityInfo,
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
      cityInfo: {},
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
    }).then(async() => {
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
      let cityInfo = {};
      const { costDetailsVo } = details;
      if (costDetailsVo && costDetailsVo.length > 0) {
        const cityArr = costDetailsVo.map(it => it.belongCity).filter(item => item);
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

  cityInfo = (codes) => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/cityInfo',
        payload: {
          codes,
        }
      }).then(() => {
        const { cityInfo } = this.props;
        console.log('InvoiceDetail -> cityInfo -> cityInfo', cityInfo);
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
      userInfo,
      id
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
                  allow === 'copy' && (userInfo.userId === details.createId) && !details.isEnterpriseAlitrip &&
                    <Tooltip title="复制">
                      <i className="iconfont icona-fuzhi3x" onClick={() => this.onChangeType('copy')} />
                    </Tooltip>
                }
                {
                  details.isEnterpriseAlitrip && (userInfo.userId === details.createId) &&
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
                  details.status === 3 && Number(templateType) === 1 && (userInfo.userId === details.createId) &&
                  <ShareLoan
                    invoiceId={id}
                    onCanel={() => this.onCancel()}
                    list={details.invoiceLoanShare && details.invoiceLoanShare.list ? details.invoiceLoanShare.list : []}
                  >
                    <Button type="primary" className="m-r-8">共享</Button>
                  </ShareLoan>
                }
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
          <BasicText
            details={details}
            selfSubmitFieldVos={selfSubmitFieldVos}
            templateType={Number(templateType)}
            onLinkDetail={this.onLinkDetail}
            showFields={showFields}
            receipt={receipt}
            previewImage={this.previewImage}
            supplierAccountVo={supplierAccountVo}
            aliTrip={aliTrip}
            expandSubmitFieldVos={expandSubmitFieldVos}
          />
          <Divider type="horizontal" className="m-t-16" />
          <MainText
            showFields={showFields}
            details={details}
            previewImage={this.previewImage}
            previewFiles={this.previewFile}
          />
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
                cityInfo={this.state.cityInfo}
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
          {
            details.shareOperationRecords && !!(details.shareOperationRecords.length) &&
            <>
              <div className={cs(style.header, 'm-b-24', 'm-t-16')}>
                <div className={style.line} />
                <span>共享记录</span>
              </div>
              <Timeline>
                {
                  details.shareOperationRecords.map(it => (
                    <Timeline.Item key={it.createTime} color="#00C795">
                      <div className={style.recordProd}>
                        <p className="fs-14 c-black-65" style={{maxWidth: '760px'}}>{it.description}</p>
                        <p className="fs-13 c-black-45 m-l-16">
                          {it.createTime ? moment(it.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                        </p>
                      </div>
                    </Timeline.Item>
                  ))
                }
              </Timeline>
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
