import { get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'aliTravelData',
  state: {
    list: [],
    authorize: {},
  },
  effects: {
    *authorize({ payload }, { call, put }) {
      const response = yield call(get, api.authorize, payload);
      yield put({
        type: 'save',
        payload: {
          authorize: response || {},
          list: response.refs || [],
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
