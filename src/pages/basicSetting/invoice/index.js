
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Form, Table, message, Modal, Menu, Dropdown, Icon, Divider, Tag } from 'antd';
// import TableBtn from '@/components/TableBtn';
// import { SearchOutlined } from '@ant-design/icons';
import Search from 'antd/lib/input/Search';
import QrCodeModal from '@/components/QrCodeModal';
import treeConvert from '@/utils/treeConvert';
// import SortModal from './components/SortModal';
import PageHead from '@/components/pageHead';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
// import AddInvoice from './components/AddInvoice';
import AddGroup from './components/AddGroup';
import JudgeType from './components/JudgeType';
// import Tags from '../../../components/Tags';
import Sort from '../../../components/TreeSort';
import { invoiceType } from '../../../utils/constants';


const namespace = 'invoice';
const { confirm } = Modal;
@connect(({ session, invoice, loading }) => ({
  loading: loading.models[namespace],
  list: invoice.list,
  check: invoice.check,
  userInfo: session.userInfo
}))

class Invoice extends React.PureComponent {
  static propsTypes = {
    costLists: PropTypes.array,
    loading: PropTypes.bool
  }

  state = {
    name: '',
    typeVisible: false,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'invoice/approveList',
      payload: {
        isAuth: true,
      },
    });
    this.onQuery({});
  }

  onOk = () => {
    const { name } = this.state;
    this.onQuery({name});
  }

  handleVisibleChange = (id) => {
    const _this = this;
    this.props.dispatch({
      type: 'invoice/delPer',
      payload: {
        id,
      }
    }).then(() => {
      if (this.props.check && this.props.check.isCheckDel) {
        confirm({
          title: '请确认是否删除?',
          content: this.props.check.msg || '删除不能恢复',
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
      } else {
        message.error(this.props.check && this.props.check.msg);
      }
    });
  }

  onSearch = (val) => {
    this.setState({
      name: val,
    });
    this.onQuery({
      name: val,
    });
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'invoice/del',
      payload: {
        id,
      }
    }).then(() => {
      message.success('删除成功');
      this.onQuery({});
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'invoice/list',
      payload,
    });
  }

  changeVisible = () => {
    this.setState({
      typeVisible: false,
    });
  }

  onAddCategory = (id) => {
    this.props.history.push(`/basicSetting/invoice/${id}`);
  }

  // 获得排序结果
  getSort = (list, callback) => {
    const result = this.openTree(list, []);
    // 传给后端数据
    this.props.dispatch({
      type: 'invoice/sort',
      payload: {
        sortList: result
      }
    }).then(() => {
      message.success('排序成功!');
      this.setState({
        name: '',
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

  render() {
    const {
      list,
      userInfo,
      loading,
    } = this.props;
    const { typeVisible } = this.state;
    let lists = [];
    if (this.state.name) {
      lists = list;
    } else {
      lists = treeConvert({
        rootId: 0,
        pId: 'parentId',
        otherKeys: ['status', 'note', 'type', 'sort', 'templateType', 'parentId', 'sort', 'isAlitrip'],
      },list);
    }
    this.sortData(lists);
    const columns = [{
      title: '单据模版名称',
      dataIndex: 'name',
      render: (_, record) => (
        <span>
          <span>{record.name}</span>
          { (record.status === 0) && <Tag color="red" className="m-l-8">已停用</Tag> }
          {
            record.isAlitrip &&
            <img src={aliLogo} alt="阿里商旅" style={{ width: '18px', height: '18px',marginLeft: '8px' }} />
          }
        </span>
      ),
    }, {
      title: '类型',
      dataIndex: 'templateType',
      render: (_, record) => (
        <span>
          {invoiceType[record.templateType].name}
        </span>
      ),
    },{
      title: '描述',
      dataIndex: 'note',
      width: 460,
      render: (text) => (
        <span>
          <span className="eslips-2">{text}</span>
        </span>
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: '200px',
      render: (_, record) => {
        const _this = this;
        let btns = [{
          node: (
            <span
              className="pd-20-9 c-black-65"
              onClick={() => this.onAddCategory(`${record.id}_${record.templateType}_child`)}
            >
              添加单据模版
            </span>
          ),
        }, {
          node: (
            <AddGroup
              data={record}
              title="copy"
              onOk={() => _this.onOk()}
            >
              <span className="pd-20-9 c-black-65">复制</span>
            </AddGroup>
          ),
        }, {
          node: (
            <span
              className="deleteColor pd-20-9"
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
                onClick={() => this.onAddCategory(`${record.id}_${record.templateType}_copy`)}
              >
                复制
              </span>
            ),
          }, {
            node: (
              <QrCodeModal
                userInfo={userInfo}
                id={record.id}
                name={record.name}
              >
                <span className="pd-20-9 c-black-65">下载提报二维码</span>
              </QrCodeModal>
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
                <AddGroup data={record} onOk={() => _this.onOk()} title="edit">
                  <a style={{ width: '90px', display: 'inline-block', textAlign: 'right', marginRight: '8px' }}>编辑组</a>
                </AddGroup>
            }
            {
              record.type === 1 &&
                <a
                  style={{ width: '90px', display: 'inline-block', textAlign: 'right', marginRight: '8px' }}
                  onClick={() => this.onAddCategory(`${record.id}_${record.templateType}`)}
                >
                  编辑单据模板
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
      },
      className: 'fixCenter'
    }];
    const btnList = [{
      node: (
        <JudgeType
          title="add"
          data={{}}
          type={0}
          onOk={this.onOk}
          visible={typeVisible}
          changeVisible={this.changeVisible}
          linkInvoice={this.onAddCategory}
        >
          <span>支出类</span>
        </JudgeType>
      )
    }, {
      node: (
        <JudgeType
          title="add"
          type={20}
          data={{}}
          onOk={this.onOk}
          visible={typeVisible}
          changeVisible={this.changeVisible}
          linkInvoice={this.onAddCategory}
        >
          <span>收入类</span>
        </JudgeType>
      )
    }];
    const menuList = (
      <Menu>
        {
          btnList.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Menu.Item key={`q_${index}`}>{item.node}</Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <div className="mainContainer">
        <PageHead title="单据模板设置" />
        <div className="content-dt">
          <div className="cnt-header">
            <div className="head_lf">
              <Dropdown overlay={menuList}>
                <Button type="primary" style={{marginRight: '8px'}}>新增单据模板</Button>
              </Dropdown>
              <AddGroup title="add" onOk={this.onOk}>
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
              <Sort list={list} callback={this.getSort}>
                <Button type="default">排序</Button>
              </Sort>
            </div>
          </div>
          <Table
            columns={columns}
            rowKey="id"
            loading={loading}
            dataSource={lists}
            pagination={false}
            defaultExpandAllRows
            scroll={{ y: '600px' }}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <i className="iconfont iconenter" onClick={e => onExpand(record, e)} />
              ) : (
                <i className="iconfont icondown" onClick={e => onExpand(record, e)} />
              )
            }}
          />
        </div>
      </div>
    );
  }
};

export default Invoice;
