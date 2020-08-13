import { get, post } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'controller',
  state: {
    removeDataTime: null,
    modifyGrant: null,
  },
  effects: {
    *getTime({ payload }, { call, put }) {
      const response = yield call(get, api.getTime, payload);
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response ? response.removeDataTime : null,
          synCompanyTime: response ? response.synCompanyTime : null,
          status: response ? response.status : 0,
        },
      });
    },
    *del({ payload }, { call, put }) {
      const response = yield call(get, api.del, payload);
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response || null,
        },
      });
    },
    *delCompany({ payload }, { call, put }) {
      const response = yield call(get, api.delCompany, payload);
      yield put({
        type: 'save',
        payload: {
          removeDataTime: response || null,
        },
      });
    },
    *queryUsers({ payload }, { call, put }) {
      const response = yield call(get, api.queryUsers, payload);
      yield put({
        type: 'save',
        payload: {
          queryUsers: response || null,
        },
      });
    },
    *modifyGrant({ payload }, { call, put }) {
      const response = yield call(post, api.modifyGrant, payload,{withCode: true});
      console.log(5555,response);
      yield put({
        type: 'save',
        payload: {
          modifyGrant: response,
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
