import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Divider, Button, Popconfirm, message, Modal} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { withRouter } from 'react-router';
import ModalTemp from '@/components/ModalTemp';
import InvoiceTable from '@/components/Modals/AddInvoice/ContractTable';
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
class ChooseContract extends Component {
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
      }
    }).then(() => {
      this.setState({
        visible: true,
      });
    });
  }

  onCancel = () => {
    // this.props.onOk();
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
   console.log(selectedRows, '-')
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
        searchContent: e,
      }
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'costGlobal/listIncomeDraft',
      payload,
    });
  }

  onOk = (payload) => {
    const { selectedRowKeys, selectedRows, visible, searchContent } = this.state;
    this.props.onOk(selectedRows)
    this.setState({
      visible: false,
    });
  }

  render() {
    const { draftList, total, loading, page, draftTotal } = this.props;
    const { selectedRowKeys, selectedRows, visible, searchContent } = this.state;
    return (
      <div>
        <div onClick={() => this.onShow()}>{this.props.children}</div>
        <ModalTemp
          title="选择收入合同"
          visible={visible}
          size="big"
          onCancel={() => this.onCancel()}
          width="980px"
          newBodyStyle={{
            padding: '24px 32px'
          }}
          footer={[
            <Button key="cancel" onClick={() => this.onCancel()}>取消</Button>,
            <Button key="ok" type="primary" onClick={() => this.onOk()}>确定</Button>
          ]}
        >
          <InvoiceTable
            list={draftList}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            onSelect={this.onSelect}
            onSelectAll={this.onSelectAll}
            onSearch={this.onSearch}
            searchPro="搜索单号、金额、合同名称"
            total={total}
            loading={loading}
            onQuery={this.onQuery}
            searchContent={searchContent}
            page={page}
            // btn={(
              // <>
              //   <Button type='default' onClick={() => this.onDelete()} className="m-r-8">批量删除</Button>
              // </>
            // )}
            // production={(
            //   <span>
            //     草稿箱共计{draftTotal.count ? draftTotal.count : 0}单，
            //     ¥{draftTotal.totalSum ? draftTotal.totalSum/100 : 0}
            //   </span>
            // )}
          />
        </ModalTemp>
      </div>
    );
  }
}

export default ChooseContract;
