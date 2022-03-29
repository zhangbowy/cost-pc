/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col, Tooltip,Tag} from 'antd';
import cs from 'classnames';
import moment from 'moment';
import aliLogo from '@/assets/img/aliTrip/alitrip.png';
import style from './index.scss';
import { invoiceStatus, getArrayValue, approveStatus, loanStatus, accountType } from '../../../utils/constants';
import DisabledTooltip from './DisabledTooltip';

const thirdInvoiceTig = {
    0:'阿里商旅自动导入单据',
    10: '鑫资产自动导入单据',
    20: '智能薪酬自动导入单据',
    30:'历史导入单据'
  };

const BasicText = ({ details, selfSubmitFieldVos, templateType,
  onLinkDetail, showFields, receipt,
  previewImage, supplierAccountVo, aliTrip, expandSubmitFieldVos }) => {
  return (
    <Row className="fs-14 m-l-10" style={{display: 'flex',flexWrap: 'wrap'}}>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单据类型：</span>
        <span className="fs-14 c-black-65">{details.invoiceTemplateName}</span>
      </Col>
      <Col span={8} className={cs('m-t-16',style.nameIcon)}>
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
        <span className="fs-14 c-black-65">
          {details.invoiceNo}
          {
            details.thirdInvoiceType===0 &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
        {/* 鑫资产标签 */}
        {
          details.thirdInvoiceType===10 && (
            <Tag color="blue">
              <i className="iconfont iconxinzichan" style={{ verticalAlign: 'middle', marginRight: '3px' }} />
              <span>鑫资产</span>
            </Tag>)
        }
        {/* 智能薪酬标签 */}
        {
          details.thirdInvoiceType===20 && (
            <Tag color="orange">
              <span>智能薪酬</span>
            </Tag>)
        }
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
            details.cantCopy ||details.thirdInvoiceType ?
              <DisabledTooltip
                className="m-l-8"
                title={`${thirdInvoiceTig[details.thirdInvoiceType]
            }，无审批环节`}
                name="审批详情"
              />
            :
              <span className="link-c m-l-8 cur-p" onClick={() => onLinkDetail(details.approvedUrl, details.approveStatus)}>审批详情</span>
          }
        </span>
      </Col>
      {
        Number(templateType) === 1 &&
          <Col span={8} className="m-t-16">
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>还款状态：</span>
            <span className="fs-14 c-black-65">
              {getArrayValue(details.loanStatus, loanStatus)}
            </span>
          </Col>
      }
      {
        Number(templateType) === 1 &&
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
      }
      {
        showFields.happenTime && showFields.happenTime.status &&
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
      }
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          {Number(templateType) ? Number(templateType) === 1 ? '借款人' : '提交人' : '报销人'}：
        </span>
        <span className="fs-14 c-black-65">
          {
            details.userId !== details.createId && Number(templateType) === 1 ?
            `${details.createName}已移交给${details.userName}` : details.userName
          }
        </span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          {Number(templateType) ? Number(templateType) === 1 ? '借款人部门' : '提交人部门' : '报销人部门'}：
        </span>
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
                <span className="m-r-8">{receipt.account}</span>
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
                    onClick={() => previewImage([{ imgUrl: receipt.qrUrl }], 0)}
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
                    onClick={() => previewImage([{ imgUrl: supplierAccountVo.qrUrl }], 0)}
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
            <span className={cs('fs-14', style.nameTil)} style={{color: '#FF5A5F'}}>拒绝原因：</span>
            <span className={cs('fs-14', style.rightFlex)} style={{color: '#FF5A5F'}}>
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
        aliTrip && aliTrip.expenseOwner && aliTrip.expenseOwner.userName &&
        <Col span={8} className="m-t-16">
          <div style={{display: 'flex'}}>
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>归属人：</span>
            <span className={cs('fs-14','c-black-65', style.rightFlex)}>
              {aliTrip.expenseOwner.userName}
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
                    <div className="m-r-8 m-b-8" onClick={() => previewImage(details.payVoucher, index, true)}>
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
  );
};

export default BasicText;
