import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Dropdown, Table } from 'antd';
import style from './index.scss';
import { rowSelect } from '../../../../utils/common';

class TempTable extends PureComponent {

  state = {
    selectedRows: [],
    selectedRowKeys: [],
  }

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount+=item.submitSum;
    });
    this.setState({
        selectedRows: _selectedRows,
        selectedRowKeys,
        sumAmount: amount,
    });
  };

  onSelect = (record, selected) => {
    const {
        selectedRows,
        selectedRowKeys,
    } = rowSelect.onSelect(this.state, record, selected);
    let amount = 0;
    selectedRows.forEach(item => {
      amount+=item.submitSum;
    });
    this.setState({
        selectedRows,
        selectedRowKeys,
        sumAmount: amount,
    });
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //   let current = 0;
  //   if (pagination) {
  //     current = pagination.current;
  //   }
  // }

  render () {
    const { list, columns, tableProps,
      pagination, hisRecord, currentType } = this.props;
    const { selectedRowKeys, sumAmount } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };
    return (
      <>
        <div className="content-dt">
          <div className="cnt-header">
            <div className="head_lf" style={{display: 'flex'}}>
              <Dropdown
                overlay={(
                  <Menu onClick={e => this.onExport(e)}>
                    <Menu.Item key="2"><span className="pd-20-9 c-black-65">导出高级搜索结果</span></Menu.Item>
                    <Menu.Item key="3"><span className="pd-20-9 c-black-65">导出全部</span></Menu.Item>
                  </Menu>
                )}
                overlayClassName={style.menuBtn}
              >
                <Button>
                  导出 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
          {
            currentType === 0 &&
            <div className={style.message}>
              <span className="fs-14 c-black-65">
                { selectedRowKeys.length ? `已选${selectedRowKeys.length}` : `共${hisRecord.total}` }条记录，合计
              </span>
              <span className="fs-16 c-black-85 fw-500">
                ¥{ selectedRowKeys.length ? sumAmount : hisRecord.sum}
              </span>
            </div>
          }
          <Table
            dataSource={list}
            columns={columns}
            {...tableProps}
            rowSelection={currentType === 0 ? rowSelection : null}
            onChange={this.handleTableChange}
            pagination={currentType === 0 ? {
              ...pagination,
              size: 'small',
              showTotal: () => (`共${pagination.total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
            } : false}
          />
        </div>
      </>
    );
  }
}

TempTable.propTypes = {
  list: PropTypes.array,
  columns: PropTypes.array,
  tableProps: PropTypes.object
};

export default TempTable;
