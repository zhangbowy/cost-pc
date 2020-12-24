import { post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'peopleS',
  state: {
    list: [],
    detailList: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE
    },
    querys: {
      pageNo: 1,
      pageSize: PAGE_SIZE
    },
    total: 0,
    totals: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      console.log('*list -> response', response);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          querys: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
          totals: response.page.total || 0,
        },
      });
    },
    *detailList({ payload }, { call, put }) {
      const response = yield call(post, api.detailList, payload);
      console.log('*list -> response', response);
      yield put({
        type: 'save',
        payload: {
          detailList: response.list || [],
          query: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
          total: response.page.total || 0,
        },
      });
    },
    *export({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '员工支出表' });
      yield call(post, api.export, payload);
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
