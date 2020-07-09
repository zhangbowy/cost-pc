import { post, get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'projects',
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
    *projectEdit({ payload }, { call }) {
      yield call(post, api.projectEdit, payload);
    },
    *projectAdd({ payload }, { call }) {
      yield call(post, api.projectAdd, payload);
    },
    *delete({ payload }, { call }) {
      yield call(get, api.delete, payload);
    },
    *uploadFile({ payload }, { call }) {
      yield call(post, api.uploadFile, payload);
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
