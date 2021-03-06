
import React from 'react';
import { Table, Divider, message, Menu, Form, DatePicker, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import Search from 'antd/lib/input/Search';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { rowSelect } from '@/utils/common';
import DropBtn from '@/components/DropBtn';
import style from './index.scss';
import RecordModal from './components/RecordModal';
import AddModal from './components/AddModal';

const { RangePicker } = DatePicker;
@Form.create()
@connect(({ loading, borrowering }) => ({
  loading: loading.effects['borrowering/list'] || false,
  list: borrowering.list,
  query: borrowering.query,
  total: borrowering.total,
  loanSumObj: borrowering.loanSumObj,
  recordList: borrowering.recordList
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
      loanSumAll:0
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
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { searchContent } = this.state;
    console.log('e.key======',e.key);
    this.setState({
      status: e.key,
      selectedRowKeys: [],
      selectedRows: [],
      sumAmount: 0,
    });
    this.onQuery({
      ...query,
      status: e.key,
      searchContent,
      startTime,
      endTime,
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

  onOk = () => {
    const {
      query,
    } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { status, searchContent } = this.state;
    this.onQuery({
      ...query,
      status,
      startTime,
      endTime,
      searchContent,
    });
  }

  handChange = (date) => {
    if (!date) {
      const { status, searchContent } = this.state;
      const {
        query,
      } = this.props;
      this.onQuery({
        ...query,
        status,
        searchContent,
      });
    }
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    const obj = payload;
    obj.type = payload.status*1 - 2;
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

  onSearch = (val) => {
    const { query } = this.props;
    const { status } = this.state;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    this.setState({
      searchContent: val,
    });
    this.onQuery({
      ...query,
      searchContent: val,
      status,
      startTime,
      endTime,
    });
  }

  export = (key) => {
    const { selectedRowKeys, status, searchContent } = this.state;
    console.log('key======',key);
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('???????????????????????????');
      return;
    }
    let params = {};
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    if (key === '1') {
      params = {
        ids: selectedRowKeys,
        export: true,
        fileName:'??????????????????',
      };
    } else if (key === '3') {
      params = {
        searchContent,
        startTime,
        endTime,
        type:status-2,
        fileName:status==='2'?'???????????????':'???????????????',
        export: true
      };
    }
    console.log(params);
    this.props.dispatch({
      type: 'borrowering/loanExported',
      payload: {
        ...params,
      }
    }).then(() => {
      message.success('????????????');
    });
  }

  // ??????
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

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      // selectedRows,
      loanSumAll
    } = this.state;
    const {
      list,
      query,
      form: { getFieldDecorator },
      total,
      loading,
    } = this.props;
    const columns = [{
      title: '????????????',
      dataIndex: 'reason',
      width: 150,
    }, {
      title: '?????????????????????',
      dataIndex: 'loanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '????????????????????????',
      dataIndex: 'waitLoanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '??????',
      dataIndex: 'invoiceNo',
      width: 130,
    }, {
      title: '????????????',
      dataIndex: 'invoiceTemplateName',
      width: 120,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '?????????',
      dataIndex: 'userName',
      width: 100,
    }, {
      title: '??????',
      dataIndex: 'deptName',
      width: 100,
    }, {
      title: '????????????',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD HH:mm:ss') }</span>
      ),
      width: 150,
    }, {
      title: '??????????????????',
      dataIndex: 'repaymentTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '??????',
      dataIndex: 'ope',
      render: (_, record) =>
      (
        <div>
          {
            Number(status) === 2 &&
            <AddModal title="add" onOk={() => this.onOk()} detail={record}>
              <Button style={{padding:'0'}} type="link">??????</Button>
            </AddModal>
          }
          {
            Number(status) === 2 &&
            <Divider type="vertical" />
          }
          <RecordModal detail={record} RecordModal id={record.invoiceId} canRefuse={Number(status) === 2} refuse={this.handleRefuse}>
            <a>????????????</a>
          </RecordModal>
          {
            Number(status) === 2 &&
            <Divider type="vertical" />
          }
          {
            Number(status) === 2 &&
              <InvoiceDetail id={record.id} templateType={1} data={record}>
                <a>??????</a>
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
        title: '??????',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {/* <InvoiceDetail id={record.invoiceId} canRefuse={Number(record.status) === 2} refuse={this.handleRefuse}>
              <a>????????????</a>
            </InvoiceDetail> */}
            <RecordModal detail={record} RecordModal id={record.invoiceId} canRefuse={Number(status) === 2} refuse={this.handleRefuse}>
              <a>????????????</a>
            </RecordModal>
            {
              <Divider type="vertical" />
            }
            {
              <InvoiceDetail id={record.id} templateType={1} data={record}>
                <a>????????????</a>
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
      <div className="content-dt" style={{padding: 0}}>
        <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
          <Menu.Item key={2}>
            ?????????
          </Menu.Item>
          <Menu.Item key={3}>
            ?????????
          </Menu.Item>
        </Menu>
        <div className={style.payContent}>
          <div className="cnt-header" style={{display: 'flex'}}>
            <div className="head_lf">
              <DropBtn
                selectKeys={selectedRowKeys}
                total={total}
                onExport={(key) => this.export(key)}
                noLevels
              />
              <Form style={{display: 'flex', marginLeft: '8px'}}>
                <Form.Item label="????????????">
                  {
                    getFieldDecorator('createTime')(
                      <RangePicker
                        className="m-l-8"
                        placeholder="???????????????"
                        format="YYYY-MM-DD"
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        onOk={() => this.onOk()}
                        onChange={() => this.handChange()}
                      />
                    )
                  }
                </Form.Item>
                <Search
                  placeholder="?????? ?????? ?????????"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
            {/* <div className="head_rg">
              <span>??????</span>
            </div> */}
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>
            {selectedRowKeys.length?`??????${selectedRowKeys.length}????????????`:''}
            ??????????????{sumAmount?sumAmount/100:(this.props.loanSumObj&&this.props.loanSumObj.loanSumAll/100 || 0)}
            {status==='2'?`????????????????????${sumAmount?loanSumAll/100:(this.props.loanSumObj&&this.props.loanSumObj.waitAssessSumAll/100 || 0)}`:''}
          </p>
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            scroll={{ x: 1800 }}
            rowKey="loanId"
            loading={loading}
            pagination={{
              current: query.pageNo,
              onChange: (pageNumber) => {
                const createTime = this.props.form.getFieldValue('createTime');
                let startTime = '';
                let endTime = '';
                if (createTime && createTime.length > 0) {
                  startTime = moment(createTime[0]).format('x');
                  endTime = moment(createTime[1]).format('x');
                }
                const { searchContent } = this.state;
                this.onQuery({
                  pageNo: pageNumber,
                  pageSize: query.pageSize,
                  searchContent,
                  status,
                  endTime,
                  startTime,
                });
              },
              total,
              size: 'small',
              showTotal: () => (`???${total}?????????`),
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (cur, size) => {
                const createTime = this.props.form.getFieldValue('createTime');
                let startTime = '';
                let endTime = '';
                if (createTime && createTime.length > 0) {
                  startTime = moment(createTime[0]).format('x');
                  endTime = moment(createTime[1]).format('x');
                }
                const { searchContent } = this.state;
                this.onQuery({
                  pageNo: cur,
                  pageSize: size,
                  searchContent,
                  status,
                  endTime,
                  startTime,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default Payments;
