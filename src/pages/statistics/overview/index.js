/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import update from 'immutability-helper';
import TempTable from './components/TempTable';
import defaultData from './default';
import Chart from '../../../components/StaticChart/component/Chart';
import InvoicePrice from './components/Invoice';
import SearchBanner from './components/Search/Searchs';



const menus = [{
  key: '0',
  name: '支出明细',
}, {
  key: '1',
  name: '部门支出',
}, {
  key: '2',
  name: '类别支出',
}, {
  key: '3',
  name: '项目支出',
}, {
  key: '4',
  name: '员工支出',
}, {
  key: '5',
  name: '供应商支出',
}];
@connect(({ overview, loading, global }) => ({
  loading: loading.effects['overview/detail'] ||
  loading.effects['overview/dept'] ||
  loading.effects['overview/classify'] ||
  loading.effects['overview/project'] ||
  loading.effects['overview/supplier'] ||
  loading.effects['overview/people'] || false,
  list: overview.list,
  sum: overview.sum,
  query: overview.query,
  total: overview.total,
  queryPage: overview.queryPage,
  detailList: overview.detailList,
  pieChartVos: overview.pieChartVos,
  listQuery: overview.listQuery,
  listTotal: overview.listTotal,
  subSum: overview.subSum,
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: global.projectList,
  supplierList: global.supplierList,
}))
class EchartsTest extends Component {

  state={
    current: '0',
    columns: defaultData[0].columns,
    searchList: defaultData[0].searchList,
  }

  componentDidMount () {
    this.onQuery({
      pageNo: 1,
      pageSize: 10,
    }, () => {
      this.search();
    });
  }

  search = () => {
    const { dispatch } = this.props;
    const _this = this;
    const fetchs = ['projectList', 'supplierList', 'costList', 'invoiceList'];
    const arr = fetchs.map(it => {
      return dispatch({
        type: `global/${it}`,
        payload: {},
      });
    });
    const { searchList } = this.state;
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
      this.setState({
        searchList: newSearch,
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
    });
  }

  inVoiceQuery = payload => {
    const { current } = this.state;
    Object.assign(payload, {
      ...this.onGetSearch(),
    });
    if (payload.id) {
      const keys = defaultData[current].type;
      Object.assign(payload, {
        [keys]: payload.id,
        currentType: current,
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
          subSum
        });
      });
    });
  }

  pageDetail = payload => {
    const { current } = this.state;
    Object.assign(payload, {
      ...this.onGetSearch(),
    });
    if (payload.id) {
      const keys = defaultData[current].type;
      Object.assign(payload, {
        [keys]: payload.id,
        currentType: current,
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
          listQuery
        });
      });
    });
  }

  handleClick = e => {
    const { detailList, listQuery, listTotal, pieChartVos } = this.props;
    const col = defaultData[e.key];
    const { columns, type, chartName, searchList } = col;
    let cols = [...columns];
    const _this = this;
    if (e.key !== '0') {
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
              type={type}
              changeMoney={100}
            >
              <a>{`${e.key === '3' || e.key === '5' ? '查看支出类别分布' : '查看趋势图'}`}</a>
            </Chart>
          ),
          fixed: 'right'
        }], [1, 0, {
          title: '金额（元）',
          dataIndex: 'submitSumAll',
          render: (_, record) => (
            <InvoicePrice
              title={`${record[chartName]}支出统计`}
              detailList={detailList}
              onQuery={val => _this.inVoiceQuery(val)}
              query={listQuery}
              total={listTotal}
              id={record.deptId || record.userId || record.supplierId
              || record.projectId || record.categoryId || record.id}
              projectType={record.projectType}
              pageDetail={_this.pageDetail}
              chartList={pieChartVos}
            >
              {
                type === 'dept' ?
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
          width: type === 'dept' ? 160 : 100,
        }]]
      });
    }
    console.log('EchartsTest -> cols', cols);
    this.setState({
      current: e.key,
      columns: cols,
      searchList,
    }, () => {
      const values = {};
      searchList.forEach(it => {
        if (it.value) {
          Object.assign(values, {
            ...it.value,
          });
        }
      });
      this.onQuery({
        ...values,
      }, () => {
        this.search();
      });
    });
  }

  onChangeSearch = (val) => {
    this.setState({
      searchList: val
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
    const obj = {...params};
    if (Number(key) !== 1) {
      Object.assign(obj, {
        ...this.onGetSearch(),
      });
    }
    console.log('EchartsTest -> onExport -> params', params);
    this.props.dispatch({
      type: 'overview/export',
      payload: {
        ...obj
      }
    });
  }

  render() {
    const { current, columns, searchList } = this.state;
    const { tableProps } = defaultData[current];
    const { list, queryPage, total, sum, loading } = this.props;

    return (
      <div>
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
          list={list}
          loading={loading}
          columns={columns}
          currentType={Number(current)}
          onQuery={this.onQuery}
          onExports={this.onExport}
          hisRecord={{
            total,
            sum,
          }}
          tableProps={tableProps}
          pagination={Number(current) === 0 ? {
            current: queryPage.pageNo,
            total,
          } : false}
        />
      </div>
    );
  }
}

export default EchartsTest;
