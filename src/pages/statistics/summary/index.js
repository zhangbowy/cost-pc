import React from 'react';
import { Menu, message, Popconfirm, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import DropBtn from '@/components/DropBtn';
import treeConvert from '@/utils/treeConvert';
import SummaryCmp from './components/SummaryCmp';
import style from './index.scss';
import TableTemplate from '../../../components/Modals/TableTemplate';
import { borrowStatus, invoiceStatus, incomeInvoiceStatus } from '../../../utils/constants';
import SearchBanner from '../overview/components/Search/Searchs';

const listSearch = [
  {
    type: 'search',
    label: '外部选择',
    placeholder: '搜索单号、事由、收款账户名称',
    key: 'content',
    id: 'content',
    out: 1
  },
  {
    type: 'deptAndUser',
    label: '提交部门/人',
    placeholder: '请选择',
    key: ['createUserVOS', 'createDeptVOS'],
    id: 'createUserVOS',
    out: 1
  },
  {
    type: 'rangeTime',
    label: '提交时间',
    placeholder: '请选择',
    key: ['startTime', 'endTime'],
    id: 'startTime',
    out: 1
  },
  {
    type: 'select',
    label: '单据状态',
    placeholder: '请选择',
    key: 'statuses',
    id: 'statuses',
    options: invoiceStatus.filter(it => it.key !== '6'),
    fileName: {
      key: 'key',
      name: 'value'
    }
  },
  {
    type: 'tree',
    label: '单据类型',
    placeholder: '请选择',
    key: 'incomeTemplateIds',
    id: 'incomeTemplateIds',
    out: 1
  },
  {
    type: 'tree',
    label: '项目',
    placeholder: '请选择',
    key: 'projectIds',
    id: 'projectIds'
  },
  {
    type: 'tree',
    label: '供应商',
    placeholder: '请选择',
    key: 'supplierIds',
    id: 'supplierIds'
  }
];

const incomeListSearch = [
  {
    type: 'search',
    label: '外部选择',
    placeholder: '搜索单号、事由、收款账户名称',
    key: 'content',
    id: 'content',
    out: 1
  },
  {
    type: 'deptAndUser',
    label: '提交部门/人',
    placeholder: '请选择',
    key: ['createUserVOS', 'createDeptVOS'],
    id: 'createUserVOS',
    out: 1,
    isOnlyOut: true
  },
  {
    type: 'deptAndUser',
    label: '收款部门/人',
    placeholder: '请选择',
    key: ['userVOS', 'deptVOS'],
    id: 'userVOS',
  },
  {
    type: 'rangeTime',
    label: '提交时间',
    placeholder: '请选择',
    key: ['startTime', 'endTime'],
    id: 'startTime',
    out: 1
  },
  {
    type: 'select',
    label: '单据状态',
    placeholder: '请选择',
    key: 'statuses',
    id: 'statuses',
    options: incomeInvoiceStatus.filter(it => it.key !== '6'),
    fileName: {
      key: 'key',
      name: 'value'
    }
  },
  {
    type: 'tree',
    label: '单据类型',
    placeholder: '请选择',
    key: 'incomeTemplateIds',
    id: 'incomeTemplateIds',
    out: 1
  },
  {
    type: 'tree',
    label: '项目',
    placeholder: '请选择',
    key: 'projectIds',
    id: 'projectIds'
  },
];

const apply = [
  {
    key: '1',
    value: '审核中'
  },
  {
    key: '2',
    value: '审批通过'
  },
  {
    key: '4',
    value: '已撤销'
  },
  {
    key: '5',
    value: '已拒绝'
  }
];
const salary = [
  {
    key: '1',
    value: '审核中'
  },
  {
    key: '3',
    value: '已发放'
  },
  {
    key: '4',
    value: '已撤销'
  },
  {
    key: '5',
    value: '已拒绝'
  }
];

@connect(({ loading, summary, session, costGlobal, global }) => ({
  loading:
    loading.effects['summary/submitList'] ||
    loading.effects['summary/loanList'] ||
    loading.effects['summary/applicationList'] ||
    loading.effects['summary/salaryList'] ||
    false,
  submitList: summary.submitList,
  applicationList: summary.applicationList,
  loanList: summary.loanList,
  salaryList: summary.salaryList,
  query: summary.query,
  total: summary.total,
  sum: summary.sum,
  historyList: summary.historyList,
  historyPage: summary.historyPage,
  userInfo: session.userInfo,
  recordList: costGlobal.recordList,
  recordPage: costGlobal.recordPage,
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: costGlobal.projectList,
  supplierList: global.supplierList,
  thirdList: summary.thirdList,
  statisticsDimension: summary.statisticsDimension,
  incomeList:summary.incomeList
}))
class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: '0',
      selectedRowKeys: [],
      selectedRows: [],
      list: [],
      searchContent: '',
      sumAmount: 0,
      searchList: listSearch
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'summary/statisticsDimension',
      payload: {}
    });
    const { query } = this.props;
    this.onQuery({ ...query }, () => {
      const his = localStorage.getItem('historyLink');
      localStorage.removeItem('historyLink');
      if (his) {
        this.handleClick({ key: '4' }, () => {
          this.search();
        });
      } else {
        this.search();
      }
    });
  }

  search = () => {
    const { dispatch } = this.props;
    const { current } = this.state;
    const _this = this;
    const fetchs = ['projectList', 'supplierList', 'costList', 'invoiceList'];
    let arr = [];
    arr = fetchs.map(it => {
      const params = {};
      if (it === 'invoiceList') {
        Object.assign(params, {
          templateType: Number(current) === 4 ? -1 : current
        });
      }
      return dispatch({
        type: it === 'projectList' ? `costGlobal/${it}` : `global/${it}`,
        payload: params
      });
    });
    const { searchList } = this.state;

    Promise.all(arr).then(() => {
      const {
        costCategoryList,
        invoiceList,
        projectList,
        supplierList
      } = _this.props;
      const treeList = [costCategoryList, projectList, invoiceList];
      console.log('search -> treeList', treeList);
      const keys = [
        'costIds',
        'projectIds',
        'incomeTemplateIds',
        'supplierIds'
      ];
      const obj = {};
      const newTree = treeList.map((it, i) => {
        return treeConvert(
          {
            rootId: 0,
            pId: 'parentId',
            name: i === 0 ? 'costName' : 'name',
            tName: 'title',
            tId: 'value'
          },
          it
        );
      });

      newTree.push(supplierList);
      newTree.forEach((it, index) => {
        Object.assign(obj, {
          [keys[index]]: it
        });
      });
      console.log('newSearch', obj);

      const newSearch = searchList.map(it => {
        if (keys.includes(it.key)) {
          return {
            ...it,
            options: obj[it.key],
            fileName: {
              key: 'id',
              name: 'name'
            }
          };
        }
        return { ...it };
      });
      console.log('newSearch', newSearch);
      this.setState({
        searchList: newSearch
      });
    });
  };

  export = key => {
    const { current, selectedRowKeys, searchList } = this.state;
    if (selectedRowKeys.length === 0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let url = 'summary/submitExport';
    if (Number(current) === 1) {
      url = 'summary/loanExport';
    } else if (Number(current) === 2) {
      url = 'summary/applicationExport';
    } else if (Number(current) === 3) {
      url = 'summary/salaryExport';
    } else if (Number(current) === 4) {
      url = 'summary/thirdExport';
    }
    let params = {};
    const { searchContent } = this.state;
    if (key === '1') {
      params = {
        ids: selectedRowKeys
      };
    } else if (key === '2') {
      searchList.forEach(it => {
        if (it.value) {
          Object.assign(params, {
            ...it.value,
            searchContent
          });
        }
      });
    } else if (key === '3') {
      params = {
        isAll: true
      };
    }
    this.props.dispatch({
      type: url,
      payload: {
        ...params
      }
    });
  };

  onSearch = e => {
    const { query } = this.props;
    this.setState(
      {
        searchContent: e
      },
      () => {
        this.onQuery({
          pageNo: 1,
          pageSize: query.pageSize
        });
      }
    );
  };

  onSelect = val => {
    this.setState({
      selectedRowKeys: val.selectedRowKeys,
      selectedRows: val.selectedRows,
      sumAmount: val.sumAmount
    });
  };

  onQuery = (payload, callback) => {
    const { current, searchList } = this.state;
    let url = 'summary/submitList';
    if (Number(current) === 1) {
      url = 'summary/loanList';
    } else if (Number(current) === 2) {
      url = 'summary/applicationList';
    } else if (Number(current) === 3) {
      url = 'summary/salaryList';
    } else if (Number(current) === 4) {
      url = 'summary/thirdList';
    } else if (Number(current) === 20) {
      url = 'summary/incomeList';
    }
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value
        });
      }
    });
    // 非收入单据时把incomeTemplateIds替换为invoiceTemplateIds
    if (payload.incomeTemplateIds) {
      Object.assign(payload, { invoiceTemplateIds: payload.incomeTemplateIds });
    }
    this.props.dispatch({
      type: url,
      payload
    })
      .then(() => {
        const {
          submitList,
          applicationList,
          loanList,
          salaryList,
          thirdList,
          incomeList
        } = this.props;
        let lists = submitList;
        if (Number(current) === 1) {
          lists = loanList;
        } else if (Number(current) === 2) {
          lists = applicationList;
        } else if (Number(current) === 3) {
          lists = salaryList;
        } else if (Number(current) === 4) {
          lists = thirdList;
        } else if (Number(current) === 20) {
          lists = incomeList;
        }
        this.search();
        this.setState({
          list: lists
        });
        console.log('lists999999', this.state.list);
        if (callback) {
          callback();
        }
      });
  };

  handleClick = (e, callback) => {
    let arr = [...listSearch];
    if (e.key === '0') {
      arr[2].options = invoiceStatus.filter(it => it.key !== '6');
    } else if (e.key === '1') {
      arr[2].options = borrowStatus;
    } else if (e.key === '2') {
      arr[2].options = apply;
    } else if (e.key === '3') {
      arr[2].options = salary;
    } else if (e.key === '4') {
      arr = arr.filter(it => it.key !== 'statuses');
    } else if (e.key === '20') {
      arr = [...incomeListSearch];
    }
    console.log(arr, '搜索的内容');
    this.setState(
      {
        current: e.key,
        selectedRowKeys: [],
        selectedRows: [],
        searchList: arr
      },
      () => {
        if (callback) {
          callback();
        }
        this.onQuery({
          pageNo: 1,
          pageSize: 10
        });
      }
    );
  };

  onChangeSearch = val => {
    console.log('onChangeSearch -> val', val);
    this.setState(
      {
        searchList: val
      },
      () => {
        this.onQuery({
          pageNo: 1,
          pageSize: 10
        });
      }
    );
  };

  onRecord = (payload, callback) => {
    const { current } = this.state;
    Object.assign(payload, {
      templateType: Number(current) === 4 ? '' : current,
      isAlitrip: Number(current) === 4
    });
    this.props
      .dispatch({
        type: 'costGlobal/recordList',
        payload
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  };

  onHistory = (payload, callback) => {
    this.props
      .dispatch({
        type: 'summary/historyList',
        payload
      })
      .then(() => {
        console.log('historyPage', this.props.historyPage);
        if (callback) {
          callback();
        }
      });
  };

  onDelete = (payload, callback) => {
    this.props
      .dispatch({
        type: 'costGlobal/delInvoice',
        payload
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  };

  onDelHistory = id => {
    const { historyPage } = this.props;
    this.props
      .dispatch({
        type: 'summary/del',
        payload: { id }
      })
      .then(() => {
        this.props.dispatch({
          type: 'summary/historyList',
          payload: {
            pageNo: historyPage.pageNo,
            pageSize: historyPage.pageSize
          }
        });
        this.onQuery({
          pageNo: 1,
          pageSize: 10
        });
      });
  };
  // 修改所属期

  editBelongDate = ({ payload, callback }) => {
    this.props
      .dispatch({
        type: 'summary/submit',
        payload
      })
      .then(() => {
        const { query } = this.props;
        this.onQuery({
          ...query
        });
        callback();
      });
  };

  render() {
    const {
      loading,
      query,
      total,
      sum,
      userInfo,
      recordList,
      recordPage,
      historyPage,
      historyList,
      statisticsDimension
    } = this.props;
    const {
      current,
      selectedRowKeys,
      list,
      searchContent,
      sumAmount,
      selectedRows,
      searchList
    } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'operationName',
        width: 80
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        width: 80,
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        )
      },
      {
        title: '操作内容',
        dataIndex: 'operationType',
        width: 80,
        render: (_, record) => (
          <span>{record.operationType === 1 ? '删除单据' : '修改所属期'}</span>
        )
      },
      {
        title: '详情',
        dataIndex: 'operationMsg',
        width: 160
      }
    ];
    const column = [
      {
        title: '导入批次',
        dataIndex: 'batchId',
        width: 90
      },
      {
        title: '操作人',
        dataIndex: 'createName',
        width: 100
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        width: 100,
        render: (_, record) => (
          <span>
            {record.createTime
              ? moment(record.createTime).format('YYYY-MM-DD')
              : '-'}
          </span>
        )
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        width: 160
      },
      {
        title: '操作',
        dataIndex: 'operationType',
        width: 80,
        render: (_, record) => (
          <Popconfirm
            title={`确认删除${record.content}吗？`}
            onConfirm={() => this.onDelHistory(record.id)}
          >
            <span className="sub-color">删除</span>
          </Popconfirm>
        )
      }
    ];
    return (
      <div style={{ minWidth: '1000px' }}>
        <div style={{ background: '#fff', paddingTop: '16px' }}>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key={0}>报销单</Menu.Item>
            <Menu.Item key={1}>借款单</Menu.Item>
            <Menu.Item key={2}>申请单</Menu.Item>
            <Menu.Item key={3}>
              <Tooltip title="薪资单为保密数据，如对权限控制范围有疑问请联系超管处理">
                <span>薪资单</span>
              </Tooltip>
            </Menu.Item>
            {
              !!(userInfo.orderItemLevel) && (
                <Menu.Item key={20}>
                  <span>收款单</span>
                </Menu.Item>
              )
            }
            <Menu.Item key={4}>三方导入</Menu.Item>
          </Menu>
        </div>
        <SearchBanner list={searchList} onChange={this.onChangeSearch} />
        <div className="content-dt" style={{ padding: 0, height: 'auto' }}>
          <div className={style.payContent}>
            {/* 增加了收款单不需要显示这个 crated by zhangbo on 2020/03/23 */}
            {/* eslint-disable-next-line eqeqeq */}
            {current != 20 && (
              <>
                <div className="cnt-header" style={{ display: 'flex' }}>
                  <div className="head_lf">
                    <DropBtn
                      selectKeys={selectedRowKeys}
                      total={total}
                      className="m-l-8"
                      onExport={key => this.export(key)}
                    >
                      导出
                    </DropBtn>
                  </div>
                  <div className="head_rg">
                    {Number(current) === 4 && (
                      <div className="m-r-24">
                        <TableTemplate
                          page={historyPage}
                          onQuery={this.onHistory}
                          columns={column}
                          list={historyList}
                          placeholder="输入详情内容搜索"
                          sWidth="800px"
                          title="导入历史"
                        >
                          <div
                            style={{
                              cursor: 'pointer',
                              verticalAlign: 'middle',
                              display: 'flex'
                            }}
                          >
                            <div className={style.activebg}>
                              <i className="iconfont iconcaozuojilu m-r-8 c-black-65" />
                            </div>
                            <span className="fs-14 c-black-65">导入历史</span>
                          </div>
                        </TableTemplate>
                      </div>
                    )}
                    <TableTemplate
                      page={recordPage}
                      onQuery={this.onRecord}
                      columns={columns}
                      list={recordList}
                      placeholder="输入详情内容搜索"
                      sWidth="800px"
                      title="操作记录"
                    >
                      <div
                        style={{
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          display: 'flex'
                        }}
                      >
                        <div className={style.activebg}>
                          <i className="iconfont iconcaozuojilu m-r-8 c-black-65" />
                        </div>
                        <span className="fs-14 c-black-65">操作记录</span>
                      </div>
                    </TableTemplate>
                  </div>
                </div>
                <div className={style.message}>
                  <span className="fs-14 c-black-65">
                    {selectedRowKeys.length
                      ? `已选${selectedRowKeys.length}`
                      : `共${total}`}
                    条记录，合计
                  </span>
                  <span className="fs-16 c-black-85 fw-500">
                    ¥{selectedRowKeys.length ? sumAmount / 100 : sum / 100}
                  </span>
                </div>
              </>
            )}
            <SummaryCmp
              list={list}
              templateType={Number(current)}
              selectedRowKeys={selectedRowKeys}
              selectedRows={selectedRows}
              sumAmount={sumAmount}
              loading={loading}
              onQuery={this.onQuery}
              editBelongDate={c => this.editBelongDate(c)}
              onSelect={this.onSelect}
              total={total}
              query={query}
              searchContent={searchContent}
              userInfo={userInfo}
              onDelInvoice={this.onDelete}
              statisticsDimension={statisticsDimension}
              current={current}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Summary;
