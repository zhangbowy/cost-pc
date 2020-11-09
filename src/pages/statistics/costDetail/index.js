
import React from 'react';
import { Table, Form, DatePicker, Badge, Icon, Button, Tooltip, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import { rowSelect } from '@/utils/common';
// import { JsonParse } from '@/utils/common';
import constants, { getArrayValue, approveStatus, invoiceStatus } from '@/utils/constants';
import LevelSearch from '@/components/LevelSearch';
import DropBtn from '@/components/DropBtn';
import style from './index.scss';

const { RangePicker } = DatePicker;
const { APP_API } = constants;
@Form.create()
@connect(({ loading, statistics }) => ({
  loading: loading.effects['statistics/list'] || false,
  list: statistics.list,
  query: statistics.query,
  total: statistics.total,
  exportData: statistics.exportData,
}))
class Statistics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
      leSearch: {},
      selectedRows: [],
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({
      ...query,
    });
  }

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
    const { searchContent, leSearch } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
      startTime,
      endTime,
      content:searchContent,
      ...leSearch,
    });
  }

  handChange = (date) => {
    if (!date) {
      const { searchContent, leSearch } = this.state;
      const {
        query,
      } = this.props;
      this.onQuery({
        ...query,
        content:searchContent,
        ...leSearch,
      });
    }
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'statistics/list',
      payload,
    });
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



  onSearch = (val) => {
    const { query } = this.props;
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
    const { leSearch } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
      content: val,
      startTime,
      endTime,
      ...leSearch,
    });
  }

  print = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length > 1) {
      message.error('只支持打印一条数据');
      return;
    }
    if (selectedRows.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${selectedRows[0].invoiceSubmitId}`;
    // this.props.dispatch({
    //   type: 'global/print',
    //   payload: {
    //     id: selectedRows[0].invoiceSubmitId,
    //   }
    // }).then(() => {
    //   message.success('打印成功');
    // });
  }

  handleSearch = (detail) => {
    const { query } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    this.setState({
      leSearch: detail,
    });
    const { searchContent } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
      content:searchContent,
      ...detail,
      startTime,
      endTime,
    });
  }

  export = (key) => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { searchContent, leSearch } = this.state;
    let params = {};
    if (key === '1') {
      params = {
        ids: selectedRowKeys,
      };
    }else if (key === '2') {
      params = {
        searchContent,
        ...leSearch,
        startTime,
        endTime,
      };
    }

    // const _this = this;
    this.props.dispatch({
      type: 'statistics/export',
      payload: {
        ...params,
      }
    });
  }

  render() {
    const {
      selectedRowKeys,
      sumAmount,
      leSearch,
    } = this.state;
    const {
      list,
      query,
      form: { getFieldDecorator },
      total,
      loading,
    } = this.props;
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      width: 100,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '金额（元）',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      ),
      width: 100,
    }, {
      title: '报销人',
      dataIndex: 'userName',
      width: 130,
    }, {
      title: '报销部门',
      dataIndex: 'deptName',
      width: 130,
    }, {
      title: '项目',
      dataIndex: 'projectName',
      width: 130,
    }, {
      title: '报销事由',
      dataIndex: 'reason',
      width: 150,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''} arrowPointAtCenter>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 140,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 100,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '提交人',
      dataIndex: 'createUserName',
      width: 100,
    }, {
      title: '提交人部门',
      dataIndex: 'createDeptName',
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '发放人',
      dataIndex: 'payUserName',
      width: 100,
    }, {
      title: '付款时间',
      dataIndex: 'payTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '审批状态',
      dataIndex: 'approveStatus',
      render: (text) => (
        <span>{getArrayValue(text, approveStatus)}</span>
      ),
      width: 100,
    }, {
      title: '发放状态',
      dataIndex: 'status',
      render: (text) => (
        <span>
          {
            (Number(text) === 2 )|| (Number(text) === 3) ?
              <Badge
                color={Number(text) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                text={getArrayValue(text, invoiceStatus)}
              />
            :
              <span>{getArrayValue(text, invoiceStatus)}</span>
          }
        </span>
      ),
      width: 100,
    },{
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <InvoiceDetail
            id={record.invoiceSubmitId}
            templateType={0}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 80,
      fixed: 'right',
      className: 'fixCenter'
    }];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };
    return (
      <div className="content-dt" style={{padding: 0}}>
        <div className={style.payContent}>
          <div className="cnt-header" style={{display: 'flex'}}>
            <div className="head_lf">
              <DropBtn
                selectKeys={selectedRowKeys}
                total={total}
                className="m-l-8"
                onExport={(key) => this.export(key)}
              >
                导出
              </DropBtn>
              <Button className="m-l-8" onClick={() => this.print()}>打印</Button>
              <Form style={{display: 'flex', marginLeft: '8px'}}>
                <Form.Item label="提交时间">
                  {
                    getFieldDecorator('createTime')(
                      <RangePicker
                        className="m-l-8"
                        placeholder="请选择时间"
                        format="YYYY-MM-DD"
                        style={{ width: '250px' }}
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
            <LevelSearch onOk={this.handleSearch} details={leSearch}>
              <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle'}}>
                <Icon className="sub-color m-r-3" type="filter" />
                <span className="fs-14 sub-color">高级搜索</span>
              </div>
            </LevelSearch>
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>已选{selectedRowKeys.length}笔费用，共计¥{sumAmount/100}</p>
          <Table
            columns={columns}
            dataSource={list}
            scroll={{ x: 2200 }}
            rowKey="id"
            rowSelection={rowSelection}
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
                  content: searchContent,
                  endTime,
                  startTime,
                  ...leSearch,
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
                  pageNo: 1,
                  pageSize: size,
                  content: searchContent,
                  endTime,
                  startTime,
                  ...leSearch,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default Statistics;
