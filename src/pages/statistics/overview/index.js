import React, { Component } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
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
@connect(({ overview, loading }) => ({
  loading: loading.effects['overview/list'] || false,
  list: overview.list,
  sum: overview.sum,
  query: overview.query,
  total: overview.total,
  queryPage: overview.queryPage,
  detailList: overview.detailList,
  pieChartVos: overview.pieChartVos,
  listQuery: overview.listQuery,
  listTotal: overview.listTotal,
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
    });
  }

  onQuery = payload => {
    const { current } = this.state;
    this.props.dispatch({
      type: `overview/${defaultData[current].query}`,
      payload,
    });
  }

  inVoiceQuery = payload => {
    Object.assign(payload, {
      dateType: 0,
      endTime: 1640966399000,
      startTime: 1609430401000,
    });
    this.props.dispatch({
      type: 'overview/deptDetail',
      payload,
    });
  }

  pageDetail = payload => {
    Object.assign(payload, {
      dateType: 0,
      endTime: 1625068799000,
      startTime: 1617206401000,
    });
    this.props.dispatch({
      type: 'overview/deptDetail',
      payload,
    });
  }

  handleClick = e => {
    const { detailList, listQuery, listTotal, pieChartVos } = this.props;
    const col = JSON.parse(JSON.stringify(defaultData[e.key]));
    const { columns, type, chartName } = col;
    const _this = this;
    if (e.key !== '0') {
      columns.push({
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
      });
      columns.splice(2, 0, {
        title: '金额（元）',
        dataIndex: 'submitSumAll',
        render: (_, record) => (
          <InvoicePrice
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
      });
    }
    this.setState({
      current: e.key,
      columns,
    }, () => {
      this.onQuery({
        dateType: 0,
        endTime: 1640966399000,
        startTime: 1609430401000,
      });
    });
  }

  onChangeSearch = (val) => {
    this.setState({
      searchList: val
    });
  }

  render() {
    const { current, columns, searchList } = this.state;
    const { tableProps } = defaultData[current];
    const { list, queryPage, total, sum } = this.props;

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
          columns={columns}
          currentType={Number(current)}
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
