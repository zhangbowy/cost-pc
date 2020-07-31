import React, { Component } from 'react';
import { Modal, Row, Col, Table, Tag, Popover, message, Button } from 'antd';
import cs from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import fileIcon from '@/utils/fileIcon.js';
import { invoiceStatus, getArrayValue, approveStatus } from '@/utils/constants';
import { ddOpenSlidePanel, ddPreviewImage, previewFile } from '@/utils/ddApi';
import { JsonParse } from '@/utils/common';
import style from './index.scss';
import constants, { accountType } from '../../../utils/constants';
// import { DownloadFile } from '../../../utils/ddApi';

const { APP_API } = constants;
@connect(({ global }) => ({
  invoiceDetail: global.invoiceDetail,
  approvedUrl: global.approvedUrl,
}))
class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      category: [],
      receipt: {},
    };
  }

  onShow = () => {
    const { id } = this.props;
    this.props.dispatch({
      type: 'global/invoiceDetail',
      payload: {
        id
      }
    }).then(() => {
      const { invoiceDetail } = this.props;
      if (invoiceDetail.costDetailsVo) {
        this.setState({
          category: invoiceDetail.costDetailsVo,
        });
      }
      if (invoiceDetail.receiptNameJson) {
        const receipts = JsonParse(invoiceDetail.receiptNameJson);
        this.setState({
          receipt: receipts[0] || {},
        });
      }
      this.setState({
        visible: true,
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
    const { id } = this.props;
    window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${id}`;
  }

  // 拒绝
  handleRefuse = () => {
    const { id, refuse } = this.props;
    refuse(id, () => {
      this.setState({ visible: false });
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
    const { visible,  category, receipt } = this.state;
    const {
      children,
      invoiceDetail,
      canRefuse
    } = this.props;

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
      width: 100
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
    return (
      <span>
        <span onClick={() => this.onShow()}>
          { children }
        </span>
        <Modal
          visible={visible}
          title="单据详情"
          width="980px"
          bodyStyle={{height: '572px', overflowY: 'scroll'}}
          onCancel={() => this.onCancel()}
          footer={([
            canRefuse && <Button key="refuse" onClick={() => this.handleRefuse()}>拒绝</Button>,
            <Button key="cancel" type="primary" onClick={() => this.handelOk()}>打印</Button>
          ]
          )}
        >
          <div className={cs(style.header, 'm-b-16')}>
            <div className={style.line} />
            <span>单据基础信息</span>
          </div>
          <Row className="m-b-16 fs-14">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>报销事由：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.reason}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据类型：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.invoiceTemplateName}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.invoiceNo}</span>
            </Col>
          </Row>
          <Row className="m-b-16">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>报销总额(元)：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.submitSum/100}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交人：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.createName}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交人部门：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.createDeptName}</span>
            </Col>
          </Row>
          <Row className="m-b-16">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>提交日期：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.createTime && moment(invoiceDetail.createTime).format('YYYY-MM-DD')}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>发放状态：</span>
              <span className="fs-14 c-black-65">{getArrayValue(invoiceDetail.status, invoiceStatus)}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>审批状态：</span>
              <span className="fs-14 c-black-65">
                {getArrayValue(invoiceDetail.approveStatus, approveStatus)}
                <span className="link-c m-l-8" onClick={() => this.onLinkDetail(invoiceDetail.approvedUrl, invoiceDetail.approveStatus)}>审批详情</span>
              </span>
            </Col>
          </Row>
          <Row className="m-b-16">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>报销人：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.userName}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>报销人部门：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.deptName}</span>
            </Col>
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据备注：</span>
              <span className="fs-14 c-black-65">{invoiceDetail.note}</span>
            </Col>
          </Row>
          <Row className="m-b-16">
            <Col span={8}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>收款账户：</span>
              <span className="fs-14 c-black-65">
                {/* {invoiceDetail.receiptName}  */}
                {/* {receipt.bankName}  */}
                { receipt.type ? getArrayValue(receipt.type, accountType) : ''}
                <span className="m-r-8">{ receipt.bankName }</span>
                {receipt.account}
              </span>
            </Col>
            <Col span={8} style={{display: 'flex'}}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>图片：</span>
              <span className={cs(style.imgUrl, style.wraps)}>
                {invoiceDetail.imgUrl && invoiceDetail.imgUrl.map((it, index) => (
                  <div className="m-r-8 m-b-8" onClick={() => this.previewImage(invoiceDetail.imgUrl, index)}>
                    <img alt="图片" src={it.imgUrl} className={style.images} />
                  </div>
                ))}
              </span>
            </Col>
            <Col span={8} style={{display: 'flex'}}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>附件：</span>
              <span className={cs('fs-14', 'c-black-65', style.file)}>
                {invoiceDetail.fileUrl && invoiceDetail.fileUrl.map(it => (
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
            <Col span={8} style={{display: 'flex'}} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>项目：</span>
              <span className="fs-14 c-black-65">
                {invoiceDetail.projectName}
              </span>
            </Col>
            <Col span={8} style={{display: 'flex'}} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商：</span>
              <span className="fs-14 c-black-65">
                {invoiceDetail.supplierName}
              </span>
            </Col>
            <Col span={8} style={{display: 'flex'}} className="m-t-16">
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>供应商账户：</span>
              <span className="fs-14 c-black-65">
                {invoiceDetail.supplierAccountName} {invoiceDetail.supplierAccount}
              </span>
            </Col>
          </Row>
          <div className={cs(style.header, 'm-b-16')}>
            <div className={style.line} />
            <span>费用明细</span>
          </div>
          <Table
            columns={columns}
            dataSource={category}
            pagination={false}
            rowKey="id"
          />
        </Modal>
      </span>
    );
  }
}

export default InvoiceDetail;
