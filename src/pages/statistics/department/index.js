import React, { Component } from 'react';
import { Table, Button, Form, Radio, DatePicker } from 'antd';
import { connect } from 'dva';
import getDateUtil from '@/utils/tool';
import moment from 'moment';
import Invoice from './component/Invoice';


const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};
const time =  getDateUtil(new Date().getTime()).split('-');
const startDate = `${time[0]}-${time[1]}-01 00:00:01`;
const endDate = `${time[0]}-${time[1]}-${getMaxDay(time[0],time[1])} 23:59:59`;
const { MonthPicker, YearPicker, QuarterPicker } = DatePicker;
@Form.create()
@connect(({ department, loading }) => ({
  loading: loading.effects['department/list'] || false,
  list: department.list,
  detailList: department.detailList,
}))
class Department extends Component {
  constructor(props){
    super(props);
    this.state = {
      startTime: new Date(startDate).getTime(),
      endTime: new Date(endDate).getTime(),
      dateType: 0,
      defaultQuarter: this.getQuarter(new Date()),
      defaultMonth: `${time[0]}-${time[1]}`,
      defaultYear: time[0]
    };
  }

  componentDidMount(){
    this.onQuery({});
  }

  onChangeType = (e) => {
    const date = e.target.value;
    this.setState({
      dateType: e.target.value,
    });
    if(date === 'month'){
      this.monthChage(this.state.defaultMonth);
    }else if(date=== 'date'){
      this.getQuarter(this.state.defaultQuarter,true);
    }else{
      this.yearChange(this.state.defaultYear);
    }
  }

  getQuarter = (date,isValue) => {
    if(isValue){
      const start = `${date.split('~')[0]  }-01 00:00:01`;
      const end =  date.split('~')[1] + ((date.split('~')[1].split('-')[1]==='06'||date.split('~')[1].split('-')[1]==='09')?'-30 23:59:59':'-31 23:59:59');
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      this.setState({ startTime, endTime });
    } else {
      const year = date.getFullYear();
      if(date <= 3){
        return `${year}-01~${year}-03`;
      }if(date <= 6){
        return `${year}-04~${year}-06`;
      }if(date <= 9){
        return `${year}-07~${year}-09`;
      }
        return `${year}-10~${year}-12`;
    }
  }

  yearChange = (str) => {
    const start = `${str}-01-01 00:00:01`;
    const end = `${str}-12-31 23:59:59`;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    this.setState({
      startTime,
      endTime
    });
  }

  monthChage = (str) =>{
    const start = `${str}-01 00:00:01`;
    const end = `${str}-${ getMaxDay(str.split('-')[0],str.split('-')[1]) } 23:59:59`;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    this.setState({
      startTime,
      endTime
    });
  }

  quarterChage = (str) => {
    this.getQuarter(str,true);
  }

  onQuery = (payload) => {
    const { startTime, endTime, dateType } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType)
    });
    this.props.dispatch({
      type: 'department/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    const { startTime, endTime, dateType } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType)
    });
    this.props.dispatch({
      type: 'department/detailList',
      payload,
    });
  }

  render () {
    const {
      loading,
      list,
      detailList,
    } = this.props;
    const { dateType, defaultYear, defaultQuarter, defaultMonth } = this.state;
    const columns = [{
      title: '部门',
      dataIndex: 'deptName',
      width: 260,
    }, {
      title: '金额(元)',
      dataIndex: 'submitSumAll',
      render: (_, record) => (
        <span>
          {record.submitSumAll ? record.submitSumAll/100 : 0}
          { record.submitSum ?  `（本部${record.submitSum}）` : '（本部0）'}
        </span>
      ),
      className: 'moneyCol',
      width: 140,
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 100,
    }, {
      title: '单据数',
      dataIndex: 'submitUserCountAll',
      width: 100,
      render: (_, record) => (
        <Invoice
          lists={detailList}
          onQuery={this.inVoiceQuery}
          deptId={record.deptId}
        >
          <a>{record.submitUserCountAll}</a>
        </Invoice>
      )
    }, {
      title: '费用数',
      dataIndex: 'categoryCountAll',
      width: 100,
    }, {
      title: '环比增长',
      dataIndex: 'annulus',
      width: 100,
    }, {
      title: '同比增长',
      dataIndex: 'yearOnYear',
      width: 100,
    }, {
      title: '操作',
      dataIndex: 'ope',
      width: 100,
      render: () => (
        <a>查看趋势图</a>
      )
    }];
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf" style={{display: 'flex'}}>
            <Button type="default">导出</Button>
            <Form style={{display: 'flex', marginLeft: '8px'}}>
              <p style={{ lineHeight: '32px', marginBottom: 0 }}>提交时间：</p>
              <Radio.Group className="m-r-8" value={dateType} onChange={e => this.onChangeType(e)}>
                <Radio.Button value={0}>月度</Radio.Button>
                <Radio.Button value={1}>季度</Radio.Button>
                <Radio.Button value={2}>年度</Radio.Button>
              </Radio.Group>
              {
                Number(dateType)===2 &&
                  <YearPicker onChange={(str) => this.yearChange(str)} defaultValue={defaultYear} />
                ||  Number(dateType)=== 0 &&
                  <MonthPicker allowClear={false} onChange={(_,str) => this.monthChage(str)} defaultValue={moment(defaultMonth)} />
                ||  Number(dateType)=== 1 &&
                  <QuarterPicker onChange={(str) => this.quarterChage(str)} value={defaultQuarter} />
              }
            </Form>
          </div>
        </div>
        <Table
          dataSource={list}
          loading={loading}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  }
}

export default Department;
