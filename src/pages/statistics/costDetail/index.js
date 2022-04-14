/* eslint-disable eqeqeq */
import React from 'react';
import {
  Table,
  Form,
  Icon,
  Button,
  Tooltip,
  message,
  Dropdown,
  Menu,
  Badge,
  Divider,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import { formItemLayout } from '@/utils/constants';
// import Search from 'antd/lib/input/Search';
import update from 'immutability-helper';
import InvoiceDetail from '@/components/Modals/InvoiceDetail';
import { rowSelect } from '@/utils/common';
// import { JsonParse } from '@/utils/common';
import constants, { getArrayValue, approveStatus } from '@/utils/constants';
import treeConvert from '@/utils/treeConvert';
// import DropBtn from '@/components/DropBtn';
import aliLogo from '@/assets/img/aliTrip/aliLogo.png';
import TableTemplate from '@/components/Modals/TableTemplate';
import style from './index.scss';
import { ddOpenLink } from '../../../utils/ddApi';
import SearchBanner from '../overview/components/Search/Searchs';
import {
  statusList,
  invoiceStatus,
  getArrayColor
} from '../../../utils/constants';
import ChangeDate from './component/ChangeDate';
import ImportModal from '@/components/ImportModal';
import MessageTip from './component/MessageTip';
import xzcLogo from '@/assets/img/aliTrip/xzcLogo.png';
import znxcLogo from '@/assets/img/aliTrip/znxcLogo.png';

const { APP_API } = constants;
const objStatus = {
  2: {
    name: '待发放'
  },
  3: {
    name: '已发放'
  }
};
const staticsObj = {
  0: {
    name: '提交时间',
    key: 'startTime'
  },
  1: {
    name: '审核通过时间',
    key: 'approveStartTime'
  },
  2: {
    name: '发生日期',
    key: 'happenStartTime'
  }
};
@Form.create()
@connect(({ loading, costDetail, costGlobal, global, session }) => ({
  loading: loading.effects['costDetail/list'] || false,
  list: costDetail.list,
  query: costDetail.query,
  total: costDetail.total,
  sum: costDetail.sum,
  recordPage: costDetail.recordPage,
  recordList: costDetail.recordList,
  costCategoryList: global.costCategoryList,
  invoiceList: global.invoiceList,
  projectList: costGlobal.projectList,
  supplierList: global.supplierList,
  userInfo: session.userInfo,
  uploadRes: global.uploadRes,
  officeListAndRole: costGlobal.officeListAndRole,
  historyImportStatus: costGlobal.historyImportStatus,
  loadingImportant: loading.effects['costGlobal/historyImport'] || false,
}))
class Statistics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      count: 0,
      sumAmount: 0,
      searchContent: '',
      leSearch: {},
      selectedRows: [],
      searchList: [
        {
          // 搜索部分数据
          type: 'tree',
          label: '支出类别',
          placeholder: '请选择',
          key: 'categoryIds',
          id: 'categoryIds',
          out: 1
        },
        {
          type: 'inSector',
          label: '金额',
          placeholder: ['请输入', '请输入'],
          key: ['minSum', 'maxSum'],
          id: 'price'
        },
        {
          type: 'deptAndUser',
          label: '承担部门/人',
          placeholder: '请选择',
          key: ['userVOS', 'deptVOS'],
          id: 'user',
          out: 1
        },
        {
          type: 'rangeTime',
          label: '发生日期',
          placeholder: '请选择',
          key: ['happenStartTime', 'happenEndTime'],
          id: 'happenStartTime'
        },
        {
          type: 'rangeTime',
          label: '提交时间',
          placeholder: '请选择',
          key: ['startTime', 'endTime'],
          id: 'startTime'
        },
        {
          type: 'rangeTime',
          label: '审核通过时间',
          placeholder: '请选择',
          key: ['approveStartTime', 'approveEndTime'],
          id: 'approveStartTime',
          out: 1
        },
        {
          type: 'rangeTime',
          label: '付款时间',
          placeholder: '请选择',
          key: ['payStartTime', 'payEndTime'],
          id: 'payStartTime'
        },
        {
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
        },
        {
          type: 'deptAndUser',
          label: '提交部门/人',
          placeholder: '请选择',
          key: ['createUserVOS', 'createDeptVOS'],
          id: 'createUserVOS'
        },
        {
          type: 'tree',
          label: '单据类型',
          placeholder: '请选择',
          key: 'invoiceTemplateIds',
          id: 'invoiceTemplateIds'
        },
        {
          type: 'tree',
          label: '项目',
          placeholder: '请选择',
          key: 'projectIds',
          id: 'projectIds'
        },
        {
          type: 'tree',
          label: '供应商',
          placeholder: '请选择',
          key: 'supplierIds',
          id: 'supplierId'
        },
        {
          type: 'search',
          label: '外部选择',
          placeholder: '单号、事由、收款人',
          key: 'content',
          id: 'content',
          out: 1
        }
      ],
      isModalVisible: false,
      importStatus: false, // 是否进入导入状态
      importLoading: false, // 导入状态：进行中
      // importResult: {}, // 导入结果percent
      file: {}, // 当前上传文件
      percent: 30, // 进度条百分比
      msgTimeOut:false,// 失败数据展示时间到期
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'costGlobal/historyImportStatus',
      payload: {},
    });
    this.props.dispatch({
      type: 'costGlobal/actionLogs',
      payload: {
        actionPart: 1,
        actionContext: '查看支出明细',
        port: 0,
      }
    });
    this.onInit();
  }

  onQuery = payload => {
    const { searchList } = this.state;
    searchList.forEach(it => {
      if (it.value) {
        Object.assign(payload, {
          ...it.value
        });
      }
    });
    this.props.dispatch({
      type: 'costDetail/list',
      payload
    });
  };

  onInit = () => {
    const { searchList } = this.state;
    const linkStatus = localStorage.getItem('linkStatus');
    localStorage.removeItem('linkStatus');
    const statusTime =
      localStorage.getItem('statisticalDimension') === 'undefined'
        ? 0
        : localStorage.getItem('statisticalDimension');
    const times =
      localStorage.getItem('submitTime') &&
      localStorage.getItem('submitTime') !== 'undefined'
        ? JSON.parse(localStorage.getItem('submitTime'))
        : null;
    localStorage.removeItem('submitTime');
    let arr = [...searchList];
    arr = searchList.map(it => {
      if (it.key === 'statusList' && linkStatus) {
        return {
          ...it,
          value: {
            statusList: [linkStatus]
          },
          valueStr: objStatus[linkStatus] && objStatus[linkStatus].name
        };
      }
      if (times && it.id === staticsObj[statusTime].key) {
        console.log('走了吗', it.key);
        return {
          ...it,
          value: {
            [it.key[0]]: Number(times.startTime),
            [it.key[1]]: Number(times.endTime)
          },
          valueStr: `${moment(Number(times.startTime)).format(
            'YYYY-MM-DD'
          )}~${moment(Number(times.endTime)).format('YYYY-MM-DD')}`
        };
      }
      return { ...it };
    });
    this.search(arr, () => {
      const values = {};
      Object.assign(values, {
        pageNo: 1,
        pageSize: 10
      });
      arr.forEach(it => {
        if (it.value) {
          Object.assign(values, {
            ...it.value
          });
        }
      });
      this.onQuery({
        ...values
      });
    });
  };

  search = (searchList, callback) => {
    console.log('EchartsTest -> search -> searchList', searchList);
    const { dispatch } = this.props;
    const _this = this;
    const fetchs = ['projectList','invoiceList', 'supplierList', 'costList', 'officeListAndRole'];
    const arr = fetchs.map(it => {
      return dispatch({
        type: it === 'projectList' || it === 'officeListAndRole' ?
          `costGlobal/${it}` : `global/${it}`,
        payload: {}
      });
    });
    Promise.all(arr).then(() => {
      const { costCategoryList, projectList, supplierList, invoiceList, officeListAndRole } = _this.props;
      const treeList = [costCategoryList, projectList, invoiceList];
      const keys = ['categoryIds', 'projectIds', 'invoiceTemplateIds', 'supplierIds'];
      const obj = {};
      const newTree = treeList.map((it, i) => {
        return treeConvert(
          {
            rootId: 0,
            pId: 'parentId',
            name: i === 0 ? 'costName' : 'name',
            tName: 'title',
            tId: 'value'
          },
          it
        );
      });
      newTree.push(supplierList);
      newTree.push(officeListAndRole);
      newTree.forEach((it, index) => {
        Object.assign(obj, {
          [keys[index]]: it
        });
      });
      const newSearch = [];
      searchList.forEach(it => {
        if (keys.includes(it.key)) {
          newSearch.push({
            ...it,
            options: obj[it.key],
            fileName: it.fileName || {
              key: 'id',
              name: 'name'
            }
          });
        } else {
          newSearch.push({ ...it });
        }
      });
      if (officeListAndRole.length) {
        newSearch.push({
          type: 'select',
          label: '分公司',
          placeholder: '请选择',
          key: 'officeIds',
          id: 'officeIds',
          options: [...officeListAndRole, { id: -1, officeName: '其他' }],
          fileName: {
            key: 'id',
            name: 'officeName'
          },
        });
      }
      this.setState(
        {
          searchList: newSearch
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    });
  };

  onDelete = id => {
    const { selectedRows, selectedRowKeys } = rowSelect.onDelete(
      this.state,
      id
    );
    let amount = 0;
    selectedRows.forEach(item => {
      amount += item.submitSum;
    });
    this.setState({
      selectedRows,
      selectedRowKeys,
      sumAmount: amount
    });
  };

  print = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length > 10) {
      message.error('最多支持打印十条数据');
      return;
    }
    if (selectedRows.length === 0) {
      message.error('请选择一条数据打印');
      return;
    }
    const id = selectedRows.map(it => it.invoiceSubmitId);
    const lists = Array.from(new Set(id));
    const ids = lists.join(',');
    ddOpenLink(
      `${APP_API}/cost/pdf/batch/submit?token=${localStorage.getItem(
        'token'
      )}&ids=${ids}`
    );
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const result = rowSelect.onSelectAll(this.state, selected, changeRows);
    const _selectedRows = result.selectedRows;
    const { selectedRowKeys } = result;
    let amount = 0;
    _selectedRows.forEach(item => {
      amount += item.submitSum;
    });
    this.setState({
      selectedRows: _selectedRows,
      selectedRowKeys,
      sumAmount: amount
    });
  };

  onSelect = (record, selected) => {
    const { selectedRows, selectedRowKeys } = rowSelect.onSelect(
      this.state,
      record,
      selected
    );
    let amount = 0;
    selectedRows.forEach(item => {
      amount += item.submitSum;
    });
    this.setState({
      selectedRows,
      selectedRowKeys,
      sumAmount: amount
    });
  };

  export = key => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0 && key === '1') {
      message.error('请选择要导出的数据');
      return;
    }
    const { searchList } = this.state;

    const { searchContent, leSearch } = this.state;
    let params = {};
    if (key == 1) {
      params = {
        ids: selectedRowKeys
      };
    } else if (key == 2) {
      params = {
        searchContent,
        ...leSearch,
      };
      searchList.forEach(it => {
        if (it.value) {
          Object.assign(params, {
            ...it.value
          });
        }
      });
    } else if (key == 3) {
      params = {
        isAll: true
      };
    }
    this.props.dispatch({
      type: 'costDetail/export',
      payload: {
        ...params
      }
    });
  };

  onChangeSearch = async val => {
    let arr = [...val];
    const { searchList } = this.state;
    const index = val.findIndex(it => it.linkKey === 'projectIds');
    const arrTime = val.findIndex(it => it.key === 'timeC');
    if (index > -1) {
      const keys = searchList[index].key;
      const oldValue = searchList[index].value || {};
      const newValue = val[index].value || {};
      if (newValue[keys] !== oldValue[keys]) {
        const pIndex = val.findIndex(it => it.key === 'projectIds');
        const { lists, projectList } = await this.onProject({ ...newValue });
        const values = projectList.filter(it => it.type === 1);
        arr = update(arr, {
          $splice: [
            [
              pIndex,
              1,
              {
                ...val[pIndex],
                options: lists || [],
                value:
                  newValue[keys] !== 0
                    ? { [val[pIndex].key]: values.map(it => it.id) }
                    : null,
                valueStr: null
              }
            ]
          ]
        });
      }
    }
    if (arrTime && arrTime.length) {
      const { dateType } = arrTime[0].value;
      if (dateType === -1) {
        this.setState({
          dateType: -1
        });
      }
    }
    this.setState(
      {
        searchList: arr
      },
      () => {
        this.onQuery({
          pageNo: 1,
          pageSize: 10
        });
      }
    );
  };

  handleTableChange = (pagination, filters, sorter) => {
    const params = {
      ...filters
    };
    if (params.status) {
      Object.assign(params, {
        status: filters.status[0] || ''
      });
    }
    if (pagination) {
      const { current, pageSize } = pagination;
      Object.assign(params, {
        pageNo: current,
        pageSize
      });
    }
    if (sorter) {
      let order = '';
      if (sorter.order === 'ascend') {
        order = 1;
      } else if (sorter.order === 'descend') {
        order = 2;
      }
      Object.assign(params, {
        sortType: order
      });
    }
    this.onQuery(params);
  };

  onRecord = (payload, callback) => {
    this.props
      .dispatch({
        type: 'costDetail/recordList',
        payload
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  };

  onOk = (payload, callback) => {
    this.props
      .dispatch({
        type: 'costDetail/edit',
        payload
      })
      .then(() => {
        const { query } = this.props;
        this.onQuery({
          ...query
        });
        callback();
      });
  };

  // 手动导入
  handleImport = () => {
    this.setState({ importStatus: true, importLoading: true });
    const { file } = this.state;
    console.log('🚀 ~ file: index.js ~ line 501 ~ Statistics ~ file', file);

    const formData = new FormData();
    formData.append('file', file);
    this.props
      .dispatch({
        type: 'costGlobal/historyImport',
        payload: formData
      })
      .then(() => {
        message.success('导入需要一些时间，导入完成后将会发送工作通知，请留意');
        this.handleCancel();
      });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      importStatus: false,
      file: {}
    });
  };

  Props = _this => {
    return {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: `costGlobal/historyImport?token=${sessionStorage.getItem(
        'token'
      )}`,
      beforeUpload(file) {
        console.log(
          '🚀 ~ file: index.js ~ line 525 ~ Statistics ~ beforeUpload ~ file',
          file
        );
        _this.setState({ file });
        // setFile(file);
        return false;
      }
    };
  };

  handleDownLoad=(id)=>{
    if(id){
      window.open(`${APP_API}/cost/excel/importErrorExcel?token=${localStorage.getItem(
        'token'
      )}&&id=${id}`, '_self');
      this.setState({
        isModalVisible: false,
        importStatus: false,
        file: {}
      });
      return;
    }
    window.open(`${APP_API}/cost/excel/uploadModel?token=${localStorage.getItem(
      'token'
    )}`, '_self');
  }

  // 数据总数、成功数据、失败数据展示
  // oldDate : 调用此函数的时间
  // time = oldDate => {
  //   // 15分钟之后的时间戳
  //   const endTimes = oldDate.getTime() + 15 * 60 * 10 * 100;
  //   const tt = setInterval(() => {
  //     // 当前时间
  //     const nowTimes = new Date().getTime();
  //     // 时间差
  //     const diffTime = endTimes - nowTimes;
  //     if (diffTime <= 0) {
  //       console.log('时间到了');
  //       this.setState({ msgTimeOut: true });
  //       sessionStorage.removeItem('importResult');
  //       clearInterval(tt);
  //     }
  //   }, 1000);
  // };

  render() {
    const {
      selectedRowKeys,
      sumAmount,
      searchList,
      importStatus,
      importLoading,
      isModalVisible,
      file,
      percent,
      // msgTimeOut,
    } = this.state;
    // const importResult=JSON.parse(sessionStorage.getItem('importResult'));
    const {
      list,
      query,
      loading,
      total,
      sum,
      recordPage,
      recordList,
      userInfo,
      historyImportStatus,
      loadingImportant
    } = this.props;
      console.log('🚀 ~ file: index.js ~ line 704 ~ Statistics ~ render ~ query', query);
    const recordColumns = [
      {
        title: '姓名',
        dataIndex: 'createName'
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        render: text => (
          <span>{text ? moment(text).format('YYYY-MM-DD') : '-'}</span>
        )
      },
      {
        title: '操作内容',
        dataIndex: 'operationMsg'
      },
      {
        title: '详情',
        dataIndex: 'operationDetail',
        ellipsis: true,
        textWrap: 'word-break',
        render: text => (
          <Tooltip title={text || ''} placement="topLeft">
            {text}
          </Tooltip>
        )
      }
    ];
    const columns = [
      {
        title: '支出类别',
        dataIndex: 'categoryName',
        ellipsis: true,
        textWrap: 'word-break',
        width: 100,
        render: text => (
          <Tooltip title={text || ''} placement="topLeft">
            {text}
          </Tooltip>
        )
      },
      {
        title: '金额（元）',
        dataIndex: 'submitSum',
        render: text => <span>{text ? text / 100 : 0}</span>,
        width: 100
      },
      {
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
      },
      {
        title: '承担人',
        dataIndex: 'userName',
        width: 130
      },
      {
        title: '承担部门',
        dataIndex: 'deptName',
        width: 150
      },
      {
        title: '发生日期',
        dataIndex: 'costTime',
        render: text => (
          <span>{text && moment(text).format('YYYY-MM-DD')}</span>
        ),
        width: 120
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        render: text => (
          <span>{text && moment(text).format('YYYY-MM-DD')}</span>
        ),
        width: 120
      },
      {
        title: '审核通过时间',
        dataIndex: 'approveTime',
        render: text => (
          <span>{text && moment(text).format('YYYY-MM-DD')}</span>
        ),
        width: 120
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        render: text => (
          <span>{text && moment(text).format('YYYY-MM-DD')}</span>
        ),
        width: 120
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width: 100
      },
      {
        title: '提交人部门',
        dataIndex: 'createDeptName',
        width: 150
      },
      {
        title: '项目',
        dataIndex: 'projectName',
        width: 130,
        ellipsis: true,
        textWrap: 'word-break',
        record: text => <span>{text || '-'}</span>
      },
      {
        title: '供应商',
        dataIndex: 'supplierAccountName',
        width: 130,
        ellipsis: true,
        textWrap: 'word-break'
      },
      {
        title: '单据类型',
        dataIndex: 'invoiceTemplateName',
        width: 100,
        render: text => <span>{text || '-'}</span>
      },
      {
        title: '单号',
        dataIndex: 'invoiceNo',
        width: list.isAssetsImport ? 230:140,
        render: (_, record) => (
          <span>
            <span>{record.invoiceNo}</span>
            {record.thirdPlatformType===0 && (
              <img
                src={aliLogo}
                alt="阿里商旅"
                style={{ width: '18px', height: '18px', marginLeft: '8px' }}
              />
            )}
            {
              record.thirdPlatformType===2 && (
                <img
                  src={xzcLogo}
                  alt="鑫资产"
                  style={{ width: '16px', height: '16px', marginLeft: '8px', verticalAlign: 'text-bottom' }}
                />
               )
            }
            {
              record.thirdPlatformType===3 && (
                <img
                  src={znxcLogo}
                  alt="智能薪酬"
                  style={{ width: '16px', height: '16px', marginLeft: '8px', verticalAlign: 'text-bottom' }}
                />
               )

            }
          </span>
        )
      },
      {
        title: '发放人',
        dataIndex: 'payUserName',
        width: 100
      },
      {
        title: '审批状态',
        dataIndex: 'approveStatus',
        render: text => <span>{getArrayValue(text, approveStatus)}</span>,
        width: 100
      },
      {
        title: '单据状态',
        dataIndex: 'status',
        render: (_, record) => {
          const { status } = record;
          return (
            <span>
              <Badge
                color={
                  getArrayColor(`${status}`, invoiceStatus) === '-'
                    ? 'rgba(255, 148, 62, 1)'
                    : getArrayColor(`${status}`, invoiceStatus)
                }
                text={
                  record.statusStr ||
                  getArrayValue(record.status, invoiceStatus)
                }
              />
            </span>
          );
        },
        width: 110,
        fixed: 'right',
        filters: [
          { text: '已发放', value: '3' },
          { text: '待发放', value: '2' }
        ]
      },
      {
        title: '操作',
        dataIndex: 'ope',
        render: (_, record) => (
          <span>
            {userInfo.adminType === 1 && (
              <>
                <ChangeDate
                  month={record.happenTime}
                  money={record.submitSum}
                  onOK={this.onOk}
                  id={record.id}
                >
                  <a>修改所属期</a>
                </ChangeDate>
                <Divider type="vertical" />
              </>
            )}
            <InvoiceDetail
              id={record.invoiceSubmitId}
              templateType={record.templateType}
            >
              <a>查看</a>
            </InvoiceDetail>
          </span>
        ),
        width: 180,
        fixed: 'right',
        className: 'fixCenter'
      }
    ];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      columnWidth: '24px'
    };

    return (
      <div style={{ padding: 0 }}>
        <SearchBanner list={searchList || []} onChange={this.onChangeSearch} />
        <div className="content-dt" style={{ height: 'auto', padding: '32px' }}>
          <div className="cnt-header" style={{marginBottom: historyImportStatus&&historyImportStatus.errorCount ? '16px' : '0px'}}>
            <div
              className="head_lf"
              style={{ display: 'flex' }}
            >
              <Dropdown
                overlay={
                  <Menu onClick={e => this.export(e.key)}>
                    <Menu.Item key="1">
                      <span className="pd-20-9 c-black-65">
                        导出选中（{selectedRowKeys.length}）
                      </span>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <span className="pd-20-9 c-black-65">
                        导出高级搜索结果
                      </span>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <span className="pd-20-9 c-black-65">导出全部</span>
                    </Menu.Item>
                  </Menu>
                }
                overlayClassName={style.menuBtn}
              >
                <Button>
                  导出 <Icon type="down" />
                </Button>
              </Dropdown>
              <Button
                className="m-l-8"
                onClick={() => {
                  this.setState({ isModalVisible: true });
                }}
              >
                批量导入
              </Button>
              <Button className="m-l-8" onClick={() => this.print()}>
                打印
              </Button>
            </div>
            {userInfo.adminType === 1 && (
              <div className="head_rf">
                <TableTemplate
                  page={recordPage}
                  onQuery={this.onRecord}
                  columns={recordColumns}
                  list={recordList}
                  placeholder="输入详情内容搜索"
                  sWidth="800px"
                  title="操作记录"
                >
                  <div className="head_rf" style={{ cursor: 'pointer' }}>
                    <i
                      className="iconfont iconcaozuojilu c-black-65"
                      style={{ verticalAlign: 'middle', marginRight: '4px' }}
                    />
                    <span className="fs-14 c-black-65">操作记录</span>
                  </div>
                </TableTemplate>
              </div>
            )}
          </div>
          {historyImportStatus && historyImportStatus.errorCount ? (
            <MessageTip
              total={historyImportStatus.count + historyImportStatus.errorCount}
              successNum={historyImportStatus.count}
              errorNum={historyImportStatus.errorCount}
              onLink={()=>this.handleDownLoad(historyImportStatus.errorExcelId)}
              time={historyImportStatus.date}
            />
          ) : null}
          <div className={style.messageTop}>
            <span className="fs-14 c-black-65">
              {selectedRowKeys.length
                ? `已选${selectedRowKeys.length}`
                : `共${total}`}
              条记录，合计
            </span>
            <span className="fs-16 c-black-85 fw-500">
              ¥{selectedRowKeys.length ? sumAmount / 100 : sum / 100}
            </span>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={list}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            rowKey="id"
            scroll={{ x: 3220 }}
            pagination={{
              current: query.pageNo,
              total,
              pageSize: query.pageSize,
              size: 'small',
              showTotal: () => `共${total}条数据`,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>

        <ImportModal
          isModalVisible={isModalVisible}
          handleCancel={this.handleCancel}
          importStatus={importStatus}
          importLoading={importLoading}
          importResult={historyImportStatus}
          file={file}
          handleImport={this.handleImport}
          loading={loadingImportant}
          props={this.Props(this)}
          handleReset={() => {
            this.setState({ file: {} });
          }}
          handleConImport={() => {
            sessionStorage.removeItem('importResult');
            this.setState({
              importStatus: false,
              // importResult: {},
              file: {}
            });
          }}
          percent={percent}
          downLoad={this.handleDownLoad}
        />
      </div>
    );
  }
}

export default Statistics;
