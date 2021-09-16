/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Tree, Icon, Table, Form, Select } from 'antd';
import cs from 'classnames';
import { dateToTime } from '@/utils/util';
import treeConvert from '@/utils/treeConvert';
import style from './index.scss';
import TimeComp from '../../workbench/components/TimeComp';

const { TreeNode } = Tree;
const { Option } = Select;
@connect(({ customQuery, loading, global }) => ({
  loading: loading.effects['customQuery/list'] || false,
  list: customQuery.list,
  query: customQuery.query,
  total: customQuery.total,
  detailList: customQuery.detailList,
  isNoRole: customQuery.isNoRole,
  costCategoryList: global.costCategoryList,
}))
class customQuery extends Component {
  constructor(props){
    super(props);
    this.state = {
      submitTime: {
        ...dateToTime('0_m'),
        type: '0_m'
      },
    };
  }

  componentDidMount(){
    const { submitTime } = this.state;
    this.props.dispatch({
      type: 'global/costList',
      payload: {},
    });
    this.onQuery({
      ...submitTime,
    });
  }

  onQuery = (payload) => {
    if (payload.type) delete payload.type;
    this.props.dispatch({
      type: 'customQuery/list',
      payload,
    });
  }

  renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });

  onChangeState = (key, val) => {
    this.setState({
      [key]: val,
    }, () => {
      if (key === 'submitTime') {
        if (val.type) { delete val.type; }
        this.onQuery({
          ...val,
        });
      }
    });
  }


  render () {
    const {
      // loading,
      list,
      costCategoryList,
      // detailList,
      // query,
      // total,
    } = this.props;
    const lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, costCategoryList);
    const { submitTime } = this.state;
    const columns = [{
      title: '承担部门',
      dataIndex: 'deptName'
    }, {
      title: '金额',
      dataIndex: 'submitSum'
    }, {
      title: '环比',
      dataIndex: 'annulus'
    }, {
      title: '同比',
      dataIndex: 'yearOnYear'
    }, {
      title: '操作',
      dataIndex: 'operate'
    }];
    return (
      <div>
        <div style={{background: '#fff', padding: '24px 0'}}>
          <p className="m-l-24 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>自定义查询</p>
          <p className="m-l-24 c-black-65">支持类别、部门、时间等多维度组合查询</p>
        </div>
        <div className={cs('content-dt', style.contents)}>
          <div className={style.cntLeft}>
            <div className={style.leftHead}>
              <p className="fw-500 c-black-85 fs-16 m-r-8">支出类别</p>
              <span className="sub-color cur-p">
                <Icon type="sync" />
                <span className="m-l-4">重置</span>
              </span>
            </div>
            <div>
              <Tree
                checkable
              >
                {this.renderTreeNodes(lists)}
              </Tree>
            </div>
          </div>
          <Divider type="vertical" style={{height: '100%'}} />
          <div className={style.cntRight}>
            <Form layout="inline" className="m-b-16">
              <Form.Item label="承担部门" className="m-r-24">
                <Select style={{ width: '160px' }} placeholder="请选择">
                  <Option value={1}>承担着</Option>
                </Select>
              </Form.Item>
              <Form.Item label="时间筛选">
                <TimeComp submitTime={submitTime} onChangeData={this.onChangeState} />
              </Form.Item>
            </Form>
            <Table
              columns={columns}
              dataSource={list}
              pagination={false}

            />
          </div>
        </div>
      </div>
    );
  }
}

export default customQuery;
