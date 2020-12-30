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
@connect(({ department, loading }) => ({
  loading: loading.effects['department/list'] || false,
  list: department.list,
  query: department.query,
  total: department.total,
  detailList: department.detailList,
  isNoRole: department.isNoRole,
}))
class Department extends Component {
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
      type: 'department/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    Object.assign(payload, {
      deptId: payload.id,
    });
    this.props.dispatch({
      type: 'department/detailList',
      payload,
    });
  }

  onExport = (payload) => {
    this.props.dispatch({
      type: 'department/export',
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
      isNoRole,
    } = this.props;
    console.log('Department -> render -> total', total);

    return (
      <>
        <StaticChart
          onQuery={this.onQuery}
          list={list}
          detailList={detailList}
          loading={loading}
          invoiceQuery={this.inVoiceQuery}
          query={query}
          total={total}
          type="dept"
          onExport={this.onExport}
          chartName="deptName"
          isNoRole={isNoRole}
          column={[{
            title: '部门',
            dataIndex: 'deptName',
            width: 150,
            render: (_, record) => (
              <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
            )
          }]}
        />
      </>
    );
  }
}

export default Department;
