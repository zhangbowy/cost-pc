import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Button, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import MenuItems from '@/components/AntdComp/MenuItems';
import PageHead from '@/components/pageHead';
import style from './index.scss';
import AddFlow from './components/AddFlow';
import { getArrayValue } from '../../../utils/constants';

const approvePersonList = [{
  key: '0',
  value: '报销单审批流'
}, {
  key: '1',
  value: '借款单审批流'
}, {
  key: '2',
  value: '申请单审批流'
}, {
  key: '3',
  value: '薪资单审批流'
}];
function ApprovalFlow(props) {

  const [status, setStatus] = useState('0');

  useEffect(() => {
    const { userInfo } = props;
    if (userInfo.costConfigCheckVo && userInfo.costConfigCheckVo.version === '个人试用版本') {
      message.error('个人试用版本，钉钉暂不支持该功能的试用，请邀请企业管理员开通试用', 5);
    }
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
      console.log('成功');
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
        {
          !record.isDefault ?
            <>
              <Popconfirm
                title="确认删除吗？"
                onConfirm={() => onDel(record.id)}
              >
                <span className="deleteColor">删除</span>
              </Popconfirm>
            </>
            :
            <span className="delBtn">删除</span>
        }
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
        <Divider type="vertical" />
        <AddFlow
          title="edit"
          templateType={status}
          processPersonId={record.id}
          name={record.templateName}
          onOk={() => onQuery()}
        >
          <a>编辑</a>
        </AddFlow>
      </span>
    ),
    width: '170px',
    className: 'fixCenter'
  }];

  return (
    <div>
      {/* <div className="app_header">
        <p className="app_header_title">审批设置</p>
        <p className="app_header_line">
          { status === '0' ? '默认为你提供了一些模版，你也可以按单据类型自行添加' : '默认为你提供1个审批流模版，你也可以自行添加' }
        </p>
      </div> */}
      <PageHead
        title="审批流设置"
        note={status === '0' ? '默认为你提供了一些模版，你也可以按单据类型自行添加' : '默认为你提供1个审批流模版，你也可以自行添加'}
      />
      <div style={{width: '100%', marginTop: '-8px'}}>
        <MenuItems
          lists={approvePersonList || []}
          onHandle={(val) => onHandle(val)}
          params={{
            key: 'key',
            value:'value'
          }}
          status={status}
          className="p-l-32 titleMenu"
        />
      </div>
      <div className={cs('content-dt', style.approval_cnt)} style={{ height: 'auto', paddingBottom: '32px' }}>
        <div className="m-l-32 m-r-32">
          <AddFlow
            title="add"
            templateType={status}
            onOk={() => onQuery()}
            name={getArrayValue(status, approvePersonList)}
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

export default connect(({ approvalFlow, session }) => ({
  approveList: approvalFlow.approveList,
  userInfo: session.userInfo,
}))(ApprovalFlow);

