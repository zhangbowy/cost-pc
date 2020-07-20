import { post, get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'supplier',
  state: {
    list: [],
    detail: {},
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || []
        }
      });
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || []
        }
      });
    },
    *edit({ payload }, { call }) {
      console.log(payload);
      yield call(post, api.edit, payload);
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *delete({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *sort({ payload }, { call }) {
      yield call(post, api.sort, payload);
    }
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
