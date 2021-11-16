import { get, post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

export default {
  namespace: 'sendDing',
  state: {
    list: {},
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || {},
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
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
