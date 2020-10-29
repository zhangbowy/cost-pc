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
    personal: {}, // 个人信息
    associateLists: [],
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      console.log('*list -> response', response);
      const res = response || {};
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
    *personal({ payload }, { call, put }) {
      const response = yield call(get, api.personal, payload);
      yield put({
        type: 'save',
        payload: {
          personal: response || {},
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
      yield put({
        type: 'save',
        payload: {
          huaVisible: response.type === 1,
        },
      });
    },
    *associateLists({ payload }, { call, put }) {
      const response = yield call(get, api.associateLists, payload);
      console.log(response);

      const res = response;
      const lists = res.list ? res.list.map(it => { return { ...it, id: it.applicationId }; }) : [];
      yield put({
        type: 'save',
        payload: {
          associateLists: lists || [],
        }
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
