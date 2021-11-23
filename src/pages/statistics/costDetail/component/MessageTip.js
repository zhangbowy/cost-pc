import React from 'react';
import style from './index.scss';

const MessageTip = ({ successNum, errorNum, total, onLink }) => {
  return (
    <div className={style.message}>
      <i className="iconfont icona-shibai3x errorColor m-r-8" />
      <span className="fs-14 c-black-65">
        共批量上传数据{total}条，成功导入{successNum}条，失败
        <span className="fs-14 errorColor fw-500">
          {errorNum}
        </span>
        条。
      </span>
      <span className={style.link} onClick={onLink}>下载失败数据</span>
    </div>
  );
};

export default MessageTip;
