

import React from 'react';
import { Menu, Tooltip, Table, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cs from 'classnames';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import treeConvert from '@/utils/treeConvert';
import style from './index.scss';
import { getArrayColor, getArrayValue, invoiceStatus } from '../../utils/constants';
import { ddOpenSlidePanel } from '../../utils/ddApi';
import SearchBanner from '../statistics/overview/components/Search/Searchs';

@connect(({ loading, approvalList, global, costGlobal }) => ({
  loading: loading.effects['approvalList/list'] || false,
  list: approvalList.list,
  query: approvalList.query,
  total: approvalList.total,
  invoiceList: global.invoiceList,
  officeListAndRole: costGlobal.officeListAndRole
}))
class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: '0',
      totals: 0,
      searchList: [{
          type: 'deptAndUser',
          label: '提交部门/人',
          placeholder: '请选择',
          key: ['createUserVOS', 'createDeptVOS'],
          id: 'createUserVOS',
          out: 1
        },
        {
          type: 'rangeTime',
          label: '提交时间',
          placeholder: '请选择',
          key: ['startTime', 'endTime'],
          id: 'startTime',
          out: 1
        },
        {
          type: 'tree',
          label: '单据类型',
          placeholder: '请选择',
          key: 'invoiceTemplateIds',
          id: 'invoiceTemplateIds',
          out: 1,
          fileName: {
            key: 'id',
            name: 'name'
          }
        },
        {
          type: 'search',
          label: '外部选择',
          placeholder: '单号、事由、收款人',
          key: 'searchContent',
          id: 'searchContent',
          out: 1
        }],
    };
  }

  componentDidMount(){
    const { searchList } = this.state;
    this.search(searchList, () => {
      const {
        query,
      } = this.props;
      this.onQuery({...query});
    });

  }

  search = (newA, callback) => {
    const searchList = [...newA];
    const { dispatch } = this.props;
    const _this = this;
    const fetchs = ['invoiceList', 'officeListAndRole'];
    const arr = fetchs.map(it => {
      return dispatch({
        type: it === 'officeListAndRole' ? `costGlobal/${it}` : `global/${it}`,
        payload: {}
      });
    });
    Promise.all(arr).then(() => {
      const { invoiceList, officeListAndRole } = _this.props;
      const treeList = [invoiceList];
      const keys = [
        'invoiceTemplateIds',
        'officeIds'
      ];
      const obj = {};
      const newTree = treeList.map((it) => {
        return treeConvert(
          {
            rootId: 0,
            pId: 'parentId',
            name: 'name',
            tName: 'title',
            tId: 'value'
          },
          it
        );
      });
      newTree.push(officeListAndRole);
      newTree.forEach((it, index) => {
        Object.assign(obj, {
          [keys[index]]: it
        });
      });
      if (officeListAndRole.length > 0) {
        searchList.splice(3, 0, {
          type: 'select',
          label: '分公司',
          placeholder: '请选择',
          key: 'officeIds',
          id: 'officeIds',
          out: 1,
          fileName: {
            key: 'id',
            name: 'officeName'
          }
        });
      }
      const newSearch = [];
      searchList.forEach(it => {
        if (keys.includes(it.key)) {
          newSearch.push({
            ...it,
            options: obj[it.key],
          });
        } else {
          newSearch.push({ ...it });
        }
      });
      this.setState(
        {
          searchList: newSearch
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    });
  };

  onChangeSearch = async val => {
  console.log('Summary -> val', val);
    this.setState(
      {
        searchList: val
      },
      () => {
        this.onQuery({
          pageNo: 1,
          pageSize: 10
        });
      }
    );
  };

  onQuery = (payload) => {
    const { current } = this.state;
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        console.log('🚀 ~ file: index.js ~ line 174 ~ Summary ~ it', it.value);
        if (it.value.officeIds) {
          Object.assign(payload, {
            officeIds: [it.value.officeIds]
          });
        } else {
          Object.assign(payload, {
            ...it.value
          });
        }
      }
    });
    Object.assign(payload, {
      type: 0,
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

  handle = (url) => {
    const _this = this;
    const { query } = this.props;
    ddOpenSlidePanel(url, '审批详情', (res) => {
      console.log('res', res);
      _this.onQuery({
        ...query,
      });
    }, (e) => {
      console.log('关闭的', e);
      _this.onQuery({
        ...query,
      });
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
    const { current, totals, searchList } = this.state;
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
    }];

    if (Number(current) === 0) {
      columns.splice(7,0,{
        title: '操作',
        dataIndex: 'operate',
        render: (_, record) => (
          <a onClick={() => this.handle(record.url)}>去处理</a>
        ),
        fixed: 'right',
        width: 100,
      });
    } else if (Number(current) === 1) {
      columns.splice(7,0,{
        title: '审批时间',
        dataIndex: 'resultTime',
        render: (_, record) => (
          <span>{record.resultTime ? moment(record.resultTime).format('YYYY-MM-DD') : '-'}</span>
        ),
        width: 150
      });
    }
    return (
      <div style={{ minWidth: '1000px' }}>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key={0}>
              待我审批
              <span className={Number(current) !== 0 ? cs(style.active, style.noActive) : style.active}>{totals}</span>
            </Menu.Item>
            <Menu.Item key={1}>我已审批</Menu.Item>
            <Menu.Item key={2}>抄送我的</Menu.Item>
          </Menu>
        </div>
        <SearchBanner list={searchList || []} onChange={this.onChangeSearch} />
        <div className="content-dt" style={{padding: 0, height: 'auto'}}>
          <div className={style.payContent}>
            <Table
              columns={columns}
              loading={loading}
              dataSource={list}
              onChange={this.onChange}
              rowKey="invoiceId"
              scroll={{ x: 1080 }}
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
