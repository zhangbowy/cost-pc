
import React from 'react';
import { Table, Form, Badge, Tooltip, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import Search from 'antd/lib/input/Search';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { rowSelect } from '@/utils/common';
// import { JsonParse } from '@/utils/common';
import constants, { getArrayValue, approveStatus, invoiceStatus } from '@/utils/constants';
import LevelSearch from '@/components/LevelSearchNew';
import DropBtn from '@/components/DropBtn';
import style from './index.scss';

const { APP_API } = constants;
@Form.create()
@connect(({ loading, summary }) => ({
  loading: loading.effects['summary/list'] || false,
  list: summary.list,
  query: summary.query,
  total: summary.total,
  exportData: summary.exportData,
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
      type: 'summary/list',
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
      message.error('???????????????????????????');
      return;
    }
    if (selectedRows.length === 0) {
      message.error('???????????????????????????');
      return;
    }
    window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${selectedRows[0].invoiceSubmitId}`;
    // this.props.dispatch({
    //   type: 'global/print',
    //   payload: {
    //     id: selectedRows[0].invoiceSubmitId,
    //   }
    // }).then(() => {
    //   message.success('????????????');
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
      message.error('???????????????????????????');
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
      type: 'summary/export',
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
      // form: { getFieldDecorator },
      total,
      loading,
    } = this.props;
    const columns = [{
      title: '????????????',
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
      title: '???????????????',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      ),
      width: 100,
    }, {
      title: '?????????',
      dataIndex: 'userName',
      width: 130,
    }, {
      title: '????????????',
      dataIndex: 'deptName',
      width: 130,
    }, {
      title: '??????',
      dataIndex: 'projectName',
      width: 130,
    }, {
      title: '????????????',
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
      title: '??????',
      dataIndex: 'invoiceNo',
      width: 140,
    }, {
      title: '????????????',
      dataIndex: 'invoiceTemplateName',
      width: 100,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '?????????',
      dataIndex: 'createUserName',
      width: 100,
    }, {
      title: '???????????????',
      dataIndex: 'createDeptName',
      width: 100,
    }, {
      title: '????????????',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '?????????',
      dataIndex: 'payUserName',
      width: 100,
    }, {
      title: '????????????',
      dataIndex: 'payTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '????????????',
      dataIndex: 'approveStatus',
      render: (text) => (
        <span>{getArrayValue(text, approveStatus)}</span>
      ),
      width: 100,
    }, {
      title: '????????????',
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
      title: '??????',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <InvoiceDetail
            id={record.invoiceSubmitId}
            templateType={0}
          >
            <a>??????</a>
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
                ??????
              </DropBtn>
              {/* <Button className="m-l-8" onClick={() => this.print()}>??????</Button> */}
              <Form style={{display: 'flex', marginLeft: '8px'}}>
                <Search
                  placeholder="?????? ?????? ?????????"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
            <LevelSearch onOk={this.handleSearch} details={leSearch}>
              {/* <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle'}}>
                <div className={style.activebg}>
                  <Icon className="sub-color m-r-8" type="filter" />
                </div>
                <span className="fs-14 sub-color">??????</span>
              </div> */}
            </LevelSearch>
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>??????{selectedRowKeys.length}????????????????????{sumAmount/100}</p>
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
