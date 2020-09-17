/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React, { PureComponent } from 'react';
import { Table, Badge, Popconfirm, Divider, Modal, Button, Icon, Popover, Radio } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import moment from 'moment';
import MenuItems from '@/components/AntdComp/MenuItems';
import { workbenchStatus, getArrayValue, invoiceStatus, approveStatus } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
import banner from '@/assets/img/banner.png';
import adCode from '@/assets/img/adCode.png';
import style from './index.scss';
import AddCategory from '../../components/AddCategory';
import AddInvoice from '../../components/Modals/AddInvoice';
import StepShow from '../../components/StepShow';
import { accountType, loanStatus } from '../../utils/constants';

@connect(({ loading, workbench, session }) => ({
  loading: loading.effects['workbench/list'] || false,
  list: workbench.list,
  query: workbench.query,
  OftenTemplate: workbench.OftenTemplate,
  UseTemplate: workbench.UseTemplate,
  total: workbench.total,
  userInfo: session.userInfo,
  loanSum: workbench.loanSum,
  huaVisible: workbench.huaVisible
}))
class Workbench extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      type: '1',
      reason: '',
      huaVisible: false,
      typeLeft: '8'
    };
  }

  componentDidMount() {
    this.onQuery({
      type: '1',
      pageNo: 1,
      pageSize: 10,
    });
    this.props.dispatch({
      type: 'workbench/costList',
      payload: {}
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
    Object.assign(payload, {
      searchContent: payload.reason || '',
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
      const { type, reason, typeLeft } = this.state;
      this.onQuery({
        type: type === '0' ? typeLeft : type,
        ...query,
        reason,
      });
    });
  }

  onHandleOk = () => {
    const { type, reason, typeLeft } = this.state;
    const { query } = this.props;
    this.onQuery({
      reason,
      type: type === '0' ? typeLeft : type,
      ...query,
    });
  }

  onSearch = (val) => {
    const { type, typeLeft } = this.state;
    const { query } = this.props;
    this.setState({
      reason: val,
    });
    this.onQuery({
      reason: val,
      type: type === '0' ? typeLeft : type,
      ...query,
    });
  }

  handleClick = val => {
    const { query } = this.props;
    this.setState({
      type: val,
      typeLeft: '8'
    });
    this.onQuery({
      ...query,
      type: val === '0' ? '8' : val,
      pageNo: 1,
    });
  };

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

  onChangeType = e => {
    this.setState({
      typeLeft: e.target.value,
    });
    const { query } = this.props;
    this.onQuery({
      ...query,
      type: e.target.value,
      pageNo: 1,
    });
  }

  render() {
    const { list, OftenTemplate, total, query, UseTemplate, userInfo, loading, loanSum } = this.props;
    const { huaVisible, typeLeft, type } = this.state;
    const columns = [{
      title: '事由',
      dataIndex: 'reason',
      width: 150,
    }, {
      // eslint-disable-next-line no-nested-ternary
      title: `${Number(type) === 7 || (Number(type) === 0 && Number(typeLeft) === 9) ? '借款金额(元)' : Number(type) === 0 ? '报销金额(元)': '金额(元)'}`,
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
        let name = record.receiptName;
        if (record.supplierAccountVo && record.supplierAccountVo.supplierAccountName) {
          name = record.supplierAccountVo.supplierAccountName;
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
        console.log(account);
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
    if (Number(type) === 2) {
      columns.splice(7, 0, {
        title: '发放状态',
        dataIndex: 'grantStatus',
        render: (text) => (
          <span>
            {
              (Number(text) === 2) || (Number(text) === 3) || (Number(text) === 5) ?
                <Badge
                  color={Number(text) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                  text={getArrayValue(text, invoiceStatus)}
                />
                :
                <span>{getArrayValue(text, invoiceStatus)}</span>
            }
          </span>
        ),
        width: 100,
      });
    }
    if (Number(type) === 1) {
      console.log('11111');
      columns.splice(7, 0, {
        title: '审批状态',
        dataIndex: 'approveStatus',
        render: (text) => (
          <span>{getArrayValue(text, approveStatus)}</span>
        ),
        width: 100,
      });
    }
    if (Number(type) === 0 && (columns.length < 10)) {
      columns.splice(7, 0, {
        title: '审批状态',
        dataIndex: 'approveStatus',
        render: (_, record) => (
          <span>{getArrayValue(record.approveStatus, approveStatus)}</span>
        ),
        width: 100,
      }, {
        title: '发放状态',
        dataIndex: 'grantStatus',
        render: (text) => (
          <span>
            {
              (Number(text) === 2) || (Number(text) === 3) || (Number(text) === 5) ?
                <Badge
                  color={Number(text) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                  text={getArrayValue(text, invoiceStatus)}
                />
                :
                <span>{getArrayValue(text, invoiceStatus)}</span>
            }
          </span>
        ),
        width: 100,
      });
    }
    if ( Number(typeLeft) === 9 && Number(type) === 0) {
      columns.splice(7, 0, {
        title: '还款状态',
        dataIndex: 'loanStatus',
        render: (text) => (
          <span>{getArrayValue(text, loanStatus)}</span>
        ),
        width: 100,
      });
      columns.splice(2, 0 ,{
        title: '待核销金额(元)',
        dataIndex: 'waitAssessSum',
        render: (text) => (
          <span>{text ? text / 100 : 0}</span>
        ),
        className: 'moneyCol',
        width: 140,
      });
    }
    if (Number(type) === 7) {
      columns.splice(7, 0, {
        title: '还款状态',
        dataIndex: 'loanStatus',
        render: (text) => (
          <span>{getArrayValue(text, loanStatus)}</span>
        ),
        width: 100,
      });
      columns.splice(2, 0 ,{
        title: '待核销金额(元)',
        dataIndex: 'waitAssessSum',
        render: (text) => (
          <span>{text ? text / 100 : 0}</span>
        ),
        className: 'moneyCol',
        width: 140,
      });
    }
    return (
      <div>
        {
          userInfo.isSupperAdmin && (localStorage.getItem('initShow') !== 'true') ?
            <StepShow {...this.props} userInfo={userInfo} />
            :
            <>
              <div className={style.app_header}>
                <p className="fs-14 fw-500 c-black-85 m-b-8">常用单据（点击直接新建）</p>
                <div className={style.header_cnt}>
                  <AddCategory
                    OftenTemplate={OftenTemplate}
                    UseTemplate={UseTemplate}
                    onHandleOk={this.onHandleOk}
                  >
                    <div className={style.header_add}>
                      <div className={style.header_add_mc} />
                      <i className="iconfont iconxinzengbaoxiao" />
                      <p>我要报销</p>
                    </div>
                  </AddCategory>
                  {
                    OftenTemplate.map(item => (
                      <AddInvoice
                        id={item.id}
                        onHandleOk={this.onHandleOk}
                        key={item.id}
                        templateType={item.templateType}
                      >
                        <div key={item.id} className={cs(style.offten, 'm-l-20')}>
                          <i className="iconfont icondanju" style={{color: item.templateType && Number(item.templateType) ? 'rgba(38, 128, 242, 0.37)' : 'rgba(0, 199, 149, 0.37)'}} />
                          <div className={style.cost_cnt}>
                            <span className="fw-500 fs-14 c-black-85 li-22 m-b-2 eslips-1">{item.name}</span>
                            <span className="fs-12 c-black-45 eslips-1">{item.note || '暂无备注'}</span>
                          </div>
                        </div>
                      </AddInvoice>
                    ))
                  }
                </div>
              </div>
              <div className="content-dt" style={{ padding: 0 }}>
                <div style={{ marginBottom: '24px' }}>
                  <MenuItems
                    lists={workbenchStatus}
                    onHandle={(val) => this.handleClick(val)}
                    status="1"
                  />
                </div>
                <div style={{ margin: '0 32px' }}>
                  <div className="m-b-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Search
                      placeholder="单号、事由、收款账户名称"
                      style={{ width: '272px' }}
                      onSearch={(e) => this.onSearch(e)}
                    />
                    {
                      !Number(type) &&
                      <Radio.Group
                        onChange={e => this.onChangeType(e)}
                        className="m-r-16"
                        value={typeLeft}
                      >
                        <Radio.Button value="8">报销单</Radio.Button>
                        <Radio.Button value="9">借款单</Radio.Button>
                      </Radio.Group>
                    }
                  </div>
                  {
                    Number(type) === 7 &&
                    <p className="c-black-85 m-b-8">借款共计：¥{loanSum.loanSumAll ? loanSum.loanSumAll/100 : 0}，待核销共计：¥{loanSum.waitAssessSumAll ? loanSum.waitAssessSumAll/100 : 0}</p>
                  }
                  <Table
                    columns={columns}
                    dataSource={list}
                    rowKey="invoiceId"
                    scroll={{ x: 1500 }}
                    loading={loading}
                    pagination={{
                      current: query.pageNo,
                      onChange: (pageNumber) => {
                        const { reason } = this.state;
                        this.onQuery({
                          pageNo: pageNumber,
                          pageSize: query.pageSize,
                          type: Number(type) === 0 ? typeLeft : type,
                          reason,
                        });
                      },
                      total,
                      size: 'small',
                      showTotal: () => (`共${total}条数据`),
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onShowSizeChange: (cur, size) => {
                        const { reason } = this.state;
                        this.onQuery({
                          type: Number(type) === 0 ? typeLeft : type,
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
