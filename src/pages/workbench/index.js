/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Popconfirm, Divider, Icon, Tooltip, Form, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import { getArrayValue, invoiceStatus } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import HeadRight from '@/pages/workbench/components/HeadRight';
import style from './index.scss';
import Header from './components/Header';
import HeadLeft from './components/HeadLeft';
import StepShow from '../../components/StepShow';
import wave from '../../utils/wave';
import LeftPie from './components/Boss/LeftPie';
import RightChart from './components/Boss/RightChart';
import Boss from './components/Boss';
import { dateToTime } from '../../utils/util';
import TimeComp from './components/TimeComp';
import aliLogo from '@/assets/img/aliTrip/alitrip.png';

@Form.create()
@connect(({ loading, workbench, session, global, costGlobal }) => ({
  loading: loading.effects['workbench/list'] || false,
  list: workbench.list,
  query: workbench.query,
  OftenTemplate: workbench.OftenTemplate,
  UseTemplate: workbench.UseTemplate,
  total: workbench.total,
  userInfo: session.userInfo,
  loanSum: workbench.loanSum,
  personal: workbench.personal,
  invoiceList: global.invoiceList,
  submitReport: workbench.submitReport,
  submitReportDetail: workbench.submitReportDetail,
  reportPage: workbench.reportPage,
  fyCategory: workbench.fyCategory,
  cbCategory: workbench.cbCategory,
  totalSum: workbench.totalSum,
  pieList: workbench.pieList,
  deptTree: workbench.deptTree,
  reportTotal: workbench.reportTotal,
  loanSumVo: workbench.loanSumVo,
  roleStatics: costGlobal.roleStatics,
  chartLoading: loading.effects['workbench/submitReport'] || false,
}))
class Workbench extends PureComponent {

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.location.state && nextProps.location.state.id) {
      return {
        isBoss: nextProps.location.state.id === 1
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      personal: {},
      isComplete: false,
      invoiceTemplateIds: 'all',
      isBoss: !!(localStorage.getItem('workbenchIsBoss') === 'true'),
      bossVisible: !!(localStorage.getItem('isSetWorkbench') === 'true'),
      submitTime: {
        ...dateToTime('0_m'),
        type: '0_m'
      },
      submitReport: {},
      flagMenu: false,
    };
  }

  async componentDidMount() {
    if (document.querySelector('#svg-area')) {
      wave.init();
    }
    const { dispatch } = this.props;
    const fetchList = [{
      url: 'workbench/personal',
      params: {}
    }, {
      url: 'costGlobal/roleStatics',
      params: {id: '470538850289750017'}
    }, {
      url: 'workbench/costList',
      params: {}
    }, {
      url: 'global/invoiceList',
      params: {}
    }, {
      url: 'workbench/deptTree',
      params: {}
    }];
    const fetchs = fetchList.map(it => it.url);
    const arr = fetchs.map((it, index) => {
      return dispatch({
        type: it,
        payload: {
          ...fetchList[index].params
        },
      });
    });
    Promise.all(arr).then(() => {
      const { personal, roleStatics } = this.props;
      const arrs = roleStatics.filter(it => it.url === 'statistics_department');
      let flagMenu = false;
      if (arrs && arrs.length) {
        flagMenu = true;
      }
      this.setState({
        personal,
        flagMenu,
      });
      this.onQuery({
        isComplete: false,
        pageNo: 1,
        pageSize: 10,
      });
      // 支出简报
      this.onQueryChart({
        ...dateToTime('0_m'),
        dateType: 0,
      });
    });

  }

  onQueryChart = payload => {
    this.props.dispatch({
      type: 'workbench/submitReport',
      payload,
    }).then(() => {
      const { submitReport } = this.props;
      this.setState({
        submitReport,
      });
    });
  }


  onQuery = (payload) => {
    const { invoiceTemplateIds, isComplete, reason } = this.state;
    Object.assign(payload, {
      searchContent: reason || '',
      isMobile: false,
      invoiceTemplateIds: invoiceTemplateIds === 'all' ? [] : [invoiceTemplateIds],
      isComplete: isComplete === 'all' ? '' : isComplete,
    });
    this.props.dispatch({
      type: 'workbench/list',
      payload,
    });
  }

  onDelete = (id, template) => {
    const url = 'workbench/del';
    const {
      query,
    } = this.props;
    this.props.dispatch({
      type: url,
      payload: {
        id,
        template
      }
    }).then(() => {
      this.onQuery({
        ...query,
      });
    });
  }

  onHandleOk = () => {
    const { query } = this.props;
    this.onQuery({
      ...query,
    });
  }

  onSearch = (val) => {
    const { query } = this.props;
    this.setState({
      reason: val,
    }, () => {
      this.onQuery({
        reason: val,
        ...query,
      });
    });
  }

  onPersonal = () => {
    const { query } = this.props;
    const { isBoss } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
    });
    this.props.dispatch({
      type: 'workbench/personal',
      payload: {},
    }).then(() => {
      const { personal } = this.props;
      this.setState({
        personal
      });
    });
    const { submitTime } = this.state;
    if (isBoss) {
      this.chart({
        url: 'submitReport',
        payload: this.setVal({
          url: 'submitReport',
          payload:{...submitTime},
        })
      });
    }
  }

  setVal = ({ url, payload }) => {
    const obj = {
      startTime: payload.startTime,
      endTime: payload.endTime,
    };
    if (url === 'submitReport') {
      if (payload.deptIds) {
        Object.assign(obj , {
          deptIds: payload.deptIds,
        });
      }
      let dateType = 0;
      if (payload.type !== '-1') {
        if (payload.type.indexOf('q') > -1) {
          dateType = 1;
        } else if (payload.type.indexOf('y') > -1) {
          dateType = 2;
        }
      }
      Object.assign(obj , {
        dateType,
      });
    } else if (url === 'chartPie') {
      Object.assign(obj, {
        attribute: payload.attribute,
      });
    }
    return obj;
  }

  onComplete = (value, type) => {
    this.setState({
      [type]: value,
    }, () => {
      const { query } = this.props;
      this.onQuery({
        ...query,
        pageNo: 1,
      });
    });
  }

  onreset = () => {
    this.setState({
      isComplete: false,
      invoiceTemplateIds: 'all',
      reason: '',
    }, () => {
      const { query } = this.props;
      this.onQuery({
        ...query,
        pageNo: 1,
      });
    });
  }

  onSetUser = isBoss => {
    this.props.dispatch({
      type: 'workbench/setUser',
      payload: {
        isBoss
      }
    }).then(() => {
      localStorage.removeItem('workbenchIsBoss');
      localStorage.setItem('workbenchIsBoss', isBoss);
      this.setState({
        isBoss,
        bossVisible: true,
      }, () => {
        localStorage.removeItem('isSetWorkbench');
        localStorage.setItem('isSetWorkbench', 'true');
        this.onPersonal();
      });
    });;
  }

  reportChange = (payload, callback) => {
    const {
      submitTime: { startTime, endTime, deptIds }
    } = this.state;
    if (deptIds) {
      Object.assign(payload, { deptIds });
    }
    console.log('reportChange', startTime);
    this.props.dispatch({
      type: 'workbench/submitReportDetail',
      payload: {
        ...payload,
        startTime,
        endTime,
      },
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }

  chart  = ({ payload, url }, callback) => {
    this.props.dispatch({
      type: `workbench/${url}`,
      payload,
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }

  onChangeState = (key, val) => {
    this.setState({
      [key]: val,
    }, () => {
      if (key === 'submitTime') {
        if (val.type) { delete val.type; }
        this.onQueryChart({
          ...val,
        });
      }
    });
  }

  onLink = (type, status) => {
    const { submitTime } = this.state;
    localStorage.removeItem('linkType');
    localStorage.removeItem('linkStatus');
    localStorage.setItem('linkType', type);
    localStorage.removeItem('submitTime');
    localStorage.setItem('submitTime', JSON.stringify(submitTime));
    if(status) {
      localStorage.setItem('linkStatus', status);
    }
    this.props.history.push('/statistics/costDetail');
  }

  render() {
    const { list, total, query,
        userInfo, loading, invoiceList,
        OftenTemplate,
        submitReportDetail, reportPage,
        reportTotal,
        loanSumVo,
        chartLoading
   } = this.props;
    const { personal, isComplete,
      invoiceTemplateIds, reason,
      isBoss, bossVisible, submitTime, submitReport, flagMenu } = this.state;
    const columns = [{
      title: '事由',
      dataIndex: 'reason',
      width: 120,
      render: (_, record) => (
        <span>
          <InvoiceDetail
            id={record.invoiceId}
            templateId={record.invoiceTemplateId}
            templateType={record.templateType}
            allow="copy"
            onCallback={() => this.onPersonal()}
          >
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a
                className="eslips-2"
                style={{ cursor: 'pointer' }}
              >
                {record.reason}
              </a>
            </Tooltip>
          </InvoiceDetail>
        </span>
      ),
    }, {
      title: '金额(元)',
      dataIndex: 'sum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 100,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 140,
      render: (_, record) => (
        <span>
          <span>{record.invoiceNo}</span>
          {
            record.isAlitrip &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
      )
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 140,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 140,
    }, {
      title: '单据状态',
      dataIndex: 'statusStr',
      width: 100,
      render: (_, record) => (
        <span>{record.statusStr || getArrayValue(record.status, invoiceStatus)}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            ((Number(record.approveStatus) === 4) || (Number(record.status) === 5)) &&
            <Popconfirm
              title="是否确认删除？"
              onConfirm={() => this.onDelete(record.invoiceId, record.templateType)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          }
          {
            ((Number(record.approveStatus) === 4) || (Number(record.status) === 5)) &&
            <Divider type="vertical" />
          }
          <InvoiceDetail
            id={record.invoiceId}
            templateId={record.invoiceTemplateId}
            templateType={record.templateType}
            allow="copy"
            onCallback={() => this.onPersonal()}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 80,
      fixed: 'right',
      className: 'fixCenter'
    }];

    return (
      <div>
        {
          userInfo.isSupperAdmin && (localStorage.getItem('initShow') !== 'true') ?
            <StepShow {...this.props} userInfo={userInfo} />
            :
            <>
              <Boss
                visible={!bossVisible}
                changeBoss={this.onSetUser}
              />
              <div className={style.app_header}>
                <Header
                  personal={personal || {}}
                  onOk={() => this.onPersonal()}
                  isBoss={isBoss}
                />
              </div>
              {
                !isBoss &&
                <div className={style.ad}>
                  <HeadLeft onOk={() => this.onPersonal()} OftenTemplate={OftenTemplate} />
                  <HeadRight onOk={() => this.onPersonal()} />
                </div>
              }
              {
                isBoss &&
                <div className={style.ad} style={{ margin: '24px 0 16px 24px', alignItems: 'center' }}>
                  <p className="c-black-85 fs-18 fw-500">阿米巴支出简报</p>
                  <TimeComp onChangeData={this.onChangeState} submitTime={submitTime} />
                </div>
              }
              {
                isBoss &&
                <div className={style.ad} style={{ marginTop: 0 }}>
                  <div className={style.rightCharts}>
                    <RightChart
                      data={submitReport || {}}
                      submitReport={submitReport}
                      submitReportDetail={submitReportDetail}
                      reportPage={reportPage}
                      reportChange={this.reportChange}
                      submitTime={submitTime}
                      onChangeData={this.onChangeState}
                      reportTotal={reportTotal}
                      loanSumVo={loanSumVo}
                      onLink={this.onLink}
                      loading={chartLoading}
                    />
                  </div>
                  <LeftPie
                    {...this.props}
                    data={submitReport || {}}
                    loading={chartLoading}
                    flagMenu={flagMenu}
                  />
                </div>
              }
              {
                isBoss &&
                <p className="fw-500 fs-18 c-black-85 m-l-24 m-b-12">我发起的单据</p>
              }
              <div
                className="content-dt"
                style={{
                  padding: '0 0 32px 0',
                  height: 'auto',
                  margin: isBoss ? '0 24px 24px 24px' : '24px'
                }}
              >
                <div style={{ margin: '0 32px' }}>
                  {
                    !isBoss &&
                    <p className="fw-500 fs-14 c-black-85 m-t-16">我发起的单据</p>
                  }
                  <div className={style.searchs} style={{ marginTop: isBoss ? '24px' : '16px' }}>
                    <Form layout="inline" style={{display: 'flex'}}>
                      <Form.Item label="单据状态" style={{marginRight: '24px'}}>
                        <Select style={{width: '160px'}} value={isComplete} onChange={(val) => this.onComplete(val, 'isComplete')}>
                          <Select.Option value={false}>未完成</Select.Option>
                          <Select.Option value>已完成</Select.Option>
                          <Select.Option value="all">全部</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="单据类型" style={{marginRight: '24px'}}>
                        <Select
                          value={invoiceTemplateIds}
                          style={{width: '160px'}}
                          dropdownMatchSelectWidth={false}
                          onChange={(val) => this.onComplete(val, 'invoiceTemplateIds')}
                          dropdownMenuStyle={{
                            width: '186px'
                          }}
                        >
                          <Select.Option value="all">全部</Select.Option>
                          {
                            invoiceList.map(it => (
                              <Select.Option value={it.id} key={it.id}>{it.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      <div className={style.onreset} onClick={() => this.onreset()}>
                        <Icon type="sync" />
                        <span className="m-l-4">重置</span>
                      </div>
                    </Form>
                    <Search
                      placeholder="单号、事由、收款人"
                      style={{ width: '272px' }}
                      onSearch={(e) => this.onSearch(e)}
                      onInput={e => this.setState({ reason: e.target.value })}
                      value={reason}
                    />
                  </div>
                  <Table
                    columns={columns}
                    dataSource={list}
                    rowKey="invoiceId"
                    scroll={{ x: 1000 }}
                    loading={loading}
                    pagination={{
                      current: query.pageNo,
                      onChange: (pageNumber) => {
                        this.onQuery({
                          pageNo: pageNumber,
                          pageSize: query.pageSize,
                          reason,
                        });
                      },
                      total,
                      size: 'small',
                      showTotal: () => (`共${total}条数据`),
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onShowSizeChange: (cur, size) => {
                        this.onQuery({
                          reason,
                          pageNo: cur,
                          pageSize: size
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </>
        }
      </div>
    );
  }
}

export default Workbench;
