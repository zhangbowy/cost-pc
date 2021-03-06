import React from 'react';
import { connect } from 'dva';
import { Button, Form, Table, Divider, Modal, message, Tag, Tooltip, Dropdown, Icon, Menu, Badge } from 'antd';
import PropTypes from 'prop-types';
// import cs from 'classnames';
import Search from 'antd/lib/input/Search';
import update from 'immutability-helper';
import treeConvert from '@/utils/treeConvert';
import Setting from '@/components/Setting';
import BatchImport from '@/components/BatchImport/index';
import Sort from '@/components/TreeSort/index';
import PageHead from '@/components/pageHead';
import constants from '@/utils/constants';
import style from './index.scss';

const {
  APP_API,
} = constants;
const { confirm } = Modal;
const typeEnum = {
  'project': '项目',
  'supplier': '供应商'
};

const statusObj = {
  0: {
    color: 'rgba(255, 90, 95, 1)',
    text: '已停用'
  },
  1: {
    color: 'rgba(0, 199, 149, 1)',
    text: '进行中'
  },
  2: {
    color: 'rgba(0, 0, 0, 0.25)',
    text: '已完结'
  }
};

@connect(({ session, loading }) => ({
  userInfo: session.userInfo,
  loading: loading.effects['global/project_list'] ||
  loading.effects['global/supplier_list'],
}))
class Product extends React.PureComponent {
  static propsTypes = {
    list: PropTypes.array,
    loading: PropTypes.bool,
    type: PropTypes.string,
    onQuery: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      historyList: [],
      searchName: '',
      searchValue: ''
    };
    this.onQuery = props.onQuery;
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

  onSearch = (e) => {
    this.setState({
      searchName: e
    });
    if (!this.state.searchName) {
      this.setState({
        historyList: JSON.parse(JSON.stringify(this.props.list))
      });
    }
    this.onQuery({ name: e });
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
      type: `global/${this.props.type}_del`,
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
      confirmText = `确认删除该${typeEnum[this.props.type]}吗？`;
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

  // 获得排序结果
  getSort = (list, callback) => {
    const result = this.openTree(list, []);
    // 传给后端数据
    this.props.dispatch({
      type: `global/${this.props.type}_sort`,
      payload: {
        sortList: result
      }
    }).then(() => {
      message.success('排序成功!');
      this.setState({
        searchName: '',
        searchValue: ''
      }, () => {
        this.onQuery({});
      });
      callback();
    });
  }

  setSearchValue = (e) => {
    this.setState({
      searchValue: e.target.value
    });
  }

  onExport = (e) => {
    e.stopPropagation();
    const { type } = this.props;
    window.location.href=`${APP_API}/cost/export/${type}?token=${localStorage.getItem('token')}`;
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

  render() {
    const { loading, list, type } = this.props;
    const { searchName, historyList, searchValue } = this.state;
    let columns = [{
      title: '名称',
      dataIndex: 'name',
      render: (_, record) => (
        <span>
          <span style={{ marginRight: '8px' }}>{record.name}</span>
          {(record.type === 1 && record.status === 0) && <Tag color="red">已停用</Tag>}
        </span>
      )
    },{
      title: '编号',
      dataIndex: 'no',
      width: '120px',
      render: (_, record) => (
        <span>
          <span>{record[`${type}No`]}</span>
        </span>
      )
    }, {
      title: '参与人',
      dataIndex: 'availablePpersonnel',
      width: '120px',
      render: (_, record) => {
        let ele = null;
        if (record.type === 1) {
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
      width: 160,
      render: (_, record) => {
        let ele = null;
        if (record.type === 1) {
          ele = (
            <span>
              <Tooltip placement="topLeft" title={record.note || ''}>
                <span className="eslips-2">{record.note}</span>
              </Tooltip>
            </span>
          );
        } else {
          ele = <span>—</span>;
        }
        return ele;
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: 120,
      className: 'fixCenter',
      render: (_, record) => {
        return (
          <div>
            <a className="deleteColor" disabled={record.children} onClick={() => this.delete(record)}>删除</a>
            <Divider type="vertical" />
            <Setting
              target={type}
              list={list}
              type={record.type === 1 ? 'item' : 'group'}
              onOk={this.onOk}
              detail={record}
            >
              <a>编辑</a>
            </Setting>
          </div>
        );
      },
      fixed: 'right',
    }];
    if (type === 'project') {
      columns = update(columns, {
        $splice: [[2, 0, {
          title: '负责人',
          dataIndex: 'projectManagerName',
          width: '120px',
        }], [4,0,{
          title: '项目期限',
          dataIndex: 'dateRangeStr',
          width: '220px',
        }], [1, 0, {
          title: '项目状态',
          dataIndex: 'projectStatus',
          filterDropdown: () => (
            <div className={style.dropDown}>
              <div>进行中</div>
              <div>已停用</div>
              <div>已完结</div>
            </div>
          ),
          width: '120px',
          render: (_, record) => {
            let ele = null;
            console.log(statusObj[record.projectStatus]);

            if (record.type === 1) {
              ele = (
                <span>
                  <Badge
                    color={statusObj[record.projectStatus] ?
                    statusObj[record.projectStatus].color : 'rgba(255, 90, 95, 1)'}
                    text={statusObj[record.projectStatus] ?
                    statusObj[record.projectStatus].text : '已完结'}
                  />
                </span>
              );
            } else {
              ele = <span>—</span>;
            }
            return ele;
          }
        }]]
      });
    }
    let lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'name',
      name: 'name',
      otherKeys: ['note', 'id', 'userJson', 'deptJson', 'isAllUse', 'type',
      'status', 'sort', 'parentId', 'supplierAccounts', 'supplierNo',
      'projectNo', 'projectManagerName', 'dateRangeStr', 'projectStatus']
    }, list);
    if (searchName) {
      lists = list;
    }
    this.sortData(lists);
    return (
      <div>
        <PageHead title={`${typeEnum[type]}管理`} />
        <div className="content-dt">
          <div className="cnt-header">
            <div className="head_lf">
              <Setting type="item" target={type} list={list} onOk={this.onOk}>
                <Button type="primary" style={{ marginRight: '8px' }}>{`新增${typeEnum[type]}`}</Button>
              </Setting>
              <Setting type="group" target={type} list={list} onOk={this.onOk}>
                <Button style={{ marginRight: '8px' }}>新增分组</Button>
              </Setting>
              <Dropdown
                overlay={(
                  <Menu>
                    <Menu.Item key="2">
                      <BatchImport callback={this.onQuery} type={type}>
                        <span className="pd-20-9 c-black-65">批量导入</span>
                      </BatchImport>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <span className="pd-20-9 c-black-65" onClick={e => this.onExport(e)}>批量导出</span>
                    </Menu.Item>
                  </Menu>
                )}
                overlayClassName="menuBtn"
              >
                <Button className="m-r-8">
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
              <Form style={{ display: 'inline-block' }}>
                <Form.Item>
                  <Search
                    value={searchValue}
                    onChange={this.setSearchValue}
                    placeholder="输入关键字，按回车搜索"
                    style={{ width: '272px' }}
                    onSearch={(e) => this.onSearch(e)}
                  />
                </Form.Item>
              </Form>
            </div>
            <Sort style={{ justifyContent: 'flex-end' }} list={searchName ? historyList : list} callback={this.getSort}>
              <Button>排序</Button>
            </Sort>
          </div>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={lists}
            pagination={false}
            scroll={{
              x: type === 'project' ? '1300px' : null
            }}
          />
        </div>
      </div>
    );
  }
}

export default Product;
