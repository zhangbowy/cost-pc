import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Divider, Button, Popconfirm, message, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { withRouter } from 'react-router';
import InvoiceTable from '.';
// import style from './index.scss';
import { rowSelect } from '../../../../utils/common';

@withRouter
@connect(({ costGlobal, loading }) => ({
  draftList: costGlobal.draftList,
  total: costGlobal.total,
  page: costGlobal.page,
  draftTotal: costGlobal.draftTotal,
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
    if (!ids.length) {
      message.error('请勾选草稿');
      return;
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

  onEdit = ({ isTemplateDel, isTemplateUsed, invoiceId, templateType, details, id }) => {
    const str = 'draft';
    if (isTemplateDel) {
      message.error('管理员已删除该单据模板，草稿无效请删除');
      return;
    }
    if (!isTemplateUsed) {
      message.error('该单据模板不可用，草稿无效请删除');
      return;
    }
    localStorage.setItem('contentJson', details);
    this.props.history.push(`/workbench/${str}~${templateType}~${invoiceId}~${id}`);
  }

  render() {
    const { draftList, total, loading, page, draftTotal } = this.props;
    const { selectedRowKeys, selectedRows, visible, searchContent } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => (
        <span>{index+1}</span>
      ),
      width: '40px'
    }, {
      title: '事由',
      dataIndex: 'reason',
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
      width: '100px'
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
        <span>
          <span>{record.costSum ? record.costSum/100 : 0}</span>
        </span>
      ),
      className: 'moneyCol',
      width: '100px'
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      render: (_, record) => (
        <span>{record.invoiceTemplateName}</span>
      ),
      width: '120px'
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>
          <span>{record.createTime ? moment(Number(record.createTime)).format('YYYY-MM-DD') : '-'}</span>
        </span>
      ),
      width: '100px'
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
          <a
            onClick={() => this.onEdit({
              id: record.id,
              isTemplateDel: record.isTemplateDel,
              isTemplateUsed: record.isTemplateUsed,
              templateType: record.templateType,
              invoiceId: record.invoiceTemplateId,
              details: record.contentJson
            })}
          >
            编辑
          </a>
        </span>
      ),
      className: 'fixCenter',
      width: '80px'
    }];
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <Modal
          title="草稿箱"
          visible={visible}
          onCancel={() => this.onCancel()}
          width="980px"
          bodyStyle={{height: '470px', overflowY: 'scroll'}}
          footer={(
            <>
              <Button type="default" key="cen" onClick={this.onCancel}>取消</Button>
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
            searchPro="请输入事由、收款账户"
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
            production={(
              <span>
                草稿箱共计{draftTotal.count ? draftTotal.count : 0}单，
                ¥{draftTotal.totalSum ? draftTotal.totalSum/100 : 0}
              </span>
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default Draft;
