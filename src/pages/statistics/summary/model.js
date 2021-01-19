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