import React from 'react';
import cs from 'classnames';
import { Row, Col } from 'antd';
import style from './index.scss';
import fileIcon from '../../../utils/fileIcon';
import { srcName } from '../../../utils/common';

const MainText = ({ showFields, details, previewImage, previewFiles, previewFileOss }) => {
  return (
    <>
      <Row className="m-l-10">
        <Col span={24}>
          <div style={{display: 'flex'}}>
            <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{showFields.reason && showFields.reason.name ? showFields.reason.name : '事由'}：</span>
            <span className="fs-14 c-black-65" style={{flex: 1}}>{details.reason}</span>
          </div>
        </Col>
      </Row>
      {
        details.exceedReason &&
        <Row className="m-l-10">
          <Col span={24} className="m-t-16">
            <div style={{display: 'flex'}}>
              <span className={cs('fs-14', style.nameTil)} style={{color: '#FF5A5F'}}>超标理由：</span>
              <span className="fs-14 c-black-65" style={{flex: 1,color: '#FF5A5F'}}>{details.exceedReason}</span>
            </div>
          </Col>
        </Row>
      }
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
                      <div className="m-r-8 m-b-8" onClick={() => previewImage(details.imgUrl, index)}>
                        <img alt="图片" src={it.imgUrl} className={style.images} />
                      </div>
                    ))
                    :
                    '-'
                  }
                  {
                    showFields.imgUrl.itemExplain && showFields.imgUrl.itemExplain.map((its, i) => {
                      return(
                        <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
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
                      <div className={style.files} onClick={() => previewFiles(it)}>
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
                        <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
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
        showFields.ossFileUrl && showFields.ossFileUrl.status ?
          <Row className="m-l-10">
            <Col span={8} className="m-t-16">
              <div style={{display: 'flex'}}>
                <span className={cs('fs-14', 'c-black-85', style.nameTil)}>{showFields.ossFileUrl.name}：</span>
                <span className={cs('fs-14', 'c-black-65', style.file)}>
                  {
                    details.ossFileUrl && details.ossFileUrl.length ? details.ossFileUrl.map(it => (
                      <div className={style.files} onClick={() => previewFileOss(it.fileUrl)}>
                        <img
                          className='attachment-icon'
                          src={fileIcon[srcName(it.fileName)]}
                          alt='attachment-icon'
                        />
                        <p key={it.fileId} style={{marginBottom: '8px'}}>{it.fileName}</p>
                      </div>
                    ))
                    :
                    <span>-</span>
                  }
                  {
                    showFields.ossFileUrl.itemExplain && showFields.ossFileUrl.itemExplain.map((its, i) => {
                      return(
                        <p className="c-black-45 fs-12 m-b-0" key={its.msg}>
                          {i===0 ? '(' : ''}
                          {its.msg}
                          {(i+1) === showFields.ossFileUrl.itemExplain.length ? ')' : ''}
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
    </>
  );
};

export default MainText;
