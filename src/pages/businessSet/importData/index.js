import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button } from 'antd';
// import moment from 'moment';
import PageHead from '@/components/pageHead';
import style from './index.scss';
// import { ddDing } from '../../../utils/ddApi';
import constants from '@/utils/constants';
import ImportModal from '@/components/ImportModal';

const { APP_API } = constants;

@connect(({ global, costGlobal }) => ({
  uploadRes: global.uploadRes,
  historyImportStatus: costGlobal.historyImportStatus
}))
class ImportData extends Component {
  // static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      importStatus: false, // 是否进入导入状态
      importLoading: false, // 导入状态：进行中
      importResult: {}, // 导入结果percent
      file: {}, // 当前上传文件
      percent: 30, // 进度条百分比
      popoverVisible: false
    };
  }

  componentDidMount() {}

  // 手动导入
  handleImport = () => {
    this.setState({ importStatus: true, importLoading: true });
    const { file } = this.state;
    // console.log('🚀 ~ file: index.js ~ line 501 ~ Statistics ~ file', file);

    const formData = new FormData();
    formData.append('file', file);
    this.props
      .dispatch({
        type: 'costGlobal/historyImport',
        payload: formData
      })
      .then(() => {
        const { historyImportStatus } = this.props;
        if (historyImportStatus) {
          this.setState({
            importResult: historyImportStatus,
            percent: 100,
            importLoading: false
          });
        } else {
          this.setState({
            importStatus: false,
            importLoading: false
          });
        }
      });
  };

  handleCancel = () => {
    const { importResult, popoverVisible } = this.state;
    if (importResult.errorCount) {
      this.setState({ popoverVisible: true });
    } else if (!popoverVisible) {
      this.setState({
        isModalVisible: false,
        importStatus: false,
        importResult: {},
        file: {}
      });
    }
  };

  Props = _this => {
    return {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: `costGlobal/historyImport?token=${sessionStorage.getItem(
        'token'
      )}`,
      beforeUpload(file) {
        // console.log(
        //   '🚀 ~ file: index.js ~ line 525 ~ Statistics ~ beforeUpload ~ file',
        //   file
        // );
        _this.setState({ file });
        return false;
      }
    };
  };

  handleCancelPop = e => {
    e.stopPropagation();
    this.setState({
      popoverVisible: false
    });
  };

  handleOkPop = e => {
    e.stopPropagation();
    this.setState({
      popoverVisible: false,
      isModalVisible: false,
      importStatus: false,
      importResult: {},
      file: {}
    });
  };

  render() {
    const {
      importResult,
      importStatus,
      importLoading,
      isModalVisible,
      file,
      percent,
      popoverVisible
    } = this.state;
    return (
      <div className="mainContainer">
        <PageHead title="历史数据导入" />
        <div className="content-dt">
          <div className={style.cnt_foot}>
            <div className={style.header}>
              <div className={style.line} />
              <span className="fs-14 c-black-85 fw-400">批量导入支出明细</span>
            </div>
          </div>
          <p className={style.desc}>
            根据当前的支出类别列表，生成对应的批量导入模版
            <a
              href={`${APP_API}/cost/excel/uploadModel?token=${localStorage.getItem(
                'token'
              )}`}
              className={style.modal_download}
            >
              下载模版
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              this.setState({ isModalVisible: true });
            }}
            className={style.importBtn}
          >
            批量导入
          </Button>
          <p className={style.text}>
            1.
            若有错误数据，系统会将正确数据导入，并将错误数据返回(包含失败原因)，可修改后导入；
          </p>
          <p className={style.text}>
            2.导入成功后的支出明细，如需查看或批量删除，请前往：
            <span
              onClick={() => {
                // this.props.history.push('');
              }}
            >
              台账汇总-三方导入
            </span>
          </p>
        </div>

        <ImportModal
          isModalVisible={isModalVisible}
          popoverVisible={popoverVisible}
          handleCancel={this.handleCancel}
          importStatus={importStatus}
          importLoading={importLoading}
          importResult={importResult}
          file={file}
          handleImport={this.handleImport}
          props={this.Props(this)}
          handleReset={() => {
            this.setState({ file: {} });
          }}
          handleConImport={() => {
            this.setState({
              importStatus: false,
              importResult: {},
              file: {}
            });
          }}
          handleOkPop={this.handleOkPop}
          handleCancelPop={this.handleCancelPop}
          percent={percent}
        />
      </div>
    );
  }
}

export default ImportData;
