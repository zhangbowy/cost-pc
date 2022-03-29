/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  Modal,
  message,
  Button,
  Tooltip,
} from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import style from './index.scss';
import constants from '../../../utils/constants';
import RefuseModal from './RefuseModal';
import { ddOpenLink } from '../../../utils/ddApi';
import { numAdd } from '../../../utils/float';
import {
  handleProduction,
  compare,
} from '../../../utils/common';
import VerificationBasicText from './verification/BasicText';
// import { DownloadFile } from '../../../utils/ddApi';
import CostDetailTable from './CostDetailTable';
import RecordTable from './record';

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
  deptAndUser: costGlobal.deptAndUser,
  incomeDetail: global.incomeDetail
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
      totalCost: 0,
      selfSubmitFieldVos: [],
    };
  }

  onShow = () => {
    this.onInit(true);
  };

  onInit = () => {
    const { id } = this.props;
    const url = 'global/incomeDetail';
    const params = { id };
    this.props
      .dispatch({
        type: url,
        payload: params
      })
      .then(async () => {
        const {
          incomeDetail,
        } = this.props;
        const details = incomeDetail;
        let productSum = 0;
        let totalCost = 0;
        const recordCount = details.incomeAssessVos.length;
        if (details.incomeDetailVo) {
          this.setState({
            category: details.incomeDetailVo
          });
          details.incomeDetailVo.forEach(it => {
            totalCost += Number(it.incomeSum);
          });
        }
        if (details.receiptNameJson) {
          const receipts = JsonParse(details.receiptNameJson);
          this.setState({
            receipt: receipts[0] || {}
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
        this.setState({
          visible: true,
          details,
          totalCost,
          showFields: showObj,
          // eslint-disable-next-line react/no-unused-state
          expandSubmitFieldVos,
          selfSubmitFieldVos,
          recordCount
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
    const { incomeDetail  } = this.props;
    const details = incomeDetail;

    if (details.proInsId) {
      this.props
        .dispatch({
          type: 'global/approveUrl',
          payload: {
            proInsId: details.proInsId
          }
        })
        .then(() => {
          console.log(this.props);
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
    if (Number(templateType) === 20) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Income?token=${localStorage.getItem(
        'token'
      )}&id=${id}`;
    }
  };

  handelOkPrint = () => {
    const { id, templateType } = this.props;
    if (Number(templateType) === 20) {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/income?token=${localStorage.getItem(
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
      selfSubmitFieldVos,
      recordCount
    } = this.state;
    const {
      children,
      templateType,
      title
    } = this.props;

    const getFooter = () => {
      const { refuse } = this.props;
      let footerDom;
      switch (templateType) {
        case 4:
          break;
        default:
          footerDom = (
            <div className={style.footerWrap}>
              <div />
              <div>
                {(refuse && Number(details.status) === 2)  &&
                <RefuseModal refuse={val => this.handleRefuse(val)}>
                  <Button key="refuse">拒绝核销</Button>
                </RefuseModal>}
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
          bodyStyle={{ maxHeight: '630px', overflowY: 'scroll' }}
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
            previewFiles={this.previewFiles}
          />
          {/* 收入明细 */}
          <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
            <div className={style.line} />
            <span>
              收入明细（共{category.length}项，合计¥
              { totalCost / 100})
            </span>
          </div>
          <CostDetailTable
            list={category}
            previewImage={this.previewImage}
            previewFiles={this.previewFiles}
          />
          {/* 收款记录 */}
          <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
            <div className={style.line} />
            <span>
              收款记录（共{recordCount}项，合计¥
              { details.assessSum / 100})
            </span>
          </div>
          <RecordTable list={details.incomeAssessVos} />
        </Modal>
      </span>
    );
  }
}

export default InvoiceDetail;
