import React from 'react';
import {Table, Button, Divider, message, Badge, Select, Popconfirm, Dropdown, Icon, Menu, Tooltip} from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';
import SelectIncome from './components/SelectIncome';
import style from './index.scss';
import constants, { getArrayColor, getArrayValue, contractInvoiceStatus as incomeInvoiceStatus, invoiceStatus } from '../../../utils/constants';
import DraftList from './components/DraftList';
import { ddOpenLink } from '../../../utils/ddApi';
import SearchBanner from '../../statistics/overview/components/Search/Searchs';
import treeConvert from '@/utils/treeConvert';

const ListSearch = [
  {
    type: 'search',
    label: '合同名称',
    placeholder: '搜索单号、事由、合同名称',
    key: 'str',
    id: 'str',
    out: 1
  },
  {
    type: 'deptAndUser',
    label: '提交部门/人',
    placeholder: '请选择',
    key: ['userIds', 'createDeptIds'],
    id: 'createUserVOS',
    out: 1,
  },
  {
    type: 'rangeTime',
    label: '提交时间',
    placeholder: '请选择',
    key: ['start', 'end'],
    id: 'startTime',
    out: 1
  },
  {
    type: 'tree',
    label: '合同类型',
    placeholder: '请选择',
    key: 'templateId',
    id: 'incomeTemplateIds',
  },
  {
    type: 'select',
    label: '合同状态',
    placeholder: '请选择',
    key: 'status',
    id: 'status',
    options: incomeInvoiceStatus,
    fileName: {
      key: 'key',
      name: 'value'
    },
    out: 1
  },
  {
    type: 'tree',
    label: '项目',
    placeholder: '请选择',
    key: 'projectIds',
    id: 'projectIds'
  },
  // {
  //   type: 'search',
  //   // label: '外部选择',
  //   placeholder: '搜索单号、事由、合同名称',
  //   key: 'str',
  //   id: 'str',
  // },
];

const { APP_API } = constants;
@connect(({ loading, contract: incomeReport, costGlobal, global }) => ({
  loading: loading.effects['incomeReport/list'] || false,
  list: incomeReport.list,
  originLoanSum: incomeReport.originLoanSum,
  waitAssessSum: incomeReport.waitAssessSum,
  loanSum: incomeReport.loanSum,
  query: incomeReport.query,
  total: incomeReport.total,
  checkTemp: costGlobal.checkTemp,
  draftTotal: costGlobal.draftTotal,
  incomeDetail: global.incomeDetail,
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: costGlobal.projectList,
  contractDetail: global.contractDetail
}))
class incomeReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reason: null,
      type: null,
      searchList: ListSearch
    };
  }

  componentDidMount() {
    this.getDraft();
    this.search();
    this.onQuery({
      pageNo: 1,
      pageSize: 10,
    });
  }

  getDraft = () => {
    this.props.dispatch({
      type: 'costGlobal/listIncomeDraft',
      payload: {
        pageNo: 1,
        pageSize: 10,
        type: 30
      }
    });
  }

  onQuery=(payload) => {
    const { reason, type, searchList } = this.state;
    if (reason){
      Object.assign(payload, {
        reason
      });
    }
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value
        });
      }
    });
    if (type !== null){
      Object.assign(payload, {
        type: type === 'all' ? '' : type
      });
    }
    if(payload.userIds) {
      Object.assign(payload, {
        createIds: payload.userIds.map(({userId}) => userId)
      });
    }
    if(payload.createDeptIds) {
      Object.assign(payload, {
        createDeptIds: payload.createDeptIds.map(({deptId}) => deptId)
      });
    }
    this.props.dispatch({
      type: 'contract/list',
      payload: {
        ...payload,
        type: 1
      },
    });
    // this.search();
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
          templateType: 30
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
      } = _this.props;
      const treeList = [costCategoryList, projectList, invoiceList];
      console.log('search -> treeList', treeList);
      const keys = [
        'costIds',
        'projectIds',
        'templateId',
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


  onChangeType = (operateType, details) => {
    this.props
      .dispatch({
        type: 'costGlobal/checkTemplate',
        payload: {
          invoiceTemplateId: details.invoiceTemplateId,
          templateType: 30,
        }
      })
      .then(() => {
        const { checkTemp } = this.props;
        if (checkTemp.isDisabled) {
          message.error('单据已停用，无法提交。');
          return;
        }
        if (!checkTemp.isCanUse) {
          message.error('不可使用该单据，请联系管理员“超管”');
          return;
        }
        this.props.dispatch({
          type: 'global/contractDetail',
          payload: {
            loanId: details.id,
          }
        }).then(() => {
          const { incomeDetail, contractDetail } = this.props;
          console.log('🚀 ~ file: index.js ~ line 95 ~ incomeReport ~ .then ~ incomeDetail', contractDetail);
          localStorage.setItem('contentJson', JSON.stringify(contractDetail));
          localStorage.removeItem('selectCost');
          this.props.history.push(
            `/income/contract/${operateType}~30~${details.invoiceTemplateId}~${details.id}`
          );
        });

      });
  };

  onComplete = (val, key) => {
    this.setState({
      [key]: val,
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: 10,
      });
    });
  }

  print = (id) => {
    ddOpenLink(`${APP_API}/cost/pdf/batch/contract?token=${localStorage.getItem('token')}&ids=${id}`);
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'contract/del',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      const { query } = this.props;
      this.onQuery({
        ...query
      });
    });
  }

  handleTableChange = (pagination) => {
    this.onQuery({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  handleClick = (type, record) => {
    switch(type) {
      case 'copy':
        this.onChangeType('copy', record);
      break;
      default:
        this.print(record.id);
      break;
    }
  }

  onChangeSearch = val => {
    console.log('onChangeSearch -> val', val);
    this.setState(
      {
        searchList: val
      },
      () => {
        this.onQuery({
          pageNo: 1,
          pageSize: 10,
        });
      }
    );
  };

  render() {
    const columns = [{
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 180,
      fixed: 'left',
      render: (_, record) => (
        <IncomeInvoiceDetail
          id={record.id}
          // refuse={this.handleRefuse}
          templateId={record.incomeTemplateId}
          templateType={30}
          // allow="modify"
          // onCallback={() => this.onOk()}
          // signCallback={this.onSign}
          title="合同详情"
        >
          <a>{record.invoiceNo}</a>
        </IncomeInvoiceDetail>

      )
    }, {
      title: '合同名称',
      width: 130,
      dataIndex: 'name'
    }, {
      title: '合同金额（元）',
      width: 130,
      dataIndex: 'originLoanSum',
      render: (_, record) => (
        <span>
          <span>{record.originLoanSum ? record.originLoanSum/100 : 0}</span>
        </span>
      ),
      className: 'moneyCol',
    }, {
      title: '已收款（元）',
      width: 130,
      dataIndex: 'waitAssessSum',
      render: (_, record) => (
        <span>
          <span>{record.waitAssessSum ? record.waitAssessSum/100 : 0}</span>
        </span>
      ),
      className: 'moneyCol',
    }, {
      title: '未收款（元）',
      width: 130,
      dataIndex: 'loanSum',
      render: (_, record) => (
        <span>
          <span>{record.loanSum ? record.loanSum/100 : 0}</span>
        </span>
      ),
      className: 'moneyCol',
    }, {
      title: '业务员',
      width: 130,
      dataIndex: 'userName'
    }, {
      title: '签订日期',
      width: 130,
      dataIndex: 'repaymentTime',
      render: (_, record) => (
        <span>{moment(record.repaymentTime).format('YYYY-MM-DD')}</span>
      )
    }, {
      title: '项目名称',
      width: 120,
      dataIndex: 'projectName'
    }, {
      fixed: 'right',
      title: '合同状态',
      width: 130,
      dataIndex: 'status',
      render: (_, record) => {
        const { status } = record;
        return (
          <span>
            <Badge
              color={
                getArrayColor(`${status}`, incomeInvoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${status}`, incomeInvoiceStatus)
              }
              text={record.msg ||
                getArrayValue(record.status, incomeInvoiceStatus)}
            />
          </span>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) =>
      {
        const btns = [{
          node: (
            <span className="pd-20-9 c-black-65">
              复制
            </span>
          ),
          key: 'copy'
        }, {
          node: (
            <span className="pd-20-9">
              打印
            </span>
          ),
          key: 'print'
        }];
        const menu = (
          <Menu>
            {
              btns.map((item) => (
                // eslint-disable-next-line react/no-array-index-key
                <Menu.Item
                  key={item.key}
                  onClick={() => this.handleClick(item.key, record)}
                >{item.node}
                </Menu.Item>
              ))
            }
          </Menu>
        );
        return (
          <span>
                <>
                  {
                    (record.status !== 3 && record.status !== 6) && (
                      <Popconfirm
                        title="是否确认删除？"
                        onConfirm={() => this.onDelete(record.id)}
                        disabled={record.status == 3 || record.status == 6}
                      >
                        <span  style={{ cursor: 'pointer', color: record.status == 3 || record.status == 6? '#7F7F7F' : '#00c795'}}>删除</span>
                      </Popconfirm>
                    )
                  }
                  {
                    (record.status == 3 || record.status == 4) && (
                      <Tooltip
                        title="该合同已收款，撤销收款后重试"
                      >
                        <span  style={{ cursor: 'pointer', color: record.status == 3 || record.status == 6? '#7F7F7F' : '#00c795'}}>删除</span>
                      </Tooltip>
                    )
                  }
                  <Divider type="vertical" />
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </>
          </span>
        );
      },
      width: 130,
      fixed: 'right',
      className: 'fixCenter'
    }];
    const { list, loading, total, query, draftTotal, originLoanSum, waitAssessSum, loanSum} = this.props;
    const { searchList } = this.state;

    return (
      <div className="contract-wrap">
        <SearchBanner list={searchList} onChange={this.onChangeSearch}></SearchBanner>
        <div className="content-dt" style={{padding: '0'}}>
          <div className="cnt-header" style={{display: 'flex',margin: '24px 24px 16px 24px'}}>
            <div className="head_lf">
              <SelectIncome>
                <Button type="primary" className="m-r-16">新建合同</Button>
              </SelectIncome>
              {/*<Search*/}
              {/*  placeholder="搜索合同编号、合同名称、事由"*/}
              {/*  style={{width: '272px'}}*/}
              {/*  onSearch={(val) => this.onComplete(val, 'reason')}*/}
              {/*/>*/}
              {/*<span style={{lineHeight: '32px'}} className="m-l-16">合同状态：</span>*/}
              {/*<Select*/}
              {/*  style={{width: '160px'}}*/}
              {/*  onChange={(val) => this.onComplete(val, 'type')}*/}
              {/*  placeholder="请选择"*/}
              {/*>*/}
              {/*  <Select.Option value={0}>审批中</Select.Option>*/}
              {/*  <Select.Option value={0}>已拒绝</Select.Option>*/}
              {/*  <Select.Option value={0}>部分已收款</Select.Option>*/}
              {/*  <Select.Option value={0}>全部已收款</Select.Option>*/}
              {/*  <Select.Option value={0}>未收款</Select.Option>*/}
              {/*  <Select.Option value="all">全部</Select.Option>*/}
              {/*</Select>*/}
            </div>
            <div className="head_lf">
              <DraftList onOk={this.getDraft}>
                <div className={style.caogaox}>
                  <i className={cs('iconfont', 'iconcaogaoxiang', style.caogao)} />
                  <span className="c-black-65 m-r-8 m-l-4">草稿箱</span>
                  <span className="c-black-85 fs-20">{draftTotal.count}</span>
                  <span className="c-black-65 m-l-4">单</span>
                </div>
              </DraftList>
            </div>
          </div>
          <div className={style.contract_stat}>
            <span>合同总金额 ¥ {originLoanSum / 100}</span>
            <span>已收金额 ¥{waitAssessSum / 100}</span>
            <span>未收金额 ¥{loanSum / 100}</span>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            onChange={this.handleTableChange}
            scroll={{ x: '1500px' }}
            pagination={{
              current: query.pageNo,
              total,
              size: 'small',
              showTotal: () => (`共${total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (cur, size) => {
                this.onQuery({
                  pageNo: cur,
                  pageSize: size,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default incomeReport;
