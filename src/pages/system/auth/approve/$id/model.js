import { get, post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './service';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'approveRole',
  state: {
    list: [],
    details: {},
    detail: {},
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          details: response || {},
        },
      });
    },
    *details({ payload }, { call, put }) {
      const response = yield call(get, api.details, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || {},
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
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
