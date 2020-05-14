/**
 * Routes:
 *  - src/components/PrivateRoute
 * auth: AUTHID
 */

import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Form, Input, Table } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
import SortModal from './components/SortModal';
import AddClassify from './components/AddClassfy';
import AddGroup from './components/AddGroup';

const namespace = 'costCategory';
@connect((state) => ({
  loading: state.loading.models[namespace],
  list: state[namespace].list,
  query: state[namespace].query,
}))

class CostCategory extends React.PureComponent {
  static propsTypes = {
    costLists: PropTypes.array,
    query: PropTypes.object,
    loading: PropTypes.bool
  }

  componentDidMount() {
    const { query } = this.props;
    this.onQuery({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
    });
  }

  onQuery = (payload) => {
    this.props.dispatch({
      type: 'costCategory/costList',
      payload,
    });
  }

  render() {
    const {
      list,
      query,
    } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'costName'
    }, {
      title: '图标',
      dataIndex: 'icon',
      render: (_, record) => (
        record.icon ?
        (<img alt="" src={record.icon} />) :
        (<span>-</span>)
      )
    }, {
      title: '描述',
      dataIndex: 'note'
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => (
        <AddClassify detail={record}>
          <a>创建子费用类别</a>
        </AddClassify>
      )
    }];
    return (
      <div className="content-dt">
        <div>
          <div>
            <AddClassify>
              <Button type="primary" style={{marginRight: '8px'}}>新增费用类别</Button>
            </AddClassify>
            <AddGroup>
              <Button style={{marginRight: '8px'}}>新增分组</Button>
            </AddGroup>
            <Form style={{display: 'inline-block'}}>
              <Form.Item>
                <Input
                  placeholder="输入关键字，按回车搜索"
                  suffix={
                    <span className="iconfont " />
                  }
                  style={{ width: '272px' }}
                />
              </Form.Item>
            </Form>
          </div>
          <div style={{float: 'right', marginTop: '-30px'}}>
            <SortModal>
              <span>排序</span>
            </SortModal>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            onChange: (page, pageSize) => {
              this.onQuery({
                pageNo: page,
                pageSize,
              });
            }
          }}
        />
      </div>
    );
  }
};

export default CostCategory;
