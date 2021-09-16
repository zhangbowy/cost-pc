import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Tree, Icon, Table, Form, Select } from 'antd';
import cs from 'classnames';
import { dateToTime } from '@/utils/util';
import style from './index.scss';
import TimeComp from '../../workbench/components/TimeComp';

const { TreeNode } = Tree;
const { Option } = Select;
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
    this.state = {
      submitTime: {
        ...dateToTime('0_m'),
        type: '0_m'
      },
    };
  }

  componentDidMount(){
    const { submitTime } = this.state;
    this.onQuery({
      ...submitTime,
    });
  }

  onQuery = (payload) => {
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


  render () {
    const {
      // loading,
      list,
      // detailList,
      // query,
      // total,
    } = this.props;
    const { submitTime } = this.state;
    const columns = [{
      title: '承担部门',
      dataIndex: ''
    }, {
      title: '金额',
      dataIndex: ''
    }, {
      title: '环比',
      dataIndex: ''
    }, {
      title: '同比',
      dataIndex: ''
    }, {
      title: '操作',
      dataIndex: ''
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
          <div className={style.cntRight}>
            <Form layout="inline" className="m-b-16">
              <Form.Item label="承担部门" className="m-r-24">
                <Select style={{ width: '160px' }}>
                  <Option value={1}>承担着</Option>
                </Select>
              </Form.Item>
              <Form.Item label="时间筛选">
                <TimeComp submitTime={submitTime} />
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
