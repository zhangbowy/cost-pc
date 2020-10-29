/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Popconfirm, Divider, Modal, Button, Icon, Popover, Tooltip, Form, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getArrayValue, invoiceStatus } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import banner from '@/assets/img/banner.png';
import adCode from '@/assets/img/adCode.png';
import HeadRight from '@/pages/workbench/components/HeadRight';
import style from './index.scss';
import Header from './components/Header';
import HeadLeft from './components/HeadLeft';
import StepShow from '../../components/StepShow';
import { accountType } from '../../utils/constants';
import wave from '../../utils/wave';

@Form.create()
@connect(({ loading, workbench, session, global }) => ({
  loading: loading.effects['workbench/list'] || false,
  list: workbench.list,
  query: workbench.query,
  OftenTemplate: workbench.OftenTemplate,
  UseTemplate: workbench.UseTemplate,
  total: workbench.total,
  userInfo: session.userInfo,
  loanSum: workbench.loanSum,
  huaVisible: workbench.huaVisible,
  personal: workbench.personal,
  invoiceList: global.invoiceList,
}))
class Workbench extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      huaVisible: false,
      personal: {},
      isComplete: false,
      invoiceTemplateIds: 'all',
    };
  }

  componentDidMount() {
    if (document.querySelector('#svg-area')) {
      wave.init();
    }
    this.onQuery({
      isComplete: false,
      pageNo: 1,
      pageSize: 10,
    });
    this.props.dispatch({
      type: 'workbench/personal',
      payload: {}
    }).then(() => {
      const { personal } = this.props;
      this.setState({
        personal,
      });
    });
    this.props.dispatch({
      type: 'workbench/costList',
      payload: {}
    });
    this.props.dispatch({
      type: 'global/invoiceList',
      payload: {
        type: 1,
      }
    });
    this.props.dispatch({
      type: 'workbench/ejectFrame',
      payload: {}
    }).then((e) => {
      console.log(e);
      this.setState({huaVisible:this.props.huaVisible});
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

  onDelete = (id, temp) => {
    let url = 'workbench/del';
    if (temp && Number(temp)) {
      url = 'workbench/loanDel';
    }
    const {
      query,
    } = this.props;
    this.props.dispatch({
      type: url,
      payload: {
        id
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
  }

  closeHua = (type) => {
    if(type){
      this.props.dispatch({
        type: 'workbench/unRemind',
        payload: {
          isCompany: true
        }
      });
    }
    this.setState({ huaVisible: false });
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

  render() {
    const { list, total, query, userInfo, loading, invoiceList, OftenTemplate } = this.props;
    const { huaVisible, personal, isComplete, invoiceTemplateIds, reason } = this.state;
    const columns = [{
      title: '事由',
      dataIndex: 'reason',
      width: 150,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '金额(元)',
      dataIndex: 'sum',
      render: (text) => (
        <span>{text && text / 100}</span>
      ),
      className: 'moneyCol',
      width: 140,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 160,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 160,
    }, {
      title: '收款账户名称',
      dataIndex: 'receiptName',
      width: 150,
      render: (_, record) => {
        let name = record.accountVo;
        if (name) {
          name = name.accountName;
        }
        return (
          <span>{name || '-'}</span>
        );
      }
    }, {
      title: '个人/供应商收款账户',
      dataIndex: 'receiptId',
      render: (_, record) => {
        let account = record.accountVo;
        if (record.supplierAccountVo && record.supplierAccountVo.supplierAccountName) {
          account = [{
            ...record.supplierAccountVo,
            type: record.supplierAccountVo.accountType,
            account: record.supplierAccountVo.supplierAccount,
          }];
        }
        return (
          <span>
            {account && account.accountType ? getArrayValue(account.accountType, accountType) : ''}
            <span className="m-r-8">{account && account.bankName}</span>
            {account && account.account}
            {!account && '-'}
          </span>
        );
      },
      width: 180,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 150,
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
            ((Number(record.approveStatus) === 4) || (Number(record.approveStatus) === 5)) &&
            <Popconfirm
              title="是否确认删除？"
              onConfirm={() => this.onDelete(record.invoiceId, record.templateType)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          }
          {
            ((Number(record.approveStatus) === 4) || (Number(record.approveStatus) === 5)) &&
            <Divider type="vertical" />
          }
          <InvoiceDetail
            id={record.invoiceId}
            templateId={record.invoiceTemplateId}
            templateType={record.templateType}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 120,
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
              <div className={style.app_header}>
                <Header personal={personal || {}} onOk={() => this.onPersonal()} />
              </div>
              <div className={style.ad}>
                <HeadLeft onOk={() => this.onPersonal()} OftenTemplate={OftenTemplate} />
                <HeadRight onOk={() => this.onPersonal()} />
              </div>
              <div className="content-dt" style={{ padding: 0 }}>
                <div style={{ margin: '0 32px' }}>
                  <p className="fw-500 fs-14 c-black-85 m-t-16 m-b-16">我发起的单据</p>
                  <div className={style.searchs}>
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
                          onChange={(val) => this.onComplete(val, 'invoiceTemplateIds')}
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
                      placeholder="单号、事由、收款账户名称"
                      style={{ width: '272px' }}
                      onSearch={(e) => this.onSearch(e)}
                      onInput={e => this.setState({ reason: e.target.value })}
                      value={reason}
                    />
                  </div>
                  {/* {
                    Number(type) === 7 &&
                    <p className="c-black-85 m-b-8">借款共计：¥{loanSum.loanSumAll ? loanSum.loanSumAll/100 : 0}，待核销共计：¥{loanSum.waitAssessSumAll ? loanSum.waitAssessSumAll/100 : 0}</p>
                  } */}
                  <Table
                    columns={columns}
                    dataSource={list}
                    rowKey="invoiceId"
                    scroll={{ x: 1500 }}
                    loading={loading}
                    pagination={{
                      current: query.pageNo,
                      onChange: (pageNumber) => {
                        console.log('onChange');
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
                        console.log('翻页');
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

        {/* 花呗工作花开通指引 */}
        <Modal
          footer={null}
          header={null}
          closable={false}
          visible={huaVisible}
          width="728px"
          bodyStyle={{
            padding: '0',
          }}
        >
          <div className={style.banner_wrapper}>
            <Icon onClick={() => {this.closeHua();}} type="close" className={style.close} />
            <img className={style.banner} src={banner} alt="" />
            <div className={style.banner_footer}>
              <div className={style.footer_left}>
                <div className={style.left_top}>企业无预支，员工无垫付</div>
                <div calssName={style.left_bottom} style={{position:'absolute'}}>鑫支出联合支付宝花呗工作花，为企业提供“报销备用金”</div>
              </div>
              <div className={style.footer_left_btn}>
                <span
                  style={{color:'#00C795',fontSize:'12px',cursor:'pointer'}}
                  onClick={() => {window.open('https://www.yuque.com/docs/share/09880e09-a80a-410a-86c6-7a7c7f31dc9a?#');}}
                >
                  查看签约流程 &gt;
                </span>
              </div>
              <div className={style.footer_right}>
                <div className={style.jumpout} onselectstart="return false;" onClick={() => {this.closeHua(1);}}>不再提醒 &gt;</div>
                {/* <Button type="primary" className={style.opening}>立刻咨询开通</Button> */}
                <Popover
                  content={(
                    <div>
                      <img alt="二维码" src={adCode} style={{ width: '200px' }} />
                    </div>
                  )}
                  placement="top"
                  trigger="hover"
                >
                  <Button type="primary" className={style.opening}>立刻咨询开通</Button>
                </Popover>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Workbench;
