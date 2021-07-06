/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Modal, message } from 'antd';
import constants from '@/utils/constants';
import { FilesDragAndDrop } from './FilesDragAndDrop';
import style from './index.scss';
import SetProgress from './Progess';

const {
  APP_API,
} = constants;

class ExportFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onShow = () => {
    const { expenseId } = this.props;
    if (!expenseId) {
      message.error('请选择支出类别之后再导入');
      return;
    }
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onDownload = () => {
    window.location.href=`${APP_API}/cost/export/invoice/costDetail/share/template?token=${localStorage.getItem('token')}`;
  }

  onUpload = async(files) => {
    //  instanceof FileList
    console.log('ExportFile -> onUpload -> files', files instanceof FileList);
    console.log('ExportFile -> onUpload -> files', files[0]);
    const { upload, expenseId } = this.props;
    const formData = new FormData();
    formData.append('file',files[0]);
    console.log('ExportFile -> onUpload -> formData', formData);
    formData.append('expenseId',expenseId);
    const results = await upload(formData);
    console.log(results);
  }

  render() {
    const {
      children,
      loading,
    } = this.props;
    const {
      visible,
    } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{ children }</span>
        <Modal
          visible={visible}
          width="824px"
          bodyStyle={{height: '557px', overflowY: 'scroll'}}
          title={null}
          onCancel={this.onCancel}
          maskClosable={false}
          footer={null}
        >
          {
            loading ?
              <>
                <SetProgress />
              </>
              :
              <>
                <p className="fs-20 fw-500 c-black-85">批量导入分摊</p>
                <p className="fs-14 m-t-8 m-b-16">
                  <span>根据分摊表单的内容(是否按项目分摊)，生成对应的批量导入模版 </span>
                  <a onClick={() => this.onDownload()}>下载模版</a>
                </p>
                <FilesDragAndDrop
                  onUpload={this.onUpload}
                  count={1}
                  formats={['xls', 'xlsx']}
                />
                <div className={style.pro}>
                  <p>操作说明：</p>
                  <p>1、支持Excel 2007及以上版本.xlsx结尾的文件，表头信息请勿更改，红色字段为必填项；</p>
                  <p>2、一个文件内的数据重复上传将生成多条数据，低于50条以内的失败数据支持在线编辑，更多数据请下载修改！</p>
                </div>
              </>
          }
        </Modal>
      </span>
    );
  }
}

export default ExportFile;
