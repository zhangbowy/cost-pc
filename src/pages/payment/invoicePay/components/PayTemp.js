
import React from 'react';
import { Table, Menu, Button, Form, DatePicker, message } from 'antd';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import cs from 'classnames';
import { rowSelect } from '@/utils/common';
import DropBtn from '@/components/DropBtn';
import constants from '@/utils/constants';
import TableTemplate from '@/components/Modals/TableTemplate';
import style from '../index.scss';
import PayModal from './PayModal';
import { ddOpenLink } from '../../../../utils/ddApi';

const { RangePicker } = DatePicker;
const { APP_API } = constants;
@Form.create()
class PayTemp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: '2',
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
      selectedRows: [],
      accountType: [],
      pageNo: 1,
      show: true,
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
      selectedRowKeys: [],
      selectedRows: [],
      sumAmount: 0,
    });

    this.props.onChangeStatus(e.key);
    this.onQuery({
      ...query,
      status: Number(e.key) === 1 ? 2 : e.key,
      searchContent,
      startTime,
      endTime,
      pageNo: 1,
      isSign: Number(e.key) === 1,
    });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount+=item.submitSum;
    });

    this.setState({
        selectedRows: _selectedRows,
        selectedRowKeys,
        sumAmount: amount.toFixed(2),
    });
  };

  onSelect = (record, selected) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onSelect(this.state, record, selected);
      console.log(selectedRowKeys);
      let amount = 0;
      selectedRows.forEach(item => {
        amount+=item.submitSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount.toFixed(2),
      });
  };

  onDelete = (id) => {
      const {
          selectedRows,
          selectedRowKeys,
      } = rowSelect.onDelete(this.state, id);
      let amount = 0;
      selectedRows.forEach(item => {
        amount+=item.submitSum;
      });
      this.setState({
          selectedRows,
          selectedRowKeys,
          sumAmount: amount,
      });
  };

  onOk = (val) => {
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
    if (val) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
        sumAmount: 0,
      });
    }
    const { status, searchContent } = this.state;
    this.onQuery({
      ...query,
      pageNo: 1,
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
    console.log('模板', payload);
    this.props.onQuerys(payload);
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
    const { status, accountTypes } = this.state;
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
      accountTypes
    });
  }

  export = (key) => {
    const { selectedRowKeys, status, searchContent, accountTypes } = this.state;
    const { namespace } = this.props;
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let params = {};
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    let url = `${namespace}/exporting`;
    if (key === '1') {
      params = {
        ids: selectedRowKeys
      };
    } else if (key === '2') {
      params = {
        searchContent,
        startTime,
        endTime,
      };
    }
    if(Number(status) !== 2) {
      url = `${namespace}/exported`;
    }
    this.props.dispatch({
      type: url,
      payload: {
        ...params,
        accountTypes,
      }
    }).then(() => {
      message.success('导出成功');
    });
  }

  print = () => {
    const { selectedRowKeys } = this.state;
    const { templateType } = this.props;
    if (selectedRowKeys.length > 10) {
      message.error('最多支持打印十条数据');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    const ids = `${selectedRowKeys.join(',')}`;
    if (!Number(templateType)) {
      // window.location.href = `${APP_API}/cost/export/pdfDetail4Loan?token=${localStorage.getItem('token')}&id=${selectedRowKeys[0]}`;
      // window.location.href = `${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${ids}`;
      // this.props.dispatch({
      //   type: 'global/invoicePrint',
      //   payload: {
      //     ids,
      //   }
      // });
      ddOpenLink(`${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem('token')}&ids=${ids}`);
    } else {
      // window.location.href = `${APP_API}/cost/export/pdfDetail?token=${localStorage.getItem('token')}&id=${selectedRowKeys[0]}`;
      // window.location.href = `${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem('token')}&ids=${ids}`;
      // this.props.dispatch({
      //   type: 'global/loanPrint',
      //   payload: {
      //     ids,
      //   }
      // });
      ddOpenLink(`${APP_API}/cost/pdf/batch/loan?token=${localStorage.getItem('token')}&ids=${ids}`);
    }
  }

  // 拒绝
  handleRefuse = (val) => {
    const { namespace, templateType } = this.props;
    this.props.dispatch({
      type: `${namespace}/refuse`,
      payload: {
        invoiceSubmitIds: [val.id],
        rejectNote: val.rejectNote,
        templateType,
      }
    }).then(() => {
      this.onOk();
    });
  }

  onConfirm = () => {
    this.onOk();
    this.setState({
      visibleConfirm: true,
    });
  }

  handleTableChange = (pagination, filters) => {

    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    const { searchContent, status } = this.state;
    this.setState({
      accountTypes: filters.accountType,
      pageNo: pagination.current,
    }, () => {
      this.onQuery({
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        accountTypes: filters.accountType || [],
        searchContent,
        status,
        endTime,
        startTime,
      });
    });

  };

  onMove = () => {
    const { selectedRowKeys, accountTypes, searchContent, status } = this.state;
    const { templateType, query } = this.props;
    if (!selectedRowKeys.length) {
      message.error('请至少选择一条数据');
      return;
    }
    const createTime = this.props.form.getFieldValue('createTime');
    let startTime = '';
    let endTime = '';
    if (createTime && createTime.length > 0) {
      startTime = moment(createTime[0]).format('x');
      endTime = moment(createTime[1]).format('x');
    }
    this.props.operationSign({
      invoiceIds: selectedRowKeys,
      templateType,
      isSign: Number(status) === 2,
    }, () => {
      this.setState({
        selectedRowKeys: [],
      });
      this.onQuery({
        pageNo: 1,
        pageSize: query.pageSize,
        accountTypes,
        searchContent,
        status: status === '1' ? 2 : status,
        endTime,
        startTime,
      });
    });
  }

  handle = () => {
    this.setState({
      show: false,
    });
  }

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      selectedRows,
      accountTypes,
      show,
    } = this.state;
    const {
      list,
      query,
      form: { getFieldDecorator },
      total,
      loading,
      columns,
      templateType,
      confirm,
      recordList,
      recordPage,
      onRecord,
    } = this.props;
    const recordColumns = [{
      title: '姓名',
      dataIndex: 'createName',
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
    }, {
      title: '操作内容',
      dataIndex: 'operationMsg',
    }, {
      title: '详情',
      dataIndex: 'operationDetail',
    }];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px',
      fixed: true
    };
    return (
      <div className="content-dt" style={{padding: 0}}>
        <Menu onClick={this.handleClick} selectedKeys={[status]} mode="horizontal">
          <Menu.Item key={2}>
            待发放
          </Menu.Item>
          <Menu.Item key={1}>
            已票签
          </Menu.Item>
          <Menu.Item key={3}>
            已发放
          </Menu.Item>
        </Menu>
        <>
          {
            Number(status) === 1 && show &&
            <div className={style.production}>
              <div className={style.texts}>
                <i className="iconfont iconinfo-cirlce" />
                <span className="c-black-65">如有票据签收/核对环节，可将核对后的单据暂时移至已票签，由出纳统一发放</span>
              </div>
              <i className="iconfont iconguanbi c-black-65 fs-14" style={{ cursor: 'pointer' }} onClick={() => this.handle()} />
            </div>
          }
        </>
        <div className={Number(status) === 1 && show ? cs(style.payContent, style.noPadding) : style.payContent}>
          <div className="cnt-header" style={{display: 'flex'}}>
            <div className="head_lf">
              {
                (Number(status) === 2 || Number(status) === 1) &&
                <>
                  <PayModal selectKey={selectedRows} onOk={(val) => this.onOk(val)} templateType={templateType} confirms={() => confirm()}>
                    <Button type="primary" style={{marginRight: '8px'}}>发起支付</Button>
                  </PayModal>
                  <Button className="m-r-8" onClick={() => this.onMove()}>{Number(status) === 2 ? '移至已票签' : '移回待发放'}</Button>
                </>
              }
              <DropBtn
                selectKeys={selectedRowKeys}
                total={total}
                onExport={(key) => this.export(key)}
                noLevels
              />
              <Button className="m-l-8" onClick={() => this.print()}>打印</Button>
              <Form style={{display: 'flex', marginLeft: '8px'}}>
                <Form.Item label="提交时间">
                  {
                    getFieldDecorator('createTime')(
                      <RangePicker
                        className="m-l-8"
                        placeholder="请选择时间"
                        format="YYYY-MM-DD"
                        style={{ width: '250px' }}
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
                  placeholder="单号 事由 收款人"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
            {
              Number(status) === 1 &&
              <div className="head_rf">
                <TableTemplate
                  page={recordPage}
                  onQuery={onRecord}
                  columns={recordColumns}
                  list={recordList}
                  placeholder="输入详情内容搜索"
                  sWidth='800px'
                >
                  <div className="head_rf" style={{ cursor: 'pointer' }}>
                    <i className="iconfont iconcaozuojilu c-black-65" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    <span className="fs-14 c-black-65">操作记录</span>
                  </div>
                </TableTemplate>
              </div>
            }
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>
            已选{selectedRowKeys.length}张单据，共计¥{sumAmount/100}
          </p>
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            scroll={{ x: 2400 }}
            rowKey="id"
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
                console.log('分页改变');
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
                  accountTypes
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default PayTemp;
