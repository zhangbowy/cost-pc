
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { Button, Form, Table, Modal, message, Menu, Icon, Dropdown, Divider, Tag, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import treeConvert from '@/utils/treeConvert';
import { classifyIcon, getArrayColor } from '@/utils/constants';
// import SortModal from './components/SortModal';
import PageHead from '@/components/pageHead';
// import AddClassify from './components/AddClassfy';
import AddGroup from './components/AddGroup';
import JudgeType from './components/JudgeType';
import Tags from '../../../components/Tags';
import Sort from '../../../components/TreeSort';
import MenuItems from '../../../components/AntdComp/MenuItems';

const namespace = 'costCategory';
const { confirm } = Modal;
const menuList = [{
  key: '0',
  value: '支出类别'
}, {
  key: '1',
  value: '收入类别'
}];
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
      typeVisible: false,
      type: localStorage.getItem('costItem') || '0',
    };
  }

  componentDidMount() {
    localStorage.removeItem('costItem');
    this.onQuery({});
  }

  onQuery = (payload) => {
    const { userInfo, dispatch } = this.props;
    const { type } = this.state;
    Object.assign(payload, { companyId: userInfo.companyId || '' });
    const url = type === '0' ? 'costCategory/costList' : 'costCategory/incomeList';
    dispatch({
      type: url,
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
    const { type } = this.state;
    this.props.dispatch({
      type: 'costCategory/delPer',
      payload: {
        id,
        costType: type,
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

  onAddCategory = (id) => {
    const { type } = this.state;
    localStorage.removeItem('costItem');
    localStorage.setItem('costItem', type);
    this.props.history.push(`/basicSetting/costCategory/${id}`);
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
    const { type } = this.state;
    this.props.dispatch({
      type: 'costCategory/del',
      payload: {
        costType: type,
        id,
        companyId: userInfo.companyId || ''
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({});
    });
  }

  changeVisible = () => {
    this.setState({
      typeVisible: false,
    });
  }

  // 获得排序结果
  getSort = (list, callback) => {
    const result = this.openTree(list, []);
    const { type } = this.state;
    // 传给后端数据
    this.props.dispatch({
      type: type === '0' ? 'costCategory/sort' : 'costCategory/incomeSort',
      payload: {
        sortList: result,
        type: 1,
      }
    }).then(() => {
      message.success('排序成功!');
      this.setState({
        costName: '',
      }, () => {
        this.onQuery({});
      });
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

  onHandle = (val) => {
    this.setState({
      type: val,
    }, () => {
      this.onQuery({});
    });
  }

  render() {
    const {
      list,
      loading,
      userInfo,
    } = this.props;
    const newArrs = list.map(it => ({ ...it, name: it.costName}));
    const { typeVisible , type} = this.state;
    let lists = treeConvert({
      rootId: 0,
      pId: 'parentId',
      tName: 'costName',
      name: 'costName',
      otherKeys: ['icon', 'note', 'type', 'parentId', 'status', 'attribute', 'sort']
    }, list);
    if (this.state.costName) {
      lists = list;
    }
    this.sortData(lists);
    const columns = [{
      title: '名称',
      dataIndex: 'costName',
      ellipsis: true,
      textWrap: 'word-break',
      render: (_, record) => (
        <span>
          <span style={{ marginRight: '8px' }}>{record.costName}</span>
          { (record.status === 0) && <Tag color="red">已停用</Tag> }
          {
            (record.type === 0 || record.parentId === 0) &&
            (Number(record.attribute) === 0) &&
            <Tags color='rgba(0, 199, 149, 0.08)'>
              费用
            </Tags>
          }
          {
            (record.type === 0 || record.parentId === 0)
            && (record.attribute === 1) &&
            <Tags color='#FFF1F0'>
              成本
            </Tags>
          }
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
            color: getArrayColor(record.icon, classifyIcon[type]),
            fontSize: '30px',
          }}
        />) :
        (<span>-</span>)
      ),
      width: 100
    }, {
      title: '描述',
      dataIndex: 'note',
      width: 460,
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
      width: '170px',
      render: (_, record) => {
        const _this = this;
        let btns = [{
          node: (
            <AddGroup
              onOk={() => _this.onOk()}
              title="add"
              data={{parentId: record.id}}
              list={list}
              type={type}
            >
              <span className="pd-20-9 c-black-65">添加子分组</span>
            </AddGroup>
          ),
        }, {
          node: (
            <span
              className="m-l-8 pd-20-9 c-black-65"
              onClick={() => this.onAddCategory(`child_${record.id}_${record.attribute}`)}
            >
              创建子类别
            </span>
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
              type={type}
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
              <span
                className="pd-20-9 c-black-65"
                onClick={() => this.onAddCategory(`copy_${record.id}_${record.attribute}`)}
              >
                复制
              </span>
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
                <AddGroup
                  data={record}
                  onOk={() => _this.onOk()}
                  title="edit"
                  list={list}
                  type={type}
                >
                  <a style={{ width: '60px', display: 'inline-block', textAlign: 'right', marginRight: '8px' }}>编辑组</a>
                </AddGroup>
            }
            {
              record.type === 1 &&
                <a
                  style={{ width: '60px', display: 'inline-block', textAlign: 'right', marginRight: '8px' }}
                  onClick={() => this.onAddCategory(`edit_${record.id}_${record.attribute}`)}
                >编辑类别
                </a>
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
      <div className="mainContainer">
        <PageHead title="支出类别设置" />
        {
          !!(userInfo.orderItemLevel) &&
          <div style={{width: '100%', marginTop: '-8px'}}>
            <MenuItems
              lists={menuList || []}
              onHandle={(val) => this.onHandle(val)}
              params={{
                key: 'key',
                value:'value'
              }}
              className="p-l-32 titleMenu"
              status={type}
            />
          </div>
        }
        <div className="content-dt ">
          <div className="cnt-header">
            <div className="head_lf">
              {
                type === '0' ?
                  <JudgeType
                    title="add"
                    data={{}}
                    onOk={this.onOk}
                    visible={typeVisible}
                    changeVisible={this.changeVisible}
                    linkInvoice={this.onAddCategory}
                  >
                    <Button type="primary" style={{marginRight: '8px'}}>新增支出类别</Button>
                  </JudgeType>
                  :
                  <Button type="primary" style={{marginRight: '8px'}} onClick={() => this.onAddCategory('add')}>新增收入类别</Button>
              }

              <AddGroup onOk={this.onOk} title="add" list={list} type={type}>
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
            <div>
              <Sort list={newArrs} callback={this.getSort} title={`${menuList[type].value}排序`}>
                <div style={{display: 'flex', alignItems: 'center', height: '32px'}} className="head_rf sub-color">
                  <i className="iconfont iconpaixu m-r-8" />
                  <span>类别排序</span>
                </div>
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
};

export default CostCategory;
