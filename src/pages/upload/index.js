/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Upload } from 'antd';
import classnames from 'classnames';
import Icon from '@/components/Icon';
import { errMsg } from '@/utils/mReactDom';

const srcList = {
  jpg: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/jpg-file.png',
  jpeg: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/jpg-file.png',
  png: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/ppt-file.png',
  pdf: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/pdf-file.png',
  doc: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/word-file.png',
  docx: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/word-file.png'
};

const SIZE_LIMIT = 50 * 1024 * 1024;

const wait = 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/wait-upload.png';
const unknown = 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/unknown.png';

const projectConfig = require('@/project.config');

const uploadRequest = '支持上传多种渠道的简历，格式包括PDF、DOCX、DOC、PNG、JPG、JPEG，文件需小于50M';

const statusTexts = {
  uploading: '附件上传中……',
  done: '上传成功！',
  success: '上传成功！',
  error: '上传失败！'
};

const Header = ({ onChange, fileList, companyId }) => {
  const handleChange = useCallback(
    ({ fileList = [] }) => {
      onChange && onChange(fileList);
    },
    [onChange]
  );
  const { status, percent, name, uid } = useMemo(
    () => (fileList && fileList[0]) || {},
    [fileList]
  );
  const data = useMemo(
    () => ({
      companyId,
      fileType: 99
    }),
    [companyId]
  );
  const statusText = statusTexts[status];
  const handleRemove = useCallback(
    e => {
      e.stopPropagation();
      onChange && onChange([]);
    },
    [onChange]
  );
  const src = useMemo(
    () => {
      if (!uid) {
        return wait;
      }
      const names = (name || '').split('.');
      const extName = names[names.length - 1];
      return srcList[extName] || unknown;
    },
    [uid, name]
  );
  const handleBeforeUpload = file => {
    const { size, name } = file;
    if (size > SIZE_LIMIT) {
      errMsg('文件不能大于50M');
      return Upload.LIST_IGNORE;
    }
    const names = (name || '').split('.');
    const extName = names[names.length - 1];
    if (!srcList[extName]) {
      errMsg('请上传PDF、DOCX、DOC、PNG、JPG、JPEG格式的文件');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div className='mpg-resume-from-channel--header'>
      <p className='mpg-resume-from-channel--header--title'>投递简历</p>
      <Upload
        accept='.doc,.docx,.jpg,.jpeg,.png,.pdf,application/pdf,image/jpeg,image/jpg,image/png,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        action={projectConfig.uploadChannelOssUrl}
        className='mpg-resume-from-channel--header--upload'
        fileList={fileList}
        onChange={handleChange}
        maxCount={1}
        showUploadList={false}
        data={data}
        beforeUpload={handleBeforeUpload}
      >
        <div className='mpg-resume-from-channel--header--upload-wrap'>
          <img
            className='mpg-resume-from-channel--header--upload-image'
            src={src}
            alt='upload'
          />
          <div className='mpg-resume-from-channel--header--upload-body'>
            <div className='mpg-resume-from-channel--header--upload-content'>
              <div className='mpg-resume-from-channel--header--upload-center'>
                <div className='mpg-resume-from-channel--header--upload-topic'>
                  <p className='mpg-resume-from-channel--header--upload-title'>
                    { name || '附件简历' }
                  </p>
                  {
                    (
                      status === 'error' ||
                      status === 'done' ||
                      status === 'success'
                    ) &&
                    <Icon
                      className='mpg-resume-from-channel--header--upload-remove'
                      type='iconqingkong'
                      category='proj'
                      onClick={handleRemove}
                    />
                  }
                </div>
                {
                  status === 'uploading' &&
                  <div className='mpg-resume-from-channel--header--upload-percent-wrap'>
                    <div
                      className='mpg-resume-from-channel--header--upload-percent'
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                }
                {
                  statusText &&
                  <p
                    className={classnames(
                      'mpg-resume-from-channel--header--upload-status',
                      { 'is-error': status === 'error' }
                    )}
                  >
                    { statusText }
                  </p>
                }
              </div>
              <p className='mpg-resume-from-channel--header--upload-button'>
                { uid ? '重新上传' : '点击上传' }
              </p>
            </div>
            {
              !uid &&
              <p className='mpg-resume-from-channel--header--upload-request'>
                { uploadRequest }
              </p>
            }
          </div>
        </div>
      </Upload>
    </div>
  );
};
Header.propTypes = {
  fileList: PropTypes.array,
  onChange: PropTypes.func,
  companyId: PropTypes.string
};

export default memo(Header);
