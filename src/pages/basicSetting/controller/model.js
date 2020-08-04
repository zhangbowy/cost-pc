import { get } from '@/utils/request';
// import constants from '@/utils/constants';
import api from './services';

// const { PAGE_SIZE } = constants;
export default {
  namespace: 'controller',
  state: {
    removeDataTime: null,
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
