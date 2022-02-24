import { get, post } from '@/utils/request';
import api from './services';

export default {
  namespace: 'assets',
  state: {
    list: [],
    authorize: 1,
    assetsList: [],
    saveTime: 0,
  },
  effects: {
    *authorize({ payload }, { call, put }) {
      const response = yield call(post, api.authorize, payload);
      yield put({
        type: 'save',
        payload: {
          authorize: response,
        },
      });
    },
    *assetsList({ payload }, { call, put }) {
      const response = yield call(get, api.assetsList, payload);
      yield put({
        type: 'save',
        payload: {
          assetsList: response || [],
        },
      });
    },
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          saveTime: response.saveTime || '',
        },
      });
    },
    *onSave({ payload }, { call }) {
      yield call(post, api.save, payload);
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
