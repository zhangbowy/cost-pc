import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import Search from 'antd/lib/input/Search';
import style from './index.scss';

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
    scroll
  } = props;
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: props.selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  return (
    <>
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
      <div className={style.addCosts}>
        <div className={style.addTable}>
          <Table
            columns={props.columns}
            rowSelection={rowSelection}
            dataSource={list}
            rowKey="id"
            loading={loading}
            scroll={scroll || {}}
            pagination={{
              hideOnSinglePage: true,
              current: page.pageNo,
              onChange: (pageNumber) => {
                onQuery({
                  pageNo: pageNumber,
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


