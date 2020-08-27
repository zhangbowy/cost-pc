import { post, get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'peopleSet',
  state: {
    detail: {},
    isAll: false,
    userVos: [],
    allUserCount: 0,
    checkAll: false,
    payUserCount: 0
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
          userVos: response.userVos || [],
          allUserCount: response.allUserCount || 0,
          checkAll: response.checkAll || false,
          payUserCount: response.payUserCount || 0,
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
