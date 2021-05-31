import React, { Component } from 'react';
import { connect } from 'dva';
import getDateUtil from '@/utils/tool';
import StaticChart from '../../../components/StaticChart';


const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};
const time =  getDateUtil(new Date().getTime()).split('-');
const startDate = `${time[0]}-${time[1]}-01 00:00:01`;
const endDate = `${time[0]}-${time[1]}-${getMaxDay(time[0],time[1])} 23:59:59`;
@connect(({ supplierS, loading }) => ({
  loading: loading.effects['supplierS/list'] || false,
  list: supplierS.list,
  query: supplierS.query,
  total: supplierS.total,
  chartList: supplierS.chartList,
  detailList: supplierS.detailList,
}))
class Supplier extends Component {
  constructor(props){
    super(props);
    this.state = {
      // startTime: new Date(startDate).getTime(),
      // endTime: new Date(endDate).getTime(),
      // dateType: 0,
      // defaultQuarter: this.getQuarter(new Date()),
      // defaultMonth: `${time[0]}-${time[1]}`,
      // defaultYear: time[0]
    };
  }

  componentDidMount(){
    this.onQuery({
      startTime: new Date(startDate).getTime(),
      endTime: new Date(endDate).getTime(),
      dateType: 0,
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'supplierS/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    Object.assign(payload, {
      supplierId: payload.id === -1 ? '' : payload.id,
    });
    this.props.dispatch({
      type: 'supplierS/detailList',
      payload,
    });
  }

  chartQuery = (payload) => {
    this.props.dispatch({
      type: 'supplierS/chart',
      payload,
    });
  }

  onExport = (payload) => {
    this.props.dispatch({
      type: 'supplierS/export',
      payload,
    });
  }

  render () {
    const {
      loading,
      list,
      detailList,
      query,
      total,
      chartList
    } = this.props;
    return (
      <>
        <StaticChart
          onQuery={this.onQuery}
          onExport={this.onExport}
          onChart={this.chartQuery}
          list={list}
          detailList={detailList}
          loading={loading}
          query={query}
          total={total}
          invoiceQuery={this.inVoiceQuery}
          chartList={chartList}
          type="supplier"
          column={[{
            title: '供应商',
            dataIndex: 'supplierName',
            width: 80,
            render: (_, record) => (
              <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.supplierName}</span>
            )
          }]}
        />
      </>
    );
  }
}

export default Supplier;
