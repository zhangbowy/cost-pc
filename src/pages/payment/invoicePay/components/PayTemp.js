
import React from 'react';
import { Table, Menu, Button, Form, message, Checkbox } from 'antd';
import moment from 'moment';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import DropBtn from '@/components/DropBtn';
import constants from '@/utils/constants';
import TableTemplate from '@/components/Modals/TableTemplate';
import style from '../index.scss';
import PayModal from './PayModal';
import { ddOpenLink } from '../../../../utils/ddApi';
import SearchBanner from '../../../statistics/overview/components/Search/Searchs';
import fields from '../../../../utils/fields';

const { APP_API } = constants;
const { signName } = fields;
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
      isCheckExported: false,
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
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
      isCheckExported: false,
    });

    this.props.onChangeStatus(e.key);
    this.onQuery({
      ...query,
      status: e.key,
      pageNo: 1,
      isSign: Number(e.key) === 1,
    });
  };

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
        sumAmount: amount.toFixed(2),
    });
  };

  onSelect = (record, selected) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onSelect(this.state, record, selected);
      console.log(selectedRowKeys);
      let amount = 0;
      selectedRows.forEach(item => {
        amount+=item.submitSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount.toFixed(2),
      });
  };

  onDelete = (id) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
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

  onOk = (val) => {
    const {
      query,
    } = this.props;
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
        sumAmount: 0,
      });
    }
    const { status } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
      status,
    });
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    const { isOnlyShowModify } = this.state;
    Object.assign(payload, {
      isOnlyShowModify
    });
    this.props.onQuerys(payload);
  }

  onChange = (rows, keys) => {
    let amount = 0;
    keys.forEach(item => {
      if (item.submitSum) {
        amount+=item.submitSum;
      }
    });
    this.setState({
      selectKey: keys,
      count: keys.length,
      sumAmount: amount/100,
    });
  }

  export = (key) => {
    const { selectedRowKeys, status, accountTypes } = this.state;
    const { namespace, searchList } = this.props;
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('???????????????????????????');
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
    if(Number(status) !== 2 && Number(status) !== 1) {
      url = `${namespace}/exported`;
    }
    if (Number(status) === 5) {
      url = `${namespace}/exportRefuse`;
    }
    console.log('????????????', url);
    this.props.dispatch({
      type: url,
      payload: {
        ...params,
        accountTypes,
        isSign: Number(status) === 1,
      }
    }).then(() => {
      message.success('????????????');
    });
  }

  print = () => {
    const { selectedRowKeys } = this.state;
    const { templateType } = this.props;
    if (selectedRowKeys.length > 10) {
      message.error('??????????????????????????????');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.error('???????????????????????????');
      return;
    }
    const ids = `${selectedRowKeys.join(',')}`;
    if (!Number(templateType)) {
      ddOpenLink(`${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${ids}`);
    } else {
      ddOpenLink(`${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem('token')}&ids=${ids}`);
    }
  }

  // ??????
  handleRefuse = (val) => {
    const { namespace, templateType } = this.props;
    this.props.dispatch({
      type: `${namespace}/refuse`,
      payload: {
        invoiceSubmitIds: [val.id],
        rejectNote: val.rejectNote,
        templateType,
      }
    }).then(() => {
      this.onOk();
    });
  }

  onConfirm = () => {
    this.onOk();
    this.setState({
      visibleConfirm: true,
    });
  }

  handleTableChange = (pagination, filters) => {
    const { status } = this.state;
    this.setState({
      accountTypes: filters.accountType,
      pageNo: pagination.current,
    }, () => {
      this.onQuery({
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        accountTypes: filters.accountType || [],
        status,
      });
    });

  };

  onMove = () => {
    const { selectedRowKeys, accountTypes, status } = this.state;
    const { templateType, query } = this.props;
    if (!selectedRowKeys.length) {
      message.error('???????????????????????????');
      return;
    }
    const params = {
      pageNo: 1,
      pageSize: query.pageSize,
      accountTypes,
      status,
    };
    this.props.operationSign({
      invoiceIds: selectedRowKeys,
      templateType,
      isSign: Number(status) === 2,
    }, () => {
      this.setState({
        selectedRowKeys: [],
      });
      this.onQuery(params);
    });
  }

  handle = () => {
    this.setState({
      show: false,
    });
  }

  onChangeCheck = (value, key) => {
    this.setState({
      [key]: value,
    }, () => {
      const {
        query,
      } = this.props;
      const { status } = this.state;
      this.onQuery({
        ...query,
        pageNo: 1,
        status,
        [key]: value,
      });
    });

  }

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      selectedRows,
      accountTypes,
      show,
    } = this.state;
    const {
      list,
      query,
      total,
      loading,
      columns,
      templateType,
      confirm,
      recordList,
      recordPage,
      onRecord,
      searchList,
      isModifyInvoice
    } = this.props;

    const recordColumns = [{
      title: '??????',
      dataIndex: 'createName',
    }, {
      title: '????????????',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{text ? moment(Number(text)).format('YYYY-MM-DD') : '-'}</span>
      )
    }, {
      title: '????????????',
      dataIndex: 'operationMsg',
    }, {
      title: '??????',
      dataIndex: 'operationDetail',
    }];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px',
      fixed: true
    };
    return (
      <div style={{padding: 0}}>
        <div className={style.titleMenu}>
          <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
            <Menu.Item key={2}>
              ?????????
            </Menu.Item>
            <Menu.Item key={1}>
              ???{signName[templateType]}
            </Menu.Item>
            <Menu.Item key={3}>
              ?????????
            </Menu.Item>
            <Menu.Item key={5}>
              ?????????
            </Menu.Item>
          </Menu>
        </div>
        <SearchBanner
          list={searchList || []}
          onChange={val => this.props.onChangeSearch(val, () => {
            this.onQuery({
              pageNo: 1,
              pageSize: query.pageSize,
              accountTypes,
              status,
            });
          })}
        />
        <div className="content-dt" style={{padding: 0}}>
          <>
            {
              Number(status) === 1 && show &&
              <div className={style.production}>
                <div className={style.texts}>
                  <i className="iconfont iconinfo-cirlce" />
                  <span className="c-black-65">
                    {
                      templateType ?
                      '?????????????????????????????????????????????????????????????????????????????????'
                      :
                      '??????????????????/????????????????????????????????????????????????????????????????????????????????????'
                    }
                  </span>
                </div>
                <i className="iconfont iconguanbi c-black-65 fs-14" style={{ cursor: 'pointer' }} onClick={() => this.handle()} />
              </div>
            }
          </>
          <div className={Number(status) === 1 && show ? cs(style.payContent, style.noPadding) : style.payContent}>
            <div className="cnt-header" style={{display: 'flex'}}>
              <div className="head_lf">
                {
                  (Number(status) === 2 || Number(status) === 1) &&
                  <>
                    <PayModal selectKey={selectedRows} onOk={(val) => this.onOk(val)} templateType={templateType} confirms={() => confirm()}>
                      <Button type="primary" style={{marginRight: '8px'}}>????????????</Button>
                    </PayModal>
                    <Button className="m-r-8" onClick={() => this.onMove()}>{Number(status) === 2 ? `?????????${signName[templateType]}` : '???????????????'}</Button>
                  </>
                }
                <DropBtn
                  selectKeys={selectedRowKeys}
                  total={total}
                  onExport={(key) => this.export(key)}
                  noLevels
                />
                <Button className="m-l-8" onClick={() => this.print()}>??????</Button>
              </div>
              <div className="head_rf">
                {
                  isModifyInvoice &&
                  <Checkbox
                    className="m-l-16"
                    style={{marginTop: '5px'}}
                    onChange={e => this.onChangeCheck(e.target.checked, 'isOnlyShowModify')}
                  >???????????????
                  </Checkbox>
                }
                {
                  templateType === 0 && Number(status) === 1 &&
                  <Checkbox
                    className="m-l-16"
                    style={{marginTop: '5px'}}
                    onChange={e => this.onChangeCheck(e.target.checked, 'isCheckExported')}
                  >???????????????
                  </Checkbox>
                }
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p className="c-black-85 fw-500 fs-14">
                ??????{selectedRowKeys.length}????????????????????{sumAmount/100}
              </p>
              {
                Number(status) === 1 &&
                <div className="head_rf">
                  <TableTemplate
                    page={recordPage}
                    onQuery={onRecord}
                    columns={recordColumns}
                    list={recordList}
                    placeholder="????????????????????????"
                    sWidth='800px'
                  >
                    <div className="head_rf" style={{ cursor: 'pointer' }}>
                      <i className="iconfont iconcaozuojilu c-black-65" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      <span className="fs-14 c-black-65">????????????</span>
                    </div>
                  </TableTemplate>
                </div>
              }
            </div>
            <Table
              columns={columns}
              dataSource={list}
              rowSelection={rowSelection}
              scroll={{ x: Number(status) !== 3 && Number(status) !== 5 ? 1750 : 2300 }}
              rowKey="id"
              loading={loading}
              onChange={this.handleTableChange}
              pagination={{
                current: query.pageNo,
                total,
                size: 'small',
                showTotal: () => (`???${total}?????????`),
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
