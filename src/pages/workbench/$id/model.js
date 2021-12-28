import { get, post } from '@/utils/request';
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
    barCharts: [], // 柱状图
    lineCharts: [], // 折线图
  },
  effects: {
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
    *add({ payload }, { call }) {
      yield call(post, api.del, payload);
    },
    *loanDel({ payload }, { call }){
      yield call(get, api.loanDel, payload);
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
