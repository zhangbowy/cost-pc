import React from 'react';
import style from './index.scss';
import { ddPreviewImage } from '../../utils/ddApi';

const TableImg = ({ imgUrl }) => {

  const  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  };

  return (
    <span className={imgUrl && (imgUrl.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
      {imgUrl && imgUrl.map((it, index) => (
        <div className="m-r-8" onClick={() => previewImage(imgUrl, index)}>
          <img alt="图片" src={it.imgUrl} className={style.images} />
        </div>
      ))}
    </span>
  );
};

export default TableImg;
