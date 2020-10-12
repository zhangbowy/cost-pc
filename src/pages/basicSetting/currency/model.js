import { get, post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './service';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'currency',
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
      response.unshift({
        exchangeRate:'',
        currencyType: 3,
        status:0, // 0：启用，1：禁用
        name:'人民币',
        currencyCode:'CNY',
        currencySymbol:'¥'
      });
      console.log('response======',response);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
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
      yield call(post, api.del, payload);
    },
    *add({ payload }, { call }) {
      yield call(post, api.add, payload);
    },
    *edit({ payload }, { call }) {
      yield call(post, api.edit, payload);
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
