/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
import React, { memo, useState, useMemo } from 'react';
import { Upload } from 'antd';
import classnames from 'classnames';
import { useLocation } from 'react-router-dom';
import dd from 'dingtalk-jsapi';
import { Button } from 'antd-mobile';
import { getQuery } from '@/utils/query';
import style from './index.scss';
// import Icon from '@/components/Icon';
// import { errMsg } from '@/utils/mReactDom';

const srcList = {
  jpg: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/jpg-file.png',
  jpeg: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/jpg-file.png',
  png: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/ppt-file.png',
  pdf: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/pdf-file.png',
  doc: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/word-file.png',
  docx: 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/word-file.png'
};

// const SIZE_LIMIT = 50 * 1024 * 1024;

const wait = 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/wait-upload.png';
const unknown = 'https://xfw-recruit.oss-cn-hangzhou.aliyuncs.com/base/xzp/unknown.png';

const projectConfig = {
  uploadChannelOssUrl: 'http://cost-pc.forwe.work/cost/upload/file',
};

const uploadRequest = '支持上传多种渠道的简历，格式包括PDF、DOCX、DOC、PNG、JPG、JPEG，文件需小于50M';

const statusTexts = {
  uploading: '附件上传中……',
  done: '上传成功！',
  success: '上传成功！',
  error: '上传失败！'
};

const UploadFileMini = () => {
  const location = useLocation();
  const { companyId } = getQuery(location) || {};
  const [fileList, setFileList] = useState([]);
  dd.onMessage = (e) => {
    console.log(e);
  };
  // const handleChange = useCallback(
  //   ({ fileList = [] }) => {
  //     onChange && onChange(fileList);
  //   },
  //   [onChange]
  // );
  const handleChange = (info) => {
  console.log('🚀 ~ file: index.js ~ line 54 ~ handleChange ~ info', info);
    if (info.result) {
      setFileList([...fileList, ...info.result]);
    }
  };

  const { status, name, uid } = useMemo(
    () => (fileList && fileList[0]) || {},
    [fileList]
  );

  const statusText = statusTexts[status];

  const handleRemove = (e, index) => {
    e.stopPropagation();
    const img = [...fileList];
    img.splice(index, 1);
    setFileList(img);
  };
  const src = useMemo(
    () => {
      if (!uid) {
        return wait;
      }
      const names = (name || '').split('.');
      const extName = names[names.length - 1];
      return srcList[extName.toLowerCase()] || unknown;
    },
    [uid, name]
  );
  const srcName = (name) => {
    const names = (name || '').split('.');
    const extName = names[names.length - 1];
    return srcList[extName.toLowerCase()] || unknown;
  };
  const onSave = () => {
    dd.postMessage({
      fileList: JSON.stringify(fileList),
    });
  };
  // const handleBeforeUpload = file => {
  //   const { size, name } = file;
  //   if (size > SIZE_LIMIT) {
  //     message.error('文件不能大于50M');
  //     return Upload.LIST_IGNORE,
  //   }
  //   const names = (name || '').split('.');
  //   const extName = names[names.length - 1];
  //   console.log('🚀 ~ file: index.js ~ line 91 ~ UploadFileMini ~ extName', extName);
  //   if (!srcList[extName.toLowerCase()]) {
  //     message.error('请上传PDF、DOCX、DOC、PNG、JPG、JPEG格式的文件');
  //     return Upload.LIST_IGNORE;
  //   }
  //   return true;
  // };

  return (
    <div className={style.fileNameBody}>
      <div className={style['mpg-resume-from-channel--header']}>
        <Upload
          name="file"
          multiple
          action={projectConfig.uploadChannelOssUrl}
          className={style['mpg-resume-from-channel--header--upload']}
          fileList={fileList}
          onSuccess={handleChange}
          maxCount={9}
          showUploadList={false}
          data={{ companyId }}
          headers={{
            token: 'ca394cd0-5458-46e1-abd0-d8e2ec5c2e59'
          }}
        >
          <div className={style['mpg-resume-from-channel--header--upload-wrap']}>
            <img
              className={style['mpg-resume-from-channel--header--upload-image']}
              src={src}
              alt='upload'
            />
            <div className={style['mpg-resume-from-channel--header--upload-body']}>
              <div className={style['mpg-resume-from-channel--header--upload-content']}>
                <div className={style['mpg-resume-from-channel--header--upload-center']}>
                  <div className={style['mpg-resume-from-channel--header--upload-topic']}>
                    <p className={style['mpg-resume-from-channel--header--upload-title']}>
                      上传附件
                    </p>
                  </div>
                  {
                    statusText &&
                    <p
                      className={classnames(
                        style['mpg-resume-from-channel--header--upload-status'],
                        { 'is-error': status === 'error' }
                      )}
                    >
                      { statusText }
                    </p>
                  }
                </div>
                <p className={style['mpg-resume-from-channel--header--upload-button']}>
                  { uid ? '重新上传' : '点击上传' }
                </p>
              </div>
              <p className={style['mpg-resume-from-channel--header--upload-request']}>
                { uploadRequest }
              </p>
            </div>
          </div>
        </Upload>
        {
          fileList && fileList.map((it, index) => (
            <div className={style.list}>
              <div className={style.fileTitle} key={it.fileUrl}>
                <div className={style['mpg-resume-from-channel--header--upload-topic']}>
                  {
                    srcName[it.fileName] &&
                    <img
                      className={style['mpg-resume-from-channel--header--upload-image']}
                      src={srcName[it.fileName]}
                      alt='upload'
                    />
                  }
                  <p className={style.fileName}>
                    { it.fileName}
                  </p>
                </div>
                <i
                  className='iconfont icona-shibai3x'
                  type='iconqingkong'
                  category='proj'
                  onClick={e => handleRemove(e,index)}
                />
              </div>
            </div>
          ))
        }
      </div>
      <div className={style.btns}>
        <Button type="primary" className={style.antdBtn} onClick={onSave}>完成</Button>
      </div>
    </div>
  );
};

export default memo(UploadFileMini);
