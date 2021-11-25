/* eslint-disable no-shadow */
import React from 'react';
import { Modal, Button, Progress, Upload } from 'antd';
import cs from 'classnames';
// import { debounce } from 'lodash-decorators';
import style from './index.scss';
import loadingFile from '@/assets/img/file@3x.png';
// import constants from '@/utils/constants';

const { Dragger } = Upload;
// const { APP_API } = constants;

export default function ImportModal({
  importStatus,
  importLoading,
  importResult = {},
  isModalVisible,
  handleCancel,
  file,
  handleImport,
  props,
  handleConImport,
  handleReset,
  percent,
  // popoverVisible,
  // handleOkPop,
  // handleCancelPop,
  downLoad,
  // popMsg,
}) {
  const ele = importResult => {
    if (!importResult.errorCount) {
      return (
        <>
          <div className={style.img_end}>
            <i
              className={cs('iconfont icona-chenggong3x', style.icon_success)}
            />
          </div>
          <div className={style.import_success}>上传成功</div>
        </>
      );
    }
    if (!importResult.count) {
      return (
        <>
          <div className={style.img_end}>
            <i className={cs('iconfont icona-shibai3x', style.icon_fail)} />
          </div>
          <div className={style.import_success}>上传失败</div>
        </>
      );
    }
    return (
      <>
        <div className={style.img_end}>
          <i className={cs('iconfont icona-jinggao3x', style.icon_warn)} />
        </div>
        <div className={style.import_success}>部分数据上传失败</div>
      </>
    );
  };
  return (
    <Modal
      title={importStatus ? '批量导入' : '批量导入明细'}
      visible={isModalVisible}
      onCancel={() => {
        handleCancel();
      }}
      // closeIcon={
      //   <Popconfirm
      //     visible={popoverVisible}
      //     placement="rightTop"
      //     title={
      //       <div>
      //         <p className={style.popTitle}>确定关闭吗？</p>
      //         <p className={style.popContent}>
      //           {popMsg || '关闭后可在列表上方下载失败数据，本次数据仅保留15分钟。'}
      //         </p>
      //       </div>
      //     }
      //     onConfirm={e => handleOkPop(e)}
      //     onCancel={e => handleCancelPop(e)}
      //   >
      //     <i className="iconfont iconclose" />
      //   </Popconfirm>
      // }
      width={824}
      className={style.modal_box}
      centered
      footer={null}
    >
      {importStatus ? (
        <div className={style.import_status}>
          {/* importLoading:true：上传中 */}
          {importLoading ? (
            <div className={style.import_ing}>
              <div className={style.img_ing}>
                <img src={loadingFile} alt="" />
              </div>
              <Progress percent={percent} status="active" strokeWidth={8} />
            </div>
          ) : (
            <div className={style.import_end}>
              {ele(importResult)}

              <div className={style.result_text}>
                共上传数据 {importResult.count + importResult.errorCount}{' '}
                条，成功导入
                <span> {importResult.count} </span>条，失败
                <span> {importResult.errorCount} </span>条
              </div>
              {importResult.errorCount ? (
                <div>
                  <Button
                    className={style.reset_btn}
                    type="primary"
                    onClick={()=>downLoad(importResult.id)}
                  >
                    下载失败数据
                    {/* <a
                      href={`${APP_API}/cost/excel/importErrorExcel?token=${localStorage.getItem(
                        'token'
                      )}&&id=${importResult.id}`}
                    >
                      下载失败数据
                    </a> */}
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    className={style.reset_btn}
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    完成
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleConImport();
                    }}
                  >
                    继续上传
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={style.modal_top}>
            根据客户列表的表单内容生成对应的批量导入模版
            <span
              className={style.modal_download}
              onClick={downLoad}
            >下载模版
            </span>
            {/* <a
              href={`${APP_API}/cost/excel/uploadModel?token=${localStorage.getItem(
                'token'
              )}`}
              className={style.modal_download}
            >
              下载模版
            </a> */}
          </div>
          <div className={style.upload_box}>
            {file.uid ? (
              <div className={style.import_box}>
                <div className={style.import_top}>
                  <div className={style.img_box}>
                    <i
                      className={cs(
                        'iconfont icona-wenjian3x1',
                        style.img_style
                      )}
                    />
                  </div>
                  <div className={style.file_name}>{file.name}</div>
                </div>
                <div className={style.import_btn}>
                  <Button className={style.reset_btn} onClick={handleReset}>
                    重新选择
                  </Button>
                  <Button type="primary" onClick={handleImport}>
                    开始导入
                  </Button>
                </div>
              </div>
            ) : (
              <Dragger {...props} className={style.drag_box}>
                <p className="ant-upload-drag-icon">
                  <i
                    className={cs('iconfont icona-wenjian3x2', style.file_icon)}
                  />
                </p>
                <p className="ant-upload-hint upload_explain">
                  将文件拖拽至此区域，或点击按钮上传文件
                </p>
                <Button type="primary">上传文件</Button>
              </Dragger>
            )}
          </div>
          <div className={style.explain}>
            <p>操作说明：</p>
            <p>
              1、支持Excel
              2007及以上版本.xlsx结尾的文件，表头信息请勿更改，红色字段为必填项；
            </p>
            <p>
              2、一个文件内的数据重复上传将生成多条数据，失败数据可下载修改后继续上传！
            </p>
          </div>
        </>
      )}
    </Modal>
  );
}
