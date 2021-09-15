
import React from 'react';
import { Table, Form, Icon, Button, Tooltip, message, Dropdown, Menu, Badge, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
// import Search from 'antd/lib/input/Search';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { rowSelect } from '@/utils/common';
// import { JsonParse } from '@/utils/common';
import constants, { getArrayValue, approveStatus } from '@/utils/constants';
// import DropBtn from '@/components/DropBtn';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
import TableTemplate from '@/components/Modals/TableTemplate';
import style from './index.scss';
import { ddOpenLink } from '../../../utils/ddApi';
import SearchBanner from '../overview/components/Search/Searchs';
import { statusList, invoiceStatus, getArrayColor } from '../../../utils/constants';
import ChangeDate from './component/ChangeDate';

const { APP_API } = constants;
@Form.create()
@connect(({ loading, costDetail }) => ({
  loading: loading.effects['costDetail/list'] || false,
  list: costDetail.list,
  query: costDetail.query,
  total: costDetail.total,
  sum: costDetail.sum,
  recordPage: costDetail.recordPage,
  recordList: costDetail.recordList,
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
      searchList: [{ // 搜索部分数据
        type: 'tree',
        label: '支出类别',
        placeholder: '请选择',
        key: 'categoryIds',
        id: 'categoryIds',
        out: 1,
      }, {
        type: 'inSector',
        label: '金额',
        placeholder: ['请输入', '请输入'],
        key: ['minSum', 'maxSum'],
        id: 'price',
      }, {
        type: 'deptAndUser',
        label: '承担部门/人',
        placeholder: '请选择',
        key: ['userVOS', 'deptVOS'],
        id: 'user',
        out: 1,
      }, {
        type: 'rangeTime',
        label: '提交时间',
        placeholder: '请选择',
        key: ['startTime', 'endTime'],
        id: 'startTime',
      }, {
        type: 'rangeTime',
        label: '审核通过时间',
        placeholder: '请选择',
        key: ['approveStartTime', 'approveEndTime'],
        id: 'approveStartTime',
        out: 1,
      }, {
        type: 'rangeTime',
        label: '付款时间',
        placeholder: '请选择',
        key: ['payStartTime', 'payEndTime'],
        id: 'payStartTime'
      }, {
        type: 'select',
        label: '单据状态',
        placeholder: '请选择',
        key: 'statusList',
        id: 'statusList',
        options: statusList,
        fileName: {
          key: 'key',
          name: 'value'
        }
      }, {
        type: 'deptAndUser',
        label: '提交部门/人',
        placeholder: '请选择',
        key: ['createUserVOS', 'createDeptVOS'],
        id: 'createUserVOS',
      }, {
        type: 'tree',
        label: '单据类型',
        placeholder: '请选择',
        key: 'invoiceTemplateIds',
        id: 'invoiceTemplateIds',
      }, {
        type: 'tree',
        label: '项目',
        placeholder: '请选择',
        key: 'projectIds',
        id: 'projectIds',
      }, {
        type: 'tree',
        label: '供应商',
        placeholder: '请选择',
        key: 'supplierIds',
        id: 'supplierId',
      }, {
        type: 'search',
        label: '外部选择',
        placeholder: '单号、事由、收款人',
        key: 'content',
        id: 'content',
        out: 1,
      }],
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

  onQuery = (payload) => {
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value,
        });
      }
    });
    this.props.dispatch({
      type: 'costDetail/list',
      payload,
    });
  }



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
    if (selectedRows.length > 10) {
      message.error('最多支持打印十条数据');
      return;
    }
    if (selectedRows.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    const id = selectedRows.map(it => it.invoiceSubmitId);
    const lists = Array.from(new Set(id));
    const ids = lists.join(',');
    ddOpenLink(`${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${ids}`);
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
      type: 'costDetail/export',
      payload: {
        ...params,
      }
    });
  }

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
    this.onQuery(params);
  }

  render() {
    const {
      selectedRowKeys,
      sumAmount,
      searchList,
    } = this.state;
    const {
      list,
      query,
      loading,
      total,
      sum,
      recordPage,
      recordList,
    } = this.props;
    const recordColumns = [];
    const columns = [{
      title: '支出类别',
      dataIndex: 'categoryName',
      ellipsis: true,
      textWrap: 'word-break',
      width: 100,
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          {text}
        </Tooltip>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      ),
      width: 100,
    }, {
      title: '报销事由',
      dataIndex: 'reason',
      width: 150,
      render: (_, record) => (
        <InvoiceDetail
          id={record.invoiceSubmitId}
          templateType={record.templateType}
        >
          <Tooltip placement="topLeft" title={record.reason || ''}>
            <a className="eslips-1">{record.reason}</a>
          </Tooltip>
        </InvoiceDetail>
      )
    }, {
      title: '承担人',
      dataIndex: 'userName',
      width: 130,
    }, {
      title: '承担部门',
      dataIndex: 'deptName',
      width: 150,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '审核通过时间',
      dataIndex: 'approveTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '付款时间',
      dataIndex: 'payTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '提交人',
      dataIndex: 'createUserName',
      width: 100,
    }, {
      title: '提交人部门',
      dataIndex: 'createDeptName',
      width: 150,
    }, {
      title: '项目',
      dataIndex: 'projectName',
      width: 130,
      ellipsis: true,
      textWrap: 'word-break',
      record: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '供应商',
      dataIndex: 'supplierAccountName',
      width: 130,
      ellipsis: true,
      textWrap: 'word-break',
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 100,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 140,
      render: (_, record) => (
        <span>
          <span>{record.invoiceNo}</span>
          {
            record.isEnterpriseAlitrip &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
      )
    }, {
      title: '发放人',
      dataIndex: 'payUserName',
      width: 100,
    }, {
      title: '审批状态',
      dataIndex: 'approveStatus',
      render: (text) => (
        <span>{getArrayValue(text, approveStatus)}</span>
      ),
      width: 100,
    }, {
      title: '单据状态',
      dataIndex: 'status',
      render: (_, record) => {
        const { status } = record;
        return (
          <span>
            <Badge
              color={
                getArrayColor(`${status}`, invoiceStatus) === '-' ?
                'rgba(255, 148, 62, 1)' : getArrayColor(`${status}`, invoiceStatus)
              }
              text={record.statusStr || getArrayValue(record.status, invoiceStatus)}
            />
          </span>
        );
      },
      width: 110,
      fixed: 'right',
      filters: [
        { text: '已发放', value: '3' },
        { text: '待发放', value: '2' }
      ],
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <ChangeDate>
            <a>修改所属期</a>
          </ChangeDate>
          <Divider type="vertical" />
          <InvoiceDetail
            id={record.invoiceSubmitId}
            templateType={record.templateType}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 180,
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
      <div style={{padding: 0}}>
        <SearchBanner
          list={searchList || []}
          onChange={this.onChangeSearch}
        />
        <div className="content-dt" style={{ height: 'auto', padding: '24px' }}>
          <div className="cnt-header">
            <div className="head_lf" style={{display: 'flex'}}>
              <Dropdown
                overlay={(
                  <Menu onClick={e => this.onExport(e.key)}>
                    <Menu.Item key="1"><span className="pd-20-9 c-black-65">导出选中（{selectedRowKeys.length}）</span></Menu.Item>
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
              <Button className="m-l-8" onClick={() => this.print()}>打印</Button>
            </div>
            <div className="head_rf">
              <TableTemplate
                page={recordPage}
                onQuery={this.onRecord}
                columns={recordColumns}
                list={recordList}
                placeholder="输入详情内容搜索"
                sWidth='800px'
              >
                <div className="head_rf" style={{ cursor: 'pointer' }}>
                  <i className="iconfont iconcaozuojilu c-black-65" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  <span className="fs-14 c-black-65">操作记录</span>
                </div>
              </TableTemplate>
            </div>
          </div>
          <div className={style.message}>
            <span className="fs-14 c-black-65">
              { selectedRowKeys.length ? `已选${selectedRowKeys.length}` : `共${total}` }条记录，合计
            </span>
            <span className="fs-16 c-black-85 fw-500">
              ¥{ selectedRowKeys.length ? sumAmount/100 : sum/100}
            </span>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={list}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            rowKey="id"
            scroll={{ x: 3100 }}
            pagination={{
              ...query,
              total,
              size: 'small',
              showTotal: () => (`共${total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      </div>
    );
  }
}

export default Statistics;
