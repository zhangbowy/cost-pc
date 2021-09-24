/* eslint-disable no-param-reassign */
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
    *getTime({ payload }, { call, put }) {
      const response = yield call(get, api.getTime, payload);
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response ? response.removeDataTime : null,
          synCompanyTime: response ? response.synCompanyTime : null,
          status: response ? response.status : 0,
        },
      });
    },
    *del({ payload }, { call, put }) {
      const response = yield call(get, api.del, payload);
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response || null,
        },
      });
    },
    *delCompany({ payload, callback }, { call, put }) {
      const response = yield call(get, api.delCompany, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response || null,
        },
      });
    },
    *queryUsers({ payload }, { call, put }) {
      const response = yield call(get, api.queryUsers, payload);
      yield put({
        type: 'save',
        payload: {
          queryUsers: response || null,
        },
      });
    },
    *modifyGrant({ payload, callback }, { call, put }) {
      let url = api.modifyGrant;
      if (payload.types) {
        url = api.modifyLoan;
        delete payload.types;
      }
      const response = yield call(post, url, payload,{withCode: true});
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          modifyGrant: response,
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
