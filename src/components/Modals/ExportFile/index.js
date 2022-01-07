// /* eslint-disable no-param-reassign */
// /* eslint-disable react/no-access-state-in-setstate */
// import React, { Component } from 'react';
// import { Modal, message } from 'antd';
// import constants from '@/utils/constants';
// import { FilesDragAndDrop } from './FilesDragAndDrop';
// import style from './index.scss';
// import SetProgress from './Progess';
// import Results from './Result';

// const {
//   APP_API,
// } = constants;

// class ExportFile extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//       result: {},
//       loadings: false,
//     };
//   }

//   onShow = () => {
//     const { expenseId } = this.props;
//     if (!expenseId) {
//       message.error('请选择支出类别之后再导入');
//       return;
//     }
//     this.setState({
//       visible: true,
//     });
//   }

//   onCancel = () => {
//     // const { result } = this.state;
//     // if (result.status === 0) {

//     // }
//     this.setState({
//       visible: false,
//     });
//   }

//   onDownload = () => {
//     window.location.href=`${APP_API}/cost/export/invoice/costDetail/share/template?token=${localStorage.getItem('token')}`;
//   }

//   onUpload = async(files, options) => {
//     //  instanceof FileList
//     // console.log('ExportFile -> onUpload -> files', files instanceof FileList);
//     // console.log('ExportFile -> onUpload -> files', files[0]);
//     // const { upload, expenseId, uniqueId } = this.props;
//     // const formData = new FormData();
//     // formData.append('file',files[0]);
//     // console.log('ExportFile -> onUpload -> formData', formData);
//     // formData.append('expenseId',expenseId);
//     // formData.append('uniqueId',uniqueId);
//     // const results = await upload(formData);
//     console.log(options);
//     const { upload, expenseId, uniqueId } = this.props;
//     this.setState({
//       loadings: true,
//     }, async() => {
//       const formData = new FormData();
//       formData.append('file',files[0]);
//       console.log('ExportFile -> onUpload -> formData', this.childRef);
//       formData.append('expenseId',expenseId);
//       formData.append('uniqueId',uniqueId);
//       this.childRef.changeVal(30);
//       this.childRef.changeVal(40);
//       this.childRef.changeVal(60);
//       this.childRef.changeVal(80);
//       this.childRef.changeVal(95);
//       const results = await upload(formData);
//       console.log(results);
//       if (results) {
//         this.childRef.changeVal(100);
//         this.setState({
//           result: { ...results, status: results.fileStatus },
//           loadings: false,
//         });
//       }
//     });

//   }

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
@connect(({ costGlobal, loading }) => ({
  uploadStatus: costGlobal.uploadStatus,
  loading: loading.effects['costGlobal/upload'] || false,
}))
class ExportFile extends React.PureComponent {
  static propsTypes = {
    type: PropTypes.array.isRequired,
    callback: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisible: false,
      resultModalVisible: false,
      fileList: [],
      uploadRes: {},
      exportList: [],
    };
  }

  // 上传Modal开关
  toogleUploadModal = (target) => {
    if (!target) {
      const { exportList } = this.state;
      const { callback } = this.props;
      callback({ exportList });
    }
    this.setState({
      uploadModalVisible: target,
      fileList: [],
      uploadRes: {},
      exportList: [],
    });
  }

  // 关闭上传结果modal
  closeResModal = (action) => {
    let { uploadModalVisible } = this.state;
    const { exportList } = this.state;
    if (action !== 'single') {
      const { callback } = this.props;
      callback({ exportList });
    }
    if (action === 'all') {
      uploadModalVisible = false;
    }
    this.setState({
      resultModalVisible: false,
      uploadModalVisible,
    });
  }

  beforeUpload = (file) => {
    if(file.size > 1048576) {
      message.error('上传文件不能超过1MB');
    } else {
      this.setState({ fileList: [file] });
    }
    return false;
  }

  removeFile = () => {
    this.setState({ fileList: [] });
  }

  upload = () => {
    const { uniqueId, expenseId } = this.props;
    const { fileList } = this.state;
    if(!fileList.length) {
      message.error('请选择你要上传的文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('expenseId',expenseId);
    formData.append('uniqueId',uniqueId);

    this.props.dispatch({
      type: 'costGlobal/upload',
      payload: formData
    }).then(() => {
      const { uploadStatus } = this.props;
      const { exportList } = this.state;
      this.setState({
        uploadRes: uploadStatus,
        resultModalVisible: true,
        fileList: []
      });
      if (uploadStatus.fileStatus && uploadStatus.content){
        this.setState({
          exportList: [...exportList, ...uploadStatus.content]
        });
      }
    });
  }

  render() {
    const { children, loading, officeId } = this.props;
    const { uploadModalVisible, resultModalVisible, uploadRes, fileList } = this.state;
    return (
      <span>
        <span onClick={() => this.toogleUploadModal(true)}>{children}</span>
        <Modal
          title="批量导入分摊"
          visible={uploadModalVisible}
          onCancel={() => this.toogleUploadModal(false)}
          footer={[
            <Button key="cancel" onClick={() => this.toogleUploadModal(false)}>取消</Button>,
            <Button key="ok" type="primary" onClick={() => this.upload()}>确定上传</Button>
          ]}
        >
          <Spin spinning={loading}>
            <div className="m-l-20">
              <p className="fs-14 c-black-65" style={{ lineHeight: '30px' }}>1. 根据分摊表单的内容(是否按项目分摊)，生成对应的批量导入模版</p>
              <p className="fs-14 c-black-65" style={{ lineHeight: '30px' }}>
                2.下载此支出类别专属分摊模版：
                <a href={`${APP_API}/cost/export/invoice/costDetail/share/template?token=${localStorage.getItem('token')}&officeId=${officeId || ''}`} size="small" className={cs('m-l-8', styles.download)}>下载模板</a>
              </p>
              <p className="fs-14 c-black-65" style={{ lineHeight: '30px' }}>3. 请选择要导入的项目文件</p>
              <div className={cs('m-t-8', styles.import_wrapper)}>
                <Upload
                  accept=".xlsx"
                  action={`${APP_API}/cost/invoice/salary/import/costDetail/share?token=${localStorage.getItem('token')}`}
                  onChange={this.uploadChange}
                  beforeUpload={this.beforeUpload}
                  showUploadList
                  fileList={fileList}
                  onRemove={this.removeFile}
                >
                  <Button icon="upload" className="m-tt-16 m-b-8">上传文件</Button>
                </Upload>
              </div>
              <p className="fs-13 c-black-45">说明：若有错误数据，系统会终止此次导入，并将全部数据返回(包含失败原因)，可修改后重新导入</p>
            </div>
          </Spin>
        </Modal>

        {/* 导入展示Modal */}
        <Modal
          title="批量导入"
          visible={resultModalVisible}
          onCancel={() => this.closeResModal('single')}
          footer={[
            <Button key="cancel" onClick={() => this.closeResModal('all')}>关闭</Button>,
            uploadRes.failedFileId
              ? (
                <Button key="save" >
                  <a href={`${APP_API}/cost/export/invoice/costDetail/share/fail?failFileId=${uploadRes.failedFileId}&token=${localStorage.getItem('token')}`}>
                    导出失败数据
                  </a>
                </Button>
              )
              : <Button key="save" onClick={() => this.closeResModal('single')}>继续导入</Button>
          ]}
        >
          <span>{`导入成功${uploadRes.successNum || 0}条，导入失败${uploadRes.failedNum || 0}条`}</span>
        </Modal>
      </span>
    );
  }
}

export default ExportFile;
