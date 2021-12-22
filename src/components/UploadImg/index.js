import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import cs from 'classnames';
import constants from '@/utils/constants';
import style from './index.scss';
import { ddPreviewImage } from '../../utils/ddApi';

const {imgPath} = constants;

class UploadImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.imgUrl || [],
    };
  }

  handleChange = (info) => {
    console.log('UploadImg -> handleChange -> info', info);
    const img = this.state.imgUrl;
    if (img.length === 9) {
      return;
    }
    let arr = info.result.imgUrl ? [...img, info.result] : [...img];
    if (arr.length > 9) {
      console.log('🚀 ~ file: index.js ~ line 25 ~ UploadImg ~ arr', arr);
      message.error('图片最多不超过9张');
      arr = arr.slice(0,8);
    }
    this.setState({
      imgUrl: arr
    });
    this.props.onChange(arr);
  }

  onDelete = (index) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const imgs = this.state.imgUrl;
    const { disabled } = this.props;
    if (disabled) {
      message.error('不允许删除');
      return;
    }
    imgs.splice(index, 1);
    this.setState({
      imgUrl: imgs,
    });
    this.props.onChange(imgs);
  }

  previewImage = (index) => {
    const arr = this.state.imgUrl;
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  render() {
    const { userInfo, disabled, maxLen } = this.props;
    const { imgUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    );
    return (
      <div className={style.imgClass}>
        {
          imgUrl.map((it, index) => (
            <div className={cs(style.img, 'm-b-8')} key={it.imgUrl}>
              <img src={it.imgUrl} alt="添加图片" style={{ width: '100%' }} onClick={() => this.previewImage(index)} />
              <i className="iconfont icondelete_fill" onClick={() => this.onDelete(index)} />
            </div>
          ))
        }
        <Upload
          name="file"
          accept="image/*"
          listType="picture-card"
          className="avatar-uploader"
          disabled={disabled}
          showUploadList={false}
          // loading={loading}
          action={imgPath}
          beforeUpload={this.beforeUpload}
          onSuccess={this.handleChange}
          data={{ companyId: userInfo ? userInfo.companyId : '' }}
          multiple
          headers={{
            token: localStorage.getItem('token') || ''
          }}
        >
          {imgUrl && imgUrl.length < (maxLen || 9) && uploadButton}
        </Upload>
      </div>
    );
  }
}

export default UploadImg;
