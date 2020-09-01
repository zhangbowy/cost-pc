import React, { Component } from 'react';
import { Table, Divider, Tag, Popover, Tooltip } from 'antd';
import moment from 'moment';
import AddCost from './AddCost';
import style from './index.scss';
import { getArrayColor, classifyIcon } from '../../../utils/constants';
import { ddPreviewImage } from '../../../utils/ddApi';

class CostTable extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  previewImage = (arr, index) => {
    ddPreviewImage({
      urlArray: arr.map(it => it.imgUrl),
      index,
    });
  }

  onDelete = (index) => {
    const lists = this.props.list;
    lists.splice(index, 1);
    this.props.onChangeData(lists);
  }

  addCost = (val, index) => {
    this.props.addCost(val, index);
  }

  render() {
    const { list, userInfo, invoiceId } = this.props;
    const newList = [];
    list.forEach(it => {
      const obj = {};
      it.expandCostDetailFieldVos.forEach(i => {
        obj[i.field] = i.msg;
      });
      newList.push({
        ...it,
        ...obj,
      });
    });
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={style.cateNames}>
          <i className={`iconfont icon${record.icon}`} style={{color: getArrayColor(record.icon, classifyIcon)}} />
          <span>{record.categoryName}</span>
        </span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>¥{(record.costSum || 0)}</span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">分摊明细：金额 ¥{record.costSum}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>¥{it.shareAmount}</span>
                      </p>
                    ))
                  }
                </div>
              )}
            >
              <Tag>分摊明细</Tag>
            </Popover>
          }
        </span>
      )
    }, {
      title: '发生日期',
      dataIndex: 'happenTime',
      render: (_, record) => (
        <span>
          <span>{record.startTime ? moment(Number(record.startTime)).format('YYYY-MM-DD') : '-'}</span>
          <span>{record.endTime ? `-${moment(Number(record.endTime)).format('YYYY-MM-DD')}` : ''}</span>
        </span>
      )
    }, {
      title: '费用备注',
      dataIndex: 'note',
      ellipsis: true,
      width: '100px',
      render: (text) => (
        <Tooltip placement="topRight" title={text || ''}>
          <span>{text}</span>
        </Tooltip>
      )
    }, {
      title: '图片',
      dataIndex: 'imgUrl',
      render: (_, record) => (
        <span className={record.imgUrl && (record.imgUrl.length > 0) ? style.imgScroll : style.imgUrlTable}>
          {record.imgUrl && record.imgUrl.map((it, index) => (
            <div className="m-r-8" onClick={() => this.previewImage(record.imgUrl, index)}>
              <img alt="图片" src={it.imgUrl} className={style.images} />
            </div>
          ))}
        </span>
      ),
      textWrap: 'word-break',
      width: '140px'
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record, index) => (
        <span>
          <span className="deleteColor" onClick={() => this.onDelete(index)}>删除</span>
          <Divider type="vertical" />
          <AddCost
            detail={record}
            invoiceId={invoiceId}
            userInfo={userInfo}
            index={index}
            onAddCost={this.addCost}
            expandField={record.expandCostDetailFieldVos}
          >
            <a>编辑</a>
          </AddCost>
        </span>
      ),
    }];
    if (list && list[0].expandCostDetailFieldVos) {
      const arr = [];
      list.forEach(it => {
        if (it.expandCostDetailFieldVos && (it.expandCostDetailFieldVos.length > 0)) {
          const its = it.expandCostDetailFieldVos.map(item => {
              return {
                ...item,
                title: item.name,
                dataIndex: item.field,
                render: (text) => (
                  <span>
                    <Tooltip placement="topLeft" title={text || ''} arrowPointAtCenter>
                      <span className="eslips-2">{text}</span>
                    </Tooltip>
                  </span>
                ),
              };
          });
          arr.push(...its);
        }
      });
      const obj = {};
      const per = arr.reduce((cur,next) => {
        if (obj[next.field]) {
          obj[next.field] = true;
          cur.push(next);
        }
        return cur;
      },[]);
      columns.splice(2, 0, ...per);
    }
    return (
      <div style={{ marginTop: '24px' }}>
        <Table
          dataSource={newList}
          columns={columns}
          scroll={{x: newList.length > 6 ? '1200px' : '1000px'}}
          rowKey="field"
          pagination={false}
        />
      </div>
    );
  }
}

export default CostTable;
