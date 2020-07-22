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
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
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
