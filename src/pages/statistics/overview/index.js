/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Menu, Badge } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import update from 'immutability-helper';
import TempTable from './components/TempTable';
import defaultData from './default';
import Chart from '../../../components/StaticChart/component/Chart';
import InvoicePrice from './components/Invoice';
import SearchBanner from './components/Search/Searchs';
import InvoiceDetail from '../../../components/Modals/InvoiceDetail';
import { getArrayValue, invoiceStatus, getArrayColor } from '../../../utils/constants';
import { defaultMonth } from './components/Search/time';



const menu = [{
  key: '0',
  name: '支出明细',
  url: 'statistics_costDetail',
}, {
  key: '1',
  name: '部门支出',
  url: 'statistics_department',
}, {
  key: '2',
  name: '类别支出',
  url: 'statistics_classify',
}, {
  key: '3',
  name: '项目支出',
  url: 'statistics_project',
}, {
  key: '4',
  name: '员工支出',
  url: 'statistics_people',
}, {
  key: '5',
  name: '供应商支出',
  url: 'statistics_supplier',
}];
const objStatus = {
  2: {
    name: '待发放',
  },
  3: {
    name: '已发放'
  }
};
// const timeObj = {
//   0: {
//     key: 'startTime',
//     name: ''
//   },
//   1: {
//     key: 'approveStartTime',
//     name: ''
//   },
//   2: '',
// };
@connect(({ overview, loading, global, costGlobal }) => ({
  loading: loading.effects['overview/detail'] ||
  loading.effects['overview/dept'] ||
  loading.effects['overview/classify'] ||
  loading.effects['overview/project'] ||
  loading.effects['overview/supplier'] ||
  loading.effects['overview/people'] || false,
  chartLoading: loading.effects['overview/deptDetail'] || false,
  list: overview.list,
  sum: overview.sum,
  query: overview.query,
  total: overview.total,
  queryPage: overview.queryPage,
  detailList: overview.detailList,
  chartList: overview.chartList,
  pieChartVos: overview.pieChartVos,
  listQuery: overview.listQuery,
  listTotal: overview.listTotal,
  subSum: overview.subSum,
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: costGlobal.projectList,
  supplierList: global.supplierList,
  roleStatics: costGlobal.roleStatics,
}))
class EchartsTest extends Component {

  constructor(props) {
    super(props);
    this.childRef = null;
    this.state={
      current: '0',
      columns: defaultData[0].columns,
      searchList: defaultData[0].searchList,
      list: [],
      menus: menu,
      queryPage: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      expandIds: [],
      dateType: 0,
    };
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'costGlobal/roleStatics',
      payload: {
        id: '470538850289750017',
      }
    }).then(() => {
      const { roleStatics } = this.props;
      const arrs = roleStatics.map(it => it.url);
      const newArr = [];
      menu.forEach(it => {
        if (arrs.includes(it.url)){
          newArr.push(it);
        }
      });
      this.setState({
        menus: newArr,
      });
      const linkType = localStorage.getItem('linkType');
      localStorage.removeItem('linkType');
      if (linkType || linkType === 0) {
        this.onInits(linkType);
      } else {
        this.onInits('0');
      }
    });
  }

  onInits = (params) => {
    const { detailList, listQuery, listTotal,
      pieChartVos, chartLoading } = this.props;
    const col = defaultData[params];
    const { columns, query, chartName, searchList, type } = col;
    let cols = [...columns];
    const linkStatus = localStorage.getItem('linkStatus');
    localStorage.removeItem('linkStatus');
    // const times = localStorage.getItem('submitTime') &&
    // localStorage.getItem('submitTime') !== 'undefined' ?
    // JSON.parse(localStorage.getItem('submitTime')) : null;

    let arr = [...searchList];
    if (linkStatus !== 'undefined' && linkStatus) {
      arr = searchList.map(it => {
        if (it.key === 'statusList') {
          return {
            ...it,
            value: {
              statusList: [linkStatus],
            },
            valueStr: objStatus[linkStatus] && objStatus[linkStatus].name,
          };
        }
        return { ...it };
      });
    }
    const _this = this;
    if (Number(params) !== 0) {
      // const lists = e.key === '3' || e.key === '5' ? chartList : pieChartVos;
      cols = update(cols, {
        $splice: [[1, 0, {
          title: '金额（元）',
          dataIndex: 'submitSumAll',
          render: (_, record) => (
            <InvoicePrice
              title={`${record[chartName]}支出统计`}
              detailList={detailList}
              onQuery={val => _this.inVoiceQuery(val)}
              query={listQuery}
              total={listTotal}
              id={record[type] || record.userId || '-1'}
              projectType={record.projectType}
              pageDetail={_this.pageDetail}
              chartList={pieChartVos}
              onChart={val => this.onChart(val, Number(type))}
              currentType={Number(params)}
              loading={chartLoading}
            >
              {
                query === 'dept' ?
                  <a>
                    {record.submitSumAll ? (record.submitSumAll/100).toFixed(2) : 0}
                    { record.submitSum && record.id !== -1 && record.children &&
                     record.children.length ?  `（本部${(record.submitSum/100).toFixed(2)}）` : ''}
                  </a>
                  :
                  <a>
                    ¥{(record.submitSumAll/100).toFixed(2)}
                  </a>
              }
            </InvoicePrice>
          ),
          className: 'moneyCol',
          width: query === 'dept' ? 160 : 100,
        }]]
      });
      if (Number(params) === 1 || Number(params) === 2) {
        cols = update(cols, {
          $splice: [[cols.length , 0,{
            title: '操作',
            dataIndex: 'ope',
            width: 150,
            render: (_, record) => (
              <Chart
                data={record}
                onChart={this.onChart}
                chartName={chartName}
                type={query}
                changeMoney={100}
                getTime={this.onGetTime}
              >
                <a>查看趋势图</a>
              </Chart>
            ),
            fixed: 'right'
          }]]});
      }
    } else {
      cols = update(cols, {
        $splice: [[cols.length, 0 ,{
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
        }], [cols.length+1, 0, {
          title: '操作',
          dataIndex: 'ope',
          render: (_, record) => (
            <span>
              <InvoiceDetail
                id={record.invoiceSubmitId}
                templateType={record.templateType}
              >
                <a>查看</a>
              </InvoiceDetail>
            </span>
          ),
          width: 80,
          fixed: 'right',
          className: 'fixCenter'
        }]]
      });
    }
      this.setState({
        columns: cols,
        current: params,
      }, () => {
      this.search(arr, () => {
        const values = {};
        if (Number(params) === 0 || Number(params) === 4) {
          Object.assign(values, {
            pageNo: 1,
            pageSize: 10,
          });
        }
        arr.forEach(it => {
          if (it.value) {
            Object.assign(values, {
              ...it.value,
            });
          }
        });
        this.onQuery({
          ...values,
        });
      });
    });

  }

  search = (searchList, callback) => {
    const { dispatch } = this.props;
    const _this = this;
    const fetchs = ['projectList', 'supplierList', 'costList', 'invoiceList'];
    const arr = fetchs.map(it => {
      return dispatch({
        type: it === 'projectList' ? `costGlobal/${it}` :`global/${it}`,
        payload: {},
      });
    });
    Promise.all(arr).then(() => {
      const { costCategoryList, invoiceList, projectList, supplierList } = _this.props;
      const treeList = [costCategoryList, projectList, invoiceList];
      const keys = ['categoryIds', 'projectIds', 'invoiceTemplateIds', 'supplierIds'];
      const obj = {};
      const newTree = treeList.map((it, i) => {
        return treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: i === 0 ? 'costName' : 'name',
          tName: 'title',
          tId: 'value'
        }, it);
      });
      newTree.push(supplierList);
      newTree.forEach((it, index) => {
        Object.assign(obj, {
          [keys[index]]: it,
        });
      });
      const newSearch = [];
      searchList.forEach(it => {
        if (keys.includes(it.key)) {
          newSearch.push({
            ...it,
            options: obj[it.key],
            fileName: {
              key: 'id',
              name: 'name'
            }
          });
        } else {
          newSearch.push({ ...it });
        }
      });
      this.setState({
        searchList: newSearch,
      }, () => {
        if (callback) {
          callback();
        }
      });
    });
  }

  onQuery = (payload, callback) => {
    const { current, searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value,
        });
      }
    });
    this.props.dispatch({
      type: `overview/${defaultData[current].query}`,
      payload,
    }).then(() => {
      if (callback) {
        callback();
      }
      const { list, queryPage, total } = this.props;
      console.log('EchartsTest -> onQuery -> total', total);
      this.setState({
        list,
        queryPage,
        total,
        expandIds: list.map(it => it.id),
      });
    });
  }

  inVoiceQuery = payload => {
    const { current } = this.state;
    Object.assign(payload, {
      ...this.onGetSearch(),
      currentType: current,
    });
    if (payload.id) {
      const keys = defaultData[current].type;
      Object.assign(payload, {
        [keys]: payload.id,
      });
      delete payload.id;
    }
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'overview/deptDetail',
        payload,
      }).then(() => {
        const { detailList, pieChartVos, listQuery, listTotal, subSum } = this.props;
        resolve({
          detailList,
          pieChartVos,
          listQuery,
          listTotal,
          subSum,
          tableLoading: false,
          chartLoading: false,
        });
      });
    });
  }

  pageDetail = payload => {
    const { current } = this.state;
    Object.assign(payload, {
      ...this.onGetSearch(),
      currentType: current,
    });
    if (payload.id) {
      const keys = defaultData[current].type;
      Object.assign(payload, {
        [keys]: payload.id,
      });
      delete payload.id;
    }
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'overview/deptDetail',
        payload,
      }).then(() => {
        const { detailList, listQuery } = this.props;
        resolve({
          detailList,
          listQuery,
          tableLoading: false,
        });
      });
    });
  }

  onChart = (payload, key) => {
    Object.assign(payload, {
      ...this.onGetSearch(),
    });
    if (Number(key) === 5) {
      Object.assign(payload, {
        chartTypes: 'supplier'
      });
    }
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'overview/chart',
        payload,
      }).then(() => {
        const { chartList } = this.props;
        resolve(chartList);
      });
    })
    ;
  }

  handleClick = e => {
    const { loading } = this.props;
    if (loading) {
      return;
    }
    if (this.childRef && this.childRef.onInit) {
      this.childRef.onInit();
    }
    this.setState({
      list: [],
    });
    this.onInits(e.key);
  }

  onProject = payload => {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'costGlobal/projectList',
        payload,
      }).then(() => {
        const { projectList } = this.props;
        const lists = treeConvert({
          rootId: 0,
          pId: 'parentId',
          name: 'name',
          tName: 'title',
          tId: 'value'
        }, projectList);
        resolve({ lists, projectList });
      });
    });
  }

  onGetTime = () => {
    const { searchList } = this.state;
    const timeC = searchList.filter(it => it.id === 'timeC');
    if (timeC && timeC.length > 0) {
      const values = timeC[0].value;
      return {
        dateType: values.dateType,
        startTime: values.startTime || defaultMonth().startTime
      };
    }
  }

  onChangeSearch = async(val) => {
    let arr = [...val];
    const { searchList } = this.state;
    const index = val.findIndex(it => it.linkKey === 'projectIds');
    const arrTime = val.findIndex(it => it.key === 'timeC');
    if (index > -1) {
      const keys = searchList[index].key;
      const oldValue = searchList[index].value || {};
      const newValue = val[index].value || {};
      if (newValue[keys] !== oldValue[keys]) {
        const pIndex = val.findIndex(it => it.key === 'projectIds');
        const { lists, projectList } = await this.onProject({ ...newValue });
        const values = projectList.filter(it => it.type === 1);
        arr = update(arr, {
          $splice: [[pIndex, 1, {
            ...val[pIndex],
            options: lists || [],
            value: newValue[keys] !== 0 ? { [val[pIndex].key]: values.map(it => it.id) } : null,
            valueStr: null,
          }]]
        });
      }
    }
    if (arrTime && arrTime.length) {
      const { dateType } = arrTime[0].value;
      if (dateType === -1) {
        this.setState({
          dateType: -1,
        });
      }
    }
    this.setState({
      searchList: arr
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: 10,
      });
    });
  }

  onGetSearch = () => {
    const obj = {};
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(obj, {
          ...it.value,
        });
      }
    });
    return obj;
  }

  onExport = (params, key) => {
    const { current } = this.state;
    let obj = {currentType: current};
    if (Number(key) === 2) {
      obj = {
        ...this.onGetSearch(),
        currentType: current
      };
    } else if (Number(key) === 1) {
      obj = {
        ...params,
        currentType: current
      };
    } else if (Number(key) === 3) {
      obj = {
        isAll: true,
        currentType: current
      };
    }
    this.props.dispatch({
      type: 'overview/export',
      payload: {
        ...obj
      }
    });
  }

  onChangeData = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { current, columns, searchList, list, menus,
      queryPage, total, expandIds, dateType } = this.state;
    const { tableProps } = defaultData[current];
    const { sum, loading } = this.props;

    return (
      <div style={{ minWidth: '1000px' }}>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>支出分析表</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            {
              menus.map(it => (
                <Menu.Item key={it.key}>{it.name}</Menu.Item>
              ))
            }
          </Menu>
        </div>
        <SearchBanner
          list={searchList || []}
          onChange={this.onChangeSearch}
        />
        <TempTable
          ref={ref => { this.childRef = ref; }}
          list={list}
          loading={loading}
          columns={columns}
          currentType={Number(current)}
          onQuery={this.onQuery}
          onExports={this.onExport}
          dateType={dateType}
          expandIds={expandIds}
          hisRecord={{
            total,
            sum,
          }}
          onChangeDatas={this.onChangeData}
          tableProps={tableProps}
          pagination={Number(current) === 0 || Number(current) === 4 ? {
            current: queryPage.pageNo,
            total,
          } : false}
        />
      </div>
    );
  }
}

export default EchartsTest;
