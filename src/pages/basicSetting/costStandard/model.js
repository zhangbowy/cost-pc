import { get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'chargeStandard',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
      total: 0,
    }
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          query: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: response.page && response.page.total ? response.page.total : 0,
          }
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
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
