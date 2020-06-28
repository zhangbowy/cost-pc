import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'auth',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    menuList: [],
    detailRoleList: [],
    total: 0,
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
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
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
          detailRoleList: response.rolePurviewOperateVOS || [],
          rolePurviewDataVos: response.rolePurviewDataVos || [],
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
