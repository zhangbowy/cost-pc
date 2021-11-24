import { post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'summary',
  state: {
    submitList: [],
    loanList: [],
    applicationList: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
    sum: 0,
    salaryList: [],
    thirdList: [],
    historyList: [], // 单据删除操作日志
    historyPage: {
      pageNo: 1,
      pageSize: 10,
      total: 0,
    },
  },
  effects: {
    *submitList({ payload }, { call, put }) {
      const response = yield call(post, api.submitList, payload);
      const newArr = response.list && response.list.map(it => { return { ...it, money: it.submitSum }; });
      yield put({
        type: 'save',
        payload: {
          submitList: newArr || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.sum || 0
        },
      });
    },
    *loanList({ payload }, { call, put }) {
      const response = yield call(post, api.loanList, payload);
      const newArr = response.list && response.list.map(it => { return { ...it, money: it.loanSum }; });
      yield put({
        type: 'save',
        payload: {
          loanList: newArr || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.sum || 0
        },
      });
    },
    *applicationList({ payload }, { call, put }) {
      const response = yield call(post, api.applicationList, payload);
      const newArr = response.list && response.list.map(it => { return { ...it, money: it.applicationSum }; });
      yield put({
        type: 'save',
        payload: {
          applicationList: newArr || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.sum || 0
        },
      });
    },
    *salaryList({ payload }, { call, put }) {
      const response = yield call(post, api.salaryList, payload);
      const newArr = response.list && response.list.map(it => { return { ...it, money: it.salaryAmount }; });
      yield put({
        type: 'save',
        payload: {
          salaryList: newArr || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.sum || 0
        },
      });
    },
    *thirdList({ payload }, { call, put }) {
      const response = yield call(post, api.thirdList, payload);
      const newArr = response.list && response.list.map(it => { return { ...it, money: it.submitSum }; });
      yield put({
        type: 'save',
        payload: {
          thirdList: newArr || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.sum || 0
        },
      });
    },
    *historyList({ payload }, { call, put }) {
      const response = yield call(post, api.historyList, payload);
      console.log('*historyList -> response', response);
      yield put({
        type: 'save',
        payload: {
          historyList: response.list || [],
          historyPage: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: (response.page && response.page.total) || 0
          }
        },
      });
    },
    *submitExport({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '报销单列表' });
      yield call(post, api.submitExport, payload);
    },
    *loanExport({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '借款单列表' });
      yield call(post, api.loanExport, payload);
    },
    *applicationExport({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '申请单列表' });
      yield call(post, api.applicationExport, payload);
    },
    *salaryExport({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '薪资单列表' });
      yield call(post, api.salaryExport, payload);
    },
    *thirdExport({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '三方导入列表' });
      yield call(post, api.thirdExport, payload);
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
