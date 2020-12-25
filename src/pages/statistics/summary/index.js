

import React from 'react';
import { Menu, Form, message, Icon } from 'antd';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import DropBtn from '@/components/DropBtn';
import SummaryCmp from './components/SummaryCmp';
import style from './index.scss';
import LevelSearch from './components/LevelSearch';

@connect(({ loading, summary }) => ({
  loading: loading.effects['summary/submitList'] ||
            loading.effects['summary/loanList'] ||
            loading.effects['summary/applicationList'] || false,
  submitList: summary.submitList,
  applicationList: summary.applicationList,
  loanList: summary.loanList,
  query: summary.query,
  total: summary.total,
  sum: summary.sum,
}))
class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: '0',
      selectedRowKeys: [],
      selectedRows: [],
      list: [],
      searchContent: '',
      sumAmount: 0,
    };
  }

  componentDidMount(){
    const {
      query,
    } = this.props;
    this.onQuery({...query});
  }

  onOk = () => {
    const {
      query,
    } = this.props;
    this.onQuery({
      ...query
    });
  }

  export = (key) => {
    const { current, selectedRowKeys } = this.state;
    if (selectedRowKeys.length ===  0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    let url = 'summary/submitExport';
    if (Number(current) === 1) {
      url = 'summary/loanExport';
    } else if (Number(current) === 2) {
      url = 'summary/applicationExport';
    }
    let params = {};
    const { searchContent, levelSearch } = this.state;
    if (key === '1') {
      params = {
        ids: selectedRowKeys,
      };
    } else if (key === '2') {
      params = {
        searchContent,
        ...levelSearch,
      };
    }
    this.props.dispatch({
      type: url,
      payload: {
        ...params,
      }
    });
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

  onSelect = (val) => {
    this.setState({
      selectedRowKeys: val.selectedRowKeys,
      selectedRows: val.selectedRows,
      sumAmount: val.sumAmount
    });
  }

  onQuery = (payload) => {
    const { current, searchContent, levelSearch } = this.state;
    console.log('AuthIndex -> onQuery -> current', current);
    let url = 'summary/submitList';
    if (Number(current) === 1) {
      url = 'summary/loanList';
    } else if (Number(current) === 2) {
      url = 'summary/applicationList';
    }
    Object.assign(payload, {
      content: searchContent,
      ...levelSearch,
    });
    this.props.dispatch({
      type: url,
      payload,
    }).then(() => {
      const {
        submitList,
        applicationList,
        loanList
      } = this.props;
      let lists = submitList;
      if (Number(current) === 1) {
        lists = loanList;
      } else if (Number(current) === 2) {
        lists = applicationList;
      }
      this.setState({
        list: lists,
      });
    });
  }

  onOk = (search) => {
    const { query } = this.props;
    this.setState({
      levelSearch: search,
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: query.pageSize
      });
    });
  }

  handleClick = e => {
    this.setState({
      current: e.key,
      selectedRowKeys: [],
      selectedRows: []
    }, () => {
      this.onQuery({
        pageNo: 1,
        pageSize: 10,
      });
    });
  };

  render() {
    const { loading, query, total, sum } = this.props;
    const { current, selectedRowKeys, list, searchContent, sumAmount, levelSearch, selectedRows } = this.state;
    console.log('Summary -> render -> selectedRowKeys', selectedRowKeys);
    return (
      <div>
        <div style={{background: '#fff', paddingTop: '16px'}}>
          <p className="m-l-32 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>台账汇总</p>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[current]}
            className="m-l-32 titleMenu"
          >
            <Menu.Item key={0}>报销单</Menu.Item>
            <Menu.Item key={1}>借款单</Menu.Item>
            <Menu.Item key={2}>申请单</Menu.Item>
          </Menu>
        </div>
        <div className="content-dt" style={{padding: 0}}>
          <div className={style.payContent}>
            <div className="cnt-header" style={{display: 'flex'}}>
              <div className="head_lf">
                <DropBtn
                  selectKeys={selectedRowKeys}
                  total={total}
                  className="m-l-8"
                  onExport={(key) => this.export(key)}
                >
                  导出
                </DropBtn>
                {/* <Button className="m-l-8" onClick={() => this.print()}>打印</Button> */}
                <Form style={{display: 'flex', marginLeft: '8px'}}>
                  <Search
                    placeholder="单号 事由 收款账户名称"
                    style={{ width: '272px', marginLeft: '8px' }}
                    onSearch={(e) => this.onSearch(e)}
                  />
                </Form>
              </div>
              <LevelSearch onOk={this.onOk} details={levelSearch} templateType={Number(current)}>
                <div className="head_rg" style={{cursor: 'pointer', verticalAlign: 'middle', display: 'flex'}}>
                  <div className={style.activebg}>
                    <Icon className="sub-color m-r-8" type="filter" />
                  </div>
                  <span className="fs-14 sub-color">高级搜索</span>
                </div>
              </LevelSearch>
            </div>
            <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>已选{selectedRowKeys.length}笔费用，{selectedRowKeys.length ? `共计¥${sumAmount/100}` : `合计¥${sum/100}`} </p>
            <SummaryCmp
              list={list}
              templateType={Number(current)}
              selectedRowKeys={selectedRowKeys}
              selectedRows={selectedRows}
              sumAmount={sumAmount}
              loading={loading}
              onQuery={this.onQuery}
              onSelect={this.onSelect}
              total={total}
              query={query}
              searchContent={searchContent}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Summary;
