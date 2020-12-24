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
@connect(({ classifyS, loading }) => ({
  loading: loading.effects['classifyS/list'] || false,
  list: classifyS.list,
  detailList: classifyS.detailList,
  query: classifyS.query,
  total: classifyS.total,
}))
class Classify extends Component {
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
      type: 'classifyS/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    Object.assign(payload, {
      categoryId: payload.id,
    });
    this.props.dispatch({
      type: 'classifyS/detailList',
      payload,
    });
  }

  onExport = (payload) => {
    this.props.dispatch({
      type: 'classifyS/export',
      payload,
    });
  }

  render () {
    const {
      loading,
      list,
      detailList,
      query,
      total
    } = this.props;
    return (
      <>
        <StaticChart
          onQuery={this.onQuery}
          onExport={this.onExport}
          list={list}
          detailList={detailList}
          loading={loading}
          query={query}
          total={total}
          type="classify"
          invoiceQuery={this.inVoiceQuery}
          chartName="categoryName"
          column={[{
            title: '费用类别',
            dataIndex: 'categoryName',
            width: 260,
          }]}
        />
      </>
    );
  }
}

export default Classify;
