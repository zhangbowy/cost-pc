import React from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import Search from 'antd/lib/input/Search';
// import style from './index.scss';

@connect(({ loading, incomeReport }) => ({
  loading: loading.effects['incomeReport/list'] || false,
  list: incomeReport.list,
}))
class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.onQuery({
      pageNo: 1,
      pageSize: 10,
    });
  }

  // onChangeSearch = (val,callback) => {
  //   this.setState({
  //       searchList: val
  //   }, () => {
  //       if (callback) callback();
  //     }
  //   );
  // };

  onQuery=(payload) => {
    this.props.dispatch({
      type: 'incomeReport/list',
      payload,
    });
  }



  render() {
    const columns = [{
      title: '单号',
      dateIndex: ''
    }, {
      title: '金额（元）',
      dateIndex: ''
    }, {
      title: '单据类型',
      dateIndex: ''
    }, {
      title: '提交时间',
      dateIndex: ''
    }, {
      title: '单据状态',
      dateIndex: ''
    }, {
      title: '操作',
      dateIndex: 'operate'
    }];
    return (
      <div className="content-dt" style={{padding: '24px'}}>
        <div className="cnt-header" style={{display: 'flex'}}>
          <div className="head_lf" style={{display: 'flex'}}>
            <Button type="primary" className="m-r-16">新建收款单</Button>
            <Search placeholder="单号、事由、业务员"/>
          </div>
          <div className="head_lf">
            草稿箱
          </div>
        </div>
        <Table
          columns={columns}
        />
      </div>
    );
  }
}

export default Payment;
