
import React from 'react';
import { Table, Divider, message, Form, DatePicker, Badge } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import Search from 'antd/lib/input/Search';
// import { JsonParse } from '@/utils/common';
import style from './index.scss';
import { getArrayValue, approveStatus, invoiceStatus } from '../../utils/constants';

const { RangePicker } = DatePicker;
@Form.create()
@connect(({ loading, statistics }) => ({
  loading: loading.effects['statistics/list'] || false,
  list: statistics.list,
  query: statistics.query,
  total: statistics.total,
}))
class Statistics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectKey: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({
      ...query,
      status: 2,
    });
  }

  handleClick = e => {
    const { query } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { searchContent } = this.state;
    this.setState({
      status: e.key,
    });
    this.onQuery({
      ...query,
      status: e.key,
      searchContent,
      startTime,
      endTime,
      pageNo: 1,
    });
  };

  onOk = () => {
    const {
      query,
    } = this.props;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { status, searchContent } = this.state;
    this.onQuery({
      ...query,
      status,
      startTime,
      endTime,
      searchContent,
    });
  }

  handChange = (date) => {
    if (!date) {
      const { status, searchContent } = this.state;
      const {
        query,
      } = this.props;
      this.onQuery({
        ...query,
        status,
        searchContent,
      });
    }
  }

  onLink = (id) => {
    this.props.history.push(`/system/auth/${id}`);
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'payment/list',
      payload,
    });
  }

  onChange = (rows, keys) => {
    let amount = 0;
    keys.forEach(item => {
      if (item.submitSum) {
        amount+=item.submitSum;
      }
    });
    this.setState({
      selectKey: keys,
      count: keys.length,
      sumAmount: amount/100,
    });
  }

  onSearch = (val) => {
    const { query } = this.props;
    const { status } = this.state;
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    this.setState({
      searchContent: val,
    });
    this.onQuery({
      ...query,
      searchContent: val,
      status,
      startTime,
      endTime,
    });
  }

  export = () => {
    const { selectKey } = this.state;
    if (selectKey.length === 0) {
      message.error('请选择要导出的数据');
      return;
    }
    this.props.dispatch({
      type: 'payment/export',
      payload: {
        exportList: selectKey,
      }
    }).then(() => {
      message.success('导出成功');
    });
  }

  render() {
    const {
      status,
      // selectKey,
      count,
      sumAmount,
    } = this.state;
    const {
      list,
      query,
      form: { getFieldDecorator },
      total,
    } = this.props;
    const columns = [{
      title: '费用类别',
      dataIndex: 'categoryName',
      width: 100,
    }, {
      title: '金额',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      ),
      width: 100,
    }, {
      title: '承担人',
      dataIndex: 'user',
      width: 130,
    }, {
      title: '承担部门',
      dataIndex: 'dept',
      width: 130,
    }, {
      title: '事由',
      dataIndex: 'reason',
      width: 100,
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 130,
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 100,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '制单人',
      dataIndex: 'createName',
      width: 100,
    }, {
      title: '制单人部门',
      dataIndex: 'createDept',
      width: 100,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '发放人',
      dataIndex: 'payUserName',
      width: 100,
    }, {
      title: '付款时间',
      dataIndex: 'payTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 100,
    }, {
      title: '审批状态',
      dataIndex: 'approveStatus',
      render: (text) => (
        <span>{getArrayValue(text, approveStatus)}</span>
      )
    }, {
      title: '发放状态',
      dataIndex: 'status',
      render: (text) => (
        <span>
          {
            (Number(text) === 2 )|| (Number(text) === 3) ?
              <Badge
                color={Number(text) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                text={getArrayValue(text, invoiceStatus)}
              />
            :
              <span>{getArrayValue(text, invoiceStatus)}</span>
          }
        </span>
      )
    },{
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          {
            Number(record.status) === 2 &&
            <Divider type="vertical" />
          }
          <InvoiceDetail id={record.invoiceId}>
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 140,
      fixed: 'right',
    }];
    let rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.onChange(selectedRowKeys, selectedRows);
      },
    };
    if (Number(status) !== 2) {
      rowSelection=null;
    }
    return (
      <div className="content-dt" style={{padding: 0}}>
        <div className={style.payContent}>
          <div className="cnt-header" style={{display: 'flex'}}>
            <div className="head_lf">
              {/* <Button className="m-l-8" onClick={() => this.export()}>导出</Button>
              <Button className="m-l-8">打印</Button> */}
              <Form style={{display: 'flex', marginLeft: '8px'}}>
                <Form.Item label="提交时间">
                  {
                    getFieldDecorator('createTime')(
                      <RangePicker
                        className="m-l-8"
                        placeholder="请选择时间"
                        format="YYYY-MM-DD"
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        onOk={() => this.onOk()}
                        onChange={() => this.handChange()}
                      />
                    )
                  }
                </Form.Item>
                <Search
                  placeholder="单号 事由 收款账户名称"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
            {/* <div className="head_rg">
              <span>排序</span>
            </div> */}
          </div>
          {
            Number(status) === 2 &&
            <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>已选{count}笔费用，共计¥{sumAmount}</p>
          }
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            scroll={{ x: 2000 }}
            rowKey="invoiceId"
            pagination={{
              current: query.pageNo,
              onChange: (pageNumber) => {
                const createTime = this.props.form.getFieldValue('createTime');
                let startTime = '';
                let endTime = '';
                if (createTime && createTime.length > 0) {
                  startTime = moment(createTime[0]).format('x');
                  endTime = moment(createTime[1]).format('x');
                }
                const { searchContent } = this.state;
                this.onQuery({
                  pageNo: pageNumber,
                  pageSize: query.pageSize,
                  searchContent,
                  status,
                  endTime,
                  startTime,
                });
              },
              total,
              size: 'small',
              showTotal: () => (`共${total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (cur, size) => {
                const createTime = this.props.form.getFieldValue('createTime');
                let startTime = '';
                let endTime = '';
                if (createTime && createTime.length > 0) {
                  startTime = moment(createTime[0]).format('x');
                  endTime = moment(createTime[1]).format('x');
                }
                const { searchContent } = this.state;
                this.onQuery({
                  pageNo: cur,
                  pageSize: size,
                  searchContent,
                  status,
                  endTime,
                  startTime,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default Statistics;
