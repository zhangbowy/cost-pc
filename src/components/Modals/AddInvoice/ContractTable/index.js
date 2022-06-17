import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import Search from 'antd/lib/input/Search';
import style from './index.scss';
import moment from "moment";
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';

function InvoiceTable(props) {

  const onSearch = (e) => {
    props.onSearch(e);
  };

  const {
    onSelect,
    onSelectAll,
    list,
    searchPro,
    loading,
    total,
    page,
    onQuery,
    searchContent,
    scroll,
    isShowDel,
    hiddenRadio,
    onOk
  } = props;
  console.log('InvoiceTable -> total', total);

  const rowSelection = {
    type: 'radio',
    // selectedRowKeys: props.selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  const columns = [{
    title: '合同单号',
    dataIndex: 'index',
    render: (_, record) => (
      <IncomeInvoiceDetail
        id={record.id}
        // refuse={this.handleRefuse}
        templateId={record.invoiceTemplateId}
        templateType={30}
        // allow="modify"
        // onCallback={() => this.onOk()}
        // signCallback={this.onSign}
        title="合同详情"
      >
        <a>{record.invoiceNo}</a>
      </IncomeInvoiceDetail>
    ),
    width: '200px'
  }, {
    title: '合同名称',
    dataIndex: 'name',
    render: (_, record) => (
      <span>
          <span>{record.name || '-'}</span>
        </span>
    ),
    className: 'moneyCol',
    // width: '140px'
  }, {
    title: '合同金额（元）',
    dataIndex: 'originLoanSum',
    render: (_, record) => (
      <span>
          <span>{record.originLoanSum ? record.originLoanSum/100 : 0}</span>
        </span>
    ),
    className: 'moneyCol',
    // width: '140px'
  }, {
    title: '未收金额（元）',
    dataIndex: 'loanSum',
    render: (_, record) => (
      <span>
          <span>{record.loanSum ? record.loanSum / 100 - record.freezeSum / 100  : 0}</span>
        </span>
    ),
    className: 'moneyCol',
    // width: '140px'
  }, {
    title: '提交时间',
    dataIndex: 'updateTime',
    render: (_, record) => (
      <span>
          <span>{record.updateTime ? moment(Number(record.updateTime)).format('YYYY-MM-DD') : '-'}</span>
        </span>
    ),
    // width: '140px'
  }];

  if (isShowDel) {
    columns.push(
      {
        title: '操作',
        render: (_, record) => (
          <span
            className="deleteColor pd-20-9"
            onClick={() =>{onOk && onOk([])}}
          >
              删除
            </span>
        ),
        width: '140px'
      }
    )
  }

  return (
    <>
      {
        searchPro && (
          <div className="m-b-16">
            {/* <Input style={{width:'292px',marginRight:'20px'}} placeholder="请输入单号、事由" /> */}
            {props.btn}
            <Search
              placeholder={searchPro}
              style={{ width: '292px',marginRight:'20px' }}
              onSearch={(e) => onSearch(e)}
            />
            {props.production}
          </div>
        )
      }
      <div className={style.addCosts}>
        <div className={style.addTable}>
          <Table
            columns={columns}
            rowSelection={hiddenRadio ? null : rowSelection}
            dataSource={list}
            rowKey="id"
            loading={loading}
            scroll={scroll || {}}
            pagination={{
              hideOnSinglePage: true,
              pageSize: page.pageSize,
              current: page.pageNo,
              onChange: (pagenation) => {
                onQuery({
                  pageNo: pagenation,
                  pageSize: page.pageSize,
                  searchContent
                });
              },
              total,
              size: 'small',
              showTotal: () => (`共${total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (cur, size) => {
                onQuery({
                  pageNo: cur,
                  pageSize: size,
                  searchContent
                });
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

InvoiceTable.propTypes = {
  list: PropTypes.array,
};

export default InvoiceTable;


