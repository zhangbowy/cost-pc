import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Dropdown, Table, message, Switch } from 'antd';
import NoRole from '@/components/StaticChart/component/NoRole';
import noData from '@/assets/img/noData.png';
import style from './index.scss';
import { rowSelect } from '../../../../utils/common';
import { ddOpenLink } from '../../../../utils/ddApi';
import constants from '../../../../utils/constants';


const {
  APP_API
} = constants;
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

  handleTableChange = (pagination, filters, sorter) => {
    const params = {
      ...filters,
    };
    if (params.status) {
      Object.assign(params, {
        status: filters.status[0] || '',
      });
    }
    if (pagination) {
      const { current, pageSize } = pagination;
      Object.assign(params, {
        pageNo: current,
        pageSize,
      });
    }
    if (sorter) {
      let order = '';
      if (sorter.order === 'ascend') {
        order = 1;
      } else if (sorter.order === 'descend') {
        order = 2;
      }
      Object.assign(params, {
        sortType: order,
      });
    }
    this.props.onQuery(params);
  }

  handleCancel = () => {
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
    });
  }

  print = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length > 10) {
      message.error('??????????????????????????????');
      return;
    }
    if (selectedRows.length === 0) {
      message.error('???????????????????????????');
      return;
    }
    const id = selectedRows.map(it => it.invoiceSubmitId);
    const lists = Array.from(new Set(id));
    const ids = lists.join(',');
    ddOpenLink(`${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${ids}`);
  }

  customExpandIcon = (props) => {
    if(props.record.children.length > 0){
      if (props.expanded) {
          return (
            <a
              style={{ marginRight:8 }}
              className="c-black-65"
              onClick={e => {
                        props.onExpand(props.record, e);
                      }}
            >
              <i className="table-minus" />
            </a>
        );

      }
          return (
            <a
              style={{ marginRight:8 }}
              onClick={e => {
                props.onExpand(props.record, e);
              }}
              className="c-black-65"
            >
              <i className="table-plus" />
            </a>
          );
    }
      return <span className="m-l-24" />;
  }

  // ??????
  onExport = (key) => {
    const { onExports } = this.props;
    const { selectedRowKeys } = this.state;
    console.log('TempTable -> onExport -> selectedRowKeys', key);
    if (selectedRowKeys.length === 0 && key === '1') {
      message.error('???????????????????????????');
      return;
    }
    let params = {};
    if (Number(key) === 1) {
      params = {
        ids: selectedRowKeys,
      };
    }
    onExports(params, key);
  }

  onInit = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  }

  render () {
    const { list, columns, tableProps,
      pagination, currentType, loading,
      isNoRole, expandIds, setDetail } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <>
        <div className="content-dt" style={{ height: 'auto' }}>
          <div className="cnt-header">
            <div className="head_lf" style={{display: 'flex'}}>
              <Dropdown
                overlay={(
                  <Menu onClick={e => this.onExport(e.key)}>
                    {
                      !currentType &&
                      <Menu.Item key="1"><span className="pd-20-9 c-black-65">???????????????{selectedRowKeys.length}???</span></Menu.Item>
                    }
                    <Menu.Item key="2"><span className="pd-20-9 c-black-65">????????????????????????</span></Menu.Item>
                    <Menu.Item key="3"><span className="pd-20-9 c-black-65">????????????</span></Menu.Item>
                  </Menu>
                )}
                overlayClassName={style.menuBtn}
              >
                <Button>
                  ?????? <Icon type="down" />
                </Button>
              </Dropdown>
              {
                !currentType &&
                <Button className="m-l-8" onClick={() => this.print()}>??????</Button>
              }
            </div>
            {
              (currentType === 2 || currentType === 3) &&
              <div className="head_rf" style={{lineHeight: '32px'}}>
                <Switch
                  checked={currentType === 2 ? setDetail.isHideStoppedClassify : setDetail.isShowOnlyInProcess}
                  onChange={e => this.props.onSet(e, currentType === 2 ? 'isHideStoppedClassify' : 'isShowOnlyInProcess')}
                />
                <span className="m-l-8">{currentType === 2 ? '????????????????????????': '???????????????????????????'}</span>
              </div>
            }

          </div>
          {
            (currentType === 4) ?
              <Table
                dataSource={list}
                columns={columns}
                loading={loading}
                {...tableProps}
                onChange={this.handleTableChange}
                // rowKey="id"
                pagination={{
                  ...pagination,
                  size: 'small',
                  showTotal: () => (`???${pagination.total}?????????`),
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
              :
              <Table
                dataSource={list}
                columns={columns}
                loading={loading}
                {...tableProps}
                onChange={this.handleTableChange}
                // expandRowByClick
                expandedRowKeys={expandIds}
                onExpand={(b, r) => {
                  this.props.onChangeDatas('expandIds',
                  b ? [...expandIds, r.id] : expandIds.filter(i => i !== r.id));
                }}
                // rowKey="id"
                expandIcon={(props) => this.customExpandIcon(props)}
                locale={{
                  emptyText: isNoRole ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={noData} alt="????????????" style={{ width: '200px' }} />
                      <span>
                        ?????????????????????
                        <NoRole>
                          <a>?????????????????? &gt;</a>
                        </NoRole>
                      </span>
                    </div>
                    ) : '????????????'
                }}
                pagination={false}
              />
          }

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
