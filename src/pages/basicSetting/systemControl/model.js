import { get, post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'systemControl',
  state: {
    isModifyInvoice: false,
    isModifyReload: false,
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(get, api.query, payload);
      yield put({
        type: 'save',
        payload: {
          isModifyInvoice: response.isModifyInvoice,
          isModifyReload: response.isModifyReload,
        },
      });
    },
    // 完成
    *change({ payload }, { call }) {
      yield call(post, api.change, payload);
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
