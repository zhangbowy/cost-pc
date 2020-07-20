/**
 * @name 上传、下载模板组件
 * @param {function} callback 操作完成后的回调
 * @param {string} type 区分项目和供应商
 * @param {boolean} loading 上传状态
 * @param {object} uploadRes 上传成功返回的结果
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Upload, Spin, Form, message } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import constants from '@/utils/constants';
import styles from './index.scss';

const {
  APP_API,
} = constants;

@Form.create()
@connect(({ global, loading }) => ({
  loading: loading.effects['global/uploadSupplierFile'] || loading.effects['global/uploadProjectFile'] || false,
  uploadRes: global.uploadRes
}))
class BatchImport extends React.PureComponent {
  static propsTypes = {
    type: PropTypes.array.isRequired,
    callback: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: props.type === 'project' ? '项目' : '供应商',
      uploadModalVisible: false,
      resultModalVisible: false,
      fileList: [],
      uploadRes: {},
    };
  }

  // 上传Modal开关
  toogleUploadModal = (target) => {
    this.setState({
      uploadModalVisible: target
    });
  }

  // 关闭上传结果modal
  closeResModal = (action) => {
    let { uploadModalVisible } = this.state;
    const { callback } = this.props;
    callback({});
    if (action === 'all') {
      uploadModalVisible = false;
    }
    this.setState({
      resultModalVisible: false,
      uploadModalVisible
    });
  }

  beforeUpload = (file) => {
    this.setState({ fileList: [file] });
    return false;
  }

  removeFile = () => {
    this.setState({ fileList: [] });
  }

  upload = () => {
    const { type } = this.props;
    const { fileList } = this.state;
    if(!fileList.length) {
      message.error('请上传文件');
      return;
    }
    const formData = new FormData();
    const url = type === 'supplier' ? 'global/uploadSupplierFile' : 'global/uploadProjectFile';
    formData.append('file', fileList[0]);
    this.props.dispatch({
      type: url,
      payload: formData
    }).then(() => {
      const { uploadRes } = this.props;
      this.setState({
        uploadRes,
        resultModalVisible: true,
        fileList: []
      });
    });
  }

  render() {
    const { children, type, loading } = this.props;
    const { uploadModalVisible, resultModalVisible, uploadRes, title, fileList } = this.state;
    return (
      <span>
        <span onClick={() => this.toogleUploadModal(true)}>{children}</span>
        <Modal
          title={`批量导入${title}`}
          visible={uploadModalVisible}
          onCancel={() => this.toogleUploadModal(false)}
          footer={[
            <Button key="cancel" onClick={() => this.toogleUploadModal(false)}>取消</Button>,
            <Button key="ok" type="primary" onClick={() => this.upload()}>确定上传</Button>
          ]}
        >
          <Spin spinning={loading}>
            <div className="m-l-20">
              <span>{`请选择要导入的${title}文件（Excel格式）`}</span>
              <div className={cs('m-t-8', styles.import_wrapper)}>

                <Upload
                  accept=".xlsx"
                  action={`${APP_API}/cost/${type}/import/projectExcel?token=${localStorage.getItem('token')}`}
                  onChange={this.uploadChange}
                  beforeUpload={this.beforeUpload}
                  showUploadList
                  fileList={fileList}
                  onRemove={this.removeFile}
                >
                  <Button icon="upload">上传文件</Button>
                </Upload>

                <a href={`${APP_API}/cost/export/${type}/template?token=${localStorage.getItem('token')}`} size="small" className={cs('m-l-16', styles.download)}>下载模板</a>
              </div>
            </div>
          </Spin>
        </Modal>

        {/* 导入展示Modal */}
        <Modal
          title="批量导入"
          visible={resultModalVisible}
          onCancel={this.closeResModal}
          footer={[
            <Button key="cancel" onClick={() => this.closeResModal('all')}>关闭</Button>,
            uploadRes.failFileId
              ? (
                <Button key="save" >
                  <a href={`${APP_API}/cost/export/${type}/failData?failFileId=${uploadRes.failFileId}&token=${localStorage.getItem('token')}`}>
                    导出失败数据
                  </a>
                </Button>
              )
              : <Button key="save" onClick={this.closeResModal}>继续导入</Button>
          ]}
        >
          <span>{`导入成功${uploadRes.successNum}条，导入失败${uploadRes.failNum}条`}</span>
        </Modal>
      </span>
    );
  }
}

export default BatchImport;
