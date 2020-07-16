import React from 'react';
import { connect } from 'dva';
import { Button, Form, Table, Divider, Modal, message } from 'antd';
import PropTypes from 'prop-types';
// import cs from 'classnames';
import treeConvert from '@/utils/treeConvert';
import Search from 'antd/lib/input/Search';
import Setting from '@/components/Setting';
import BatchImport from '@/components/BatchImport/index';
import Sort from '@/components/TreeSort/index';

const namespace = 'project';
const { confirm } = Modal;

@connect((state) => ({
  userInfo: state.session.userInfo,
  loading: state.loading.models[namespace],
  list: state[namespace].list,
  query: state[namespace].query,
}))

class Product extends React.PureComponent {
  static propsTypes = {
    list: PropTypes.array,
    query: PropTypes.object,
    loading: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.onQuery({});
  }

  // 请求数据
  onQuery = (payload) => {
    const { userInfo, dispatch } = this.props;
    Object.assign(payload, { companyId: userInfo.companyId || '' });
    dispatch({
      type: 'project/getList',
      payload
    });
  }

  onSearch = (e) => {
    this.onQuery({name: e});
    this.setState({
      costName: e
    });
  }

  onOk = (param, url, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: url,
      payload: {
        ...param
      }
    }).then(() => {
      callback();
      this.onQuery({});
      message.success('设置成功');
    });
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'project/delete',
      payload: { id }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({});
    });
  }

  delete = (record) => {
    let confirmText = '';
    if (record.type === 0) {
      confirmText = '确认删除该分组吗？';
    } else {
      confirmText = '确认删除该项目吗？';
    }
    confirm({
      title: confirmText,
      content: '删除不能恢复',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.onDelete(record.id);
      },
      onCancel: () => {
      },
    });
  }

  render() {
    const { loading, list } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '可用人员',
      dataIndex: 'availablePpersonnel',
      render: (_, record) => {
        let ele = null;
        // console.log(record);
        if(record.type === 1){
          if (!record.isAllUse) {
            const users = record.userJson ? JSON.parse(record.userJson) : [];
            const usersLength = users.length;
            const depts = record.deptJson ? JSON.parse(record.deptJson) : [];
            const deptsLength = depts.length;
            ele = (
              <>
                {
                  usersLength > 0 &&
                  <span className='user-info'>
                    {usersLength === 1
                      ? users[0].userName
                      : `${users[0].userName}等${usersLength}人`}
                    {deptsLength > 0 && ','}
                  </span>
                }
                {
                  deptsLength > 0 &&
                  <span className='dept-info'>
                    {deptsLength === 1
                      ? depts[0].name
                      : `${depts[0].name}等${deptsLength}个部门`}
                  </span>
                }
              </>
            );
          } else {
            ele = <span>所有人</span>;
          }
        } else {
          ele = <span>—</span>;
        }
        return ele;
      }
    }, {
      title: '备注',
      dataIndex: 'note',
      render: (_, record) => {
        return (
          <div>
            {
              record.type === 1 ? <span>{record.note}</span> : <span>—</span>
            }
          </div>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: 160,
      render: (_, record) => {
        return (
          <div>
            <a onClick={() => this.delete(record)}>删除</a>
            <Divider type="vertical" />
            <Setting
              target="project"
              list={list}
              type={record.type === 1 ? 'item' : 'group'}
              onOk={this.onOk}
              detail={record}
            >
              <a>编辑</a>
            </Setting>
          </div>
        );
      }
    }];
    let lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'name',
      name: 'name',
      otherKeys: ['note', 'id', 'userJson', 'deptJson', 'isAllUse', 'type', 'status', 'sort', 'parentId']
    }, list);
    if (this.state.costName) {
      lists = list;
    }

    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <Setting type="item" target="project" list={list} onOk={this.onOk}>
              <Button type="primary" style={{ marginRight: '8px' }}>新增项目</Button>
            </Setting>
            <Setting type="group" target="project" list={list} onOk={this.onOk}>
              <Button style={{ marginRight: '8px' }}>新增分组</Button>
            </Setting>
            <BatchImport callback={this.onQuery} type="project">
              <Button style={{ marginRight: '8px' }}>批量导入</Button>
            </BatchImport>
            <Form style={{ display: 'inline-block' }}>
              <Form.Item>
                <Search
                  placeholder="输入关键字，按回车搜索"
                  style={{ width: '272px' }}
                  onSearch={(e) => this.onSearch(e)}
                />
              </Form.Item>
            </Form>
          </div>
          <Sort style={{ justifyContent: 'flex-end' }} list={lists} >
            <Button>排序</Button>
          </Sort>
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
    );
  }
}

export default Product;
