
import React from 'react';
import { Table, Divider, message, Menu, Form, DatePicker, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import { rowSelect } from '@/utils/common';
import style from './index.scss';
import RecordModal from './components/RecordModal';
import DropBtn from '../../components/DropBtn';
import constants from '../../utils/constants';
import AddModal from './components/AddModal';

const { RangePicker } = DatePicker;
const { APP_API } = constants;
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
      message.error('请选择要导出的数据');
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
        fileName:'选中导出列表',
      };
    } else if (key === '3') {
      params = {
        searchContent,
        startTime,
        endTime,
        type:status-2,
        fileName:status==='2'?'待还款列表':'已还款列表',
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
      message.success('导出成功');
    });
  }

  print = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 1) {
      message.error('只支持打印一条数据');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${selectedRowKeys[0]}`;
    // this.props.dispatch({
    //   type: 'global/print',
    //   payload: {
    //     id: selectedRowKeys[0],
    //   }
    // }).then(() => {
    //   message.success('打印成功');
    // });
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
      title: '借款事由',
      dataIndex: 'reason',
      width: 150,
    }, {
      title: '借款金额',
      dataIndex: 'loanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '待还款金额',
      dataIndex: 'waitLoanSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'daimoneyCol',
      width: 100,
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
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD hh:mm:ss') }</span>
      ),
      width: 150,
    }, {
      title: '预计还款时间',
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
              <Button type="link">还款</Button>
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
                <a>查看详情</a>
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
    };
    // if (Number(status) !== 2) {
    //   rowSelection=null;
    // }
    return (
      <div className="content-dt" style={{padding: 0}}>
        <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
          <Menu.Item key={2}>
            待还款
          </Menu.Item>
          <Menu.Item key={3}>
            已还款
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
                <Form.Item label="提交时间">
                  {
                    getFieldDecorator('createTime')(
                      <RangePicker
                        className="m-l-8"
                        placeholder="请选择时间"
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
                  placeholder="单号 事由 收款账户名称"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
            {/* <div className="head_rg">
              <span>排序</span>
            </div> */}
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>
            {selectedRowKeys.length?`已选${selectedRowKeys.length}张单据，`:''}
            借款共计¥{sumAmount?sumAmount/100:(this.props.loanSumObj&&this.props.loanSumObj.loanSumAll/100 || 0)}
            {status==='2'?`，待还款共计¥${sumAmount?loanSumAll/100:(this.props.loanSumObj&&this.props.loanSumObj.waitAssessSumAll/100 || 0)}`:''}
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
              showTotal: () => (`共${total}条数据`),
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
