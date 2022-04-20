import React from 'react';
import { Tooltip } from 'antd';
// import moment from 'moment';
import fields from '@/utils/fields';
// import { getArrayValue, approveStatus, statusList } from '../../../utils/constants';
// import InvoiceDetail from '../../../components/Modals/InvoiceDetail';
import { defaultMonth } from './components/Search/time';

const times = defaultMonth();
const initMonth = { ...times };
const { projectType } = fields;
console.log('项目角色', projectType);
const annual = [{
  title: (
    <span>
      <span className="m-r-8">环比增长</span>
      <Tooltip title="环比上月/上季度/上年度的增长率">
        <i className="iconfont iconIcon-yuangongshouce fs-16" />
      </Tooltip>
    </span>
  ),
  dataIndex: 'annulus',
  render: (_, record) => (
    <span>
      { record.annulusSymbolType === null && '-' }
      { record.annulusSymbolType !== null &&
      (
        <span className="icons">
          <i className={`iconfont vt-m m-t-2 ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
          <span className="vt-m li-1">{record.annulus}{record.annulusSymbolType === null ? '' : '%'}</span>
        </span>
      )}
    </span>
  ),
  width: 80,
}, {
  title: (
    <span className="icons">
      <span className="m-r-8">同比增长</span>
      <Tooltip title="同比去年同月/同季度/上年度的增长率">
        <i className="iconfont iconIcon-yuangongshouce fs-16" />
      </Tooltip>
    </span>
  ),
  dataIndex: 'yearOnYear',
  width: 80,
  render: (_, record) => (
    <span>
      { record.yearOnYearSymbolType === null && '-' }
      { record.yearOnYearSymbolType !== null &&
      (
        <span className="icons">
          <i className={`iconfont vt-m m-t-2 ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
          <span className="vt-m li-1">{record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}</span>
        </span>
      )}
    </span>
  ),
}];
export default {
  1: {
    query: 'dept',
    actionName: '部门支出',
    actionNum: 2001,
    columns: [{
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.deptName}</span>
      )
    }, ...annual, {
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
      rowKey: 'deptId',
      scroll: { x: '1200px' }
    },
    searchList: [{
      type: 'timeC',
      label: '时间筛选',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      isFixed: true,
      initialValue: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValueStr: initMonth.valueStr,
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
    actionName: '类别支出',
    actionNum: 2002,
    columns: [{
      title: '支出类别',
      dataIndex: 'categoryName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.categoryName}</span>
      )
    }, ...annual, {
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
      rowKey: 'id',
      scroll: { x: '1200px' }
    },
    searchList: [{
      type: 'timeC',
      label: '时间筛选',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValue: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      isFixed: true,
      initialValueStr: initMonth.valueStr,
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
  3: {
    query: 'project',
    actionName: '项目支出',
    actionNum: 2003,
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
      label: '时间筛选',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: -1,
      },
      initialValue: {
        dateType: -1,
      },
      // value: {
      //   dateType: 0,
      //   startTime: initMonth.startTime,
      //   endTime: initMonth.endTime,
      // },
      // initialValue:  {
      //   dateType: 0,
      //   startTime: initMonth.startTime,
      //   endTime: initMonth.endTime,
      // },
      isFixed: true,
      // initialValueStr: initMonth.valueStr,
      // valueStr: initMonth.valueStr,
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
      linkKey: 'queryType',
      out: 1,
    }, { // 搜索部分数据
      type: 'select',
      label: '项目角色',
      placeholder: '请选择',
      key: 'queryType',
      id: 'queryType',
      out: 1,
      options: projectType,
      linkUrl: 'costGlobal/projectList',
      linkKey: 'projectIds',
      fileName: {
        key: 'key',
        name: 'value'
      },
      initialValue: {
        queryType: 0,
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
    actionName: '员工支出',
    actionNum: 2004,
    columns: [{
      title: '姓名',
      dataIndex: 'userName',
      width: 100,
      render: (_, record) => (
        <span style={{fontWeight: record.userId === -1 ? 'bolder' : 'normal'}}>{record.userName}</span>
      )
    }, ...annual, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 100,
    }],
    chartName: 'userName',
    type: 'userIdSelect',
    tableProps: {
      rowKey: 'userId'
    },
    searchList: [{
      type: 'timeC',
      label: '时间筛选',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValue: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValueStr: initMonth.valueStr,
      valueStr: initMonth.valueStr,
    }, {
      type: 'deptAndUser',
      label: '部门/人',
      placeholder: '请选择',
      key: ['userVos', 'deptVos'],
      id: 'userVos',
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
  5: {
    query: 'supplier',
    actionName: '供应商支出',
    actionNum: 2005,
    columns: [{
      title: '供应商',
      dataIndex: 'supplierName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.supplierName}</span>
      )
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 100,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 100,
    }],
    chartName: 'supplierName',
    type: 'supplierId',
    tableProps: {
      rowKey: 'id'
    },
    searchList: [{
      type: 'timeC',
      label: '时间筛选',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValue: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValueStr: initMonth.valueStr,
      isFixed: true,
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
  },
  6: {
    query: 'office',
    actionName: '分公司支出',
    actionNum: 2006,
    columns: [{
      title: '分公司',
      dataIndex: 'officeName',
      width: 150,
      render: (_, record) => (
        <span style={{fontWeight: record.id === -1 ? 'bolder' : 'normal'}}>{record.officeName}</span>
      )
    }, {
      title: '报销人数',
      dataIndex: 'submitUserCountAll',
      width: 80,
    }, {
      title: '明细数',
      dataIndex: 'categoryCountAll',
      width: 80,
    },
    ...annual],
    chartName: 'officeName',
    type: 'officeId',
    tableProps: {
      rowKey: 'id',
      scroll: { x: '1200px' }
    },
    searchList: [{
      type: 'timeC',
      label: '时间筛选',
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValue: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValueStr: initMonth.valueStr,
      isFixed: true,
      valueStr: initMonth.valueStr,
    }, { // 搜索部分数据
      type: 'tree',
      label: '分公司',
      placeholder: '请选择',
      key: 'officeIds',
      id: 'officeIds',
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
