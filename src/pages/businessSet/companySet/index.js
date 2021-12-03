import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Button, Table, message, Divider, Popconfirm, Tooltip } from 'antd';
import { connect } from 'dva';
import treeConvert from '@/utils/treeConvert';
import Sort from '@/components/TreeSort';
import PageHead from '@/components/pageHead';
import AddComp from './component/AddComp';

@connect(({ companySet, loading }) => ({
  list: companySet.list,
  loading: loading.effects['companySet/list'] || false,
  addLoading: loading.effects['companySet/add'] ||
    loading.effects['companySet/edit'] || false,
}))
class CompanySet extends Component {
  static propTypes = {

  }

  componentDidMount() {
    this.onQuery({});
  }

  // 获得排序结果
  getSort = (list, callback) => {
    const result = this.openTree(list, []);
    // 传给后端数据
    this.props.dispatch({
      type: 'companySet/sort',
      payload: {
        sortList: result
      }
    }).then(() => {
      message.success('排序成功!');
      this.onQuery({});
      callback();
    });
  }

  // 展开树
  openTree = (list, arr) => {
    const result = arr;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.children && e.children.length) {
        const res = this.openTree(e.children, result);
        e.children = '';
        result.concat(res);
      }
      result.push(e);
    }
    return result;
  }

  sortData = (data) => {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.children && e.children.length) {
        this.sortData(e.children);
      }
    }
    data.sort((a, b) => {
      return a.sort - b.sort;
    });
  }

  onDeletes = (id) => {
    this.props.dispatch({
      type: 'companySet/del',
      payload: {
        id,
      }
    }).then(() => {
      this.onQuery({});
    });
  }

  onOk = (val, callback) => {
    const url = val.id ? 'companySet/edit' : 'companySet/add';
    const title = val.id ? '编辑成功' : '新增成功';
    this.props.dispatch({
      type: url,
      payload: {
        ...val,
      }
    }).then(() => {
      message.success(title);
      this.onQuery({});
      callback();
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'companySet/list',
      payload,
    });
  }

  render() {
    const {
      loading,
      list,
      addLoading,
    } = this.props;
    const newArrs = list.map(it => ({ ...it, name: it.officeName}));
    const lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      name: 'officeName',
      otherKeys: ['note', 'sort', 'id',
      'parentId', 'officeName', 'officeNo', 'parentName', 'userVos', 'deptVos'],
    },list);
    this.sortData(lists);
    const columns = [{
      title: '公司名称',
      dataIndex: 'officeName',
      width: 120,
      ellipsis: true,
      textWrap: 'word-break',
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          {text}
        </Tooltip>
      )
    }, {
      title: '公司编号',
      dataIndex: 'officeNo',
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      render: (text) => {
        if (text) {
          return (
            <Tooltip title={text || ''} placement="topLeft">
              {text}
            </Tooltip>
          );
        }
          return '-';
      }
    }, {
      title: '上级公司',
      dataIndex: 'parentName',
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      render: (text) => {
        if (text) {
          return (
            <Tooltip title={text || ''} placement="topLeft">
              {text}
            </Tooltip>
          );
        }
          return '-';
      }
    }, {
      title: '关联部门/人员',
      dataIndex: 'userVoss',
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      render: (_, record) => {
        const depts = record.deptVos.map(it => it.name).join(',');
        const users = record.userVos.map(it => it.name).join(',');
        return (
          <Tooltip title={`${depts} ${users}` || ''} placement="topLeft">
            <span>{depts} {users}</span>
          </Tooltip>
        );
      }
    }, {
      title: '备注',
      dataIndex: 'note',
      width: 100,
      render: (text) => (
        <span>
          <Tooltip title={text || ''} placement="topLeft">
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) =>
      (
        <div>
          <Popconfirm
            title="确认删除吗？"
            onConfirm={() => this.onDeletes(record.id)}
          >
            <span className="deleteColor">删除</span>
          </Popconfirm>
          <Divider type="vertical" />
          <AddComp
            onOk={this.onOk}
            details={record}
            list={list}
            loading={addLoading}
          >
            <a>编辑</a>
          </AddComp>
        </div>
      ),
      className: 'fixCenter',
      width: 80
    }];
    return (
      <div className="mainContainer">
        <PageHead
          title="分公司管理"
          note="1.针对一个组织架构存在多个分/子公司，支持管理和统计各分公司的支出。
                2.设置好分公司与各部门的对应关系，即可按各分公司纬度查看支出数据。"
        />
        <div className="content-dt">
          <div className="cnt-header">
            <div className="head_lf">
              <AddComp onOk={this.onOk} title="add" list={list} loading={addLoading}>
                <Button style={{marginRight: '8px'}} type="primary">新增公司</Button>
              </AddComp>
            </div>
            <div>
              <Sort list={newArrs} callback={this.getSort}>
                <Button type="default">排序</Button>
              </Sort>
            </div>
          </div>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={lists}
            pagination={false}
            defaultExpandAllRows
          />
        </div>
      </div>
    );
  }
}

export default CompanySet;
