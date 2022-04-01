/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react';
import { Table, Tooltip, Popover } from 'antd';
import moment from 'moment';
import cs from 'classnames';
import style from './index.scss';
import { handleProduction, compare, srcName } from '../../../utils/common';
import fileIcon from '../../../utils/fileIcon';

class CostDetailTable extends PureComponent {

  onHandle = (list) => {
    const { previewImage, cityInfo, previewFiles } = this.props;
    console.log('CostDetailTable -> onHandle -> list', list);
    let newArr = [];
    const columns = [];
    const dataSource = [];
    const obj = {};
    list.forEach(item => {
      const showField = item.showField ? JSON.parse(item.showField) : [];
      let objss = {...item};
      let arr = [...showField];
      if(item.trainLevel || (item.trainLevel === 0)) {
        arr = [...arr, {
          dateType: 1,
          field: 'trainLevel',
          fieldType: 5,
          isWrite: true,
          name: '火车席别',
          sort: 3,
          status: 1,
        }];
      }
      if(item.flightLevel || (item.flightLevel === 0)) {
        arr = [...arr, {
          dateType: 1,
          field: 'flightLevel',
          fieldType: 5,
          isWrite: true,
          name: '航班舱位',
          sort: 3,
          status: 1,
        }];
      }
      if (item.belongCity) {
        arr = [...arr, {
          dateType: 1,
          field: 'belongCity',
          fieldType: 5,
          isWrite: true,
          name: '消费城市',
          sort: 3,
          status: 1,
        }];
      }
      if (item.userCount) {
        arr = [...arr, {
          dateType: 1,
          field: 'userCount',
          fieldType: 5,
          isWrite: true,
          name: '招待人数',
          sort: 3,
          status: 1,
        }];
      }
      if (item.selfCostDetailFieldVos && item.selfCostDetailFieldVos.length) {
        arr = [...arr, ...item.selfCostDetailFieldVos];
        item.selfCostDetailFieldVos.forEach(it => {
          const keys = Object.keys(it);
          keys.forEach(its => {
            objss = {
              ...objss,
              [`${it.field}${its}`]: it[its],
            };
          });
        });
      }
      if (item.expandCostDetailFieldVos && item.expandCostDetailFieldVos.length) {
        arr = [...arr, ...item.expandCostDetailFieldVos];
        item.expandCostDetailFieldVos.forEach(it => {
          const keys = Object.keys(it);
          keys.forEach(its => {
            objss = {
              ...objss,
              [`${it.field}${its}`]: it[its],
            };
          });
        });
      }
      dataSource.push(objss);
      newArr = [...newArr, ...arr];
    });
    console.log('CostDetailTable -> onHandle -> newArr', newArr);
    newArr = newArr.reduce(function(item, next) {
      obj[next.field] ? '' : obj[next.field] = true && item.push(next);
      return item;
    }, []);
    const handleArr = handleProduction(newArr.sort(compare('sort')));
    // const cityArr = list.map(it => it.belongCity).filter(item => item);
    // let cityInfo = {};
    // if (Array.from(new Set(cityArr)).length > 0) {
    //   cityInfo = await this.props.cityInfo(Array.from(new Set(cityArr)));
    // }
    console.log('CostDetailTable -> onHandle -> cityInfo', cityInfo);

    handleArr.filter(it => it.fieldType !== 9).forEach(item => {
      let objs = {};
      if (item.field !== 'incomeCategory') {
       if (item.field === 'incomeNote') {
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
                {
                  item.itemExplain && !!(item.itemExplain.length) &&
                  <Tooltip
                    title={(
                      <>
                        {
                          item.itemExplain.map(its => (
                            <p className="m-b-8">{its.msg}</p>
                          ))
                        }
                      </>
                    )}
                  >
                    <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                  </Tooltip>
                }
              </>
            ),
            dataIndex: 'note',
            width: 120,
            ellipsis: true,
            render: (_, record) => (
              <>
                {
                  record.note && record.note.length > 2 ?
                    <span>
                      <Tooltip placement="topLeft" title={record.note || ''}>
                        <span className="eslips-2">{record.note}</span>
                      </Tooltip>
                    </span>
                    :
                    <span>{record.note || '-'}</span>
                }
              </>
            ),
          };
        } else if (item.field === 'imgUrl') {
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
                {
                  item.itemExplain && !!(item.itemExplain.length) &&
                  <Tooltip
                    title={(
                      <>
                        {
                          item.itemExplain.map(its => (
                            <p className="m-b-8">{its.msg}</p>
                          ))
                        }
                      </>
                    )}
                  >
                    <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                  </Tooltip>
                }
              </>
            ),
            dataIndex: 'imgUrl',
            render: (_, record) => (
              <span className={record.imgUrl && (record.imgUrl.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
                {record.imgUrl && record.imgUrl.map((it, index) => (
                  <div className="m-r-8" onClick={() => previewImage(record.imgUrl, index)}>
                    <img alt="图片" src={it.imgUrl} className={style.images} />
                  </div>
                ))}
              </span>
            ),
            textWrap: 'word-break',
            width: 150
          };
        } else if (item.field === 'fileUrl' || item.field === 'ossFileUrl') {
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
                {
                  item.itemExplain && !!(item.itemExplain.length) &&
                  <Tooltip
                    title={(
                      <>
                        {
                          item.itemExplain.map(its => (
                            <p className="m-b-8">{its.msg}</p>
                          ))
                        }
                      </>
                    )}
                  >
                    <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                  </Tooltip>
                }
              </>
            ),
            dataIndex: 'fileUrl',
            render: (_, record) => {
              const { fileUrl, ossFileUrl } = record;
              const fileList = item.field === 'fileUrl' ? fileUrl : ossFileUrl;
              return (
                <span>
                  {
                    fileList && fileList.length ?
                    fileList.length === 1 ?
                      <div className={style.files} onClick={() => previewFiles(fileList[0], item.field)}>
                        {
                          item.field === 'fileUrl' ?
                            <img
                              className='attachment-icon'
                              src={fileIcon[fileUrl[0].fileType]}
                              alt='attachment-icon'
                            />
                            :
                            <img
                              className='attachment-icon'
                              src={fileIcon[srcName(fileList[0].fileName)]}
                              alt='attachment-icon'
                            />
                        }
                        <div className={style.filename}>
                          <span className={style.filename__base}>
                            { item.field === 'fileUrl'
                                ? fileList[0].fileName.substring(0, fileUrl[0].fileName.length-(fileUrl[0].fileType.length + 1))
                                : fileList[0].fileName}
                          </span>
                          {
                            item.field === 'fileUrl' &&
                            <span className={style.filename__extension}>.{fileUrl[0].fileType}</span>
                          }
                        </div>
                      </div>
                      :
                      <Popover
                        overlayClassName={style.popFile}
                        content={(
                          <div>
                            {
                              fileList.map(items => (
                                <div className={style.files} key={items.fileId || items.fileUrl} onClick={() => previewFiles(items, item.field)}>
                                  {
                                    item.field === 'fileUrl' ?
                                      <img
                                        className='attachment-icon'
                                        src={fileIcon[items.fileType]}
                                        alt='attachment-icon'
                                      />
                                      :
                                      <img
                                        className='attachment-icon'
                                        src={fileIcon[srcName(items.fileName)]}
                                        alt='attachment-icon'
                                      />
                                  }
                                  <div className={style.filename}>
                                    <span className={style.filename__base}>
                                      { item.field === 'fileUrl'
                                         ? items.fileName.substring(0, items.fileName.length-(items.fileType.length + 1))
                                         : items.fileName}
                                    </span>
                                    {
                                      item.field === 'fileUrl' &&
                                      <span className={style.filename__extension}>.{items.fileType}</span>
                                    }
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      >
                        <span style={{color: 'rgba(52, 64, 162, 0.8)'}}>共{fileList.length}个附件</span>
                      </Popover>
                      :
                      <span>-</span>
                  }
                </span>
              );
            },
            textWrap: 'word-break',
            width: 150
          };
        } else if (item.field === 'amount'){
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
                {
                  item.itemExplain && !!(item.itemExplain.length) &&
                  <Tooltip
                    title={(
                      <>
                        {
                          item.itemExplain.map(its => (
                            <p className="m-b-8">{its.msg}</p>
                          ))
                        }
                      </>
                    )}
                  >
                    <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                  </Tooltip>
                }
              </>
            ),
            dataIndex: 'receiptSum',
            render: (_, record) => (
              <span>
                {record.incomeSumStr}
              </span>
            ),
            width: 150
          };
        } else if(item.field === 'happenTime') {
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
              </>
            ),
            dataIndex: item.field,
            render: (_, record) => {
              return (
                <span>
                  { record.startTime ? moment(record.startTime).format('YYYY-MM-DD') : '-' }
                </span>
              );
            },
            width: 150,
          };
        }  else {
          objs = {
            title: (
              <>
                <span>
                  {item.name}
                </span>
                {
                  item.itemExplain && !!(item.itemExplain.length) &&
                  <Tooltip
                    title={(
                      <>
                        {
                          item.itemExplain.map(its=> (
                            <p className="m-b-8">{its.msg}</p>
                          ))
                        }
                      </>
                    )}
                  >
                    <i className="iconfont iconIcon-yuangongshouce m-l-8" />
                  </Tooltip>
                }
              </>
            ),
            dataIndex: item.field,
            render: (_, itField) => {
              console.log('InvoiceDetail -> render -> records', itField);
              let texts = itField[`${item.field}msg`];
              if (itField[`${item.field}startTime`]) {
                texts = itField[`${item.field}endTime`] ?
                `${moment(Number(itField[`${item.field}startTime`])).format('YYYY-MM-DD')}-${moment(Number(itField[`${item.field}endTime`])).format('YYYY-MM-DD')}`
                :
                `${moment(Number(itField[`${item.field}startTime`])).format('YYYY-MM-DD')}`;
              }
              return (
                <span>
                  {
                    texts && texts.length > 2 ?
                      <span>
                        <Tooltip placement="topLeft" title={texts || ''}>
                          <span className="eslips-2">{texts}</span>
                        </Tooltip>
                      </span>
                      :
                      <span className="eslips-2">{texts || '-'}</span>
                  }
                </span>
              );
            },
            width: 150,
          };
        }
        columns.push(objs);
      }
    });

    const allWidth = columns.reduce((prev, next) => prev + next.width, 0);
    return {
      columns,
      allWidth,
      dataSource,
    };
  }

  render () {
    const { list } = this.props;
    const allData = this.onHandle(list);
    console.log('CostDetailTable -> render -> allData', allData);
    let columns = [{
      title: '收入类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={cs('eslips-2', style.icons)}>
          <i className={`iconfont icon${record.icon}`} style={{ fontSize: '24px', verticalAlign: 'middle' }} />
          {
            record.categoryName.length > 3 ?
              <Tooltip title={record.categoryName || ''}>
                <span className="m-l-4 eslips-1" style={{ verticalAlign: 'middle' }}>{record.categoryName}</span>
              </Tooltip>
              :
              <span>{record.categoryName}</span>
          }
        </span>
      ),
      width: 150,
      // fixed: 'left'
    }];
    if (allData.columns && allData.columns.length > 0) {
      columns = [...columns, ...allData.columns];
    }
    return (
      <div>
        <Table
          dataSource={allData.dataSource || []}
          scroll={{x: allData.allWidth}}
          pagination={false}
          columns={columns}
          rowKey="id"
          className={style.costTable}
          rowClassName={record => record.exceedMessage ? style.noBoard : style.haveBoard}
          expandedRowRender={record => {
            if (!record.exceedMessage) return null;
            return (
              <p style={{ margin: 0 }} className={style.exceedMess}>
                <i className="iconfont iconinfo-cirlce m-r-12 fs-20" style={{ color: '#FAAD14' }} />
                {record.exceedMessage}
              </p>
            );
          }}
          expandIconAsCell={false}
          expandIconColumnIndex={-1}
          expandedRowKeys={allData.dataSource ? allData.dataSource.map(it => it.exceedMessage && it.id) : []}
        />
      </div>
    );
  }
}

export default CostDetailTable;
