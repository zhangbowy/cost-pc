/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Tree, Icon, Table, Form, Popover, TreeSelect, Tooltip } from 'antd';
import cs from 'classnames';
import { dateToTime } from '@/utils/util';
import treeConvert from '@/utils/treeConvert';
import style from './index.scss';
import TimeComp from '../../workbench/components/TimeComp';
import autoHeight from '../../../components/AutoHeight';

const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
const commons = [{
  title: '环比',
  dataIndex: 'annulus',
  render: (_, record) => (
    <span>
      { record.annulusSymbolType === null && '-' }
      { record.annulusSymbolType !== null &&
      (
        <span className="icons" style={{display: 'flex', alignItems: 'center'}}>
          <i className={`iconfont vt-m m-t-2 ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
          <span className="vt-m li-1">{record.annulus}{record.annulusSymbolType === null ? '' : '%'}</span>
        </span>
      )}
    </span>
  ),
}, {
  title: '同比',
  dataIndex: 'yearOnYear',
  render: (_, record) => (
    <span>
      { record.yearOnYearSymbolType === null && '-' }
      { record.yearOnYearSymbolType !== null &&
      (
        <span className="icons" style={{display: 'flex', alignItems: 'center'}}>
          <i className={`iconfont vt-m m-t-2 ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
          <span className="vt-m li-1">{record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}</span>
        </span>
      )}
    </span>
  ),
}];
const childColumnns = [{
  title: '支出类别',
  dataIndex: 'costCategoryName',
  ellipsis: true,
  textWrap: 'word-break',
  render: (text) => (
    <Tooltip title={text || ''} placement="topLeft">
      {text}
    </Tooltip>
  )
}, {
  title: '金额（元）',
  dataIndex: 'submitSum',
  render: (_, record) => (
    <span>
      {record.submitSumAll ? (record.submitSumAll/100).toFixed(2) : 0}
    </span>
  )
}, ...commons];
@autoHeight()
@connect(({ customQuery, loading, global }) => ({
  loading: loading.effects['customQuery/list'] || false,
  list: customQuery.list,
  query: customQuery.query,
  total: customQuery.total,
  detailList: customQuery.detailList,
  isNoRole: customQuery.isNoRole,
  costCategoryList: global.costCategoryList,
  deptList: customQuery.deptList,
  childLoading: loading.effects['customQuery/detailList'] || false
}))
class customQuery extends Component {
  constructor(props){
    super(props);
    this.state = {
      submitTime: {
        ...dateToTime('0_m'),
        type: '0_m'
      },
      categoryIds: [],
      deptIds: [],
      expandIds: [],
    };
  }

  componentDidMount(){
    const { submitTime } = this.state;
    this.props.dispatch({
      type: 'global/costList',
      payload: {},
    });
    this.props.dispatch({
      type: 'customQuery/deptList',
      payload: {},
    });
    this.onQuery({
      ...submitTime,
    });
  }

  onQuery = (payload) => {
    const { categoryIds, submitTime, deptIds } = this.state;
    Object.assign(payload, {
      categoryIds,
      ...submitTime,
      deptIds,
    });
    if (payload.type) delete payload.type;
    this.props.dispatch({
      type: 'customQuery/list',
      payload,
    }).then(() => {
      const { list } = this.props;
      this.setState({
        expandIds: list.length === 1 ? list.map(it => it.id) : []
      });
    });
  }

  customExpandIcon = (props) => {
    if(props.record.children.length > 0){
      if (props.expanded) {
          return (
            <a
              style={{ marginRight:8 }}
              className="c-black-65"
              onClick={e => {
                        props.onExpand(props.record, e);
                      }}
            >
              <i className="table-minus" />
            </a>
        );

      }
          return (
            <a
              style={{ marginRight:8 }}
              onClick={e => {
                props.onExpand(props.record, e);
              }}
              className="c-black-65"
            >
              <i className="table-plus" />
            </a>
          );
    }
      return <span className="m-l-24" />;
  }

  renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          title={(
            <span>{item.title.length > 10 ? `${item.title.substring(0,10)}...` : item.title}</span>
          )}
          key={item.value}
          dataRef={item}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.value}
      {...item}
      title={(
        <span>{item.title.length > 10 ? `${item.title.substring(0,10)}...` : item.title}</span>
      )}
    />;
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

  onDetailQuery = (payload) => {
    if (payload.type) delete payload.type;
    const { categoryIds } = this.state;
    Object.assign(payload, {
      categoryIds,
    });
    this.props.dispatch({
      type: 'customQuery/detailList',
      payload,
    });
  }

  onVisibleChange = (val, deptId, sid) => {
    console.log('显示与隐藏', val);
    const { submitTime } = this.state;
    const obj = {
      ...submitTime,
    };
    if (!sid) {
      Object.assign(obj, {
        deptId
      });
    } else {
      const deptIds = sid.split('_')[0];
      Object.assign(obj, {
        queryUserId: deptId,
        deptId: deptIds
      });
    }
    if (val) {
      this.onDetailQuery({
        ...obj,
      });
    }
  }

  onCheck = (checkKeys) => {
    this.setState({
      categoryIds: checkKeys,
    }, () => {
      this.onQuery({});
    });
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({ deptIds: value }, () => {
      this.onQuery({});
    });
  };

   // 循环渲染树结构
   loop = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.deptId}
          label={item.deptName}
          value={item.deptId}
          dataRef={item}
          title={(
            <div>
              <span>{item.deptName}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.deptId}
      label={item.deptName}
      value={item.deptId}
      dataRef={item}
      title={(
        <div className="icons">
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.deptName}</span>
        </div>
      )}
    />;
  });

  onReset = () => {
    const { submitTime } = this.state;
    this.setState({
      categoryIds: [],
    }, () => {
      this.onQuery({
        ...submitTime,
      });
    });
  }

  render () {
    const {
      // loading,
      list,
      costCategoryList,
      detailList,
      loading,
      // query,
      // total,
      childLoading,
      deptList,
      height,
    } = this.props;
    console.log('render -> height', height);

    const lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'costName',
      tName: 'title',
      tId: 'value'
    }, costCategoryList);
    const { submitTime, categoryIds, expandIds } = this.state;
    const columns = [{
      title: '承担部门',
      dataIndex: 'deptName',
    }, {
      title: '金额（元）',
      dataIndex: 'submitSum',
      render: (_, record) => (
        <span>
          {record.submitSumAll ? (record.submitSumAll/100).toFixed(2) : 0}
          { record.submitSum && record.id !== -1 && record.children &&
            record.children.length ?  `（本部${(record.submitSum/100).toFixed(2)}）` : ''}
        </span>
      )
    }, ...commons, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => (
        <Popover
          placement="bottomRight"
          title={null}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          content={(
            <div>
              <Table
                pagination={false}
                columns={childColumnns}
                dataSource={detailList}
                scroll={{y: 245}}
                rowKey='costCategoryId'
                loading={childLoading}
                className={style.tableMin}
              />
            </div>
          )}
          // autoAdjustOverflow
          trigger='click'
          overlayClassName={style.toolTips}
          onVisibleChange={(val) => this.onVisibleChange(val, record.deptId, record.sid)}
        >
          <a>查看类别分布</a>
        </Popover>
      )
    }];
    return (
      <div className="ant-table-wrapper">
        <div style={{background: '#fff', padding: '24px 0', minWidth: '1000px'}}>
          <p className="m-l-24 m-b-8 c-black-85 fs-20" style={{ fontWeight: 'bold' }}>经营责任报表</p>
          <p className="m-l-24 c-black-65">支持类别、部门、时间等多维度组合查询</p>
        </div>
        <div className={cs('content-dt', style.contents)}>
          <div className={style.cntLeft}>
            <div className={style.leftHead}>
              <p className="fw-500 c-black-85 fs-16 m-r-8">支出类别</p>
              <span className="sub-color cur-p" onClick={() => this.onReset()}>
                <Icon type="sync" />
                <span className="m-l-4">重置</span>
              </span>
            </div>
            <div className={style.treeSelects}>
              <Tree
                checkable
                switcherIcon={<Icon type="down" />}
                onCheck={this.onCheck}
                checkedKeys={categoryIds}
              >
                {this.renderTreeNodes(lists)}
              </Tree>
            </div>
          </div>
          <Divider type="vertical" style={{height: '100%', margin: '0'}} />
          <div className={style.cntRight}>
            <Form layout="inline" className="m-b-16">
              <Form.Item label="部门/人" className="m-r-24">
                <TreeSelect
                  treeNodeFilterProp="label"
                  placeholder='请选择'
                  style={{width: '160px'}}
                  dropdownStyle={{height: '300px'}}
                  treeCheckable
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  showSearch
                  treeNodeLabelProp="label"
                  showCheckedStrategy={SHOW_PARENT}
                  onChange={this.onChange}
                  treeDefaultExpandedKeys={deptList.length === 1 ? deptList.map(it => it.deptId) : []}
                >
                  { this.loop(deptList) }
                </TreeSelect>
              </Form.Item>
              <Form.Item label="时间筛选">
                <TimeComp submitTime={submitTime} onChangeData={this.onChangeState} />
              </Form.Item>
            </Form>
            <div style={{overflowY: 'scroll'}}>
              <Table
                columns={columns}
                dataSource={list}
                pagination={false}
                loading={loading}
                expandIcon={(props) => this.customExpandIcon(props)}
                rowKey={record => record.sid || record.id}
                defaultExpandedRowKeys={list.length === 1 ? list.map(it => it.id) : []}
                expandedRowKeys={expandIds}
                scroll={{ y: 'calc(100vh - 400px)' }}
                className={style.tableHeight}
                onExpand={(b, r) => {
                  this.setState({
                    expandIds: b ? [...expandIds, r.id] : expandIds.filter(i => i !== r.id)
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default customQuery;
