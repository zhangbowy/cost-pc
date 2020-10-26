import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tooltip, Divider, Popover, Tag, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import InvoiceTable from '.';
import AddCost from '../AddCost';
import style from './index.scss';
import { getArrayColor, classifyIcon } from '../../../../utils/constants';
import { rowSelect } from '../../../../utils/common';

@connect(({ costGlobal, loading }) => ({
  folderList: costGlobal.folderList,
  total: costGlobal.total,
  page: costGlobal.page,
  loading: loading.effects['costGlobal/listFolder'] || false,
}))
class CostFolder extends Component {
  static propTypes = {
    folderList: PropTypes.array,
  }

  state = {
    selectedRowKeys:[],
    selectedRows: [],
    visible: false,
    searchContent: '',
    money: 0,
  }

  onShow = () => {
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        pageNo: 1,
        pageSize: 10,
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.setState({
      selectedRowKeys:[],
      selectedRows: [],
      visible: false,
    });
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    const money = _selectedRows.reduce((acc, cur) => {
      return acc+cur.costSum/100;
    }, 0);
    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
      details: _selectedRows,
      money,
    });
  };

  onSelect = (record, selected) => {
    const {
      selectedRows,
      selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    const money = selectedRows.reduce((acc, cur) => {
      return acc+cur.costSum/100;
    }, 0);
    this.setState({
      selectedRows,
      selectedRowKeys,
      details: selectedRows,
      money,
    });
  };

  onSearch = (e) => {
    const { page } = this.props;
    this.setState({
      searchContent: e,
    });
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload: {
        ...page,
        searchContent: e,
      }
    });
  }

  onDelete = (id) => {
    let ids = this.state.selectedRowKeys;
    if (id) {
      ids = [id];
    }
    this.props.dispatch({
      type: 'costGlobal/delFolder',
      payload: {
        ids,
      }
    }).then(() => {
      const { page } = this.props;
      const { searchContent } = this.state;
      this.onQuery({
        ...page,
        searchContent,
      });
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'costGlobal/listFolder',
      payload,
    });
  }

  render() {
    const { folderList, total, loading, page } = this.props;
    const { selectedRowKeys, selectedRows, visible, money, searchContent } = this.state;
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      render: (_, record) => (
        <span className={style.cateNames}>
          <i
            className={`iconfont icon${record.icon}`}
            style={{
              color: getArrayColor(record.icon, classifyIcon),
              fontSize: '24px',
              marginRight: '4px'
            }}
          />
          <span>{record.categoryName}</span>
        </span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>{record.currencySumStr ?  `${record.costSumStr}(${record.currencySumStr})`: record.costSumStr}</span>
          {
            record.costDetailShareVOS && record.costDetailShareVOS.length > 0 &&
            <Popover
              content={(
                <div className={style.share_cnt}>
                  <p key={record.id} className="c-black-85 fs-14 fw-500 m-b-8">分摊明细：金额 ¥{record.costSum/100}{record.currencySumStr ? `(${record.currencySumStr})` : ''}</p>
                  {
                    record.costDetailShareVOS.map(it => (
                      <p key={it.id} className="c-black-36 fs-13">
                        <span className="m-r-8">{it.userName ? `${it.userName}/` : ''}{it.deptName}</span>
                        {
                          it.projectName &&
                          <span className="m-r-8">{it.projectName}</span>
                        }
                        <span>¥{it.shareAmount/100}{it.currencySumStr ? `(${it.currencySumStr})` : ''}</span>
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
      ),
      width: '250px'
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
        <Tooltip placement="topLeft" title={text || ''}>
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
      render: (_, record) => (
        <span>
          <span className="deleteColor" onClick={() => this.onDelete(record.id)}>删除</span>
          <Divider type="vertical" />
          <AddCost
            costType={1}
            id={record.id}
          >
            <a>编辑</a>
          </AddCost>
        </span>
      ),
      className: 'fixCenter',
      fixed: 'right'
    }];
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <Modal
          title="费用夹"
          visible={visible}
          onCancel={() => this.onCancel()}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          footer={(
            <>
              {
                selectedRowKeys.length ?
                  <div key="dull" className={style.costMoney}>
                    <Button type="default" key="cancel" onClick={this.onCancel}>取消</Button>
                    <div>
                      <span className="fs-15 c-black-85 m-r-8">
                        已选{selectedRowKeys.length}笔 合计¥
                        <span className="fs-20 fw-500">{money}</span>
                      </span>
                      <Button type="primary">生成单据</Button>
                    </div>
                  </div>
                :
                  <Button type="default" key="cen" onClick={this.onCancel}>取消</Button>
              }
            </>
          )}
        >
          <InvoiceTable
            list={folderList}
            columns={columns}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            onSelect={this.onSelect}
            onSelectAll={this.onSelectAll}
            onSearch={this.onSearch}
            searchPro="请输入费用类别名称搜索"
            total={total}
            loading={loading}
            onQuery={this.onQuery}
            searchContent={searchContent}
            page={page}
            btn={(
              <>
                <AddCost
                  costType={1}
                  onCallback={() => {
                    this.onQuery({ searchContent, ...page });
                    this.props.onPerson();
                  }}
                >
                  <Button type='default' className="m-r-8">记一笔</Button>
                </AddCost>
                <Button type='default' onClick={() => this.onDelete()} className="m-r-8">批量删除</Button>
              </>
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default CostFolder;
