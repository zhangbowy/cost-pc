/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Table, Popconfirm, Divider } from 'antd';
import { connect } from 'dva';
import SubHeader from '../../../../components/SubHeader';
import AddRole from '../components/AddRole';

@connect(({ approveRole, loading }) => ({
  list: approveRole.list,
  loading: loading.effects['approveRole/list'] || false,
}))
class SettingPeople extends Component {
  static propTypes = {
    list: PropTypes.array,
  }

  componentDidMount() {
    this.onQuery({});
  }

  onQuery = (payload) => {
    const {id} = this.props.match.params;
    Object.assign(payload, { id });
    this.props.dispatch({
      type: 'approveRole/list',
      payload,
    });
  }

  handleOk = () => {
    this.onQuery({});
  }

  render() {
    const {id} = this.props.match.params;
    const columns = [{
      title: '人员',
      dataIndex: 'userName',
    },{
      title: '分配人',
      dataIndex: 'createName',
    },{
      title: '分配时间',
      dataIndex: 'createTime',
      render: (text) => (<span>{ text && moment(text).format('YYYY-MM-DD') }</span>)
    },{
      title: '操作',
      dataIndex: 'ope',
      width: '190px',
      className: 'fixCenter',
      render: (_, record) => (
        <span>
          {
            !record.isSupperAdmin &&
            <Popconfirm
              title="确认删除该角色吗?"
              onConfirm={() => this.onDelete(record.id)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          }
          {
            !record.isSupperAdmin &&
            <Divider type="vertical" />
          }
          <AddRole title="edit" isSupperAdmin={record.isSupperAdmin} onOk={this.handleOk} detail={record} id={id}>
            <a>编辑</a>
          </AddRole>
        </span>
      ),
    }];
    const { list, loading } = this.props;
    return (
      <div>
        <SubHeader
          content={{
            roleName: '审批角色',
            note: '支持将多个相同审批职能的人设置为同一个角色，用于审批流中按对应管理条件审批'
          }}
          sub
          title="审批角色"
          {...this.props}
        />
        <div className="content-dt">
          <AddRole detail={{}} title="add" onOk={this.handleOk} id={id}>
            <Button type="primary" className="m-b-16">新增人员</Button>
          </AddRole>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default SettingPeople;
