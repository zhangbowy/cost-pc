import React from 'react';
import { Tooltip, Badge } from 'antd';
import moment from 'moment';
import { projectType } from '@/utils/fields';
import { getArrayValue, invoiceStatus, approveStatus } from '../../../utils/constants';
import InvoiceDetail from '../../../components/Modals/InvoiceDetail';
import { defaultMonth } from './components/Search/time';

const times = defaultMonth();
const initMonth = { ...times };
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
      render: (_, record) => (
        <span>
          <InvoiceDetail
            id={record.invoiceSubmitId}
            templateType={0}
          >
            <Tooltip placement="topLeft" title={record.reason || ''}>
              <a className="eslips-2">{record.reason}</a>
            </Tooltip>
          </InvoiceDetail>
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
      render: (_, record) => {
        const { status } = record;
        return (
          <span>
            {
              (Number(status) === 2 )|| (Number(status) === 3) ?
                <Badge
                  color={Number(status) === 2 ? 'rgba(255, 148, 62, 1)' : 'rgba(0, 0, 0, 0.25)'}
                  text={getArrayValue(status, invoiceStatus)}
                />
              :
                <span>{getArrayValue(status, invoiceStatus)}</span>
            }
          </span>
        );
      },
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
      id: 'status',
      options: invoiceStatus,
      fileName: {
        key: 'key',
        name: 'value'
      }
    }, {
      type: 'deptAndUser',
      label: '提交部门/人',
      placeholder: '请选择',
      key: ['createUserVOS', 'createDeptVOS'],
      id: 'createUserVOS',
    }, {
      type: 'tree',
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
      key: 'supplierIds',
      id: 'supplierId',
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
    type: 'deptId',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '选择月份',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      valueStr: initMonth.valueStr,
    }, {
      type: 'dept',
      label: '部门',
      placeholder: '请选择',
      key: 'deptVos',
      id: 'deptVos',
      out: 1,
    }, { // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }]
  },
  2: {
    query: 'classify',
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
    type: 'categoryId',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '选择月份',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      valueStr: initMonth.valueStr,
    }, {
      type: 'dept',
      label: '部门',
      placeholder: '请选择',
      key: 'deptVos',
      id: 'deptVos',
      out: 1,
    }, { // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }, {
      type: 'rangeTime',
      label: '发生日期',
      placeholder: '请选择',
      key: ['repayStartTime', 'endTime'],
      id: 'submitStartTime',
      out: 1,
    }]
  },
  3: {
    query: 'project',
    columns: [{
      title: '项目',
      dataIndex: 'projectName',
      width: 100,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.projectName}</span>
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
    chartName: 'projectName',
    type: 'projectId',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '选择月份',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      valueStr: initMonth.valueStr,
    }, {
      type: 'deptAndUser',
      label: '提交部门/人',
      placeholder: '请选择',
      key: ['createUserVOS', 'createDeptVOS'],
      id: 'createUserVOS',
    }, { // 搜索部分数据
      type: 'tree',
      label: '项目',
      placeholder: '请选择',
      key: 'projectIds',
      id: 'projectIds',
      out: 1,
    }, { // 搜索部分数据
      type: 'select',
      label: '项目角色',
      placeholder: '请选择',
      key: 'queryType',
      id: 'queryType',
      out: 1,
      options: projectType,
      fileName: {
        key: 'key',
        name: 'value'
      },
      value: {
        queryType: 0,
      },
    }, { // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }]
  },
  4: {
    query: 'people',
    columns: [{
      title: '姓名',
      dataIndex: 'userName',
      width: 80,
      render: (_, record) => (
        <span style={{fontWeight: record.userId === -1 ? 'bolder' : 'normal'}}>{record.userName}</span>
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
    chartName: 'userName',
    type: 'id',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '选择月份',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      valueStr: initMonth.valueStr,
    }, {
      type: 'deptAndUser',
      label: '承担部门/人',
      placeholder: '请选择',
      key: ['createUserVOS', 'createDeptVOS'],
      id: 'createUserVOS',
    }, { // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }]
  },
  5: {
    query: 'supplier',
    columns: [{
      title: '供应商',
      dataIndex: 'supplierName',
      width: 80,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.supplierName}</span>
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
    chartName: 'supplierName',
    type: 'supplierId',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '选择月份',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      valueStr: initMonth.valueStr,
    }, { // 搜索部分数据
      type: 'tree',
      label: '供应商',
      placeholder: '请选择',
      key: 'supplierIds',
      id: 'supplierIds',
      out: 1,
    }, { // 搜索部分数据
      type: 'tree',
      label: '支出类别',
      placeholder: '请选择',
      key: 'categoryIds',
      id: 'categoryIds',
      out: 1,
    }]
  }
};
