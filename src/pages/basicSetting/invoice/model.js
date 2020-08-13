import { post, get } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'invoice',
  state: {
    list: [],
    allList: [], // 获取所有数据
    menuList: [],
    detail: {},
    check: {},
    approveList: [], // 审批流的节点
    checkDel: true,
    expandLists: [],
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
        },
      });
    },
    *allList({ payload }, { call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          allList: response || [],
        },
      });
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
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
    *expandLists({ payload }, { call, put }) {
      const response = yield call(get, api.expandLists, payload);
      yield put({
        type: 'save',
        payload: {
          expandLists: response,
        }
      });
    },
    *addGroup({ payload }, { call }) {
      yield call(post, api.addGroup, payload);
    },
    *editGroup({ payload }, { call }) {
      yield call(post, api.editGroup, payload);
    },
    *delPer({ payload }, { call, put }) {
      const response = yield call(get, api.delPer, payload);
      yield put({
        type: 'save',
        payload: {
          check: response || {},
        },
      });
    },
    *approveList({ payload }, { call, put }) {
      const response = yield call(get, api.approve, payload);
      yield put({
        type: 'save',
        payload: {
          approveList: response || {},
        },
      });
    },
    *menu({ payload }, { call, put }) {
      const response = yield call(get, api.menu, payload);
      yield put({
        type: 'save',
        payload: {
          menuList: response || [],
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response || {},
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
