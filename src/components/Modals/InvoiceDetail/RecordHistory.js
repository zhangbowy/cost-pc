import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popover, Tag, Tooltip } from 'antd';
import moment from 'moment';
import fileIcon from '@/utils/fileIcon.js';
import style from './index.scss';
import { isJsonString, srcName } from '../../../utils/common';

function RecordHistory(props) {
  const {
    previewImage,
    previewFiles,
  } = props;
  const columns = [{
    title: '字段名称',
    dataIndex: 'fieldName',
    fixed: 'left',
    width: '150px'
  },
  {
    title: '原始信息',
    dataIndex: 'oldMsg',
    render: (_, record) => {
      let arr = [];
      if (isJsonString(record.oldMsg)) {
        arr = JSON.parse(record.oldMsg);
        if (record.fieldName === '图片') {
          return (
            <span className={arr && (arr.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
              {arr && arr.map((it, index) => (
                <div className="m-r-8" onClick={() => previewImage(arr, index)}>
                  <img alt="图片" src={it.imgUrl} className={style.images} />
                </div>
              ))}
            </span>
          );
        }
        return (
          <span className={arr && (arr.length > 0) ?  style.fileUrlScroll : style.imgUrl}>
            {arr && arr.map((it) => (
              <div className={style.files} onClick={() => previewFiles(it)}>
                <img
                  className='attachment-icon'
                  src={fileIcon[it.fileType ? it.fileType : srcName(it.fileName)]}
                  alt='attachment-icon'
                />
                <p key={it.fileId} style={{marginBottom: '8px'}}>{it.fileName}</p>
              </div>
            ))}
          </span>
        );
      }
      if (record.oldShareVo && record.oldShareVo.length) {
        const money = record.oldMsg.split(' ')[1];
        return (
          <span>
            <span>{record.oldMsg}</span>
            {
              record.oldShareVo && record.oldShareVo.length > 0 &&
              <Popover
                content={(
                  <div className={style.share_cnt}>
                    <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">
                      分摊明细：金额 {money}
                    </p>
                    {
                      record.oldShareVo.map(it => (
                        <p key={it.id} className="c-black-36 fs-13">
                          <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                          {
                            it.projectName &&
                            <span className="m-r-8">{it.projectName}</span>
                          }
                          <span>¥{it.shareAmount/100}{it.currencySumStr && record.currencyId &&  record.currencyId !== -1 ? `(${it.currencySumStr})` : ''}</span>
                        </p>
                      ))
                    }
                  </div>
                )}
              >
                <Tag className="m-l-8">分摊明细</Tag>
              </Popover>
            }
          </span>
        );
      }
      if (record.oldMsg.indexOf('图片') > -1) {
        const imgArr = record.oldMsg.split(' ');
        const arrs =imgArr.length > 1 ? JSON.parse(imgArr[1]) : [];
        return (
          <>
            <span
              className={arrs && (arrs.length > 0) ?
              style.imgUrlScroll : style.imgUrl}
              style={{overflow: 'scroll'}}
            >
              {arrs && arrs.map((it, index) => (
                <div className="m-r-8" onClick={() => previewImage(arrs, index)}>
                  <img alt="图片" src={it.imgUrl} className={style.images} />
                </div>
              ))}
            </span>
          </>
        );

      }
        return (<span>{record.oldMsg}</span>);

    },
    width: '250px'
  },
  {
    title: '修改后信息',
    dataIndex: 'newMsg',
    render: (_, record) => {
      let arr = [];
      console.log('RecordHistory -> isJsonString(record.newMsg)', isJsonString(record.newMsg));

      if (isJsonString(record.newMsg)) {
        arr = JSON.parse(record.newMsg);
        if (record.fieldName === '图片') {
          return (
            <span
              className={arr && (arr.length > 0) ?
              style.imgUrlScroll : style.imgUrl}
              style={{overflow: 'scroll'}}
            >
              {arr && arr.map((it, index) => (
                <div className="m-r-8" onClick={() => previewImage(arr, index)}>
                  <img alt="图片" src={it.imgUrl} className={style.images} />
                </div>
              ))}
            </span>
          );
        }
        return (
          <span
            className={record.imgUrl && (record.imgUrl.length > 0) ?  style.fileUrlScroll : style.imgUrl}
            style={{
              flexDirection: 'column',
              overflow: 'scroll',
              maxHeight: '51px',
              display: 'inline-block',
              padding: '8px 0',
            }}
          >
            {arr && arr.map((it) => (
              <div className={style.files} onClick={() => previewFiles(it)}>
                <img
                  className='attachment-icon'
                  src={fileIcon[it.fileType ? it.fileType : srcName(it.fileName)]}
                  alt='attachment-icon'
                />
                <p key={it.fileId} style={{marginBottom: '8px'}}>{it.fileName}</p>
              </div>
            ))}
          </span>
        );
      }
      if (record.newShareVo && record.newShareVo.length) {
        const money = record.newMsg.split(' ')[1];
        return (
          <span>
            <span>{record.newMsg}</span>
            {
              record.newShareVo && record.newShareVo.length > 0 &&
              <Popover
                content={(
                  <div className={style.share_cnt}>
                    <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">
                      分摊明细：金额 {money}
                    </p>
                    {
                      record.newShareVo.map(it => (
                        <p key={it.id} className="c-black-36 fs-13">
                          <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                          {
                            it.projectName &&
                            <span className="m-r-8">{it.projectName}</span>
                          }
                          <span>¥{it.shareAmount/100}{it.currencySum ? `(${it.currencySumStr})` : ''}</span>
                        </p>
                      ))
                    }
                  </div>
                )}
              >
                <Tag className="m-l-8">分摊明细</Tag>
              </Popover>
            }
          </span>
        );
      }
      if (record.newMsg.indexOf('图片') > -1) {
        const imgArr = record.newMsg.split(' ');
        const arrs =imgArr.length > 1 ? JSON.parse(imgArr[1]) : [];
        return (
          <>
            <span
              className={arrs && (arrs.length > 0) ?
              style.imgUrlScroll : style.imgUrl}
              style={{overflow: 'scroll'}}
            >
              {arrs && arrs.map((it, index) => (
                <div className="m-r-8" onClick={() => previewImage(arrs, index)}>
                  <img alt="图片" src={it.imgUrl} className={style.images} />
                </div>
              ))}
            </span>
          </>
        );

      }
        return (<span>{record.newMsg}</span>);

    },
    width: '250px'
  },{
    title: '修改日期',
    dataIndex: 'createTime',
    render: (text) => (
      <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
    ),
    width: '250px'
  }, {
    title: '修改人',
    dataIndex: 'createName',
    width: '150px'
  }, {
    title: '改单理由',
    dataIndex: 'note',
    width: '150px',
    render: (text) => (
      <>
        {
          text && text.length > 10 ?
            <Tooltip placement="topLeft" title={text || ''}>
              <span className="eslips-2">{text}</span>
            </Tooltip>
            :
            <span>{text || '-'}</span>
        }
      </>

    )
  }];
  return (
    <div>
      <Table
        dataSource={props.list || []}
        columns={columns}
        pagination={false}
        scroll={{y: '500px', x: '950px'}}
      />
    </div>
  );
}

RecordHistory.propTypes = {
  list: PropTypes.array,
};

export default RecordHistory;

