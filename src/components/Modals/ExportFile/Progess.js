/* eslint-disable no-param-reassign */
import React, { useImperativeHandle } from 'react';
import { Progress } from 'antd';
import file from '../../../assets/img/file.png';
import style from './index.scss';

const SetProgress = ({ cRef }) => {
  const [progress, setProgress] = React.useState(0);
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: (newVal) => {
      setProgress(newVal);
    }
  }));
  return (
    <div className={style.progress}>
      <img src={file} alt="进度条" />
      <div className={style.inPro}>
        <Progress percent={progress} status="active" style={{ width: '246px' }} showInfo={false} />
        <span className="fs-14 c-black-45">上传中</span>
      </div>
    </div>
  );
};

export default SetProgress;
