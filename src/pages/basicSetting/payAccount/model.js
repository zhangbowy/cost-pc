import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'account',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE
    },
    total: 0,
    detail: {
      initialAmount: 0
    },
    check: false,
    signRes: '',
    amountMap: {
      amountSum: 0,
      costSum: 0,
      incomeSum: 0,
      amountSumStr: '0.00',
      costSumStr: '0.00',
      incomeSumStr: '0.00'
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
            pageSize: payload.pageSize,
            pageNo: payload.pageNo
          },
          total: response.page ? response.page.total : 0
        }
      });
    },
    *sign({ payload }, { call, put }) {
      const response = yield call(post, api.sign, payload);
      yield put({
        type: 'save',
        payload: {
          signRes: response || ''
        }
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *delPer({ payload }, { call, put }) {
      const response = yield call(get, api.delPer, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          check: response
        }
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || {}
        }
      });
    },
    /**
     * 获取公司的总金额、流入、流出
     * @param payload
     * @param call
     * @param put
     * @return {Generator<*, void, *>}
     */
    *getAmountMap({ payload }, { call, put }) {
      const response = yield call(get, api.amount, payload);
      yield put({
        type: 'save',
        payload: {
          amountMap: response || {}
        }
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
