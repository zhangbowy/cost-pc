import React, { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
// import cs from 'classnames';
import constants from '@/utils/constants';
import style from './index.scss';
import fileIcon from '../../utils/fileIcon';
import { srcName } from '../../utils/common';
// import fileIcon from '../../utils/fileIcon';
// import { ddPreviewImage } from '../../utils/ddApi';

const {filePath} = constants;

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: props.fileUrl || [],
    };
  }

  handleChange = (info) => {
    console.log('UploadImg -> handleChange -> info', info);
    const img = this.state.fileUrl;
    if (info.result) {
      this.setState({
        fileUrl: [...img, ...info.result]
      });
    }
    this.props.onChange([...img, ...info.result]);
  }

  onDelete = (e, index) => {
    e.stopPropagation();
    // eslint-disable-next-line react/no-access-state-in-setstate
    const imgs = this.state.fileUrl;
    const { disabled } = this.props;
    if (disabled) {
      message.error('不允许删除');
      return;
    }
    imgs.splice(index, 1);
    this.setState({
      fileUrl: imgs,
    });
    this.props.onChange(imgs);
  }

  previewFile = (it) => {
    window.open(it);
  }

  beforeUpload = file => {
    console.log('🚀 ~ file: index.js ~ line 53 ~ UploadFile ~ file', file.type);
    return new Promise((resolve, reject) => {
      if(file.type !=='application/ofd' && file.type !=='application/pdf'){
        message.error('仅支持上传ofd/pdf格式的文件');
        return reject();
      }
      return resolve(file.type ==='application/ofd' || file.type ==='application/pdf');
    });

  }

  render() {
    const { userInfo, disabled, maxLen } = this.props;
    const { fileUrl } = this.state;
    const uploadButton = (
      <Button disabled={disabled}>
        <Icon type="upload" />上传文件
      </Button>
    );
    return (
      <div className={style.imgClass}>
        <Upload
          name="file"
          className="avatar-uploader"
          disabled={disabled}
          showUploadList={false}
          // loading={loading}
          accept=".pdf,.ofd"
          action={filePath}
          beforeUpload={this.beforeUpload}
          onSuccess={this.handleChange}
          data={{ companyId: userInfo ? userInfo.companyId : '' }}
          multiple
          headers={{
            token: localStorage.getItem('token') || ''
          }}
        >
          {fileUrl && fileUrl.length < (maxLen || 100) && uploadButton}
        </Upload>
        <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>
          支持扩展名：.ofd .pdf
        </p>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden'}}>
          {
            fileUrl.map((item, index) => (
              <div key={item.fileUrl} className={style.fileList} onClick={() => this.previewFile(item.fileUrl)}>
                <div className={style.fileIcon}>
                  <img
                    className='attachment-icon'
                    src={fileIcon[srcName(item.fileName)]}
                    alt='attachment-icon'
                  />
                  <span className="eslips-1">{item.fileName}</span>
                </div>
                <i
                  className="iconfont icondelete_fill"
                  onClick={(e) => this.onDelete(e, index)}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default UploadFile;
