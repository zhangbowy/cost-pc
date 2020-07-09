import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Upload, Icon, Spin } from 'antd';
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
      visible: false,
      loading: false,
      uploadRes: {
        failFileId: '',
        failNum: 0,
        successNum: 0
      },
      showResultModal: false
    };
  }

  // 显示上传modal
  show = () => {
    this.setState({
      visible: true
    });
  }

  // 关闭上传modal
  cancel = () => {
    this.setState({
      visible: false
    });
  }

  // 关闭上传结果modal
  closeResModal = (action) => {
    let { visible } = this.state;
    const { callback } = this.props;
    callback({});
    if(action === 'all') {
      visible = false;
    }
    this.setState({
      showResultModal: false,
      visible
    });
  }

  // 上传过程监听
  uploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      const { callback } = this.props;
      callback({});
      const response = info.file.response.result;
      this.setState({
        uploadRes: response
      });
      this.setState({
        showResultModal: true,
        loading: false
      });
    }
  }

  render() {
    const { children } = this.props;
    const { visible, loading, uploadRes, showResultModal } = this.state;
    return (
      <span className={styles.content}>
        <span onClick={this.show}>{children}</span>
        <Modal
          title="批量导入项目"
          visible={visible}
          onCancel={this.cancel}
          loading={this.state.loading}
          footer={[
            <Button key="cancel" onClick={() => this.cancel()}>取消</Button>,
          ]}
        >
          <Spin spinning={loading}>
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
                  <Button>
                    <Icon type='upload' />上传文件
                  </Button>
                </Upload>

                <a href={`${APP_API}/cost/project/export/template?token=${localStorage.getItem('token')}`} size="small" className={cs('m-l-16', styles.download)}>下载模板</a>
              </div>
            </div>
          </Spin>
        </Modal>
        <Modal
          title="批量导入"
          visible={showResultModal}
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
