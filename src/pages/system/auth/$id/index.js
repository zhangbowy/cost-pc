

import React from 'react';
import moment from 'moment';
import { Button, Table, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import { choosePeople } from '@/utils/ddApi';
import SubHeader from '@/components/SubHeader';

@connect(({ loading, setUser }) => ({
  loading: loading.effects['setUser/list'] || false,
  list: setUser.list,
  role: setUser.role,
  query: setUser.query,
  total: setUser.total,
  userIdList: setUser.userIdList,
}))
class setUser extends React.PureComponent {

  componentDidMount() {
    const { query } = this.props;
    this.onQuery({
      pageNo: 1,
      pageSize: query.pageSize,
    });

  }

  onDelete = (id) => {
    const {
      query,
      dispatch,
    } = this.props;
    dispatch({
      type: 'setUser/delRole',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({
        ...query
      });
    });
  }

  onQuery = (pay) => {
    const id = this.props.match.params.id || '';
    const payload = { ...pay,id };
    this.props.dispatch({
      type: 'setUser/list',
      payload,
    });
  }

  handleClick = () => {
    const _this = this;
    const { dispatch, query } = this.props;
    const id = this.props.match.params.id || '';
    this.props.dispatch({
      type: 'setUser/userIdList',
      payload: {
        id,
      }
    }).then(() => {
      const { userIdList } = this.props;
      choosePeople(userIdList, (res) => {
        const users = [];
        res.forEach(item => {
          users.push({
            userId: item.emplId,
            name: item.name,
          });
        });
        if (users && users.length > 0) {
          dispatch({
            type: 'setUser/add',
            payload: {
              userJson: JSON.stringify(users),
              id,
            }
          }).then(() => {
            _this.onQuery({
              ...query,
            });
          });
        }
      }, { multiple: true });
    });

  }

  render() {
    const { list, query, role, total } = this.props;
    const columns = [{
      title: '人员',
      dataIndex: 'userName',
    }, {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{text && moment(text).format('YYYY-MM-DD')}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <Popconfirm
          title="确认删除该人员吗?"
          onConfirm={() => this.onDelete(record.id)}
        >
          <span className="deleteColor" id={record.id}>删除</span>
        </Popconfirm>
      ),
      width: '80px',
      className: 'fixCenter'
    }];
    return (
      <div>
        <SubHeader type="role" content={role} {...this.props} />
        <div className="content-dt">
          <Button type="primary" style={{marginBottom: '15px'}} onClick={this.handleClick}>新增人员</Button>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            pagination={{
              current: query.pageNo,
              onChange: (pageNumber) => {
                this.onQuery({
                  pageNo: pageNumber,
                  pageSize: query.pageSize
                });
              },
              size: 'small',
              showTotal: () => (`共${total}条数据`),
              showSizeChanger: true,
              showQuickJumper: true,
              total,
              onShowSizeChange: (cur, size) => {
                this.onQuery({
                  pageNo: cur,
                  pageSize: size
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default setUser;
