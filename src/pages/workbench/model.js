import { get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'workbench',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    menuList: [],
    detailRoleList: [],
    UseTemplate: [], // 常用
    OftenTemplate: [], // 其他
    total: 0,
    loanSum: {}, // 待核销
    waitLoanSum: {},
    waitLists: [],
    waitLoanSums: {},
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      const res = response.pageResult || {};
      yield put({
        type: 'save',
        payload: {
          list: res.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: res.page.total || 0,
          loanSum: response.loanSum || {}
        },
      });
    },
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.costCateList, payload);
      yield put({
        type: 'save',
        payload: {
          UseTemplate: response.UseTemplate || [],
          OftenTemplate: response.OftenTemplate || [],
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detailRoleList: response.rolePurviewOperateVOS || [],
          rolePurviewDataVos: response.rolePurviewDataVos || [],
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *loanDel({ payload }, { call }){
      yield call(get, api.loanDel, payload);
    },
    *waitList({ payload }, { call, put }) {
      const response = yield call(get, api.waitList, payload);
      const res = response.pageResult;
      const lists = res.list.map(it => { return { ...it, id: it.loanId }; }) || [];
      yield put({
        type: 'save',
        payload: {
          waitList: lists || [],
          waitLoanSum: response.loanSum || {},
        }
      });
    },
    *waitLists({ payload }, { call, put }) {
      const response = yield call(get, api.waitList, payload);
      const res = response.pageResult;
      const lists = res.list.map(it => { return { ...it, id: it.loanId }; }) || [];
      yield put({
        type: 'save',
        payload: {
          waitLists: lists || [],
          waitLoanSums: response.loanSum || {},
        }
      });
    },
    *unRemind({ payload }, { call }) {
      yield call(get, api.unRemind, payload);
    },
    *ejectFrame({ payload }, { call, put }) {
      const response = yield call(get, api.ejectFrame, payload);
      console.log(1111111111111,response);
      yield put({
        type: 'save',
        payload: {
          huaVisible: response.type === 1,
        },
      });
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
