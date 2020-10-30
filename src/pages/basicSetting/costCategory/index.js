
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { Button, Form, Table, Modal, message, Menu, Icon, Dropdown, Divider, Tag, Tooltip } from 'antd';
import treeConvert from '@/utils/treeConvert';
import { classifyIcon, getArrayColor } from '@/utils/constants';
import Search from 'antd/lib/input/Search';
// import SortModal from './components/SortModal';
import PageHead from '@/components/PageHead';
import AddClassify from './components/AddClassfy';
import AddGroup from './components/AddGroup';

const namespace = 'costCategory';
const { confirm } = Modal;
@connect((state) => ({
  userInfo: state.session.userInfo,
  loading: state.loading.models[namespace],
  list: state[namespace].list,
  query: state[namespace].query,
}))

class CostCategory extends React.PureComponent {
  static propsTypes = {
    list: PropTypes.array,
    query: PropTypes.object,
    loading: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      costName: '',
    };
  }

  componentDidMount() {
    this.onQuery({});
  }

  onQuery = (payload) => {
    const { userInfo, dispatch } = this.props;
    Object.assign(payload, { companyId: userInfo.companyId || '' });
    dispatch({
      type: 'costCategory/costList',
      payload,
    });
  }

  onOk = () => {
    const { costName } = this.state;
    this.onQuery({
      costName,
    });
  }

  handleVisibleChange = (id) => {
    const _this = this;
    this.props.dispatch({
      type: 'costCategory/delPer',
      payload: {
        id,
      }
    }).then(() => {
      confirm({
        title: '请确认是否删除?',
        content: '删除不能恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.onDelete(id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    });
  }

  onSearch = (val) => {
    this.setState({
      costName: val,
    });
    this.onQuery({
      costName: val,
    });
  }

  onDelete = (id) => {
    const { userInfo } = this.props;
    this.props.dispatch({
      type: 'costCategory/del',
      payload: {
        id,
        companyId: userInfo.companyId || ''
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({});
    });
  }

  render() {
    const {
      list,
      loading
    } = this.props;
    let lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'costName',
      name: 'costName',
      otherKeys: ['icon', 'note', 'type', 'parentId', 'status']
    }, list);
    if (this.state.costName) {
      lists = list;
    }
    const columns = [{
      title: '名称',
      dataIndex: 'costName',
      render: (_, record) => (
        <span>
          <span style={{ marginRight: '8px' }}>{record.costName}</span>
          { (record.status === 0) && <Tag color="red">已停用</Tag> }
        </span>
      ),
    }, {
      title: '图标',
      dataIndex: 'icon',
      render: (_, record) => (
        record.icon ?
        (<i
          className={cs('iconfont', `icon${record.icon}`)}
          style={{
            color: getArrayColor(record.icon, classifyIcon),
            fontSize: '30px',
          }}
        />) :
        (<span>-</span>)
      )
    }, {
      title: '描述',
      dataIndex: 'note',
      width: 360,
      render: (text) => (
        <span>
          {
            text && text.length > 48 ?
              <Tooltip placement="top" title={text || ''}>
                <span className="eslips-2">{text}</span>
              </Tooltip>
              :
              <span className="eslips-2">{text}</span>
          }
        </span>
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: '160px',
      render: (_, record) => {
        const _this = this;
        let btns = [{
          node: (
            <AddGroup
              onOk={() => _this.onOk()}
              title="add"
              data={{parentId: record.id}}
              list={list}
            >
              <span className="pd-20-9 c-black-65">添加子分组</span>
            </AddGroup>
          ),
        }, {
          node: (
            <AddClassify
              title="add"
              data={{parentId: record.id}}
              onOk={() => _this.onOk()}
              list={list}
            >
              <span className="m-l-8 pd-20-9 c-black-65">创建子费用类别</span>
            </AddClassify>
          ),
        }, {
          node: (
            <AddGroup
              data={{
                ...record,
              }}
              title="copy"
              list={list}
              onOk={() => _this.onOk()}
            >
              <span className="m-l-8 pd-20-9 c-black-65">复制</span>
            </AddGroup>
          ),
        }, {
          node: (
            <span
              className="deleteColor m-l-8 pd-20-9"
              onClick={() => _this.handleVisibleChange(record.id)}
            >
              删除
            </span>
          ),
        }];
        if (record.type === 1) {
          btns = [{
            node: (
              <AddClassify
                onOk={() => _this.onOk()}
                data={record}
                title="copy"
                list={list}
              >
                <span className="pd-20-9 c-black-65">复制</span>
              </AddClassify>
            ),
          }, {
            node: (
              <span
                onClick={() => _this.handleVisibleChange(record.id)}
                className="deleteColor pd-20-9"
              >
                删除
              </span>
            ),
          }];
        }
        const menu = (
          <Menu>
            {
              btns.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Menu.Item key={`q_${index}`}>{item.node}</Menu.Item>
              ))
            }
          </Menu>
        );
        return (
          <span>
            {
              record.type === 0 &&
                <AddGroup data={record} onOk={() => _this.onOk()} title="edit" list={list}><a>编辑组</a></AddGroup>
            }
            {
              record.type === 1 &&
                <AddClassify onOk={() => _this.onOk()} data={record} title="edit" list={list}><a>编辑类别</a></AddClassify>
            }
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link m-l-8" onClick={e => e.preventDefault()}>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        );
        // return <TableBtn source={btns} />;
      },
      className: 'fixCenter'
    }];
    return (
      <div>
        <PageHead title="费用类别设置" />
        <div className="content-dt ">
          <div className="cnt-header">
            <div className="head_lf">
              <AddClassify title="add" onOk={() => this.onOk()} list={list}>
                <Button type="primary" style={{marginRight: '8px'}}>新增费用类别</Button>
              </AddClassify>
              <AddGroup onOk={this.onOk} title="add" list={list}>
                <Button style={{marginRight: '8px'}}>新增分组</Button>
              </AddGroup>
              <Form style={{display: 'inline-block'}}>
                <Form.Item>
                  <Search
                    placeholder="输入关键字，按回车搜索"
                    style={{ width: '272px' }}
                    onSearch={(e) => this.onSearch(e)}
                  />
                </Form.Item>
              </Form>
            </div>
            {/* <div style={{float: 'right', marginTop: '-30px'}}>
              <SortModal>
                <span>排序</span>
              </SortModal>
            </div> */}
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
};

export default CostCategory;
