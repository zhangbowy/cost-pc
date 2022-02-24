import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'borrowering',
  state: {
    list: [],
    recordList: [],
    loanSumObj:{},
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      console.log(response.list);
      const lists = response.pageResult.list && response.pageResult.list.map(it => { return {...it, id: it.loanId}; });
      yield put({
        type: 'save',
        payload: {
          list: lists || [],
          // list: [{ id: 1 }, { id: 2 }],
          loanSumObj:response.loanSum || {},
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.pageResult.page ? response.pageResult.page.total : 0,
        },
      });
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    // 已发放
    *exported({ payload }, { call }) {
      console.log(api.payedExport);
      yield call(post, api.payedExport, payload);
    },
    *loanExported({ payload }, { call }) {
      console.log(api.payedExport);
      yield call(post, api.payedExport, payload);
    },
    // 待发放
    *exporting({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '待发放列表' });
      yield call(post, api.payingExport, payload);
    },
    *refuse({ payload }, { call }) {
      yield call(post, api.refuse, payload);
    },
    // 手动还款
    *repaySum({ payload }, { call }) {
      yield call(post, api.repaySum, payload);
    },
    // 借还记录
    *repayRecord({ payload }, { call, put }) {
      const response = yield call(get, api.repayRecord, payload);
      yield put({
        type: 'save',
        payload: {
          recordList: (response && response.list) || [],
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
  }
};
