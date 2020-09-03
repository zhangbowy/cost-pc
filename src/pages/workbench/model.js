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
          total: response.page.total || 0,
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
    *waitList({ payload }, { call, put }) {
      const response = yield call(get, api.waitList, payload);
      yield put({
        type: 'save',
        payload: {
          waitList: response || []
        }
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
