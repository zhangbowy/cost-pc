import {post, get} from '@/utils/request';
import api from './services';

export default {
  namespace: 'addCategory',
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
      let url = api.list;
      const param = {};
      if (payload.costType === '1') {
        url = api.incomeList;
      }else {
        Object.assign(param, {
          attribute: payload.attribute,
        });
      }
      const response = yield call(get, url, param);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
        },
      });
    },
    *fieldList({ payload }, { call, put }) {
      let url = api.fieldList;
      const param = {categoryId: payload.categoryId};
      if (payload.costType === '1') {
        url = api.incomeFieldList;
      }
      const response = yield call(get, url, param);
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
      let url = api.addCost;
      const param = {...payload};
      if (payload.costType === '1') {
        url = api.addIncome;
      }
      delete param.costType;
      const res = yield call(post, url, payload);
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
      let url = api.edit;
      const param = {...payload};
      if (payload.costType === '1') {
        url = api.editIncome;
      }
      delete param.costType;
      yield call(post, url, payload);
    },
    *delPer({ payload }, { call }) {
      let url = api.delPer;
      const param = {id: payload.id};
      if (payload.costType === '1') {
        url = api.delPerIncome;
      }
      yield call(post, url, param);
    },
    *checkDel({ payload }, { call }) {
      yield call(post, api.check, payload);
    },
    *detail({ payload }, { call, put }) {
      let url = api.detailCost;
      const param = {...payload};
      if (payload.costType === '1') {
        url = api.detailIncome;
      }
      delete param.costType;
      const response = yield call(get, url, param);
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
