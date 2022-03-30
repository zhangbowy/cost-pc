import React from 'react';
import { Table, Menu, Button, Form, message } from 'antd';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import constants from '@/utils/constants';
import style from '../index.scss';
import PayModal from './PayModal';
import { ddOpenLink } from '../../../../utils/ddApi';
import SearchBanner from '../../../statistics/overview/components/Search/Searchs';

const { APP_API } = constants;
@Form.create()
class PayTemp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      selectedRows: [],
      accountType: [],
      pageNo: 1,
      show: true,
      isOnlyShowModify: false,
      isCheckExported: false
    };
  }

  componentDidMount() {
    const {query} = this.props;
    this.onQuery({
      ...query,
      status: 2
    });
  }

  handleClick = e => {
    const {query} = this.props;
    this.setState({
      status: e.key,
      selectedRowKeys: [],
      selectedRows: [],
      sumAmount: 0,
      isCheckExported: false
    });

    this.props.onChangeStatus(e.key);
    this.onQuery({
      ...query,
      status: e.key,
      pageNo: 1,
      isSign: Number(e.key) === 1
    });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount += item.receiptSum;
    });

    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
      sumAmount: amount.toFixed(2)
    });
    console.log(_selectedRows, selectedRowKeys, '-----');
  };

  onSelect = (record, selected) => {
    const {selectedRows, selectedRowKeys} = rowSelect.onSelect(
      this.state,
      record,
      selected
    );
    console.log(selectedRows);
    let amount = 0;
    selectedRows.forEach(item => {
      amount += item.receiptSum;
    });
    this.setState({
      selectedRows,
      selectedRowKeys,
      sumAmount: amount.toFixed(2)
    });
  };

  onDelete = id => {
    const {selectedRows, selectedRowKeys} = rowSelect.onDelete(
      this.state,
      id
    );
    let amount = 0;
    selectedRows.forEach(item => {
      amount += item.submitSum;
    });
    this.setState({
      selectedRows,
      selectedRowKeys,
      sumAmount: amount
    });
  };

  onOk = val => {
    const {query} = this.props;
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
        sumAmount: 0
      });
    }
    const {status} = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
      status
    });
  };

  onLink = id => {
    this.props.history.push(`/system/auth/${id}`);
  };

  onQuery = payload => {
    this.props.onQuerys(payload);
  };

  onChange = (rows, keys) => {
    let amount = 0;
    keys.forEach(item => {
      if (item.submitSum) {
        amount += item.submitSum;
      }
    });
    this.setState({
      selectKey: keys,
      count: keys.length,
      sumAmount: amount / 100
    });
  };

  export = key => {
    const {selectedRowKeys, status, accountTypes} = this.state;
    const {namespace, searchList} = this.props;
    if (selectedRowKeys.length === 0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let params = {};
    let url = `${namespace}/exporting`;
    if (key === '1') {
      params = {
        ids: selectedRowKeys
      };
    } else if (key === '2') {
      searchList.forEach(it => {
        if (it.value) {
          Object.assign(params, {
            ...it.value
          });
        }
      });
    }
    if (Number(status) !== 2 && Number(status) !== 1) {
      url = `${namespace}/exported`;
    }
    if (Number(status) === 5) {
      url = `${namespace}/exportRefuse`;
    }
    console.log('是这里吗', url);
    this.props
      .dispatch({
        type: url,
        payload: {
          ...params,
          accountTypes,
          isSign: Number(status) === 1
        }
      })
      .then(() => {
        message.success('导出成功');
      });
  };

  print = () => {
    const { selectedRowKeys } = this.state;
    const { templateType } = this.props;
    if (selectedRowKeys.length > 10) {
      message.error('最多支持打印十条数据');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    const ids = `${selectedRowKeys.join(',')}`;
    if (!Number(templateType)) {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem(
          'token'
        )}&ids=${ids}`
      );
    } else {
      ddOpenLink(
        `${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem(
          'token'
        )}&ids=${ids}`
      );
    }
  };

  // 拒绝
  handleRefuse = val => {
    const {namespace, templateType} = this.props;
    this.props
      .dispatch({
        type: `${namespace}/refuse`,
        payload: {
          invoiceSubmitIds: [val.id],
          rejectNote: val.rejectNote,
          templateType
        }
      })
      .then(() => {
        this.onOk();
      });
  };

  onConfirm = () => {
    this.onOk();
    this.setState({
      visibleConfirm: true
    });
  };

  handleTableChange = (pagination, filters) => {
    const {status} = this.state;
    this.setState(
      {
        accountTypes: filters.accountType,
        pageNo: pagination.current
      },
      () => {
        this.onQuery({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          accountTypes: filters.accountType || [],
          status
        });
      }
    );
  };

  onMove = () => {
    const { selectedRowKeys, accountTypes, status } = this.state;
    const { templateType, query } = this.props;
    if (!selectedRowKeys.length) {
      message.error('请至少选择一条数据');
      return;
    }
    const params = {
      pageNo: 1,
      pageSize: query.pageSize,
      accountTypes,
      status
    };
    this.props.operationSign(
      {
        invoiceIds: selectedRowKeys,
        templateType,
        isSign: Number(status) === 2
      },
      () => {
        this.setState({
          selectedRowKeys: []
        });
        this.onQuery(params);
      }
    );
  };

  handle = () => {
    this.setState({
      show: false
    });
  };

  onChangeCheck = (value, key) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        const {query} = this.props;
        const {status} = this.state;
        this.onQuery({
          ...query,
          pageNo: 1,
          status,
          [key]: value
        });
      }
    );
  };

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      selectedRows,
      accountTypes,
      show
    } = this.state;
    const {
      list,
      query,
      total,
      loading,
      columns,
      templateType,
      confirm,
      searchList,
    } = this.props;

    const rowSelection = Number(status) === 2 ? {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px',
      fixed: true,
    }: null;
    return (
      <div style={{padding: 0}}>
        <div className={style.titleMenu}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[status]}
            mode="horizontal"
          >
            <Menu.Item key={2}>待收款</Menu.Item>
            <Menu.Item key={3}>已收款</Menu.Item>
            <Menu.Item key={5}>已拒绝</Menu.Item>
          </Menu>
        </div>
        <SearchBanner
          className="verificationHeader"
          list={searchList || []}
          onChange={val =>
            this.props.onChangeSearch(val, () => {
              this.onQuery({
                pageNo: 1,
                pageSize: query.pageSize,
                accountTypes,
                status
              });
            })}
        />
        <div className="content-dt" style={{padding: 0}}>
          <>
            {Number(status) === 1 && show && (
              <div className={style.production}>
                <div className={style.texts}>
                  <i className="iconfont iconinfo-cirlce"/>
                  <span className="c-black-65">
                    {templateType
                      ? '如有制单环节，可将制单后的单据暂时移至已制单，统一处理'
                      : '如有票据签收/核对环节，可将核对后的单据暂时移至已票签，由出纳统一发放'}
                  </span>
                </div>
                <i
                  className="iconfont iconguanbi c-black-65 fs-14"
                  style={{cursor: 'pointer'}}
                  onClick={() => this.handle()}
                />
              </div>
            )}
          </>
          <div
            className={
              Number(status) === 1 && show
                ? cs(style.payContent, style.noPadding)
                : style.payContent
            }
          >
            {(Number(status) === 2 || Number(status) === 1) && (
            <div className="cnt-header" style={{display: 'flex'}}>
              <div className="head_lf">
                <>
                  <PayModal
                    selectKey={selectedRows}
                    onOk={val => this.onOk(val)}
                    templateType={templateType}
                    confirms={() => confirm()}
                  >
                    <Button type="primary" style={{marginRight: '8px'}}>
                      发起收款
                    </Button>
                  </PayModal>
                </>
              </div>
              <div className="head_rf">
                {/* <TableTemplate */}
                {/*  page={recordPage} */}
                {/*  onQuery={onRecord} */}
                {/*  columns={recordColumns} */}
                {/*  list={recordList} */}
                {/*  placeholder="输入详情内容搜索" */}
                {/*  sWidth="800px" */}
                {/* > */}
                {/*  <div className="head_rf" style={{cursor: 'pointer'}}> */}
                {/*    <i */}
                {/*      className="iconfont iconcaozuojilu c-black-65" */}
                {/*      style={{verticalAlign: 'middle', marginRight: '4px'}} */}
                {/*    /> */}
                {/*    <span className="fs-14 c-black-65">操作记录</span> */}
                {/*  </div> */}
                {/* </TableTemplate> */}
              </div>
            </div>
              )}
            {(Number(status) === 2 || Number(status) === 1) && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <p className="c-black-85 fw-500 fs-14">
                  已选{selectedRowKeys.length}张单据，共计¥{sumAmount / 100}
                </p>
              </div>
            )}
            <Table
              columns={columns}
              dataSource={list}
              rowSelection={rowSelection}
              scroll={{
                x: Number(status) !== 3 && Number(status) !== 5 ? 1750 : 2300
              }}
              rowKey="id"
              loading={loading}
              onChange={this.handleTableChange}
              pagination={{
                current: query.pageNo,
                total,
                size: 'small',
                showTotal: () => `共${total}条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (cur, size) => {
                  this.onQuery({
                    pageNo: cur,
                    pageSize: size,
                    status,
                    accountTypes
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

export default PayTemp;
