import { post, get } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'approvalFlow',
  state: {
    nodes: {},
    detailNode: {},
    newNodes: {},
    approveList: []
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
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
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
