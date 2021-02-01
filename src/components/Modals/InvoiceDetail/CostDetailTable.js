/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react';
import { Table, Tooltip, Popover, Tag } from 'antd';
import moment from 'moment';
import style from './index.scss';

class CostDetailTable extends PureComponent {

  onHandle = (list) => {
    console.log('CostDetailTable -> onHandle -> list', list);
    let newArr = [];
    const columns = [];
    const dataSource = [];
    const obj = {};
    list.forEach(item => {
      const showField = JSON.parse(item.showField);
      let objss = {...item};
      let arr = [...showField];
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
    console.log('CostDetailTable -> onHandle -> newArr', newArr);

    newArr.forEach(item => {
      let objs = {};
      if (item.field !== 'costCategory' && item.field !== 'amount') {
        if (item.field === 'happenTime') {
          objs = {
            title: '发生日期',
            dataIndex: 'happenTime',
            render: (_, record) => (
              <span>
                <span>{record.startTime ? moment(record.startTime).format('YYYY-MM-DD') : '-'}</span>
                <span>{record.endTime ? `-${moment(record.endTime).format('YYYY-MM-DD')}` : ''}</span>
              </span>
            ),
            width: 120
          };
        } else if (item.field === 'costNote') {
          objs = {
            title: '费用备注',
            dataIndex: 'note',
            width: 120,
            ellipsis: true,
            render: (_, record) => (
              <>
                {
                  record.note && record.note.length > 10 ?
                    <span>
                      <Tooltip placement="topLeft" title={record.note || ''}>
                        <span className="eslips-2">{record.note}</span>
                      </Tooltip>
                    </span>
                    :
                    <span>-</span>
                }
              </>
            ),
          };
        } else if (item.field === 'imgUrl') {
          objs = {
            title: '图片',
            dataIndex: 'imgUrl',
            render: (_, record) => (
              <span className={record.imgUrl && (record.imgUrl.length > 0) ?  style.imgUrlScroll : style.imgUrl}>
                {record.imgUrl && record.imgUrl.map((it, index) => (
                  <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
                    <img alt="图片" src={it.imgUrl} className={style.images} />
                  </div>
                ))}
              </span>
            ),
            textWrap: 'word-break',
            width: 150
          };
        } else {
          objs = {
            title: item.name,
            dataIndex: item.field,
            render: (_, itField) => {
              console.log('InvoiceDetail -> render -> records', itField);
              let texts = itField[`${item.field}msg`];
              if (itField[`${item.field}dateType`]) {
                texts = '';
              } else if (itField[`${item.field}startTime`]) {
                texts = itField[`${item.field}endTime`] ?
                `${moment(Number(itField[`${item.field}startTime`])).format('YYYY-MM-DD')}-${moment(Number(itField[`${item.field}endTime`])).format('YYYY-MM-DD')}`
                :
                `${moment(Number(itField[`${item.field}startTime`])).format('YYYY-MM-DD')}`;
              }
              return (
                <span>
                  {
                    texts && texts.length > 10 ?
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
    console.log('CostDetailTable -> onHandle -> columns', columns);
    console.log('CostDetailTable -> onHandle -> dataSource', dataSource);

    const allWidth = columns.reduce((prev, next) => prev + next.width, 0);
    console.log('CostDetailTable -> onHandle -> allWidth', allWidth);
    return {
      columns,
      allWidth,
      dataSource,
    };
  }

  render () {
    const { list } = this.props;
    const allData = this.onHandle(list);
    let columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={style.icons}>
          <i className={`iconfont icon${record.icon}`} style={{ fontSize: '24px', verticalAlign: 'middle' }} />
          <span className="m-l-4" style={{ verticalAlign: 'middle' }}>{record.categoryName}</span>
        </span>
      ),
      width: 150,
      fixed: 'left'
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>{record.currencySumStr && record.currencyId &&  record.currencyId !== -1 ?
          `${record.costSumStr}(${record.currencySumStr})` : `¥${record.costSum/100}`}
          </span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 ?
              <Popover
                content={(
                  <div
                    className={style.share_cnt}
                  >
                    <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">
                      分摊明细：金额 ¥{record.costSum/100}{record.currencySumStr ? `(${record.currencySumStr})` : ''}
                    </p>
                    {
                      record.costDetailShareVOS.map(it => (
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
              :
              null
          }
        </span>
      ),
      className: 'moneyCol',
      width: 250
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
        />
      </div>
    );
  }
}

export default CostDetailTable;
