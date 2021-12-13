import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
// import cs from 'classnames';
import constants from '@/utils/constants';
import style from './index.scss';
import fileIcon from '../../utils/fileIcon';
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
    if (info.result.fileUrl) {
      this.setState({
        fileUrl: [...img, info.result]
      });
    }
    this.props.onChange([...img, info.result]);
  }

  onDelete = (index) => {
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

  previewImage = (it) => {
    window.open(it);
  }

  render() {
    const { userInfo, disabled, maxLen } = this.props;
    const { fileUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    );
    return (
      <div className={style.imgClass}>
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          disabled={disabled}
          showUploadList={false}
          // loading={loading}
          action={filePath}
          beforeUpload={this.beforeUpload}
          onSuccess={this.handleChange}
          data={{ companyId: userInfo ? userInfo.companyId : '' }}
          multiple
          headers={{
            token: localStorage.getItem('token') || ''
          }}
        >
          {fileUrl && fileUrl.length < (maxLen || 9) && uploadButton}
        </Upload>
        <p className="fs-14 c-black-45 li-1 m-t-8" style={{marginBottom: 0}}>
          支持扩展名：.rar .zip .doc .docx .pdf .jpg...
        </p>
        {
          fileUrl.map((item, index) => (
            <div key={item.fileId} className={style.fileList} onClick={() => this.previewFile(item)}>
              <div className={style.fileIcon}>
                <img
                  className='attachment-icon'
                  src={fileIcon[item.fileType]}
                  alt='attachment-icon'
                />
                <span className="eslips-1">{item.fileName}</span>
              </div>
              <i
                className="iconfont icondelete_fill"
                onClick={() => this.onDelFile(index)}
              />
            </div>
          ))
        }
      </div>
    );
  }
}

export default UploadFile;
