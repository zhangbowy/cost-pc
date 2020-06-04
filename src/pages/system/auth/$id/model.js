import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'setUser',
  state: {
    list: [],
    role: {},
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
    userIdList: [],
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          role: response.role || {},
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page.total,
        },
      });
    },
    *userIdList({ payload }, { call, put }) {
      const response = yield call(get, api.userIdList, payload);
      yield put({
        type: 'save',
        payload: {
          userIdList: response || [],
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *delRole({ payload }, { call }) {
      yield call(get, api.del, payload);
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
