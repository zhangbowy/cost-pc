import { post, get } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';
import { conditionOption } from '../../../utils/common';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'approvalFlow',
  state: {
    nodes: {},
    detailNode: {},
    newNodes: {},
    approveList: [],
    initDetailNode: {},
    initNode: {},
    getCondition: [], // 获取审批条件
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      yield put({
        type: 'changeNodes',
        payload: {
          nodes: response.node || {},
          detailNode: response || {},
        },
      });
    },
    *approvalList({ payload }, { call, put }) {
      const response = yield call(get, api.approvalList, payload);
      yield put({
        type: 'changeNodes',
        payload: {
          approveList: response || [],
        },
      });
    },
    *initNode({ payload }, { call, put }) {
      const response = yield call(get, api.initList, payload);
      yield put({
        type: 'changeNodes',
        payload: {
          initNode: response.node || {},
          initDetailNode: response || {},
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *getCondition({ payload }, { call, put }) {
      const response = yield call(get, api.getCondition, payload);
      yield put({
        type: 'changeNodes',
        payload: {
          getCondition: response && response.length ? conditionOption(response) : [],
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
    changeNodes(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        ...payload,
      };
    }
  }
};
