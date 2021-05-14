import { get, post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

export default {
  namespace: 'companySet',
  state: {
    list: [],
  },
  effects: {
    *list({ payload }, { call, put }) {

      const response = yield call(post, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *add({ payload }, { call }) {
      yield call(get, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(get, api.edit, payload);
    },
    *sorts({ payload }, { call }) {
      yield call(get, api.sorts, payload);
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
