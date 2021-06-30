import React from 'react';
import { Tooltip, Badge } from 'antd';
import moment from 'moment';
import { getArrayValue, invoiceStatus, approveStatus } from '../../../utils/constants';
import InvoiceDetail from '../../../components/Modals/InvoiceDetail';

export default {
  '0': {
    query: 'detail',
    columns: [{
      title: '支出类别',
      dataIndex: 'categoryName',
      width: 100,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <span className="eslips-2">{text}</span>
          </Tooltip>
        </span>
      ),
    }, {
      title: '金额（元）',
      dataIndex: 'submitSum',
      render: (text) => (
        <span>{text ? text/100 : 0}</span>
      ),
      width: 100,
    }, {
      title: '报销事由',
      dataIndex: 'reason',
      width: 150,
      render: (text) => (
        <span>
          <Tooltip placement="topLeft" title={text || ''}>
            <a className="eslips-2">{text}</a>
          </Tooltip>
        </span>
      ),
    }, {
      title: '承担人',
      dataIndex: 'userName',
      width: 130,
    }, {
      title: '承担部门',
      dataIndex: 'deptName',
      width: 150,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '审核通过时间',
      dataIndex: 'approveTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '付款时间',
      dataIndex: 'payTime',
      render: (text) => (
        <span>{ text && moment(text).format('YYYY-MM-DD') }</span>
      ),
      width: 120,
    }, {
      title: '提交人',
      dataIndex: 'createUserName',
      width: 100,
    }, {
      title: '提交人部门',
      dataIndex: 'createDeptName',
      width: 150,
    }, {
      title: '项目',
      dataIndex: 'projectName',
      width: 130,
      ellipsis: true,
      textWrap: 'word-break',
      record: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '供应商',
      dataIndex: 'supplierAccountName',
      width: 130,
      ellipsis: true,
      textWrap: 'word-break',
    }, {
      title: '单据类型',
      dataIndex: 'invoiceTemplateName',
      width: 100,
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }, {
      title: '单号',
      dataIndex: 'invoiceNo',
      width: 140,
    }, {
      title: '发放人',
      dataIndex: 'payUserName',
      width: 100,
    }, {
      title: '审批状态',
      dataIndex: 'approveStatus',
      render: (text) => (
        <span>{getArrayValue(text, approveStatus)}</span>
      ),
      width: 100,
    }, {
      title: '单据状态',
      dataIndex: 'status',
      render: (text) => (
        <span>
          {
            (Number(text) === 2 )|| (Number(text) === 3) ?
              <Badge
                color={Number(text) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                text={getArrayValue(text, invoiceStatus)}
              />
            :
              <span>{getArrayValue(text, invoiceStatus)}</span>
          }
        </span>
      ),
      width: 110,
      fixed: 'right',
      filters: [
        { text: '已发放', value: '1' },
        { text: '待发放', value: '3' }
      ],
    },{
      title: '操作',
      dataIndex: 'ope',
      render: (_, record) => (
        <span>
          <InvoiceDetail
            id={record.invoiceSubmitId}
            templateType={0}
          >
            <a>查看</a>
          </InvoiceDetail>
        </span>
      ),
      width: 80,
      fixed: 'right',
      className: 'fixCenter'
    }],
    tableProps: {
      scroll: { x: 3000 },
      rowKey: 'id'
    },
    searchList: [{ // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }, {
      type: 'inSector',
      label: '金额',
      placeholder: ['请输入', '请输入'],
      key: ['up', 'down'],
      id: 'price',
    }, {
      type: 'deptAndUser',
      label: '承担部门/人',
      placeholder: '请选择',
      key: ['userVOS', 'deptVOS'],
      id: 'user',
      out: 1,
    }, {
      type: 'rangeTime',
      label: '提交时间',
      placeholder: '请选择',
      key: ['submitStartTime', 'submitEndTime'],
      id: 'submitStartTime',
    }, {
      type: 'rangeTime',
      label: '审核通过时间',
      placeholder: '请选择',
      key: ['approveStartTime', 'approveEndTime'],
      id: 'approveStartTime',
      out: 1,
    }, {
      type: 'rangeTime',
      label: '付款时间',
      placeholder: '请选择',
      key: ['payStartTime', 'payEndTime'],
      id: 'payStartTime'
    }, {
      type: 'select',
      label: '单据状态',
      placeholder: '请选择',
      key: 'status',
      id: 'status'
    }, {
      type: 'deptAndUser',
      label: '提交部门/人',
      placeholder: '请选择',
      key: ['createUserVOS', 'createDeptVOS'],
      id: 'createUserVOS',
    }, {
      type: 'select',
      label: '单据类型',
      placeholder: '请选择',
      key: 'invoiceTemplateIds',
      id: 'invoiceTemplateIds',
    }, {
      type: 'tree',
      label: '项目',
      placeholder: '请选择',
      key: 'projectIds',
      id: 'projectIds',
    }, {
      type: 'tree',
      label: '供应商',
      placeholder: '请选择',
      key: 'supplierId',
      id: 'supplierId',
    }, {
      type: 'timeC',
      label: '选择月份',
      placeholder: '单号、事由、收款人',
      key: 'content',
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
      }
    }, {
      type: 'search',
      label: '外部选择',
      placeholder: '单号、事由、收款人',
      key: 'content',
      id: 'content',
      out: 1,
    }]
  },
  1: {
    query: 'dept',
    columns: [{
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
      )
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }],
    chartName: 'deptName',
    type: 'dept',
    tableProps: {
      rowKey: 'id'
    },
  },
  2: {
    query: 'dept',
    columns: [{
      title: '支出类别',
      dataIndex: 'categoryName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.categoryName}</span>
      )
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }],
    chartName: 'categoryName',
    type: 'classify',
    tableProps: {
      rowKey: 'id'
    }
  },
  3: {
    query: 'dept',
    columns: [{
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'submitSumAll',
      render: (_, record) => (
        <a>
          {record.submitSumAll ? (record.submitSumAll).toFixed(2) : 0}
          { record.submitSum && record.id !== -1 && record.children
           && record.children.length ?  `（本部${(record.submitSum).toFixed(2)}）` : ''}
        </a>
      ),
      className: 'moneyCol',
      width: 160,
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }],
    chartName: 'deptName',
    type: 'dept',
    tableProps: {
      rowKey: 'id'
    }
  },
  4: {
    query: 'dept',
    columns: [{
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'submitSumAll',
      render: (_, record) => (
        <a>
          {record.submitSumAll ? (record.submitSumAll).toFixed(2) : 0}
          { record.submitSum && record.id !== -1 && record.children
           && record.children.length ?  `（本部${(record.submitSum).toFixed(2)}）` : ''}
        </a>
      ),
      className: 'moneyCol',
      width: 160,
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }],
    chartName: 'deptName',
    type: 'dept',
    tableProps: {
      rowKey: 'id'
    }
  },
  5: {
    query: 'dept',
    columns: [{
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
      )
    }, {
      title: '金额（元）',
      dataIndex: 'submitSumAll',
      render: (_, record) => (
        <a>
          {record.submitSumAll ? (record.submitSumAll).toFixed(2) : 0}
          { record.submitSum && record.id !== -1 && record.children
           && record.children.length ?  `（本部${(record.submitSum).toFixed(2)}）` : ''}
        </a>
      ),
      className: 'moneyCol',
      width: 160,
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 70,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 70,
    }],
    chartName: 'deptName',
    type: 'dept',
    tableProps: {
      rowKey: 'id'
    }
  }
};
