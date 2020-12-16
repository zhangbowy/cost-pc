

import React from 'react';
import { Menu, Form, message } from 'antd';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
import DropBtn from '@/components/DropBtn';
import SummaryCmp from './components/SummaryCmp';
import style from './index.scss';


@connect(({ loading, summary }) => ({
  loading: loading.effects['summary/submitList'] ||
            loading.effects['summary/loanList'] ||
            loading.effects['summary/applicationList'] || false,
  submitList: summary.submitList,
  applicationList: summary.applicationList,
  loanList: summary.loanList,
  query: summary.query,
  total: summary.total,
}))
class AuthIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedRowKeys: [],
      list: [],
      searchContent: '',
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
    if (selectedRowKeys.length ===  0 && (key === '1' || key === '2')) {
      message.error('请选择要导出的数据');
      return;
    }
    let url = 'summary/submitExport';
    if (current === 1) {
      url = 'summary/loanExport';
    } else if (current === 2) {
      url = 'summary/applicationExport';
    }
    this.props.dispatch({
      type: url,
      payload: {
        ids: selectedRowKeys,
      }
    });
  }

  onQuery = (payload) => {
    const { current } = this.state;
    let url = 'summary/submitList';
    if (current === 1) {
      url = 'summary/loanList';
    } else if (current === 2) {
      url = 'summary/applicationList';
    }
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
      if (current === 1) {
        lists = loanList;
      } else if (current === 2) {
        lists = applicationList;
      }
      this.setState({
        list: lists,
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
    const { loading, query, total } = this.props;
    const { current, selectedRowKeys, list, searchContent } = this.state;
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
                  // total={total}
                  total={selectedRowKeys.length}
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
            </div>
            <p className="c-black-85 fw-500 fs-14" style={{marginBottom: '8px'}}>已选{selectedRowKeys.length}笔费用，共计¥{0}</p>
            <SummaryCmp
              list={list}
              templateType={current}
              selectedRowKeys={selectedRowKeys}
              loading={loading}
              onQuery={this.onQuery}
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

export default AuthIndex;
