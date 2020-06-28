import { post, get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'peopleSet',
  state: {
    detail: {},
    isAll: false,
  },
  effects: {
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || {},
          isAll: response.isAll || false,
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
