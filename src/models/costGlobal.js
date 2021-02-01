import { post, get } from '@/utils/request';
import api from '@/services/api';

export default {
  namespace: 'costGlobal',
  state: {
    costCategoryList: [], // 可用的费用类别
    folderList: [], // 费用夹列表
    detailFolder: {}, // 费用夹详情
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
    *loanEdit({ payload }, { call }) {
      yield call(post, api.loanEdit, payload);
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
