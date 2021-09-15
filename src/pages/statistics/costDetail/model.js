import { post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'costDetail',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
    exportData: null,
    hisRecord: {},
    recordPage: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
      total: 0,
    },
    recordList: [],
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          queryPage: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.page ? response.page.totalSum : 0
        },
      });
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    *export({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '支出明细' });
      yield call(post, api.exports, payload);
      // yield put({
      //   exportData: res,
      // });
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
