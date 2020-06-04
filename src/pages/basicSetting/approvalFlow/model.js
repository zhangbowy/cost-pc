import { post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'approvalFlow',
  state: {
    nodes: {},
    detailNode: {},
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      console.log(response.node);
      yield put({
        type: 'save',
        payload: {
          nodes: response.node || {},
          detailNode: response || {},
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
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
