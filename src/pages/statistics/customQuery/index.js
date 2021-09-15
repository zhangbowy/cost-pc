import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Tree } from 'antd';
import cs from 'classnames';
import style from './index.scss';


@connect(({ customQuery, loading }) => ({
  loading: loading.effects['customQuery/list'] || false,
  list: customQuery.list,
  query: customQuery.query,
  total: customQuery.total,
  detailList: customQuery.detailList,
  isNoRole: customQuery.isNoRole,
}))
class customQuery extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.onQuery({
      dateType: 0,
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'branchOffice/list',
      payload,
    });
  }


  render () {
    const {
      // loading,
      list,
      // detailList,
      // query,
      // total,
    } = this.props;

    return (
      <div>
        <div style={{background: '#fff', padding: '24px 0'}}>
          <p className="m-l-24 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>台账汇总</p>
          <p className="m-l-24 c-black-65">支持类别、部门、时间等多维度组合查询</p>
        </div>
        <div className={cs('content-dt', style.contents)}>
          <div className={style.cntLeft}>
            <p>支出类别</p>
            <div>
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(list)}
              </Tree>
            </div>
          </div>
          <Divider type="vertical" style={{height: '100%'}} />
          <div className={style.cntRight} />
        </div>
      </div>
    );
  }
}

export default customQuery;
