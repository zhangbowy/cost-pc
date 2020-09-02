
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Form, Table, message, Modal, Menu, Dropdown, Icon, Divider, Tag, Tooltip } from 'antd';
// import TableBtn from '@/components/TableBtn';
// import { SearchOutlined } from '@ant-design/icons';
import QrCodeModal from '@/components/QrCodeModal';
import treeConvert from '@/utils/treeConvert';
import Search from 'antd/lib/input/Search';
// import SortModal from './components/SortModal';
import AddInvoice from './components/AddInvoice';
import AddGroup from './components/AddGroup';
import JudgeType from './components/JudgeType';

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
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'invoice/approveList',
      payload: {},
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

  render() {
    const {
      list,
      userInfo,
      loading,
    } = this.props;
    let lists = [];
    if (this.state.name) {
      lists = list;
    } else {
      lists = treeConvert({
        rootId: 0,
        pId: 'parentId',
        otherKeys: ['status', 'note', 'type', 'sort', 'templateType'],
      },list);
    }
    const columns = [{
      title: '单据模版名称',
      dataIndex: 'name',
      render: (_, record) => (
        <span>
          <span style={{ marginRight: '8px' }}>{record.name}</span>
          { (record.status === 0) && <Tag color="red">已停用</Tag> }
        </span>
      ),
    }, {
      title: '描述',
      dataIndex: 'note',
      width: 460,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''} arrowPointAtCenter>
            <span className="eslips-2">{text}</span>
          </Tooltip>
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
            <AddInvoice
              title="add"
              data={{parentId: record.id}}
              onOk={() => _this.onOk()}
              templateType={record.templateType}
            >
              <span className="pd-20-9 c-black-65">添加单据模版</span>
            </AddInvoice>
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
              <AddInvoice
                onOk={() => _this.onOk()}
                data={record}
                title="copy"
                templateType={record.templateType}
              >
                <span className="pd-20-9 c-black-65">复制</span>
              </AddInvoice>
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
                <AddGroup data={record} onOk={() => _this.onOk()} title="edit"><a>编辑组</a></AddGroup>
            }
            {
              record.type === 1 &&
                <AddInvoice
                  onOk={() => _this.onOk()}
                  data={record}
                  title="edit"
                  templateType={record.templateType}
                >
                  <a>编辑单据模板</a>
                </AddInvoice>
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
    return (
      <div className="content-dt">
        <div className="cnt-header">
          <div className="head_lf">
            <JudgeType title="add" data={{}} onOk={this.onOk}>
              <Button type="primary" style={{marginRight: '8px'}}>新增单据</Button>
            </JudgeType>
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
        </div>
        <Table
          columns={columns}
          rowKey="id"
          loading={loading}
          dataSource={lists}
          pagination={false}
          defaultExpandAllRows
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
    );
  }
};

export default Invoice;
