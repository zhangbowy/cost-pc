// 费用标准
import React, { PureComponent } from 'react';
import { Table, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import PageHead from '@/components/pageHead';
import DropBtnList from '../../../components/DropBtnList';
import fields from '../../../utils/fields';
import { objToArr } from '../../../utils/common';

const { chargeType } = fields;
console.log('chargeType', chargeType);

const lists = objToArr(chargeType);
@connect(({ chargeStandard, loading }) => ({
  list: chargeStandard.list,
  query: chargeStandard.query,
  loading: loading.effects['chargeStandard/list'] || false,
}))
class chargeStandard extends PureComponent {

  componentDidMount(){
    this.onQuery({
      pageNo: 1,
      pageSize: 100,
    });
  }

  onHandle = (key, id) => {
    if (!id) {
      this.props.history.push(`/basicSetting/costStandard/${key}`);
    } else {
      this.props.history.push(`/basicSetting/costStandard/${key}_${id}`);
    }
  }

  onQuery = payload => {
    this.props.dispatch({
      type: 'chargeStandard/list',
      payload,
    });
  }

  onDelete = (id) => {
    this.props.dispatch({
      type: 'chargeStandard/del',
      payload: {id}
    }).then(() => {
      this.onQuery({});
    });
  }

  render() {
    const { loading, list } = this.props;
    const columns = [{
      title: '费用标准',
      dataIndex: 'standardName'
    }, {
      title: '标准类型',
      dataIndex: 'standardType',
      render: (text) => (
        <span>{chargeType[text].name}</span>
      )
    }, {
      title: '适用支出类别（费用）',
      dataIndex: 'categoryNameList'
    }, {
      title: '修改时间',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{text ? moment(text).format('YYYY-MM-DD') : '-'}</span>
      )
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (
        <span>{ text ? '启用' : '禁用' }</span>
      )
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="请确认是否删除？"
            onConfirm={() => this.onDelete(record.id)}
          >
            <span className="deleteColor">删除</span>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.onHandle(record.standardType, record.id)}>编辑</a>
        </span>
      )
    }];
    return (
      <div className="mainContainer">
        <PageHead title="费用标准" note="费用标准均只针对报销单" />
        <div className="content-dt">
          <DropBtnList
            btnProps={{
              type: 'primary'
            }}
            list={lists}
            handleClick={this.onHandle}
            params={{
              label: 'name',
              value: 'key'
            }}
            title="新增标准"
          />
          <Table
            pagination={false}
            columns={columns}
            className="m-t-16"
            loading={loading}
            dataSource={list}
          />
        </div>
      </div>
    );
  };
}

export default chargeStandard;
