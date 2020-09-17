import React, { Component } from 'react';
import { Modal, Row, Col, Table, Tag, Popover, message, Button, Tooltip } from 'antd';
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
// import { DownloadFile } from '../../../utils/ddApi';

const { APP_API } = constants;
@connect(({ global }) => ({
  invoiceDetail: global.invoiceDetail,
  approvedUrl: global.approvedUrl,
  djDetail: global.djDetail,
  loanDetail: global.loanDetail
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
    };
  }

  onShow = () => {
    const { id, templateType } = this.props;
    let url = 'global/invoiceDetail';
      let params = { id };
      if (Number(templateType)) {
        url = 'global/loanDetail';
        params = { loanId: id };
    }
    this.props.dispatch({
      type: url,
      payload: params
    }).then(() => {
      const { invoiceDetail, loanDetail } = this.props;
      const details = Number(templateType) ? loanDetail : invoiceDetail;
      console.log(details);
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
      if (details.supplierAccountVo) {
        this.setState({
          supplierAccountVo: details.supplierAccountVo || {},
        });
      }
      this.props.dispatch({
        type: 'global/djDetail',
        payload: {
          id: details.invoiceTemplateId,
          templateType
        }
      }).then(() => {
        const { djDetail } = this.props;
          const showObj = {};
          if (djDetail.showField) {
            const arr = JSON.parse(djDetail.showField);
            arr.forEach(it => {
              showObj[it.field] = {...it};
            });
          }
          this.setState({
            showFields: showObj,
          });
          this.setState({
            visible: true,
            details,
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
    const { invoiceDetail } = this.props;
    if (invoiceDetail.proInsId) {
      this.props.dispatch({
        type: 'global/approveUrl',
        payload: {
          proInsId: invoiceDetail.proInsId
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
    if (Number(templateType)) {
      window.location.href = `${APP_API}/cost/export/pdfDetail4Loan?token=${localStorage.getItem('token')}&id=${id}`;
    } else {
      window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${id}`;
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
      type: 'global/grantDownload',
      payload: {
        fileIds: options.fileId
      }
    }).then(() => {
      console.log(options);
      previewFile(options);
      // DownloadFile(options.file, options.fileName);
    });
  }

  render() {
    const { visible,  category, receipt, showFields, details, invoiceLoanRepayRecords, invoiceLoanAssessVos, supplierAccountVo } = this.state;
    const {
      children,
      canRefuse,
      templateType
    } = this.props;
    const newList = [];
    category.forEach(it => {
      const obj = {};
      it.expandCostDetailFieldVos.forEach(i => {
        obj[i.field] = i.msg;
      });
      newList.push({
        ...it,
        ...obj,
      });
    });
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span>
          <i className={`iconfont icon${record.icon}`} />
          <span>{record.categoryName}</span>
        </span>
      ),
      width: 130
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>¥{(record.costSum || 0)/100}</span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">分摊明细：金额 ¥{record.costSum/100}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>¥{it.shareAmount/100}</span>
                      </p>
                    ))
                  }
                </div>
              )}
            >
              <Tag>分摊明细</Tag>
            </Popover>
          }
        </span>
      ),
      width: 200
    }, {
      title: '发生日期',
      dataIndex: 'happenTime',
      render: (_, record) => (
        <span>
          <span>{record.startTime ? moment(record.startTime).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(record.endTime).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      ),
      width: 120
    }, {
      title: '费用备注',
      dataIndex: 'note',
      width: 120,
      ellipsis: true,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '图片',
      dataIndex: 'imgUrl',
      render: (_, record) => (
        <span className={record.imgUrl && (record.imgUrl.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
          {record.imgUrl && record.imgUrl.map((it, index) => (
            <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
              <img alt="图片" src={it.imgUrl} className={style.images} />
            </div>
          ))}
        </span>
      ),
      textWrap: 'word-break',
      width: '140px'
    }];
    if (category && category.length > 0 ) {
      const arr = [];
      category.forEach(it => {
        if (it.expandCostDetailFieldVos && (it.expandCostDetailFieldVos.length > 0)) {
          const its = it.expandCostDetailFieldVos.map(item => {
              return {
                ...item,
                title: item.name,
                dataIndex: item.field,
                render: (text) => (
                  <span>
                    <Tooltip placement="topLeft" title={text || ''} arrowPointAtCenter>
                      <span className="eslips-2">{text}</span>
                    </Tooltip>
                  </span>
                ),
              };
          });
          arr.push(...its);
        }
      });
      const obj = {};
      const per = arr.reduce((cur,next) => {
        if (!obj[next.field]) {
          obj[next.field] = true;
          cur.push(next);
        }
        return cur;
      },[]);
      columns.splice(2, 0, ...per);
    }
    const moneys = newList && newList.reduce((arr, crr) => {
      return arr+crr.costSum/100;
    }, []);
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
          footer={([
            canRefuse && <RefuseModal refuse={val => this.handleRefuse(val)}><Button key="refuse" className="m-r-16">拒绝</Button></RefuseModal>,
            <Button key="cancel" type="primary" onClick={() => this.handelOk()}>打印</Button>
          ]
          )}
        >
          <div className={cs(style.header, 'm-b-16')}>
            <div className={style.line} />
            <span>单据基础信息</span>
          </div>
          <Row className="fs-14">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{showFields.reason && showFields.reason.name}：</span>
              <span className="fs-14 c-black-65">{details.reason}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据类型：</span>
              <span className="fs-14 c-black-65">{details.invoiceTemplateName}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
              <span className="fs-14 c-black-65">{details.invoiceNo}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{ Number(templateType) ? '借款总额(元)' : '报销总额(元)' }：</span>
              <span className="fs-14 c-black-65">¥{ Number(templateType) ? details.loanSum/100 : details.submitSum/100}</span>
            </Col>
            {
              showFields.loan && showFields.loan.status &&
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
              !Number(templateType) &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交人部门：</span>
                <span className="fs-14 c-black-65">{details.createDeptName}</span>
              </Col>
            }
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交日期：</span>
              <span className="fs-14 c-black-65">{details.createTime && moment(details.createTime).format('YYYY-MM-DD')}</span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发放状态：</span>
              <span className="fs-14 c-black-65">{getArrayValue(details.grantStatus || details.status, invoiceStatus)}</span>
            </Col>
            <Col span={8} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>审批状态：</span>
              <span className="fs-14 c-black-65">
                {getArrayValue(details.approveStatus, approveStatus)}
                <span className="link-c m-l-8" onClick={() => this.onLinkDetail(details.approvedUrl, details.approveStatus)}>审批详情</span>
              </span>
            </Col>
            {
              Number(templateType) ?
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
              Number(templateType) ?
                <Col span={8} className="m-t-16">
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>预计还款时间：</span>
                  <span className="fs-14 c-black-65">{details.repaymentTime ? moment(details.repaymentTime).format('YYYY-MM-DD') : '-'}</span>
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
              showFields.note && showFields.note.status &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据备注：</span>
                <span className="fs-14 c-black-65">{details.note}</span>
              </Col>
            }
            {
              showFields.receiptId && showFields.receiptId.status &&
              <Col span={8} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>收款账户：</span>
                <span className="fs-14 c-black-65">
                  { receipt.type ? getArrayValue(receipt.type, accountType) : ''}
                  <span className="m-r-8">{ receipt.bankName }</span>
                  {receipt.account}
                </span>
              </Col>
            }
            {
              showFields.imgUrl && showFields.imgUrl.status &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>图片：</span>
                <span className={cs(style.imgUrl, style.wraps)}>
                  {details.imgUrl && details.imgUrl.map((it, index) => (
                    <div className="m-r-8 m-b-8" onClick={() => this.previewImage(details.imgUrl, index)}>
                      <img alt="图片" src={it.imgUrl} className={style.images} />
                    </div>
                  ))}
                </span>
              </Col>
            }
            {
              showFields.fileUrl && showFields.fileUrl.status &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>附件：</span>
                <span className={cs('fs-14', 'c-black-65', style.file)}>
                  {details.fileUrl && details.fileUrl.map(it => (
                    <div className={style.files}>
                      <img
                        className='attachment-icon'
                        src={fileIcon[it.fileType]}
                        alt='attachment-icon'
                      />
                      <p key={it.fileId} style={{marginBottom: '8px'}} onClick={() => this.previewFiles(it)}>{it.fileName}</p>
                    </div>
                  ))}
                </span>
              </Col>
            }
            {
              showFields.project && showFields.project.status &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>项目：</span>
                <span className="fs-14 c-black-65">
                  {details.projectName}
                </span>
              </Col>
            }
            {
              showFields.supplier && showFields.supplier.status &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商：</span>
                <span className="fs-14 c-black-65">
                  {details.supplierName}
                </span>
              </Col>
            }
            {
              showFields.supplier && showFields.supplier.status &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商账户：</span>
                <span className="fs-14 c-black-65">
                  {supplierAccountVo.supplierAccountName} {supplierAccountVo.supplierAccount}
                </span>
              </Col>
            }
            {
              details.reasonForRejection &&
              <Col span={8} style={{display: 'flex'}} className="m-t-16">
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>拒绝原因：</span>
                <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                  {details.reasonForRejection}
                </span>
              </Col>
            }
            {
              details.expandSubmitFieldVos &&
              (details.expandSubmitFieldVos.length > 0) &&
              details.expandSubmitFieldVos.map(it => (
                <Col span={8} style={{display: 'flex'}} className="m-t-16" key={it.field}>
                  <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{it.name}：</span>
                  <span className={cs('fs-14','c-black-65', style.rightFlex)}>
                    {it.msg}
                  </span>
                </Col>
              ))
            }
          </Row>
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
            !Number(templateType) &&
            <>
              <div className={cs(style.header, 'm-b-16', 'm-t-16')}>
                <div className={style.line} />
                <span>费用明细（共{newList.length}项，合计¥{moneys}）</span>
              </div>
              <Table
                columns={columns}
                dataSource={newList}
                pagination={false}
                scroll={{x: columns.length > 6 ? '1400px' : '1000px'}}
                rowKey="id"
              />
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
        </Modal>
      </span>
    );
  }
}

export default InvoiceDetail;
