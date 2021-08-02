

import React from 'react';
import { Menu, Tooltip, DatePicker, Table, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import style from './index.scss';
import { getArrayValue, invoiceStatus, getArrayColor, approveStatusColor } from '../../utils/constants';
import { ddOpenSlidePanel } from '../../utils/ddApi';

const { RangePicker } = DatePicker;
@connect(({ loading, approvalList }) => ({
  loading: loading.effects['approvalList/list'] || false,
  list: approvalList.list,
  query: approvalList.query,
  total: approvalList.total,
}))
class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: '0',
      searchContent: '',
      time: [],
      totals: 0,
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({...query});
  }

  onSearch = e => {
    const { query } = this.props;
    this.setState({
      searchContent: e,
    }, () => {
      this.onQuery({
        pageNo:1,
        pageSize: query.pageSize,
      });
    });
  }

  onQuery = (payload) => {
    const { time, searchContent, current } = this.state;
    if (time && time.length > 1) {
      Object.assign(payload, {
        startTime: moment(time[0]).format('x'),
        endTime: moment(time[1]).format('x')
      });
    }
    Object.assign(payload, {
      type: 0,
      searchContent,
      detailType: current
    });
    this.props.dispatch({
      type: 'approvalList/list',
      payload,
    }).then(() => {
      const { total } = this.props;
      if (Number(current) === 0) {
        this.setState({
          totals: total,
        });
      }
    });
  }

  onChange = (page) => {
    const { current, pageSize } = page;
    this.onQuery({
      pageNo: current,
      pageSize,
    });
  }

  onChangeTime = (val) => {
    const { query } = this.props;
    this.setState({
      time: val,
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: query.pageSize,
      });
    });
  }

  handle = (url) => {
    const _this = this;
    const { query } = this.props;
    ddOpenSlidePanel(url, '审批详情', (res) => {
      console.log('res', res);
      _this.onQuery({
        ...query,
      });
    }, (e) => {
      console.log(e);
    });
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: 10,
      });
    });
  };

  render() {
    const { loading, query, total, list } = this.props;
    const { current, totals } = this.state;
    const columns = [{
      title: '事由',
      dataIndex: 'reason',
      width: 150,
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
      width: 120,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 160,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 150,
    }, {
      title: '提交人',
      dataIndex: 'createName',
      width: 100,
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
    }];

    if (Number(current) === 0) {
      columns.splice(7,0,{
        title: '操作',
        dataIndex: 'operate',
        render: (_, record) => (
          <a onClick={() => this.handle(record.url)}>去处理</a>
        ),
        fixed: 'right'
      });
    } else if (Number(current) === 1) {
      columns.splice(7,0,{
        title: '审批时间',
        dataIndex: 'resultTime',
        render: (_, record) => (
          <span>{record.createTime ? moment(record.createTime).format('YYYY-MM-DD') : '-'}</span>
        ),
        width: 150
      },{
        title: '审批结果',
        dataIndex: 'approveStatus',
        render: (_, record) => {
          const { approveStatus } = record;
          return (
            <span>
              <Badge
                color={
                  getArrayColor(`${approveStatus}`, approveStatusColor) === '-' ?
                  'rgba(255, 148, 62, 1)' : getArrayColor(`${approveStatus}`, approveStatusColor)
                }
                text={record.statusStr || getArrayValue(approveStatus, approveStatusColor)}
              />
            </span>
          );
        },
        fixed: 'right'
      });
    }
    return (
      <div style={{ minWidth: '1000px' }}>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>审批</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key={0}>
              待我审批
              <span className={style.active}>{totals}</span>
            </Menu.Item>
            <Menu.Item key={1}>我已审批</Menu.Item>
            <Menu.Item key={2}>抄送我的</Menu.Item>
          </Menu>
        </div>
        <div className="content-dt" style={{padding: 0, height: 'auto'}}>
          <div className={style.payContent}>
            <div className="cnt-header" style={{display: 'flex'}}>
              <div className="head_lf">
                <div className={style.search}>
                  <span className={style.label}>提交时间：</span>
                  <RangePicker
                    placeholder="请选择"
                    style={{ width: '220px' }}
                    onChange={val => this.onChangeTime(val)}
                  />
                </div>
                <Search
                  placeholder="请输入单号、事由"
                  style={{ width: '292px', marginLeft: '16px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </div>
            </div>
            <Table
              columns={columns}
              loading={loading}
              dataSource={list}
              onChange={this.onChange}
              rowKey="invoiceId"
              scroll={{ x: 1200 }}
              pagination={{
                total,
                current: query.pageNo,
                size: 'small',
                showTotal: () => (`共${total}条数据`),
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Summary;
