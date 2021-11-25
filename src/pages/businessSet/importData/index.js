import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button } from 'antd';
import moment from 'moment';
import PageHead from '@/components/pageHead';
import style from './index.scss';
// import { ddDing } from '../../../utils/ddApi';
import constants from '@/utils/constants';
import ImportModal from '@/components/ImportModal';
import MessageTip from '../../statistics/costDetail/component/MessageTip';

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
      // importResult: {}, // 导入结果percent
      file: {}, // 当前上传文件
      percent: 30, // 进度条百分比
      msgTimeOut: false // 失败数据展示时间到期
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
        const now=new Date();
        this.time(now);
        const { historyImportStatus } = this.props;
        if (historyImportStatus) {
          localStorage.setItem('importResult',JSON.stringify({
            ...historyImportStatus,
            date: moment(now).format('YYYY-MM-DD HH:mm:ss')
          }));
          this.setState({
            // importResult: historyImportStatus,
            percent: 100,
            importLoading: false,
            msgTimeOut:false
          });
        } else {
          this.setState({
            importStatus: false,
            importLoading: false
          });
        }
      });
  };

  // 弹窗关闭
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      importStatus: false,
      file: {}
    });
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
        _this.setState({ file });
        return false;
      }
    };
  };

  handleDownLoad = id => {
    if (id) {
      window.open(
        `${APP_API}/cost/excel/importErrorExcel?token=${localStorage.getItem(
          'token'
        )}&&id=${id}`
      );
      this.setState({
        isModalVisible: false,
        importStatus: false,
        file: {}
      });
      return;
    }
    window.open(
      `${APP_API}/cost/excel/uploadModel?token=${localStorage.getItem('token')}`
    );
  };

  // 数据总数、成功数据、失败数据展示
  // oldDate : 调用此函数的时间
  time = oldDate => {
    // 15分钟之后的时间戳
    const endTimes = oldDate.getTime() + 15 * 60 * 10 * 100;
    const tt = setInterval(() => {
      // 当前时间
      const nowTimes = new Date().getTime();
      // 时间差
      const diffTime = endTimes - nowTimes;
      if (diffTime <= 0) {
        console.log('时间到了');
        this.setState({ msgTimeOut: true });
        localStorage.removeItem('importResult');
        clearInterval(tt);
      }
    }, 1000);
  };

  render() {
    const {
      // importResult,
      importStatus,
      importLoading,
      isModalVisible,
      file,
      percent,
      msgTimeOut,
    } = this.state;
    const importResult = JSON.parse(localStorage.getItem('importResult'));
    console.log('🚀 ~ file: index.js ~ line 174 ~ ImportData ~ render ~ msgTimeOut', msgTimeOut);
    console.log('🚀 ~ file: index.js ~ line 176 ~ ImportData ~ render ~ importResult', importResult);
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
            <span
              className={style.modal_download}
              onClick={() => {
                window.open(
                  `${APP_API}/cost/excel/uploadModel?token=${localStorage.getItem(
                    'token'
                  )}`
                );
              }}
            >
              下载模版
            </span>
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
          {importResult&&importResult.errorCount && !msgTimeOut  ? (
            <div className={style.msgtip}>
              <MessageTip
                total={importResult.count + importResult.errorCount}
                successNum={importResult.count}
                errorNum={importResult.errorCount}
                onLink={()=>this.handleDownLoad(importResult.id)}
                time={importResult.date}
              />
            </div>
          ) : null}
          <p className={style.text}>
            1.
            若有错误数据，系统会将正确数据导入，并将错误数据返回(包含失败原因)，可修改后导入；
          </p>
          <p className={style.text}>
            2.导入成功后的支出明细，如需查看或批量删除，请前往：
            <span
              onClick={() => {
                this.props.history.push('/statistics/costDetail');
              }}
            >
              台账汇总-三方导入
            </span>
          </p>
        </div>

        <ImportModal
          isModalVisible={isModalVisible}
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
            localStorage.removeItem('importResult');
            this.setState({
              importStatus: false,
              file: {}
            });
          }}
          percent={percent}
          downLoad={this.handleDownLoad}
        />
      </div>
    );
  }
}

export default ImportData;
