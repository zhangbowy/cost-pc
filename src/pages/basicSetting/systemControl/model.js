import { get, post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'systemControl',
  state: {
    isModifyInvoice: false,
    isModifyReload: false,
    statisticsDimension: 0,
    isOpenProject: false,
    details: {},
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(get, api.query, payload);
      console.log('*query -> response', response);
      yield put({
        type: 'save',
        payload: {
          isModifyInvoice: response.isModifyInvoice,
          isModifyReload: response.isModifyReload,
          isOpenProject: response.isOpenProject,
          statisticsDimension: response.statisticsDimension,
          details: response || {},
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
