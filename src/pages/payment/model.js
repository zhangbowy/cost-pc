import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'payment',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      // eslint-disable-next-line no-return-assign
      const lists = response.list && response.list.map(it => { return {...it, id: it.invoiceId}; });
      yield put({
        type: 'save',
        payload: {
          list: lists || [],
          // list: [{ id: 1 }, { id: 2 }],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page.total,
        },
      });
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    // 已发放
    *exported({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '已发放列表' });
      yield call(post, api.payedExport, payload);
    },
    // 待发放
    *exporting({ payload }, { call }) {
      Object.assign(payload, { type: 'export', fileName: '待发放列表' });
      yield call(post, api.payingExport, payload);
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
