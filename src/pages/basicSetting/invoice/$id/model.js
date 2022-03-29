import {post, get} from '@/utils/request';
import api from './services';

export default {
  namespace: 'addInvoice',
  state: {
    list: [],
    allList: [], // 所有数据
    detail: {},
    checkDel: false,
    expandLists: [],
    fieldList: [], // 获取公有字段
    approveList: [],
    isOpenProject: false,
  },
  effects: {
    *allList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
        },
      });
    },
    *approveList({ payload }, { call, put }) {
      const response = yield call(get, api.approve, payload);
      yield put({
        type: 'save',
        payload: {
          approveList: response || [],
        },
      });
    },
    *fieldList({ payload }, { call, put }) {
      let url = api.fieldList;
      const params = { templateType: payload.templateType };
      if (payload.templateType > 10) {
        url = api.incomeFieldList;
      }
      if (payload.invoiceTemplateId) {
        Object.assign(params, {
          invoiceTemplateId: payload.invoiceTemplateId
        });
      }
      const response = yield call(get, url, params);
      yield put({
        type: 'save',
        payload: {
          fieldList: response || [],
        },
      });
    },
    *expandLists({ payload }, { call, put }) {
      const response = yield call(get, api.expandLists, payload);
      yield put({
        type: 'save',
        payload: {
          expandLists: response || [],
        },
      });
    },
    *add({ payload }, { call }) {
      let url = api.addCost;
      if (payload.templateType > 10) {
        url = api.addIncome;
      }
      const res = yield call(post, url, payload);
      console.log(res);
    },
    *del({ payload }, { call }) {
      yield call(post, api.delCostGroup, payload);
    },
    *delCheck({ payload }, { call, put }) {
      const response = yield call(get, api.delCheck, payload);
      yield put({
        type: 'save',
        payload: {
          checkDel: response,
        }
      });
    },
    *edit({ payload }, { call }) {
      let url = api.edit;
      if (payload.templateType > 10) {
        url = api.editIncome;
      }
      yield call(post, url, payload);
    },
    *delPer({ payload }, { call }) {
      yield call(post, api.delPer, payload);
    },
    *checkDel({ payload }, { call }) {
      yield call(post, api.check, payload);
    },
    *detail({ payload }, { call, put }) {
      let url = api.detailCost;
      if (payload.templateType > 10) {
        url = api.detailIncome;
      }
      const response = yield call(get, url, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || {},
        },
      });
    },
    *isOpenProject({ payload }, { call, put }) {
      const response = yield call(post, api.isOpenProject, payload);
      yield put({
        type: 'save',
        payload: {
          isOpenProject: response || false,
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
  },
};
