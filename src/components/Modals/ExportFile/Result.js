import React from 'react';
import { Button, Result } from 'antd';

function Results({ status, subTitle, onCancel }) {

  const download = () => {

  };

  return (
    <Result
      status={status}
      title={status === 'success' ? '导入成功' : '导入失败'}
      subTitle={subTitle}
      extra={status === 'success' ? [
        <Button key="buy" onClick={() => onCancel()}>完成</Button>,
        <Button type="primary" key="console">
          继续上传
        </Button>
      ] : [
        <Button type="primary" key="console" onClick={() => download()}>
          下载失败数据
        </Button>
      ]}
    />
  );
}

export default Results;
