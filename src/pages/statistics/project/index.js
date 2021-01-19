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
@connect(({ projectS, loading }) => ({
  loading: loading.effects['projectS/list'] || false,
  list: projectS.list,
  query: projectS.query,
  total: projectS.total,
  detailList: projectS.detailList,
  chartList: projectS.chartList,
}))
class Project extends Component {
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
      type: 'projectS/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    Object.assign(payload, {
      projectId: payload.id,
    });
    this.props.dispatch({
      type: 'projectS/detailList',
      payload,
    });
  }

  chartQuery = (payload) => {
    this.props.dispatch({
      type: 'projectS/chart',
      payload,
    });
  }

  onExport = (payload) => {
    this.props.dispatch({
      type: 'projectS/export',
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
          list={list}
          detailList={detailList}
          loading={loading}
          invoiceQuery={this.inVoiceQuery}
          query={query}
          total={total}
          onChart={this.chartQuery}
          chartList={chartList}
          type="project"
          column={[{
            title: '项目',
            dataIndex: 'projectName',
            width: 100,
            render: (_, record) => (
              <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.projectName}</span>
            )
          }]}
        />
      </>
    );
  }
}

export default Project;