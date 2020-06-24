import {post, get} from '@/utils/request';
import api from './services';

export default {
  namespace: 'costCategory',
  state: {
    list: [],
    allList: [], // 所有数据
    details: {},
  },
  effects: {
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
        },
      });
    },
    *allList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
        },
      });
    },
    *add({ payload }, { call }) {
      const res = yield call(post, api.addCostGroup, payload);
      console.log(res);
    },
    *del({ payload }, { call }) {
      yield call(post, api.delCostGroup, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *delPer({ payload }, { call }) {
      yield call(post, api.delPer, payload);
    },
    *checkDel({ payload }, { call }) {
      yield call(post, api.check, payload);
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detailCost, payload);
      yield put({
        type: 'save',
        payload: {
          details: response || {},
        },
      });
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