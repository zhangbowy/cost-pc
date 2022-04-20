import React from 'react';
import { Table, Button, Divider, message, Badge, Select, Popconfirm, Dropdown, Icon, Menu } from 'antd';
import { connect } from 'dva';
import cs from 'classnames';
import Search from 'antd/lib/input/Search';
import moment from 'moment';
import IncomeInvoiceDetail from '@/components/Modals/IncomeInvoiceDetail';
import SelectIncome from './components/SelectIncome';
import style from './index.scss';
import constants, { getArrayColor, getArrayValue, incomeInvoiceStatus, invoiceStatus } from '../../utils/constants';
import DraftList from './components/DraftList';
import { ddOpenLink } from '../../utils/ddApi';

const { APP_API } = constants;
@connect(({ loading, incomeReport, costGlobal, global }) => ({
  loading: loading.effects['incomeReport/list'] || false,
  list: incomeReport.list,
  query: incomeReport.query,
  total: incomeReport.total,
  checkTemp: costGlobal.checkTemp,
  draftTotal: costGlobal.draftTotal,
  incomeDetail: global.incomeDetail
}))
class incomeReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reason: null,
      type: null,
    };
  }

  componentDidMount() {
    this.getDraft();
    this.onQuery({
      pageNo: 1,
      pageSize: 10,
    });
  }

  getDraft = () => {
    this.props.dispatch({
      type: 'costGlobal/listIncomeDraft',
      payload: {
        pageNo: 1,
        pageSize: 10,
      }
    });
  }

  onQuery=(payload) => {
    const { reason, type } = this.state;
    if (reason){
      Object.assign(payload, {
        reason
      });
    }
    if (type !== null){
      Object.assign(payload, {
        type: type === 'all' ? '' : type
      });
    }
    this.props.dispatch({
      type: 'incomeReport/list',
      payload,
    });
  }

  onChangeType = (operateType, details) => {
    this.props
      .dispatch({
        type: 'costGlobal/checkTemplate',
        payload: {
          invoiceTemplateId: details.incomeTemplateId,
          templateType: 20,
        }
      })
      .then(() => {
        const { checkTemp } = this.props;
        if (checkTemp.isDisabled) {
          message.error('单据已停用，无法提交。');
          return;
        }
        if (!checkTemp.isCanUse) {
          message.error('不可使用该单据，请联系管理员“超管”');
          return;
        }
        this.props.dispatch({
          type: 'global/incomeDetail',
          payload: {
            id: details.id,
          }
        }).then(() => {
          const { incomeDetail } = this.props;
          console.log('🚀 ~ file: index.js ~ line 95 ~ incomeReport ~ .then ~ incomeDetail', incomeDetail);
          localStorage.setItem('contentJson', JSON.stringify(incomeDetail));
          localStorage.removeItem('selectCost');
          this.props.history.push(
            `/incomeReport/${operateType}~20~${details.incomeTemplateId}~${details.id}`
          );
        });

      });
  };

  onComplete = (val, key) => {
    this.setState({
      [key]: val,
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: 10,
      });
    });
  }

  print = (id) => {
    ddOpenLink(`${APP_API}/cost/pdf/batch/income?token=${localStorage.getItem('token')}&ids=${id}`);
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'incomeReport/del',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      const { query } = this.props;
      this.onQuery({
        ...query
      });
    });
  }

  handleTableChange = (pagination) => {
    this.onQuery({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  handleClick = (type, record) => {
    switch(type) {
      case 'copy':
        this.onChangeType('copy', record);
      break;
      default:
        this.print(record.id);
      break;
    }
  }

  render() {
    const columns = [{
      title: '单号',
      dataIndex: 'invoiceNo',
      render: (_, record) => (
        <IncomeInvoiceDetail
          id={record.id}
          // refuse={this.handleRefuse}
          templateId={record.incomeTemplateId}
          templateType={20}
          // allow="modify"
          // onCallback={() => this.onOk()}
          // signCallback={this.onSign}
          title="收款单详情"
        >
          <a>{record.invoiceNo}</a>
        </IncomeInvoiceDetail>

      )
    }, {
      title: '金额（元）',
      dataIndex: 'receiptSum',
      render: (_, record) => (
        <span>
          <span>{record.receiptSum ? record.receiptSum/100 : 0}</span>
        </span>
      ),
      className: 'moneyCol',
    }, {
      title: '单据类型',
      dataIndex: 'incomeTemplateName'
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD')}</span>
      )
    }, {
      title: '单据状态',
      dataIndex: 'msg',
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
              text={record.msg ||
                getArrayValue(record.status, incomeInvoiceStatus)}
            />
          </span>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) =>
      {
        const btns = [{
          node: (
            <span className="pd-20-9 c-black-65">
              复制
            </span>
          ),
          key: 'copy'
        }, {
          node: (
            <span className="pd-20-9">
              打印
            </span>
          ),
          key: 'print'
        }];
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
                <>
                  <Popconfirm
                    title="是否确认删除？"
                    onConfirm={() => this.onDelete(record.id)}
                  >
                    <span className="deleteColor">删除</span>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </>
                :
                <>
                  <a onClick={() => this.onChangeType('copy', record)}>复制</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.print(record.id)}>打印</a>
                </>
            }

          </span>
        );
      },
      width: 130,
      fixed: 'right',
      className: 'fixCenter'
    }];
    const { list, loading, total, query, draftTotal } = this.props;
    return (
      <div className="content-dt" style={{padding: '24px'}}>
        <div className="cnt-header" style={{display: 'flex'}}>
          <div className="head_lf" style={{display: 'flex'}}>
            <SelectIncome>
              <Button type="primary" className="m-r-16">新建收款单</Button>
            </SelectIncome>
            <Search
              placeholder="单号、事由、业务员"
              style={{width: '272px'}}
              onSearch={(val) => this.onComplete(val, 'reason')}
            />
            <span style={{lineHeight: '32px'}} className="m-l-16">单据状态：</span>
            <Select
              style={{width: '160px'}}
              onChange={(val) => this.onComplete(val, 'type')}
              placeholder="请选择"
            >
              <Select.Option value={0}>未完成</Select.Option>
              <Select.Option value={1}>已完成</Select.Option>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </div>
          <div className="head_lf">
            <DraftList onOk={this.getDraft}>
              <div className={style.caogaox}>
                <i className={cs('iconfont', 'iconcaogaoxiang', style.caogao)} />
                <span className="c-black-65 m-r-8 m-l-4">草稿箱</span>
                <span className="c-black-85 fs-20">{draftTotal.count}</span>
                <span className="c-black-65 m-l-4">单</span>
              </div>
            </DraftList>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={{
            current: query.pageNo,
            total,
            size: 'small',
            showTotal: () => (`共${total}条数据`),
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (cur, size) => {
              this.onQuery({
                pageNo: cur,
                pageSize: size,
              });
            }
          }}
        />
      </div>
    );
  }
}

export default incomeReport;
