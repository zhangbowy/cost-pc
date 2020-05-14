import post from '@/utils/request';
import api from './services';

export default {
  namespace: 'costCategory',
  state: {
    list: [{
      id: '21',
      costName: '测试'
    }],
    query: {
      pageNum: 1,
      pageNo: 10
    }
  },
  effects: {
    *costList({ payload }, { call, put }) {
      const response = yield call(post, api.getEmployeeList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.result || [],
          query: {
            pageNum: payload.pageNum,
            pageNo: payload.pageNo,
          },
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.addCostGroup, payload);
    },
    *del({ payload }, { call }) {
      yield call(post, api.delCostGroup, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(post, api.detailCost, payload);
      yield put({
        type: 'save',
        payload: {
          details: response.result || {},
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
