import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import fields from '@/utils/fields';
import { getArrayValue, approveStatus, statusList } from '../../../utils/constants';
import InvoiceDetail from '../../../components/Modals/InvoiceDetail';
import { defaultMonth } from './components/Search/time';

const times = defaultMonth();
const initMonth = { ...times };
const statusTime = localStorage.getItem('statisticalDimension') === 'undefined' ? 0 : localStorage.getItem('statisticalDimension');
const staticsObj = {
  0: {
    name: '提交时间',
  },
  1: {
    name: '审核通过时间'
  },
  2: {
    name: '发生日期'
  }
};
const { projectType } = fields;
console.log('项目角色', projectType);
export default {
  '0': {
    query: 'detail',
    columns: [{
      title: '支出类别',
      dataIndex: 'categoryName',
      ellipsis: true,
      textWrap: 'word-break',
      width: 100,
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          {text}
        </Tooltip>
      )
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
        <InvoiceDetail
          id={record.invoiceSubmitId}
          templateType={record.templateType}
        >
          <Tooltip placement="topLeft" title={record.reason || ''}>
            <a className="eslips-1">{record.reason}</a>
          </Tooltip>
        </InvoiceDetail>
      )
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
      key: ['minSum', 'maxSum'],
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
      key: ['startTime', 'endTime'],
      id: 'startTime',
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
      key: 'statusList',
      id: 'statusList',
      options: statusList,
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
    }, {
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
              <i className={`iconfont ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.annulus}{record.annulusSymbolType === null ? '' : '%'}
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
              <i className={`iconfont ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}
            </span>
          )}
        </span>
      ),
    }],
    chartName: 'deptName',
    type: 'deptId',
    tableProps: {
      rowKey: 'id',
      scroll: { x: '1200px' }
    },
    searchList: [{
      type: 'timeC',
      label: staticsObj[statusTime].name,
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
      label: '承担部门',
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
    }, {
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
              <i className={`iconfont ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.annulus}{record.annulusSymbolType === null ? '' : '%'}
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
              <i className={`iconfont ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}
            </span>
          )}
        </span>
      ),
    }],
    chartName: 'categoryName',
    type: 'categoryId',
    tableProps: {
      rowKey: 'id',
      scroll: { x: '1200px' }
    },
    searchList: [{
      type: 'timeC',
      label: staticsObj[statusTime].name,
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
      label: '承担部门',
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
      label: staticsObj[statusTime].name,
      placeholder: '单号、事由、收款人',
      key: ['startTime', 'endTime'],
      id: 'timeC',
      out: 1,
      value: {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      initialValue:  {
        dateType: 0,
        startTime: initMonth.startTime,
        endTime: initMonth.endTime,
      },
      isFixed: true,
      initialValueStr: initMonth.valueStr,
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
    columns: [{
      title: '姓名',
      dataIndex: 'userName',
      width: 100,
      render: (_, record) => (
        <span style={{fontWeight: record.userId === -1 ? 'bolder' : 'normal'}}>{record.userName}</span>
      )
    }, {
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
              <i className={`iconfont ${ record.annulusSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.annulus}{record.annulusSymbolType === null ? '' : '%'}
            </span>
          )}
        </span>
      ),
      width: 100,
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
      width: 100,
      render: (_, record) => (
        <span>
          { record.yearOnYearSymbolType === null && '-' }
          { record.yearOnYearSymbolType !== null &&
          (
            <span className="icons">
              <i className={`iconfont ${ record.yearOnYearSymbolType ? 'iconxiajiang' : 'iconshangsheng' }`} />
              {record.yearOnYear}{record.yearOnYearSymbolType === null ? '' : '%'}
            </span>
          )}
        </span>
      ),
    }, {
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
      label: staticsObj[statusTime].name,
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
      label: '承担部门/人',
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
      label: staticsObj[statusTime].name,
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
  }
};
