import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import MenuItems from '@/components/AntdComp/MenuItems';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import style from './index.scss';
import AddFlow from './components/AddFlow';

const approvePersonList = [{
  key: '0',
  value: '报销单审批流'
}, {
  key: '1',
  value: '借款单审批流'
}];
function ApprovalFlow(props) {

  const [status, setStatus] = useState('0');

  useEffect(() => {
    props.dispatch({
      type: 'approvalFlow/approvalList',
      payload: {
        templateType: status,
      }
    });
  }, []);
  const onHandle = (val) => {
    setStatus(val);
    props.dispatch({
      type: 'approvalFlow/approvalList',
      payload: {
        templateType: val,
      },
    }).then(() => {
      // const { nodes, detailNode } = props;
      // this.setState({
      //   nodes,
      //   ccPosition: detailNode.ccPosition,
      //   repeatMethods: detailNode.repeatMethod,
      // });
    });
  };

  const onDel = processPersonId => {
    props.dispatch({
      type: 'approvalFlow/del',
      payload: {
        processPersonId
      }
    });
  };

  const columns = [{
    title: '审批流名称',
    dataIndex: 'templateName',
  }, {
    title: '最后修改时间',
    dataIndex: 'updateTime',
    render: (text) => (
      <span>{text && moment(text).format('YYYY-MM-DD hh:mm')}</span>
    )
  }, {
    title: '操作',
    dataIndex: 'operate',
    render: (_, record) => (
      <span>
        <a className="m-r-8">编辑</a>
        {
          !record.isDefault &&
          <span className="deleteColor" onClick={() => onDel(record.id)}>删除</span>
        }
      </span>
    ),
    width: '100px',
    className: 'fixCenter'
  }];

  return (
    <div>
      <div className="app_header">
        <p className="app_header_title">审批设置</p>
        <p className="app_header_line">默认为您提供5种类型的审批流程，您也可以自定义设置审批人</p>
      </div>
      <div className={cs('content-dt', style.approval_cnt)} style={{ height: 'auto' }}>
        <MenuItems
          lists={approvePersonList || []}
          onHandle={(val) => onHandle(val)}
          params={{
            key: 'key',
            value:'value'
          }}
          status={status}
        />
        <div className="m-l-16 m-r-16">
          <AddFlow title="add" templateType={status}>
            <Button type="primary" className="m-t-16 m-b-16">新增</Button>
          </AddFlow>
          <Table
            columns={columns}
            dataSource={props.approveList}
          />
        </div>
      </div>
    </div>
  );
}

ApprovalFlow.propTypes = {
  approveList: PropTypes.array,
};

export default connect(({ approvalFlow }) => ({
  approveList: approvalFlow.approveList,
}))(ApprovalFlow);

