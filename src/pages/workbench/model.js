import { get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'workbench',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    menuList: [],
    detailRoleList: [],
    UseTemplate: [], // 常用
    OftenTemplate: [], // 其他
    total: 0,
    loanSum: {}, // 待核销
    waitLoanSum: {},
    waitLists: [],
    waitLoanSums: {},
    personal: {}, // 个人信息
    associateLists: [],
    submitReport: {}, // 支出简报
    submitReportDetail: [], // 支出简报的列表
    reportPage: { // 简报列表的分页
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    fyCategory: [],
    cbCategory: [],
    totalSum: 0,
    pieList: [],
    deptTree: [],
    reportTotal: 0,
    loanSumVo: {},
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      console.log('*list -> response', response);
      const res = response || {};
      yield put({
        type: 'save',
        payload: {
          list: res.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: res.page.total || 0,
          loanSum: response.loanSum || {}
        },
      });
    },
    *personal({ payload }, { call, put }) {
      const response = yield call(get, api.personal, payload);
      yield put({
        type: 'save',
        payload: {
          personal: response || {},
        },
      });
    },
    *submitReport({ payload }, { call, put }) {
      const response = yield call(get, api.submitReport, payload);
      yield put({
        type: 'save',
        payload: {
          submitReport: response || {},
        },
      });
    },
    *submitReportDetail({ payload }, { call, put }) {
      const response = yield call(get, api.submitReportDetail, payload);
      let loanSumVo = {};
      let list = [];
      let reportTotal = 0;
      if (Number(payload.reportType) === 3) {
        loanSumVo = response.loanSumVo;
        list = response.pageObject.list || [];
        reportTotal = response.pageObject.page.total || 0;
      } else {
        list = response.list || [];
        reportTotal = response.page.total || 0;
      }
      yield put({
        type: 'save',
        payload: {
          submitReportDetail: list,
          loanSumVo,
          reportPage: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
          reportTotal,
        },
      });
    },
    *brokenLine({ payload }, { call, put }) {
      const response = yield call(get, api.brokenLine, payload);
      yield put({
        type: 'save',
        payload: {
          cbCategory: response.cbCategory || [],
          fyCategory: response.fyCategory || [],
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
    *chartPie({ payload }, { call, put }) {
      const response = yield call(get, api.chartPie, payload);
      yield put({
        type: 'save',
        payload: {
          pieList: response.pieChartVos || [],
          totalSum: response.totalSum || 0,
        },
      });
    },
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.costCateList, payload);
      yield put({
        type: 'save',
        payload: {
          UseTemplate: response.UseTemplate || [],
          OftenTemplate: response.OftenTemplate || [],
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detailRoleList: response.rolePurviewOperateVOS || [],
          rolePurviewDataVos: response.rolePurviewDataVos || [],
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *loanDel({ payload }, { call }){
      yield call(get, api.loanDel, payload);
    },
    *waitList({ payload }, { call, put }) {
      const response = yield call(get, api.waitList, payload);
      const res = response.pageResult;
      const lists = res.list.map(it => { return { ...it, id: it.loanId }; }) || [];
      yield put({
        type: 'save',
        payload: {
          waitList: lists || [],
          waitLoanSum: response.loanSum || {},
        }
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
    *unRemind({ payload }, { call }) {
      yield call(get, api.unRemind, payload);
    },
    *setUser({ payload }, { call }) {
      yield call(get, api.setUser, payload);
    },
    *ejectFrame({ payload }, { call, put }) {
      const response = yield call(get, api.ejectFrame, payload);
      yield put({
        type: 'save',
        payload: {
          huaVisible: response.type === 1,
        },
      });
    },
    *associateLists({ payload }, { call, put }) {
      const response = yield call(get, api.associateLists, payload);
      console.log(response);

      const res = response;
      const lists = res.list ? res.list.map(it => { return { ...it, id: it.applicationId }; }) : [];
      yield put({
        type: 'save',
        payload: {
          associateLists: lists || [],
        }
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
  }
};
