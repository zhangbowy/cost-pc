import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'auth',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    menuList: [],
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *del({ payload }, { call }) {
      yield call(post, api.del, payload);
    },
    *menu({ payload }, { call, put }) {
      const response = yield call(get, api.menu, payload);
      yield put({
        type: 'save',
        payload: {
          menuList: response || [],
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
