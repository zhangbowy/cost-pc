import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import MenuItems from '@/components/AntdComp/MenuItems';
import { Table, Button, Divider, Popconfirm, message } from 'antd';
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

  const onQuery = () => {
    props.dispatch({
      type: 'approvalFlow/approvalList',
      payload: {
        templateType: status,
      }
    });
  };

  const onDel = processPersonId => {
    props.dispatch({
      type: 'approvalFlow/del',
      payload: {
        processPersonId
      }
    }).then(() => {
      message.success('删除成功');
      onQuery();
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
        <AddFlow
          title="edit"
          templateType={status}
          processPersonId={record.id}
          name={record.templateName}
          onOk={() => onQuery()}
        >
          <a>编辑</a>
        </AddFlow>
        <Divider type="vertical" />
        <AddFlow
          title="copy"
          templateType={status}
          processPersonId={record.id}
          name={record.templateName}
          onOk={() => onQuery()}
        >
          <a>复制</a>
        </AddFlow>
        {
          !record.isDefault &&
          <>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除吗？"
              onConfirm={() => onDel(record.id)}
            >
              <span className="deleteColor">删除</span>
            </Popconfirm>
          </>
        }
      </span>
    ),
    width: '170px',
    className: 'fixCenter'
  }];

  return (
    <div>
      <div className="app_header">
        <p className="app_header_title">审批设置</p>
        <p className="app_header_line">
          { status === '0' ? '默认为您提供了一些模版，您也可以按单据类型自行添加' : '默认为您提供2个审批流模版，您也可以自行添加' }
        </p>
      </div>
      <div className={cs('content-dt', style.approval_cnt)} style={{ height: 'auto', paddingBottom: '32px' }}>
        <MenuItems
          lists={approvePersonList || []}
          onHandle={(val) => onHandle(val)}
          params={{
            key: 'key',
            value:'value'
          }}
          status={status}
        />
        <div className="m-l-32 m-r-32">
          <AddFlow
            title="add"
            templateType={status}
            onOk={() => onQuery()}
            name={Number(status) ? '借款审批流' : '报销审批流'}
          >
            <Button type="primary" className="m-t-16 m-b-16">新增</Button>
          </AddFlow>
          <Table
            columns={columns}
            dataSource={props.approveList}
            pagination={false}
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

