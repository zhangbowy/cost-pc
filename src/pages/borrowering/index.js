
import React from 'react';
import { Table, Divider, message, Menu, Button, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import { JsonParse, rowSelect } from '@/utils/common';
import style from './index.scss';
import PayModal from './components/payModal';
import DropBtn from '../../components/DropBtn';
import constants, { getArrayValue, accountType } from '../../utils/constants';

const { RangePicker } = DatePicker;
const { APP_API } = constants;
@Form.create()
@connect(({ loading, payment }) => ({
  loading: loading.effects['payment/list'] || false,
  list: payment.list,
  query: payment.query,
  total: payment.total,
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
      console.log(selectedRowKeys);
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
    this.props.dispatch({
      type: 'payment/list',
      payload,
    });
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
    let url = 'payment/exporting';
    if (key === '1') {
      params = {
        ids: selectedRowKeys
      };
    } else if (key === '2') {
      params = {
        searchContent,
        startTime,
        endTime,
      };
    }
    if(Number(status) !== 2) {
      url = 'payment/exported';
    }
    this.props.dispatch({
      type: url,
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
      type: 'payment/refuse',
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
      selectedRows,
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
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text/100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '待还款金额',
      dataIndex: 'daisubmitSum',
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
      dataIndex: 'createName',
      width: 100,
    }, {
      title: '部门',
      dataIndex: 'bumen',
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '预计还款时间',
      dataIndex: 'endTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 200,
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            Number(record.status) === 2 &&
              <PayModal onOk={() => this.onOk()} data={record}>
                <a>还款</a>
              </PayModal>
          }
          {
            Number(record.status) === 2 &&
            <Divider type="vertical" />
          }
          <InvoiceDetail id={record.invoiceId} canRefuse={Number(record.status) === 2} refuse={this.handleRefuse}>
            <a>借还记录</a>
          </InvoiceDetail>
        </span>
      ),
      width: 140,
      fixed: 'right',
      className: 'fixCenter'
    }];
    if(Number(status) !== 2) {
      columns.splice(8, 2,{
        title: '操作',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            <InvoiceDetail id={record.invoiceId} canRefuse={Number(record.status) === 2} refuse={this.handleRefuse}>
              <a>借还记录</a>
            </InvoiceDetail>
          </span>
        ),
        width: 140,
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
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>已选{selectedRowKeys.length}张单据，共计¥{sumAmount/100}</p>
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            scroll={{ x: 2000 }}
            rowKey="id"
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
