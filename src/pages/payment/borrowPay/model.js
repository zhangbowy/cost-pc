import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'borrowPay',
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
      const lists = response.list && response.list.length ? response.list.map(it => { return {...it, id: it.invoiceId, submitSum: it.loanSum}; }) : [];
      console.log('lists', lists);
      yield put({
        type: 'save',
        payload: {
          list: lists || [],
          isViewVoucher: lists.length ? lists[0].viewVoucher : false,
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
        },
      });
    },
    *operationSign({ payload }, { call }) {
      yield call(post, api.operationSign, payload);
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    // 已发放
    *exported({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '已发放列表' });
      yield call(post, api.payedExport, payload);
    },
    // 待发放
    *exporting({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '待发放列表' });
      yield call(post, api.payingExport, payload);
    },
    *refuse({ payload }, { call }) {
      yield call(post, api.refuse, payload);
    }
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
