import React, { Component } from 'react';
import { connect } from 'dva';
import getDateUtil from '@/utils/tool';
import { Table, Button, Form, Radio, DatePicker, Icon, Dropdown, Menu, Switch } from 'antd';
import moment from 'moment';
import YearPicker from '@/components/YearPicker';
import QuarterPicker from '@/components/QuarterPicker';
import Invoice from '../../../components/StaticChart/component/Invoice';
import LevelSearch from './components/LevelSearch';
import style from './index.scss';


const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};
const time =  getDateUtil(new Date().getTime()).split('-');
const startDate = `${time[0]}-${time[1]}-01 00:00:01`;
const endDate = `${time[0]}-${time[1]}-${getMaxDay(time[0],time[1])} 23:59:59`;
const { MonthPicker } = DatePicker;
@connect(({ peopleS, loading }) => ({
  loading: loading.effects['peopleS/list'] || false,
  list: peopleS.list,
  query: peopleS.query,
  total: peopleS.total,
  querys: peopleS.querys,
  totals: peopleS.totals,
  detailList: peopleS.detailList,
}))
class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(startDate).getTime(),
      endTime: new Date(endDate).getTime(),
      dateType: 0,
      defaultQuarter: this.getQuarter(new Date()),
      defaultMonth: `${time[0]}-${time[1]}`,
      defaultYear: time[0],
      levelSearch: {},
      sortType: 2,
      changeMoney: 100,
    };
  }

  componentDidMount(){
    this.onQuery({});
  }

  onChangeType = (e) => {
    const date = Number(e.target.value);
    console.log('StaticChart -> onChangeType -> date', date);
    this.setState({
      dateType: e.target.value,
    });
    if(date === 0){
      this.monthChage(this.state.defaultMonth);
    } else if (date=== 1){
      this.getQuarter(this.state.defaultQuarter,true);
    } else {
      this.yearChange(this.state.defaultYear);
    }
  }

  getQuarter = (date,isValue) => {
    if(isValue){
      const start = `${date.split('~')[0]  }-01 00:00:01`;
      const end =  date.split('~')[1] + ((date.split('~')[1].split('-')[1]==='06'||date.split('~')[1].split('-')[1]==='09')?'-30 23:59:59':'-31 23:59:59');
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      this.setState({
        startTime,
        endTime
      }, () => {
        this.onQuery({});
      });
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
    }, () => {
      this.onQuery({});
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
    }, () => {
      this.onQuery({});
    });
  }

  quarterChage = (str) => {
    this.getQuarter(str,true);
  }

  onOk = (levelSearch) => {
    this.setState({
      levelSearch,
    }, () => {
      this.onQuery({});
    });
  }

  onQuery = (payload) => {
    const { startTime, endTime, dateType, levelSearch, sortType } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
      sortType
    });
    this.props.dispatch({
      type: 'peopleS/list',
      payload,
    });
  }

  inVoiceQuery = (payload) => {
    const { startTime, endTime, dateType, levelSearch } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
      searchUserId: payload.id === -1 ? '' : payload.id
    });
    if (payload.id) {
      // eslint-disable-next-line no-param-reassign
      delete payload.id;
    }
    this.props.dispatch({
      type: 'peopleS/detailList',
      payload,
    });
  }

  onExport = (e) => {
    const payload = {};
    const { startTime, endTime, dateType, levelSearch, sortType } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
      sortType
    });
    if (e.key === '3') {
      Object.assign(payload, {
        isAll: true,
      });
    }
    this.props.dispatch({
      type: 'peopleS/export',
      payload,
    });
  }

  handleChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    const { sortType } = this.state;
    let order = '';
    if (sorter.order === 'ascend') {
      order = 1;
    } else if (sorter.order === 'descend') {
      order = 2;
    }
    if (order !== sortType) {
      this.setState({
        sortType: order,
      }, () => {
        this.onQuery({
          pageNo: 1,
          pageSize: pagination.pageSize,
        });
      });
    } else {
      this.onQuery({
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
  }

  onCheck = (checked) => {
    let money = 100;
    if(checked) {
      money = 1000000;
    }
    this.setState({
      changeMoney: money,
    });
  }

  render () {
    const {
      loading,
      list,
      detailList,
      query,
      total,
      querys,
      totals,
    } = this.props;
    const { dateType, defaultYear, defaultQuarter, defaultMonth, levelSearch, changeMoney } = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'userName',
      width: 60,
    }, {
      title: '金额(元)',
      dataIndex: 'submitSumAll',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (_, record) => (
        <Invoice
          lists={detailList}
          onQuery={this.inVoiceQuery}
          deptId={record.deptId}
          query={query}
          total={total}
          id={record.userId}
        >
          <a>
            {record.submitSum ? (record.submitSum/changeMoney).toFixed(2) : 0}
          </a>
        </Invoice>
      ),
      className: 'moneyCol',
      width: 80,
    }, {
      title: '环比增长',
      dataIndex: 'annulus',
      width: 100,
      render: (_, record) => (
        <span className="icons">
          { record.annulusSymbolType === null && '-' }
          { record.annulusSymbolType !== null &&
          (
            <span>
              <i className={`iconfont ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.annulus}
            </span>
          )}
        </span>
      ),
    }, {
      title: '同比增长',
      dataIndex: 'yearOnYear',
      width: 100,
      render: (_, record) => (
        <span>
          { record.yearOnYearSymbolType === null && '-' }
          { record.yearOnYearSymbolType !== null &&
          (
            <span className="icons">
              <i className={`iconfont ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.yearOnYear}
            </span>
          )}
        </span>
      ),
    }, {
      title: '费用数',
      dataIndex: 'categoryCountAll',
      width: 100,
    }];
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf" style={{display: 'flex'}}>
            <Dropdown
              overlay={(
                <Menu onClick={e => this.onExport(e)}>
                  <Menu.Item key="2"><span className="pd-20-9 c-black-65">导出高级搜索结果</span></Menu.Item>
                  <Menu.Item key="3"><span className="pd-20-9 c-black-65">导出全部</span></Menu.Item>
                </Menu>
              )}
              overlayClassName={style.menuBtn}
            >
              <Button>
                导出 <Icon type="down" />
              </Button>
            </Dropdown>
            <Form style={{display: 'flex', marginLeft: '8px'}}>
              <p style={{ lineHeight: '32px', marginBottom: 0 }}>提交时间：</p>
              <Radio.Group className="m-r-8" value={dateType} onChange={e => this.onChangeType(e)}>
                <Radio.Button value={0}>月度</Radio.Button>
                <Radio.Button value={1}>季度</Radio.Button>
                <Radio.Button value={2}>年度</Radio.Button>
              </Radio.Group>
              {
                dateType === 2 &&
                  <YearPicker onChange={(str) => this.yearChange(str)} defaultValue={defaultYear} />
                ||  dateType === 0 &&
                  <MonthPicker allowClear={false} onChange={(_,str) => this.monthChage(str)} defaultValue={moment(defaultMonth)} />
                ||  dateType === 1 &&
                  <QuarterPicker onChange={(str) => this.quarterChage(str)} value={defaultQuarter} />
              }
            </Form>
          </div>
          <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle', display: 'flex'}}>
            <Switch className="m-r-32" checkedChildren="万元" unCheckedChildren="元" onChange={(check) => this.onCheck(check)} />
            <LevelSearch onOk={this.onOk} details={levelSearch}>
              <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle', display: 'flex'}}>
                <div>
                  <Icon className="sub-color m-r-8" type="filter" />
                </div>
                <span className="fs-14 sub-color">高级搜索</span>
              </div>
            </LevelSearch>
          </div>
        </div>
        <Table
          dataSource={list}
          loading={loading}
          columns={columns}
          rowKey="userId"
          pagination={{
            current: querys.pageNo,
            total:totals,
            size: 'small',
            showTotal: () => (`共${totals}条数据`),
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          onChange={this.handleChange}
          // expandIcon={(props) => this.customExpandIcon(props)}
        />
      </div>
    );
  }
}

export default People;
