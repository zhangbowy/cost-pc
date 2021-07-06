import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Input } from 'antd';
import style from './index.scss';

const FilesDragAndDrop = (props) => {
    const [fileList, setFileList] = useState(null);
    const { onUpload } = props;
    const drop = useRef();
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { count, formats } = props;
    const files = [...e.dataTransfer.files];

    if (count && count < files.length) {
        message.error(`抱歉，每次最多只能上传${count} 文件。`, 'error', 2000);
        return;
    }

    if (formats && files.some((file) => !formats.some((format) => file.name.toLowerCase().endsWith(format.toLowerCase())))) {
        message.error(`只允许上传 ${formats.join(', ')}格式的文件`, 'error', 2000);
        return;
    }

    if (files && files.length) {
      setFileList(files);
    }
  };
  const onChange = (val) => {
    console.log(val.currentTarget.files);
    setFileList(val.currentTarget.files);
  };
  useEffect(() => {
    // useRef 的 drop.current 取代了 ref 的 this.drop
    drop.current.addEventListener('dragover', handleDragOver);
    drop.current.addEventListener('drop', handleDrop);
    return () => {
        drop.current.removeEventListener('dragover', handleDragOver);
        drop.current.removeEventListener('drop', handleDrop);
    };
  });

  return (
    <div className={style.drag} ref={drop}>
      {
        fileList ?
          <>
            <i className="iconfont icona-xlsx3x" />
            <p>{fileList[0].name}</p>
          </>
          :
          <>
            <i className="iconfont icona-wenjian3x" />
            <p>将文件拖拽至此区域，或点击按钮上传文件</p>
          </>
      }
      <div style={{ display: 'flex' }}>
        <div className={style.btn}>
          <Input type="file" accept="xls,xlsx" className={style.input} onChange={onChange} />
          <div className={style.btns} >{fileList ? '重新上传' : '上传文件'}</div>
        </div>
        {
          fileList &&
          <Button
            className="m-l-8"
            type="primary"
            onClick={() => onUpload(fileList)}
          >
            开始导入
          </Button>
        }
      </div>
    </div>
  );
};

FilesDragAndDrop.propTypes = {
    onUpload: PropTypes.func.isRequired,
    count: PropTypes.number,
    formats: PropTypes.arrayOf(PropTypes.string)
};

export { FilesDragAndDrop };
