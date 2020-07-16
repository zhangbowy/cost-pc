/* eslint-disable no-unused-vars */
import { get } from '@/utils/request';
import api from '@/services/api';

export default {
  namespace: 'supplierDel',
  state: {
    canDel: false,
    msg: ''
  },
  effects: {
    *checkCanDel({ payload }, { call, put }) {
      const response = yield call(get, api.canDel, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          ...response
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
  },
};
