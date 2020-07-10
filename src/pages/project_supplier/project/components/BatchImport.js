/**
 * @name 上传、下载模板组件
 * @param {function} callback 操作完成后的回调
 */

import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Upload, Spin } from 'antd';
import cs from 'classnames';
import constants from '@/utils/constants';
import styles from './index.scss';

const {
  APP_API,
} = constants;

@connect(({ session }) => ({
  userInfo: session.userInfo,
}))
class BatchImport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisible: false,
      resultModalVisible: false,
      uploadModalLoading: false,
      uploadRes: {
        failFileId: '',
        failNum: 0,
        successNum: 0
      },
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
    if(action === 'all') {
      uploadModalVisible = false;
    }
    this.setState({
      resultModalVisible: false,
      uploadModalVisible
    });
  }

  // 上传过程监听
  uploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadModalLoading: true });
    }
    if (info.file.status === 'done') {
      const { callback } = this.props;
      callback({});
      const response = info.file.response.result;
      this.setState({
        uploadRes: response
      });
      this.setState({
        resultModalVisible: true,
        uploadModalLoading: false
      });
    }
  }

  render() {
    const { children } = this.props;
    const { uploadModalVisible, resultModalVisible, uploadModalLoading, uploadRes } = this.state;
    return (
      <span className={styles.content}>
        <span onClick={() => this.toogleUploadModal(true)}>{children}</span>
        <Modal
          title="批量导入项目"
          visible={uploadModalVisible}
          onCancel={() => this.toogleUploadModal(false)}
          footer={[
            <Button key="cancel" onClick={() => this.toogleUploadModal(false)}>取消</Button>,
          ]}
        >
          <Spin spinning={uploadModalLoading}>
            <div className="m-l-20">
              <sapn>请选择要导入的项目文件（Excel格式）</sapn>
              <div className={cs('m-t-8', styles.import_wrapper)}>

                <Upload
                  accept=".xlsx"
                  action={`${APP_API}/cost/project/import/projectExcel?token=${localStorage.getItem('token')}`}
                  onChange={this.uploadChange}
                  // customRequest={this.customRequest}
                  // beforeUpload={this.beforeUpload}
                  showUploadList={false}
                >
                  <Button icon="upload">上传文件</Button>
                </Upload>

                <a href={`${APP_API}/cost/project/export/template?token=${localStorage.getItem('token')}`} size="small" className={cs('m-l-16', styles.download)}>下载模板</a>
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
                  <a href={`${APP_API}/cost/project/export/failData?failFileId=${uploadRes.failFileId}&token=${localStorage.getItem('token')}`}>
                    导出失败数据
                  </a>
                </Button>
              )
              : <Button key="save" onClick={this.closeResModal}>继续导入</Button>
          ]}
        >
          <sapn>{`导入成功${uploadRes.successNum}条，导入失败${uploadRes.failNum}条`}</sapn>
        </Modal>
      </span>
    );
  }
}

export default BatchImport;
