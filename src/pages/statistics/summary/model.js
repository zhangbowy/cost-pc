import { get, post } from '@/utils/request';
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
  },
  effects: {
    *submitList({ payload }, { call, put }) {
      const response = yield call(post, api.submitList, payload);
      yield put({
        type: 'save',
        payload: {
          submitList: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
        },
      });
    },
    *loanList({ payload }, { call, put }) {
      const response = yield call(post, api.submitList, payload);
      yield put({
        type: 'save',
        payload: {
          submitList: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
        },
      });
    },
    *applicationList({ payload }, { call, put }) {
      const response = yield call(get, api.submitList, payload);
      yield put({
        type: 'save',
        payload: {
          submitList: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
        },
      });
    },
    *submitExport({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '待发放列表' });
      yield call(post, api.submitExport, payload);
    },
    *loanExport({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '待发放列表' });
      yield call(post, api.loanExport, payload);
    },
    *applicationExport({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '待发放列表' });
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
