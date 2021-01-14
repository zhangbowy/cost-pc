
import React from 'react';
import { Table, Menu, Button, Form, DatePicker, message } from 'antd';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import { rowSelect } from '@/utils/common';
import DropBtn from '@/components/DropBtn';
import constants from '@/utils/constants';
import style from '../index.scss';
import PayModal from './payModal';
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
      status: e.key,
      searchContent,
      startTime,
      endTime,
      pageNo: 1,
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

  render() {
    const {
      status,
      selectedRowKeys,
      sumAmount,
      selectedRows,
      accountTypes
    } = this.state;
    const {
      list,
      query,
      form: { getFieldDecorator },
      total,
      loading,
      columns,
      templateType,
      confirm
    } = this.props;

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
          <Menu.Item key={3}>
            已发放
          </Menu.Item>
        </Menu>
        <div className={style.payContent}>
          <div className="cnt-header" style={{display: 'flex'}}>
            <div className="head_lf">
              {
                Number(status) === 2 &&
                <PayModal selectKey={selectedRows} onOk={(val) => this.onOk(val)} templateType={templateType} confirms={() => confirm()}>
                  <Button type="primary" style={{marginRight: '8px'}}>发起支付</Button>
                </PayModal>
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
                  placeholder="单号 事由 收款账户名称"
                  style={{ width: '272px', marginLeft: '8px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form>
            </div>
          </div>
          <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>
            已选{selectedRowKeys.length}张单据，共计¥{sumAmount/100}
          </p>
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            scroll={{ x: 2300 }}
            rowKey="id"
            loading={loading}
            onChange={this.handleTableChange}
            pagination={{
              current: query.pageNo,
              // onChange: (pageNumber) => {
              //   const createTime = this.props.form.getFieldValue('createTime');
              //   let startTime = '';
              //   let endTime = '';
              //   if (createTime && createTime.length > 0) {
              //     startTime = moment(createTime[0]).format('x');
              //     endTime = moment(createTime[1]).format('x');
              //   }
              //   console.log('分页信息');
              //   const { searchContent } = this.state;
              //   this.onQuery({
              //     pageNo: pageNumber,
              //     pageSize: query.pageSize,
              //     searchContent,
              //     status,
              //     endTime,
              //     startTime,
              //     accountTypes
              //   });
              // },
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
