import {post, get} from '@/utils/request';
import api from './services';

export default {
  namespace: 'addInvoice',
  state: {
    list: [],
    allList: [], // 所有数据
    details: {},
    checkDel: false,
    expandLists: [],
    fieldList: [], // 获取公有字段
  },
  effects: {
    *allList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
        },
      });
    },
    *approveList({ payload }, { call, put }) {
      const response = yield call(get, api.approve, payload);
      yield put({
        type: 'save',
        payload: {
          approveList: response || {},
        },
      });
    },
    *fieldList({ payload }, { call, put }) {
      const response = yield call(get, api.fieldList, payload);
      yield put({
        type: 'save',
        payload: {
          fieldList: response || [],
        },
      });
    },
    *expandLists({ payload }, { call, put }) {
      const response = yield call(get, api.expandLists, payload);
      yield put({
        type: 'save',
        payload: {
          expandLists: response || [],
        },
      });
    },
    *add({ payload }, { call }) {
      const res = yield call(post, api.addCost, payload);
      console.log(res);
    },
    *del({ payload }, { call }) {
      yield call(post, api.delCostGroup, payload);
    },
    *delCheck({ payload }, { call, put }) {
      const response = yield call(get, api.delCheck, payload);
      yield put({
        type: 'save',
        payload: {
          checkDel: response,
        }
      });
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
