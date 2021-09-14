import React from 'react';
import style from './index.scss';
import { ddPreviewImage } from '../../utils/ddApi';

const TableImg = ({ imgUrl, key }) => {

  const  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: key ? arr.map(it => it[key]) : arr,
      index,
    });
  };

  return (
    <span className={imgUrl && (imgUrl.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
      {imgUrl && imgUrl.map((it, index) => (
        <div className="m-r-8" onClick={() => previewImage(imgUrl, index)}>
          <img alt="图片" src={key ? it[key] : it} className={style.images} />
        </div>
      ))}
    </span>
  );
};

export default TableImg;
