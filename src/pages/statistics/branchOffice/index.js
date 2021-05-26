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
@connect(({ branchOffice, loading }) => ({
  loading: loading.effects['branchOffice/list'] || false,
  list: branchOffice.list,
  query: branchOffice.query,
  total: branchOffice.total,
  detailList: branchOffice.detailList,
  isNoRole: branchOffice.isNoRole,
}))
class BranchOffice extends Component {
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
      type: 'branchOffice/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    Object.assign(payload, {
      officeId: payload.id,
    });
    this.props.dispatch({
      type: 'branchOffice/detailList',
      payload,
    });
  }

  onExport = (payload) => {
    this.props.dispatch({
      type: 'branchOffice/export',
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
          type="branch"
          onExport={this.onExport}
          chartName="officeName"
          isNoRole={isNoRole}
          column={[{
            title: '分公司',
            dataIndex: 'officeName',
            width: 150,
            render: (_, record) => (
              <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.officeName}</span>
            )
          }]}
        />
      </>
    );
  }
}

export default BranchOffice;
