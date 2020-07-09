import { get } from '@/utils/request';
import api from './services';

export default {
  namespace: 'supplier',
  state: {
    list: [],
  },
  effects: {
    *getList({ payload }, {call, put }) {
      const response = yield call(get, api.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || []
        }
      });
    }
  }
};
