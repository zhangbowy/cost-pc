/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Popconfirm, Divider, Icon, Tooltip, Form, Select, Badge, Dropdown, Menu, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import cs from 'classnames';
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
import aliLogo from '@/assets/img/aliTrip/alitrip.png';
import xzcLogo from '@/assets/img/aliTrip/xzcLogo.png';
import znxcLogo from '@/assets/img/aliTrip/znxcLogo.png';
import CenterReport from './components/Boss/CenterReport';
import BottomChart from './components/Boss/BottomChart';
import { getArrayColor } from '../../utils/constants';
import { ddOpenSlidePanel } from '../../utils/ddApi';
import { handelOkPrint } from '../../utils/common';

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
  costCategoryList: global.costCategoryList,
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
  lineCharts: workbench.lineCharts,
  barCharts: workbench.barCharts,
  onlyDeptList: costGlobal.onlyDeptList,
  loanDetail: global.loanDetail,
  applyDetail: global.applyDetail,
  salaryDetail: global.salaryDetail,
  invoiceDetail: global.invoiceDetail,
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
      costTime: {
        ...dateToTime('6_cm'),
        type: '6_cm'
      },
      submitReport: {},
      flagMenu: false,
      lineParams: {},
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
      url: 'global/costList',
      params: {}
    }, {
      url: 'global/invoiceList',
      params: {}
    }, {
      url: 'workbench/deptTree',
      params: {}
    }, {
      url: 'costGlobal/onlyDeptList',
      params: {}
    }, {
      url: 'workbench/chartTrend',
      params: {
        ...dateToTime('6_cm'),
        dateType: 0,
      }
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
    const _this = this;
    Promise.all(arr).then(() => {
      const { personal, roleStatics } = this.props;
      const arrs = roleStatics.filter(it => it.url === 'statistics_department');
      let flagMenu = false;
      if (arrs && arrs.length) {
        flagMenu = true;
      }
      _this.setState({
        personal,
        flagMenu,
      });
      _this.onQuery({
        isComplete: false,
        pageNo: 1,
        pageSize: 10,
      });
      // ????????????
      _this.onQueryChart({
        ...dateToTime('0_m'),
        dateType: 0,
      });
    });

  }

  onQueryChart = (payload) => {
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
    console.log('reportChange', payload);
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
      if (key === 'costTime') {
        const { lineParams } = this.state;
        if (val.type) { delete val.type; }
        this.onQueryLine({
          ...val,
          ...lineParams,
        });
      }
      if (key === 'lineParams') {
        const { costTime } = this.state;
        console.log('onChangeState -> costTime', costTime);
        const vals = {...costTime};
        if (vals.type) { delete vals.type; }
        this.onQueryLine({
          ...val,
          ...vals,
        });
      }
    });
  }

  onQueryLine = payload => {
    this.props.dispatch({
      type: 'workbench/chartTrend',
      payload,
    });
  }

  onLink = (type, status) => {
    const { submitTime } = this.state;
    localStorage.removeItem('linkStatus');
    localStorage.removeItem('submitTime');
    localStorage.setItem('submitTime', JSON.stringify(submitTime));
    if(status) {
      localStorage.setItem('linkStatus', status);
    }
    this.props.history.push('/statistics/costDetail');
  }

  onToAdd = (templateType, id) => {
    localStorage.removeItem('contentJson');
    localStorage.removeItem('selectCost');
    this.props.history.push(`/workbench/add~${templateType}~${id}`);
  }

  // ???????????????
  handleClick = (type, data) => {
    const { invoiceId, templateType } = data;
    const { userInfo } = this.props;
    let url = '';
    let params = null;
    switch(type) {
      //    ??????
      case 'back':
        ddOpenSlidePanel(data.url, '????????????', (res) => {
          console.log(res);
        }, (e) => {
          console.log(e);
        });
        break;
      // ??????
      case 'copy':
        url = 'global/invoiceDetail';
        params = { id: invoiceId };
        if (Number(templateType) === 1) {
          url = 'global/loanDetail';
          params = { loanId: invoiceId };
        } else if (Number(templateType) === 2) {
          url = 'global/applyDetail';
          params = { applicationId: invoiceId };
        } else if (Number(templateType) === 3) {
          url = 'global/salaryDetail';
          params = { id: invoiceId };
        }
        this.props.dispatch({
          type: url,
          payload: params
        }).then(async() => {
          const { invoiceDetail, loanDetail, applyDetail, salaryDetail } = this.props;
          let details = invoiceDetail;
          if (Number(templateType) === 1) {
            details = loanDetail;
          } else if (Number(templateType) === 2) {
            details = applyDetail;
          } else if (Number(templateType) === 3) {
            details = salaryDetail;
          }
          // ????????????????????????
          if ((details.isEnterpriseAlitrip || details.isHistoryImport) &&
          (userInfo.userId === details.createId)) {
            message.error(`${details.isHistoryImport ? '????????????' : '??????????????????'}??????????????????????????????`);
            return;
          }
          localStorage.setItem('contentJson', JSON.stringify(details));
          localStorage.removeItem('selectCost');
          this.props.history.push(`/workbench/copy~${templateType}~${data.invoiceTemplateId}~${invoiceId}`);
        });
        break;
      // ??????
      case 'print':
        handelOkPrint({
          id: data.invoiceId,
          templateType: data.templateType
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { list, total, query,
        userInfo, loading, invoiceList,
        OftenTemplate,
        submitReportDetail, reportPage,
        reportTotal,
        loanSumVo,
        chartLoading,
        lineCharts,
        barCharts,
        costCategoryList,
        onlyDeptList
   } = this.props;
    const { personal, isComplete,
      invoiceTemplateIds, reason,
      costTime,
      isBoss, bossVisible, submitTime, submitReport,
      lineParams,
      flagMenu } = this.state;
    const columns = [{
      title: '??????',
      dataIndex: 'reason',
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
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
      title: '??????(???)',
      dataIndex: 'sum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 80,
    }, {
      title: '??????',
      dataIndex: 'invoiceNo',
      width: 140,
      render: (_, record) => (
        <span>
          <span>{record.invoiceNo}</span>
          {
            record.thirdPlatformType===0 &&
            <img src={aliLogo} alt="????????????" style={{ width: '16px', height: '16px',marginLeft: '8px',verticalAlign:'text-bottom'}} />
          }
          {
            record.thirdPlatformType===2 &&
            <img src={xzcLogo} alt="?????????" style={{ width: '16px', height: '16px',marginLeft: '8px',verticalAlign:'text-bottom'}} />
          }
          {
            !record.thirdPlatformType===3 &&
            <img src={znxcLogo} alt="????????????" style={{ width: '16px', height: '16px',marginLeft: '8px',verticalAlign:'text-bottom' }} />
          }
        </span>
      )
    }, {
      title: '????????????',
      dataIndex: 'invoiceTemplateName',
      width: 140,
    }, {
      title: '????????????',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 120,
    }, {
      title: '????????????',
      dataIndex: 'statusStr',
      width: 100,
      render: (_, record) => {
        const { status } = record;
        return (
          <span>
            <Badge
              color={
                getArrayColor(`${status}`, invoiceStatus) === '-'
                  ? 'rgba(255, 148, 62, 1)'
                  : getArrayColor(`${status}`, invoiceStatus)
              }
              text={
                record.statusStr ||
                getArrayValue(record.status, invoiceStatus)
              }
            />
          </span>
        );
      },
    }, {
      title: '??????',
      dataIndex: 'ope',
      render: (_, record) =>
      {
        const btns = [{
          node: (
            <span className="pd-20-9 c-black-65">
              ??????
            </span>
          ),
          key: 'copy'
        }, {
          node: (
            <span className="pd-20-9">
              ??????
            </span>
          ),
          key: 'print'
        }];
        if ((Number(record.approveStatus) === 4) || (Number(record.status) === 5)) {
          btns.push({
            node: (
              <span className="pd-20-9">
                ??????
              </span>
            ),
            key: 'back'
          });
        }
        const menu = (
          <Menu>
            {
              btns.map((item) => (
                // eslint-disable-next-line react/no-array-index-key
                <Menu.Item
                  key={item.key}
                  onClick={() => this.handleClick(item.key, record)}
                >{item.node}
                </Menu.Item>
              ))
            }
          </Menu>
        );
        return (
          <span>
            {
              ((Number(record.approveStatus) === 4) || (Number(record.status) === 5)) ?
                <Popconfirm
                  title="?????????????????????"
                  onConfirm={() => this.onDelete(record.invoiceId, record.templateType)}
                >
                  <span className="deleteColor">??????</span>
                </Popconfirm>
                :
                <a onClick={() => this.handleClick('back', record)}>
                  {record.status === 3 || record.status === 2 ? '??????' : '??????'}
                </a>
            }
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                ?????? <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        );
      },
      width: 130,
      fixed: 'right',
      className: 'fixCenter'
    }];

    return (
      <div style={{minWidth: '1090px'}}>
        {
          userInfo.isSupperAdmin && (localStorage.getItem('initShow') !== 'true') ?
            <StepShow {...this.props} userInfo={userInfo} />
            :
            <>
              <Boss
                visible={!bossVisible}
                changeBoss={this.onSetUser}
              />
              <div className={isBoss ? cs(style.app_header, style.appBoss_header) : style.app_header}>
                <Header
                  personal={personal || {}}
                  onOk={() => this.onPersonal()}
                  isBoss={isBoss}
                />
              </div>
              {
                !isBoss &&
                <div className={style.ad}>
                  <HeadLeft onOk={() => this.onPersonal()} OftenTemplate={OftenTemplate} onToAdd={this.onToAdd}/>
                  <HeadRight onOk={() => this.onPersonal()} />
                </div>
              }
              {
                isBoss &&
                <CenterReport
                  data={submitReport || {}}
                  submitReport={submitReport}
                  submitReportDetail={submitReportDetail}
                  reportPage={reportPage}
                  reportChange={this.reportChange}
                  submitTime={submitTime}
                  onChangeState={this.onChangeState}
                  reportTotal={reportTotal}
                  loanSumVo={loanSumVo}
                  onLink={this.onLink}
                  loading={chartLoading}
                />
              }
              {
                isBoss &&
                <div className={style.ad} style={{ marginTop: 0 }}>
                  <LeftPie
                    {...this.props}
                    data={submitReport || {}}
                    loading={chartLoading}
                    flagMenu={flagMenu}
                    submitTime={submitTime}
                  />
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
              }
              {
                isBoss &&
                <BottomChart
                  lineParams={lineParams}
                  submitTime={costTime}
                  onChangeState={this.onChangeState}
                  lineCharts={lineCharts}
                  barCharts={barCharts}
                  costCategoryList={costCategoryList}
                  onlyDeptList={onlyDeptList}
                />
              }
              {
                !isBoss &&
                <div
                  className="content-dt"
                  style={{
                    padding: '0 0 16px 0',
                    height: 'auto',
                    margin: '16px'
                  }}
                >
                  <div style={{ margin: '0 32px' }}>
                    <p className="fw-500 fs-14 c-black-85 m-t-16">??????????????????</p>
                    <div className={style.searchs} style={{ marginTop: isBoss ? '24px' : '16px' }}>
                      <Form layout="inline" style={{display: 'flex'}}>
                        <Form.Item label="????????????" style={{marginRight: '24px'}}>
                          <Select style={{width: '160px'}} value={isComplete} onChange={(val) => this.onComplete(val, 'isComplete')}>
                            <Select.Option value={false}>?????????</Select.Option>
                            <Select.Option value>?????????</Select.Option>
                            <Select.Option value="all">??????</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="????????????" style={{marginRight: '24px'}}>
                          <Select
                            value={invoiceTemplateIds}
                            style={{width: '160px'}}
                            dropdownMatchSelectWidth={false}
                            onChange={(val) => this.onComplete(val, 'invoiceTemplateIds')}
                            dropdownMenuStyle={{
                              width: '186px'
                            }}
                          >
                            <Select.Option value="all">??????</Select.Option>
                            {
                              invoiceList.map(it => (
                                <Select.Option value={it.id} key={it.id}>{it.name}</Select.Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                        <div className={style.onreset} onClick={() => this.onreset()}>
                          <Icon type="sync" />
                          <span className="m-l-4">??????</span>
                        </div>
                      </Form>
                      <Search
                        placeholder="???????????????????????????"
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
                        showTotal: () => (`???${total}?????????`),
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
              }
            </>
        }
      </div>
    );
  }
}

export default Workbench;
