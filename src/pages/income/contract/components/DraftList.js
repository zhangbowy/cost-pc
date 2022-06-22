import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { withRouter } from 'react-router';
import ModalTemp from '@/components/ModalTemp';
import InvoiceTable from '@/components/Modals/AddInvoice/InvoiceTable';
// import style from './index.scss';
import { rowSelect } from '@/utils/common';

@withRouter
@connect(({ costGlobal, loading }) => ({
  draftList: costGlobal.draftList,
  total: costGlobal.total,
  page: costGlobal.page,
  draftTotal: costGlobal.draftTotal,
  loading: loading.effects['costGlobal/listIncomeDraft'] || false,
}))
class DraftList extends Component {
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
      type: 'costGlobal/listIncomeDraft',
      payload: {
        pageNo: 1,
        pageSize: 10,
        type: 30
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    this.props.onOk();
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
      type: 'costGlobal/listIncomeDraft',
      payload: {
        ...page,
        type: 30,
        searchContent: e,
      }
    });
  }

  onDelete = (id) => {
    const { selectedRowKeys } = this.state;
    let ids = this.state.selectedRowKeys;
    if (id) {
      ids = [id];
    }
    if (!ids.length) {
      message.error('请勾选草稿');
      return;
    }
    this.props.dispatch({
      type: 'costGlobal/delIncomeDraft',
      payload: {
        ids,
      }
    }).then(() => {
      if (Array.isArray(ids)) {
        this.setState({
          selectedRowKeys: [],
        });
      } else {
        this.setState({
          selectedRowKeys: selectedRowKeys.filter(it => it !== id)
        });
      }
      const { page } = this.props;
      const { searchContent } = this.state;
      this.onQuery({
        ...page,
        str: searchContent,
        type: 30
      });
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'costGlobal/listIncomeDraft',
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
    localStorage.removeItem('selectCost');
    this.props.history.push(`/income/contract/${str}~${templateType}~${invoiceId}~${id}`);
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
      width: '80px'
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      render: (_, record) => (
        <span>{record.invoiceTemplateName}</span>
      ),
      width: '140px'
    }, {
      title: '金额（元）',
      dataIndex: 'costSum',
      render: (_, record) => (
          <span>{record.costSum ? record.costSum/100 : 0}</span>
      ),
      className: 'moneyCol',
      width: '140px'
    }, {
      title: '提交时间',
      dataIndex: 'updateTime',
      render: (_, record) => (
        <span>
          <span>{record.updateTime ? moment(Number(record.updateTime)).format('YYYY-MM-DD') : '-'}</span>
        </span>
      ),
      width: '140px'
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
      width: '100px'
    }];
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <ModalTemp
          title="草稿箱"
          visible={visible}
          size="big"
          onCancel={() => this.onCancel()}
          width="980px"
          newBodyStyle={{
            padding: '24px 32px'
          }}
          footer={null}
          unset='true'
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
        </ModalTemp>
      </div>
    );
  }
}

export default DraftList;
