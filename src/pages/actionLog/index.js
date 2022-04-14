

import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import style from './index.scss';
import SearchBanner from '../statistics/overview/components/Search/Searchs';
import fields from '../../utils/fields';

const { actionPart } = fields;
const Port = {0: 'PC端', 1: '手机'};
@connect(({ loading, actionLog }) => ({
  loading: loading.effects['actionLog/list'] || false,
  list: actionLog.list,
  query: actionLog.query,
  total: actionLog.total,
}))
class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchList: [{
        type: 'search',
        label: '外部选择',
        placeholder: '搜索单号、事由、收款账户名称',
        key: 'content',
        id: 'content',
        out: 1
      }, {
          type: 'rangeTime',
          label: '操作时间',
          placeholder: '请选择',
          key: ['startTime', 'endTime'],
          id: 'startTime',
          out: 1
      }, {
          type: 'select',
          label: '操作内容',
          placeholder: '请选择',
          key: 'invoiceTemplateIds',
          id: 'invoiceTemplateIds',
          out: 1,
          options: [],
          fileName: {
            key: 'id',
            name: 'name'
          }
        }],
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({...query});
  }


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
    this.props.dispatch({
      type: 'actionLog/list',
      payload,
    });
  }

  onChange = (page) => {
    const { current, pageSize } = page;
    this.onQuery({
      pageNo: current,
      pageSize,
    });
  }

  render() {
    const { loading, query, total, list } = this.props;
    const { searchList } = this.state;
    const columns = [{
      title: '操作人',
      dataIndex: 'actionUserName',
      width: 150,
    }, {
      title: '操作时间',
      dataIndex: 'actionCreateTime',
      render: (_, record) => (
        <span>{record.actionCreateTime ? moment(record.actionCreateTime).format('YYYY-MM-DD') : '-'}</span>
      ),
      width: 150,
    }, {
      title: '操作模块',
      dataIndex: 'actionPart',
      width: 100,
      render: (_, record) => (
        <span>{actionPart[record.actionPart]}</span>
      )
    }, {
      title: '操作内容',
      dataIndex: 'actionContext',
      width: 150,
    }, {
      title: '操作平台',
      dataIndex: 'port',
      width: 100,
      render: (_, record) => (
        <span>{Port[record.port]}</span>
      )
    }];

    return (
      <div style={{ minWidth: '1000px' }}>
        <SearchBanner list={searchList || []} onChange={this.onChangeSearch} />
        <div className="content-dt" style={{padding: 0, height: 'auto'}}>
          <div className={style.payContent}>
            <Table
              columns={columns}
              loading={loading}
              dataSource={list}
              onChange={this.onChange}
              rowKey="id"
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
