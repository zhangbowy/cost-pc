
import React from 'react';
import { Table, Divider, message, Menu, Button, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { rowSelect } from '@/utils/common';
import DropBtn from '@/components/DropBtn';
import { numAdd } from '@/utils/float';
import style from './index.scss';
import RecordModal from './components/RecordModal';
import AddModal from './components/AddModal';
import SearchBanner from '../../statistics/overview/components/Search/Searchs';

@connect(({ loading, borrowering, costGlobal }) => ({
  loading: loading.effects['borrowering/list'] || false,
  list: borrowering.list,
  query: borrowering.query,
  total: borrowering.total,
  loanSumObj: borrowering.loanSumObj,
  recordList: borrowering.recordList,
  officeListAndRole: costGlobal.officeListAndRole
}))
class Payments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
      selectedRows: [],
      loanSumAll:0,
      searchList: [{
        type: 'rangeTime',
        label: '提交时间',
        placeholder: '请选择',
        key: ['startTime', 'endTime'],
        id: 'startTime',
        out: 1
      },
      {
        type: 'deptAndUser',
        label: '提交部门/人',
        placeholder: '请选择',
        key: ['userVOS', 'deptVOS'],
        id: 'userVOS',
        out: 1
      },
      {
        type: 'search',
        label: '外部选择',
        placeholder: '单号、事由、收款人',
        key: 'searchContent',
        id: 'searchContent',
        out: 1
      }]
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.getOffice();
    this.onQuery({
      ...query,
      status: 2,
    });
  }

  handleClick = e => {
    const { query } = this.props;
    this.setState({
      status: e.key,
      selectedRowKeys: [],
      selectedRows: [],
      sumAmount: 0,
    });
    this.onQuery({
      ...query,
      status: e.key,
      pageNo: 1,
    });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    let loanSumAll = 0;
    _selectedRows.forEach(item => {
      amount+=item.loanSum;
      loanSumAll +=item.waitLoanSum;
    });

    this.setState({
        selectedRows: _selectedRows,
        selectedRowKeys,
        sumAmount: amount,
        loanSumAll
    });
  };

  onSelect = (record, selected) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onSelect(this.state, record, selected);
      console.log(selectedRowKeys);
      let amount = 0;
      let loanSumAll = 0;
      selectedRows.forEach(item => {
        amount+=item.loanSum;
        loanSumAll += item.waitLoanSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount,
          loanSumAll
      });
  };

  onDelete = (id) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
      let amount = 0;
      let loanSumAll = 0;
      selectedRows.forEach(item => {
        amount+=item.loanSum;
        loanSumAll += item.waitLoanSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount,
          loanSumAll
      });
  };

  getOffice = () => {
    this.props.dispatch({
      type: 'costGlobal/officeListAndRole',
      payload: {},
    }).then(() => {
      const { searchList } = this.state;
      const arr = [...searchList];
      const { officeListAndRole } = this.props;
      if (officeListAndRole.length) {
        arr.splice(1,0,{
          type: 'select',
          label: '分公司',
          placeholder: '请选择',
          key: 'officeId',
          id: 'officeId',
          options: officeListAndRole,
          fileName: {
            key: 'id',
            name: 'officeName'
          },
          out: 1
        });
      }
      this.setState({
        searchList: arr,
      });
    });
  }

  onOk = () => {
    const {
      query,
    } = this.props;
    const { status } = this.state;
    this.onQuery({
      ...query,
      status,
    });
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    const obj = payload;
    obj.type = payload.status*1 - 2;
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value
        });
      }
    });
    this.props.dispatch({
      type: 'borrowering/list',
      payload: obj,
    });
  }

  onChange = (rows, keys) => {
    let amount = 0;
    let loanSumAll = 0;
    keys.forEach(item => {
      if (item.loanSum) {
        amount+=item.loanSum;
        loanSumAll += item.waitLoanSum;
      }
    });
    this.setState({
      selectKey: keys,
      count: keys.length,
      sumAmount: amount,
      loanSumAll
    });
  }

  export = (key) => {
    const { selectedRowKeys, status, searchContent } = this.state;
    console.log('key======',key);
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let params = {};
    if (key === '1') {
      params = {
        ids: selectedRowKeys,
        export: true,
        fileName:'选中导出列表',
      };
    } else if (key === '3') {
      params = {
        searchContent,
        type:status-2,
        fileName:status==='2'?'待还款列表':'已还款列表',
        export: true
      };
    }
    this.props.dispatch({
      type: 'borrowering/loanExported',
      payload: {
        ...params,
      }
    }).then(() => {
      message.success('导出成功');
    });
  }

  // 拒绝
  handleRefuse = (val) => {
    this.props.dispatch({
      type: 'borrowering/refuse',
      payload: {
        invoiceSubmitIds: [val.id],
        rejectNote: val.rejectNote
      }
    }).then(() => {
      this.onOk();
    });
  }

  onChangeSearch = (val) => {
    this.setState({
        searchList: val
    }, () => {
      const { status } = this.state;
      const {
        query,
      } = this.props;
      this.onQuery({
        ...query,
        status,
      });
    }
    );
  }

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      // selectedRows,
      loanSumAll,
      searchList
    } = this.state;
    const {
      list,
      query,
      total,
      loading,
      loanSumObj,
    } = this.props;
    const columns = [{
      title: '借款事由',
      dataIndex: 'reason',
      width: 150,
      ellipsis: true,
      textWrap: 'word-break',
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      )
    }, {
      title: '借款金额（元）',
      dataIndex: 'loanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '待还款金额（元）',
      dataIndex: 'waitLoanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 120,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 130,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 120,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '提交人',
      dataIndex: 'userName',
      width: 100,
    }, {
      title: '部门',
      dataIndex: 'deptName',
      width: 140,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD HH:mm:ss') }</span>
      ),
      width: 150,
    }, {
      title: '预计还款日期',
      dataIndex: 'repaymentTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) =>
      (
        <div>
          {
            Number(status) === 2 &&
            <AddModal title="add" onOk={() => this.onOk()} detail={record}>
              <Button style={{padding:'0'}} type="link">还款</Button>
            </AddModal>
          }
          {
            Number(status) === 2 &&
            <Divider type="vertical" />
          }
          <RecordModal detail={record} RecordModal id={record.invoiceId} canRefuse={Number(status) === 2} refuse={this.handleRefuse}>
            <a>借还记录</a>
          </RecordModal>
          {
            Number(status) === 2 &&
            <Divider type="vertical" />
          }
          {
            Number(status) === 2 &&
              <InvoiceDetail id={record.id} templateType={1} data={record}>
                <a>查看</a>
              </InvoiceDetail>
          }
        </div>
      ),
      width: 250,
      fixed: 'right',
      className: 'fixCenter'
    }];
    console.log(status);
    if(Number(status) !== 2) {
      columns.splice(8, 2,{
        title: '操作',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {/* <InvoiceDetail id={record.invoiceId} canRefuse={Number(record.status) === 2} refuse={this.handleRefuse}>
              <a>借还记录</a>
            </InvoiceDetail> */}
            <RecordModal detail={record} RecordModal id={record.invoiceId} canRefuse={Number(status) === 2} refuse={this.handleRefuse}>
              <a>借还记录</a>
            </RecordModal>
            {
              <Divider type="vertical" />
            }
            {
              <InvoiceDetail id={record.id} templateType={1} data={record}>
                <a>查看详情</a>
              </InvoiceDetail>
            }
          </span>
        ),
        width: 200,
        fixed: 'right',
        className: 'fixCenter'
      });
    }
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px',
    };
    // if (Number(status) !== 2) {
    //   rowSelection=null;
    // }
    return (
      <div style={{padding: 0}}>
        <div className={style.titleMenu}>
          <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
            <Menu.Item key={2}>
              待还款
            </Menu.Item>
            <Menu.Item key={3}>
              已还款
            </Menu.Item>
          </Menu>
        </div>
        <SearchBanner
          list={searchList || []}
          onChange={val => this.onChangeSearch(val)}
        />
        <div className="content-dt" style={{padding: 0}}>
          <div className={style.payContent}>
            <div className="cnt-header" style={{display: 'flex'}}>
              <div className="head_lf">
                <DropBtn
                  selectKeys={selectedRowKeys}
                  total={total}
                  onExport={(key) => this.export(key)}
                  noLevels
                />
              </div>
              {/* <div className="head_rg">
                <span>排序</span>
              </div> */}
            </div>
            <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>
              {selectedRowKeys.length?`已选${selectedRowKeys.length}张单据，`:''}
              借款共计¥{sumAmount?sumAmount/100:(this.props.loanSumObj&&this.props.loanSumObj.loanSumAll/100 || 0)}
              {status==='2'?`，待还款共计¥${sumAmount
              ?loanSumAll/100
              :(loanSumObj && numAdd(loanSumObj.waitAssessSumAll || 0, loanSumObj.freezeSum || 0)/100 || 0)}`:''}
            </p>
            <Table
              columns={columns}
              dataSource={list}
              rowSelection={rowSelection}
              scroll={{ x: 1900 }}
              rowKey="loanId"
              loading={loading}
              pagination={{
                current: query.pageNo,
                onChange: (pageNumber) => {
                  this.onQuery({
                    pageNo: pageNumber,
                    pageSize: query.pageSize,
                    status,
                  });
                },
                total,
                size: 'small',
                showTotal: () => (`共${total}条数据`),
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (cur, size) => {
                  this.onQuery({
                    pageNo: cur,
                    pageSize: size,
                    status,
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Payments;
