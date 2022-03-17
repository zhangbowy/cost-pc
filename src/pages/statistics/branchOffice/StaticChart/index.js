import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Form, Radio, DatePicker, Icon, Tooltip, Dropdown, Menu, Switch } from 'antd';
import moment from 'moment';
import getDateUtil from '@/utils/tool';
import YearPicker from '@/components/YearPicker';
import QuarterPicker from '@/components/QuarterPicker';
import Invoice from './component/Invoice';
import Chart from './component/Chart';
import LevelSearch from './component/LevelSearch';
import style from './index.scss';
import NoRole from './component/NoRole';
import noData from '@/assets/img/noData.png';



const getMaxDay = (year,month) => {
  const temp = new Date(year,month,'0');
  return temp.getDate();
};
const time =  getDateUtil(new Date().getTime()).split('-');
const startDate = `${time[0]}-${time[1]}-01 00:00:01`;
const endDate = `${time[0]}-${time[1]}-${getMaxDay(time[0],time[1])} 23:59:59`;
const { MonthPicker } = DatePicker;
@Form.create()
class StaticChart extends Component {
  static propTypes = {
    list: PropTypes.array,
  }

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
      changeMoney: 100,
    };
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
      const month = date.getMonth()+1;
      if(month <= 3){
        return `${year}-01~${year}-03`;
      }if(month <= 6){
        return `${year}-04~${year}-06`;
      }if(month <= 9){
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
    const { startTime, endTime, dateType, levelSearch } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
    });
    this.props.onQuery(payload);
  }

  inVoiceQuery = (payload) => {
    const { startTime, endTime, dateType, levelSearch } = this.state;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch
    });
    this.props.invoiceQuery(payload);
  }

  customExpandIcon = (props) => {
    if(props.record.children.length > 0){
      if (props.expanded) {
          return (
            <a
              style={{ marginRight:8 }}
              className="c-black-65"
              onClick={e => {
                        props.onExpand(props.record, e);
                      }}
            >
              <i className="table-minus" />
            </a>
        );

      }
          return (
            <a
              style={{ marginRight:8 }}
              onClick={e => {
                props.onExpand(props.record, e);
              }}
              className="c-black-65"
            >
              <i className="table-plus" />
            </a>
          );
    }
      return <span />;
  }

  onChart = (payload) => {
    const { startTime, endTime, dateType, levelSearch } = this.state;
    const { onChart } = this.props;
    Object.assign(payload, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
    });
    if (onChart) {
      console.log('StaticChart -> onChart -> onChart', onChart);
      onChart(payload);
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

  // treeNodeRender = (treeNode) => {
  //   if(!treeNode || !treeNode.length){
  //     return;
  //   }
  //     return treeNode.map((v) => {
  //       return (
  //         <TreeNode
  //           value={v.value}
  //           title={(
  //             <span className="c-black-85" style={{color: 'rgba(0,0,0,0.85)!important'}}>{v.title}</span>
  //           )}
  //           key={v.value}
  //           searchs={v.title}
  //           disabled
  //         >
  //           {v.children && this.treeNodeChildRender(v.children, v.title)}
  //         </TreeNode>
  //       );
  //     });
  //   }

  //   treeNodeChildRender = (list, titles) => {
  //     return list.map(it => (
  //       <TreeNode
  //         key={it.value}
  //         value={it.value}
  //         name={it.title}
  //         searchs={titles}
  //         title={(
  //           <div>
  //             <div className={style.treeOption}>
  //               {
  //                 it.type === 0 &&
  //                 <i className="iconfont iconyinhangka" />
  //               }
  //               {
  //                 it.type === 1 &&
  //                 <i className="iconfont iconzhifubao" />
  //               }
  //               {
  //                 it.type === 2 &&
  //                 <i className="iconfont iconxianjin" />
  //               }
  //               {it.title}
  //             </div>
  //             <p className="c-black-36 m-l-20 fs-12" style={{marginBottom: 0}}>
  //               {it.type === 0 && '银行卡'}
  //               {it.type === 1 && '支付宝'}
  //               {it.type === 2 && '现金'}
  //               {it.account}
  //             </p>
  //           </div>
  //         )}
  //       />
  //     ));
  //   }

  export = (e) => {
    const obj = {};
    const { startTime, endTime, dateType, levelSearch } = this.state;
    const { onExport } = this.props;
    Object.assign(obj, {
      startTime,
      endTime,
      dateType: Number(dateType),
      ...levelSearch,
      isAll: false
    });
    if (e.key === '3') {
      Object.assign(obj, {
        isAll: true
      });
    }
    if (onExport) {
      onExport(obj);
    }
  }

  render() {
    const {
      loading,
      list,
      detailList,
      column,
      query,
      total,
      type,
      chartList,
      chartName,
      isNoRole
    } = this.props;
    console.log('StaticChart -> render -> isNoRole', isNoRole);

    const { dateType, defaultYear, defaultQuarter, defaultMonth, levelSearch, startTime, changeMoney } = this.state;
    const columns = [{
      title: `金额（${changeMoney > 102 ? '万元' : '元'}）`,
      dataIndex: 'submitSumAll',
      render: (_, record) => (
        <Invoice
          lists={detailList}
          onQuery={this.inVoiceQuery}
          id={record.deptId || record.userId || record.supplierId
          || record.projectId || record.categoryId || record.id}
          query={query}
          total={total}
          projectType={record.projectType}
        >
          {
            type === 'dept' ?
              <a>
                {record.submitSumAll ? (record.submitSumAll/changeMoney).toFixed(2) : 0}
              </a>
              :
              <a>
                ¥{(record.submitSumAll/changeMoney).toFixed(2)}
              </a>
          }
        </Invoice>
      ),
      className: 'moneyCol',
      width: type === 'dept' ? 160 : 100,
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }, {
      title: '操作',
      dataIndex: 'ope',
      width: 150,
      render: (_, record) => (
        <Chart
          data={record}
          onChart={this.onChart}
          type={type}
          chartList={chartList}
          dateType={dateType}
          startTime={startTime}
          chartName={chartName}
          changeMoney={changeMoney}
        >
          <a>{`${type === 'project' || type === 'supplier' ? '查看支出类别分布' : '查看趋势图'}`}</a>
        </Chart>
      ),
      fixed: 'right'
    }];
    if (type !== 'project' && type !== 'supplier') {
      columns.splice(3, 0, {
        title: (
          <span>
            <span className="m-r-8">环比增长</span>
            <Tooltip title="环比上月/上季度/上年度的增长率">
              <i className="iconfont iconIcon-yuangongshouce fs-16" />
            </Tooltip>
          </span>
        ),
        dataIndex: 'annulus',
        render: (_, record) => (
          <span>
            { record.annulusSymbolType === null && '-' }
            { record.annulusSymbolType !== null &&
            (
              <span className="icons">
                <i className={`iconfont ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
                {record.annulus}{record.annulusSymbolType === null ? '' : '%'}
              </span>
            )}
          </span>
        ),
        width: 80,
      }, {
        title: (
          <span className="icons">
            <span className="m-r-8">同比增长</span>
            <Tooltip title="同比去年同月/同季度/上年度的增长率">
              <i className="iconfont iconIcon-yuangongshouce fs-16" />
            </Tooltip>
          </span>
        ),
        dataIndex: 'yearOnYear',
        width: 80,
        render: (_, record) => (
          <span>
            { record.yearOnYearSymbolType === null && '-' }
            { record.yearOnYearSymbolType !== null &&
            (
              <span className="icons">
                <i className={`iconfont ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
                {record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}
              </span>
            )}
          </span>
        ),
      });
    }
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf" style={{display: 'flex'}}>
            <Dropdown
              overlay={(
                <Menu onClick={e => this.export(e)}>
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
            <LevelSearch onOk={this.onOk} details={levelSearch} type={type}>
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
          columns={[...column, ...columns]}
          pagination={false}
          rowKey="id"
          expandIcon={(props) => this.customExpandIcon(props)}
          scroll={{ x: '1200px' }}
          locale={{
            emptyText: isNoRole ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={noData} alt="暂无数据" style={{ width: '200px' }} />
                <span>
                  暂无查看权限，
                  <NoRole>
                    <a>点击查看原因 &gt;</a>
                  </NoRole>
                </span>
              </div>
              ) : '暂无数据'
          }}
        />
      </div>
    );
  }
}

export default StaticChart;
