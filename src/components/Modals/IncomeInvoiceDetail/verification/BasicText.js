/* eslint-disable no-nested-ternary */
import React from 'react';
import { Col, Row, Tag } from 'antd';
import cs from 'classnames';
import style from '../index.scss';
import { approveStatus, getArrayValue } from '../../../../utils/constants';
import DisabledTooltip from '../DisabledTooltip';
import fileIcon from '../../../../utils/fileIcon';
import { srcName } from '../../../../utils/common';

const thirdInvoiceTig = {
  0: '阿里商旅自动导入单据',
  10: '鑫资产自动导入单据',
  20: '智能薪酬自动导入单据',
  30: '历史导入单据'
};

const BasicText = ({
  details,
  onLinkDetail,
  showFields,
  previewImage,
  previewFiles,
  previewFileOss
}) => {
  return (
    <Row className="fs-14 m-l-10" style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          单据类型：
        </span>
        <span className="fs-14 c-black-65">{details.incomeTemplateName}</span>
      </Col>
      <Col span={8} className={cs('m-t-16', style.nameIcon)}>
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>单号：</span>
        <span className="fs-14 c-black-65">{details.invoiceNo}</span>
        {/* 鑫资产标签 */}
        {details.thirdInvoiceType === 10 && (
          <Tag color="blue">
            <i
              className="iconfont iconxinzichan"
              style={{ verticalAlign: 'middle', marginRight: '3px' }}
            />
            <span>鑫资产</span>
          </Tag>
        )}
        {/* 智能薪酬标签 */}
        {details.thirdInvoiceType === 20 && (
          <Tag color="orange">
            <span>智能薪酬</span>
          </Tag>
        )}
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>项目： </span>
        <span className="fs-14 c-black-65">{details.projectName || '-'}</span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          收入金额：
        </span>
        <span className="fs-14 c-black-65">
          ¥{details.assessSum ? details.assessSum / 100 : 0}
        </span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          业务员：
        </span>
        <span className="fs-14 c-black-65">
          {details.userName ? details.userName  : '-'}
        </span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          收入部门：
        </span>
        <span className="fs-14 c-black-65">{details.deptName || '-'}</span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          提交日期：
        </span>
        <span className="fs-14 c-black-65">{details.createName}</span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          审批状态：
        </span>
        <span className="fs-14 c-black-65">
          {getArrayValue(details.approveStatus, approveStatus)}
          {details.cantCopy || details.thirdInvoiceType ? (
            <DisabledTooltip
              className="m-l-8"
              title={`${thirdInvoiceTig[details.thirdInvoiceType]}，无审批环节`}
              name="审批详情"
            />
          ) : (
            <span
              className="link-c m-l-8 cur-p"
              onClick={() =>
                onLinkDetail(details.approvedUrl, details.approveStatus)}
            >
              审批详情
            </span>
          )}
        </span>
      </Col>
      {/* <Col span={8} className="m-t-16"> */}
      {/*  <span className={cs('fs-14', 'c-black-85', style.nameTil)}> */}
      {/*    发生日期： */}
      {/*  </span> */}
      {/*  <span className="fs-14 c-black-65">{details.createName}</span> */}
      {/* </Col> */}
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          提交人：
        </span>
        <span className="fs-14 c-black-65">{details.createName || '-'}</span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          提交人部门：
        </span>
        <span className="fs-14 c-black-65">{details.createDeptName || '-'}</span>
      </Col>
      <Col span={8} className="m-t-16">
        <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
          所在公司：
        </span>
        <span className="fs-14 c-black-65">{details.officeName || '-'}</span>
      </Col>
      <Col span={24} className="m-t-16">
        <div style={{ display: 'flex' }}>
          <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
            事由：
          </span>
          <span className="fs-14 c-black-65" style={{ flex: 1 }}>
            {details.reason || '-'}
          </span>
        </div>
      </Col>
      {showFields.imgUrl && showFields.imgUrl.status ? (
        <Col span={24} className="m-t-16">
          <div style={{ display: 'flex' }}>
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
              图片：
            </span>
            <span className={cs(style.imgUrl, style.wraps)}>
              {details.imgUrl && details.imgUrl.length
                ? details.imgUrl.map((it, index) => (
                  <div
                    className="m-r-8 m-b-8"
                    onClick={() => previewImage(details.imgUrl, index)}
                  >
                    <img
                      alt="图片"
                      src={it.imgUrl}
                      className={style.images}
                    />
                  </div>
                  ))
                : '-'}
              {showFields.imgUrl.itemExplain &&
                showFields.imgUrl.itemExplain.map((its, i) => {
                  return (
                    <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
                      {i === 0 ? '(' : ''}
                      {its.msg}
                      {i + 1 === showFields.imgUrl.itemExplain.length
                        ? ')'
                        : ''}
                    </p>
                  );
                })}
            </span>
          </div>
        </Col>
      ) : null}
      {showFields.fileUrl && showFields.fileUrl.status ? (
        <Col span={24} className="m-t-16">
          <div style={{ display: 'flex' }}>
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
              附件：
            </span>
            <span className={cs('fs-14', 'c-black-65', style.file)}>
              {details.fileUrl && details.fileUrl.length ? (
                details.fileUrl.map(it => (
                  <div className={style.files} onClick={() => previewFiles(it)}>
                    <img
                      className="attachment-icon"
                      src={fileIcon[it.fileType]}
                      alt="attachment-icon"
                    />
                    <p key={it.fileId} style={{ marginBottom: '8px' }}>
                      {it.fileName}
                    </p>
                  </div>
                ))
              ) : (
                <span>-</span>
              )}
              {showFields.fileUrl.itemExplain &&
                showFields.fileUrl.itemExplain.map((its, i) => {
                  return (
                    <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
                      {i === 0 ? '(' : ''}
                      {its.msg}
                      {i + 1 === showFields.fileUrl.itemExplain.length
                        ? ')'
                        : ''}
                    </p>
                  );
                })}
            </span>
          </div>
        </Col>
      ) : null}
      {showFields.ossFileUrl && showFields.ossFileUrl.status ? (
        <Row className="m-l-10 ">
          <Col span={24} className="m-t-16">
            <div style={{ display: 'flex' }}>
              <span className={cs('fs-14', 'c-black-85', style.nameTil)}>
                {showFields.ossFileUrl.name}：
              </span>
              <span className={cs('fs-14', 'c-black-65', style.file)}>
                {details.ossFileUrl && details.ossFileUrl.length ? (
                  details.ossFileUrl.map(it => (
                    <div
                      className={style.files}
                      onClick={() => previewFileOss(it.fileUrl)}
                    >
                      <img
                        className="attachment-icon"
                        src={fileIcon[srcName(it.fileName)]}
                        alt="attachment-icon"
                      />
                      <p key={it.fileId} style={{ marginBottom: '8px' }}>
                        {it.fileName}
                      </p>
                    </div>
                  ))
                ) : (
                  <span>-</span>
                )}
                {showFields.ossFileUrl.itemExplain &&
                  showFields.ossFileUrl.itemExplain.map((its, i) => {
                    return (
                      <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
                        {i === 0 ? '(' : ''}
                        {its.msg}
                        {i + 1 === showFields.ossFileUrl.itemExplain.length
                          ? ')'
                          : ''}
                      </p>
                    );
                  })}
              </span>
            </div>
          </Col>
        </Row>
      ) : null}
    </Row>
  );
};

export default BasicText;
