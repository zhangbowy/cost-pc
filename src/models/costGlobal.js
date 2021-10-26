import { post, get } from '@/utils/request';
import api from '@/services/api';

export default {
  namespace: 'costGlobal',
  state: {
    costCategoryList: [], // 可用的支出类别
    folderList: [], // 账本列表
    detailFolder: {}, // 账本详情
    page: {
      pageNo: 1,
      pageSize: 10,
    },
    total: 1,
    draftList: [],
    draftDetail: {},
    loanList: [], // 我的待还款列表
    waitLoanSumAll: {},
    userDeps: [], // 通过userId获取数据
    folderSum: {}, // 详细信息
    queryTemplateIds: [],
    draftTotal: {},
    folderIds: [], // 查询删除
    waitAssessIds: [],
    applyIds: [],
    recordDetailLoan: [],
    recordDetailInvoice: [],
    waitLists: [],
    waitLoanSums: {},
    areaCode: [],
    checkTemp: {},
    isModifyInvoice: false,
    recordList: [], // 单据删除操作日志
    recordPage: {
      pageNo: 1,
      pageSize: 10,
      total: 0,
    },
    officeTree: [],
    uploadStatus: {}, // 上传文件之后返回的参数
    exportList: [],
    exportPage: {
      pageNo: 1,
      pageSize: 100,
    },
    projectList: [], // 查询项目列表
    roleStatics: [], // 支出统计的接口
    aliCostAndI: {}, // 阿里商旅成本中心
    aliTripCity: false, // 阿里商旅查询火车或者飞机
    provinceAndCity: [], // 查询省市
    aliTripLink: '',
    deptTree: [], // 部门树
    checkLinkCost: [], // 关联的申请单
    checkFolderList: [], // 关联申请单之后判断账本
    levelCityList: [], // 等级城市列表,
    checkStandard: {}, // 校验的结果
    checkStandMsg: '',
    deptAndUser: {}, // 关联dingUserId
  },
  effects: {
    *loanList({ payload }, { call, put }) {
      const response = yield call(get, api.loanList, payload);
      const lists = response.pageResult.list || [];
      yield put({
        type: 'save',
        payload: {
          loanList: lists || [],
          waitLoanSumAll: response || {},
          total: response.pageResult.page.total || 1,
          page: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          }
        },
      });
    },
    *folderIds({ payload }, { call, put }) {
      const response = yield call(post, api.folderIds, payload);
      yield put({
        type: 'save',
        payload: {
          folderIds: response || [],
        },
      });
    },
    *waitAssessIds({ payload }, { call, put }) {
      const response = yield call(post, api.waitAssessIds, payload);
      yield put({
        type: 'save',
        payload: {
          waitAssessIds: response || [],
        },
      });
    },
    *applyIds({ payload }, { call, put }) {
      const response = yield call(post, api.applyIds, payload);
      yield put({
        type: 'save',
        payload: {
          applyIds: response || [],
        },
      });
    },
    *queryTemplateIds({ payload }, { call, put }) {
      const response = yield call(post, api.queryTemplateIds, payload);
      yield put({
        type: 'save',
        payload: {
          queryTemplateIds: response || [],
        },
      });
    },
    *addFolder({ payload }, { call }) {
      yield call(post, api.addFolder, payload);
    },
    *editFolder({ payload }, { call }) {
      yield call(post, api.editFolder, payload);
    },
    *delFolder({ payload }, { call }) {
      yield call(post, api.delFolder, payload);
    },
    *listFolder({ payload }, { call, put }) {
      const response = yield call(get, api.listFolder, payload);
      const lists = response.costDetailVos.list || [];
      yield put({
        type: 'save',
        payload: {
          folderList: lists || [],
          total: response.costDetailVos.page.total || 1,
          folderSum: response || {},
          page: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          }
        },
      });
    },
    *detailFolder({ payload }, { call, put }) {
      const response = yield call(get, api.detailFolder, payload);
      yield put({
        type: 'save',
        payload: {
          detailFolder: response || {},
        },
      });
    },
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.useExpense, payload);
      yield put({
        type: 'save',
        payload: {
          costCategoryList: response || [],
        },
      });
    },
    *addDraft({ payload }, { call }) {
      yield call(post, api.addDraft, payload);
    },
    *editDraft({ payload }, { call }) {
      yield call(post, api.editDraft, payload);
    },
    *delDraft({ payload }, { call }) {
      yield call(post, api.delDraft, payload);
    },
    *listDraft({ payload }, { call, put }) {
      const response = yield call(get, api.listDraft, payload);
      const lists = response.draftBoxPageResult.list || [];
      yield put({
        type: 'save',
        payload: {
          draftList: lists || [],
          total: response.draftBoxPageResult.page.total || 1,
          draftTotal: response,
          page: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          }
        },
      });
    },
    *detailDraft({ payload }, { call, put }) {
      const response = yield call(get, api.detailDraft, payload);
      yield put({
        type: 'save',
        payload: {
          detailDraft: response || {},
        },
      });
    },
    *userDep({ payload }, { call, put }) {
      const response = yield call(post, api.userDep, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          userDeps: response || {},
        },
      });
    },
    *invoiceEdit({ payload }, { call }) {
      yield call(post, api.invoiceEdit, payload);
    },
    // 管理员删除单据
    *delInvoice({ payload }, { call }) {
      yield call(get, api.delInvoice, payload);
    },
    *loanEdit({ payload }, { call }) {
      yield call(post, api.loanEdit, payload);
    },
    // 删除的单据的记录
    *recordList({ payload }, { call, put }) {
      const response = yield call(get, api.recordList, payload);
      yield put({
        type: 'save',
        payload: {
          recordList: response.list || [],
          recordPage: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: (response.page && response.page.total) || 0
          }
        },
      });
    },
    *recordDetailLoan({ payload }, { call, put }) {
      const response = yield call(get, api.recordDetailLoan, payload);
      console.log('*recordDetailLoan -> response', response);
      yield put({
        type: 'save',
        payload: {
          recordDetailLoan: response || [],
        },
      });
    },
    *recordDetailInvoice({ payload }, { call, put }) {
      const response = yield call(get, api.recordDetailInvoice, payload);
      yield put({
        type: 'save',
        payload: {
          recordDetailInvoice: response || [],
        },
      });
    },
    *waitLists({ payload }, { call, put }) {
      const response = yield call(get, api.waitList, payload);
      const res = response.pageResult;
      const lists = res.list.map(it => { return { ...it, id: it.loanId }; }) || [];
      yield put({
        type: 'save',
        payload: {
          waitLists: lists || [],
          waitLoanSums: response.loanSum || {},
        }
      });
    },
    *area({ payload }, { call, put }) {
      const response = yield call(get, api.area, payload);
      yield put({
        type: 'save',
        payload: {
          areaCode: response || [],
        }
      });
    },
    *checkTemplate({ payload }, { call, put }) {
      const response = yield call(get, api.checkTemplate, payload);
      yield put({
        type: 'save',
        payload: {
          checkTemp: response || {},
        }
      });
    },
    *queryModifyOrder({ payload }, { call, put }) {
      const response = yield call(get, api.queryModify, payload);
      yield put({
        type: 'save',
        payload: {
          isModifyInvoice: response.isModifyInvoice,
          isModifyReload: response.isModifyReload,
        },
      });
    },
    *officeList({ payload }, { call, put }) {
      const response = yield call(get, api.officeList, payload);
      yield put({
        type: 'save',
        payload: {
          officeList: response || [],
        },
      });
    },
    *exportList({ payload }, { call, put }) {
      const response = yield call(get, api.exportList, payload);
      yield put({
        type: 'save',
        payload: {
          exportList: response.list || [],
          exportPage: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
          }
        },
      });
    },
    *officeTree({ payload }, { call, put }) {
      const response = yield call(get, api.officeTree, payload);
      yield put({
        type: 'save',
        payload: {
          officeTree: response || [],
        },
      });
    },
    *upload({ payload }, { call, put }) {
      const response = yield call(post, api.upload, payload);
      yield put({
        type: 'save',
        payload: {
          uploadStatus: response || {},
        },
      });
    },
    // 项目列表
    *projectList({ payload }, { call, put }) {
      const response = yield call(get, api.newProjectList, payload);
      yield put({
        type: 'save',
        payload: {
          projectList: response || [],
        },
      });
    },
    *roleStatics({ payload }, { call, put }) {
      const response = yield call(get, api.roleStatics, payload);
      yield put({
        type: 'save',
        payload: {
          roleStatics: response || [],
        },
      });
    },
    *aliTripCostAndI({ payload }, { call, put }) {
      const response = yield call(get, api.costCAndITitle, payload);
      const { costCenterList, invoice } = response;
      const invoiceArr = [];
      const costArr = [];
      costCenterList.forEach(item => {
        costArr.push({
          label: item.title,
          value: item.id,
        });
      });
      invoice.forEach(item => {
        invoiceArr.push({
          label: item.title,
          value: item.id,
        });
      });
      const params = {invoiceArr, costArr};
      yield put({
        type: 'save',
        payload: {
          aliCostAndI: params || {},
        },
      });
    },
    *aliTripCity({ payload }, { call, put }) {
      const response = yield call(get, api.aliTripCity, payload);
      console.log('*aliTripCity -> response', response);
      yield put({
        type: 'save',
        payload: {
          aliTripCity: response || false,
        },
      });
    },
    *provinceAndCity({ payload }, { call, put }) {
      const response = yield call(get, api.provinceAndCity, payload);
      yield put({
        type: 'save',
        payload: {
          provinceAndCity: response || [],
        },
      });
    },
    *aliTripLink({ payload }, { call, put }) {
      const response = yield call(get, api.aliTripLink, payload);
      yield put({
        type: 'save',
        payload: {
          aliTripLink: response || '',
        },
      });
    },
    *deptTree({ payload }, { call, put }) {
      const response = yield call(get, api.deptTree, payload);
      yield put({
        type: 'save',
        payload: {
          deptTree: response || [],
        },
      });
    },
    *checkLinkCost({ payload }, { call, put }) {
      const response = yield call(post, api.checkLinkCost, payload);
      yield put({
        type: 'save',
        payload: {
          checkLinkCost: response || {},
        },
      });
    },
    *checkFolderAlc({ payload }, { call, put }) {
      const response = yield call(post, api.checkFolderList, payload);
      yield put({
        type: 'save',
        payload: {
          checkFolderList: response || [],
        },
      });
    },
    *shareLoan({ payload }, { call }) {
      yield call(post, api.shareLoan, payload);
    },
    *editCityLevel({ payload }, { call }) {
      yield call(post, api.editCityLevel, payload);
    },
    *delCityLevel({ payload }, { call }) {
      yield call(get, api.delCityLevel, payload);
    },
    *cityList({ payload }, { call, put }) {
      const response = yield call(get, api.cityList, payload);
      yield put({
        type: 'save',
        payload: {
          cityList: response || {},
        },
      });
    },
    *levelCityList({ payload }, { call, put }) {
      const response = yield call(get, api.levelCityList, payload);
      yield put({
        type: 'save',
        payload: {
          levelCityList: response || [],
        },
      });
    },
    *checkStandard({ payload }, { call, put }) {
      const response = yield call(post, api.checkStandard, payload, { withCode: true });
      yield put({
        type: 'save',
        payload: {
          checkStandard: response.result || {},
          checkStandMsg: !response.success ? response.message : '',
        },
      });
    },
    *cityInfo({ payload }, { call, put }) {
      const response = yield call(get, api.cityInfo, payload, { withCode: true });
      yield put({
        type: 'save',
        payload: {
          cityInfo: response || [],
        },
      });
    },
    *lookDept({ payload }, { call, put }) {
      const response = yield call(get, api.lookDept, payload);
      yield put({
        type: 'save',
        payload: {
          deptAndUser: response || {},
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
