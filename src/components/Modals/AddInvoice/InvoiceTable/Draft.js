import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Divider, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import InvoiceTable from '.';
import style from './index.scss';
import { rowSelect } from '../../../../utils/common';
import AddInvoice from '..';

@connect(({ costGlobal, loading }) => ({
  draftList: costGlobal.draftList,
  total: costGlobal.total,
  page: costGlobal.page,
  loading: loading.effects['costGlobal/listDraft'] || false,
}))
class Draft extends Component {
  static propTypes = {
    draftList: PropTypes.array,
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
      type: 'costGlobal/listDraft',
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
      type: 'costGlobal/listDraft',
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
      type: 'costGlobal/delDraft',
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
      type: 'costGlobal/listDraft',
      payload,
    });
  }

  render() {
    const { draftList, total, loading, page } = this.props;
    const { selectedRowKeys, selectedRows, visible, money, searchContent } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => (
        <span>{index+1}</span>
      )
    }, {
      title: '事由',
      dataIndex: 'reason',
      render: (_, record) => (
        <span>{record.reason}</span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>{record.costSum ? record.costSum/100 : 0}</span>
        </span>
      ),
      width: '250px'
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      render: (_, record) => (
        <span>{record.invoiceTemplateName}</span>
      )
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>
          <span>{record.createTime ? moment(Number(record.createTime)).format('YYYY-MM-DD') : '-'}</span>
        </span>
      )
    }, {
      title: '操作',
      dataIndex: 'opea',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="确认删除吗？"
            onConfirm={() => this.onDelete(record.id)}
          >
            <span className="deleteColor">删除</span>
          </Popconfirm>
          <Divider type="vertical" />
          <AddInvoice
            templateType={record.templateType}
            id={record.invoiceTemplateId}
            contentJson={record.contentJson}
            onHandleOk={() => {
              if (this.props.onPerson) {
                this.props.onPerson();
              }
              this.onQuery({
                ...page,
                searchContent,
              });
            }}
            draftId={record.id}
          >
            <a>编辑</a>
          </AddInvoice>
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
            list={draftList}
            columns={columns}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            onSelect={this.onSelect}
            onSelectAll={this.onSelectAll}
            onSearch={this.onSearch}
            searchPro="请输入单号、事由、收款账户"
            total={total}
            loading={loading}
            onQuery={this.onQuery}
            searchContent={searchContent}
            page={page}
            btn={(
              <>
                <Button type='default' onClick={() => this.onDelete()} className="m-r-8">批量删除</Button>
              </>
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default Draft;
