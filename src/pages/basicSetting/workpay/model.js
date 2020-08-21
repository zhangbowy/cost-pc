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
    *modifyGrant({ payload, callback }, { call, put }) {
      const response = yield call(post, api.modifyGrant, payload,{withCode: true});
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          modifyGrant: response,
        },
      });
    },
    // 获取授权地址
    *getAuthUrl({ payload, callback }, { call, put }) {
      const response = yield call(get, api.getAuthUrl, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          getAuthUrl: response,
        },
      });
    },
    // 企业是否授权
    *getCompanyAuthResult({ payload, callback }, { call, put }) {
      const response = yield call(get, api.getCompanyAuthResult, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          getCompanyAuthResult: response,
        },
      });
    },
    // 导入模板下载
    *exportTemplate({ payload, callback }, { call, put }) {
      const response = yield call(get, api.exportTemplate, payload);
      console.log(22222222222222,response);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          exportTemplate: response,
        },
      });
    },
    // 用户批量导入
    *userInfoExcel({ payload, callback }, { call, put }) {
      const response = yield call(get, api.userInfoExcel, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          userInfoExcel: response,
        },
      });
    },
    // 失败数据导出
    *failData({ payload, callback }, { call, put }) {
      const response = yield call(get, api.failData, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          failData: response,
        },
      });
    },
    // 导入信息查询complete
    *getImportInfo({ payload, callback }, { call, put }) {
      const response = yield call(get, api.getImportInfo, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          getImportInfo: response,
        },
      });
    },
    // 完成
    *complete({ payload, callback }, { call, put }) {
      const response = yield call(get, api.complete, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          complete: response,
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
