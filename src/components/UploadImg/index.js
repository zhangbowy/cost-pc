import React, { Component } from 'react';
import { Upload, Icon } from 'antd';
import constants from '@/utils/constants';
import cs from 'classnames';
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
    if (info.result.imgUrl) {
      this.setState({
        imgUrl: [...img, info.result]
      });
    }
    this.props.onChange([...img, info.result]);
  }

  onDelete = (index) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const imgs = this.state.imgUrl;
    imgs.splice(index, 1);
    this.setState({
      imgUrl: imgs,
    });
  }

  previewImage = (index) => {
    const arr = this.state.imgUrl;
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  render() {
    const { userInfo } = this.props;
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
          {imgUrl && imgUrl.length < 9 && uploadButton}
        </Upload>
      </div>
    );
  }
}

export default UploadImg;
