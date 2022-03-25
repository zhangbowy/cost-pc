import {post, get} from '@/utils/request';
import api from './services';

export default {
  namespace: 'costCategory',
  state: {
    list: [],
    allList: [], // 所有数据
    details: {},
    checkDel: false,
    expandLists: [],
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
    *incomeList({ payload }, { call, put }) {
      const response = yield call(get, api.incomeList, payload);
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
    *allIncomeList({ payload }, { call, put }) {
      const response = yield call(get, api.incomeList, payload);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
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
      let url = api.addCostGroup;
      const param = {...payload};
      if (payload.costItem === '1') {
        url = api.addIncomeGroup;
      }
      delete param.costItem;
      yield call(post, url, param);
    },
    *copy({ payload }, { call }) {
      let url = api.addCostGroup;
      const param = {...payload};
      if (payload.costItem === '1') {
        url = api.copyIncomeGroup;
      }
      delete param.costItem;
      yield call(get, url, param);
    },
    *del({ payload }, { call }) {
      yield call(post, api.delCostGroup, payload);
    },
    *sort({ payload }, { call }) {
      yield call(post, api.sorts, payload);
    },
    *sortIncome({ payload }, { call }) {
      yield call(post, api.sortIncome, payload);
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
      let url = api.addCostGroup;
      const param = {...payload};
      if (payload.costItem === '1') {
        url = api.editIncomeGroup;
      }
      delete param.costItem;
      yield call(post, url, param);
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
    },
    *detailIncome({ payload }, { call, put }) {
      const response = yield call(get, api.detailIncome, payload);
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
