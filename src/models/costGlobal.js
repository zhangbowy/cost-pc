import { post, get } from '@/utils/request';
import api from '@/services/api';

export default {
  namespace: 'costGlobal',
  state: {
    costCategoryList: [], // 可用的费用类别
    folderList: [], // 费用夹列表
    detailFolder: {}, // 费用夹详情
    page: {
      pageNo: 1,
      pageSize: 10,
    },
    total: 1,
    draftList: [],
    draftDetail: {},
  },
  effects: {
    *addFolder({ payload }, { call }) {
      yield call(post, api.addFolder, payload);
    },
    *editFolder({ payload }, { call }) {
      yield call(post, api.editFolder, payload);
    },
    *delFolder({ payload }, { call }) {
      yield call(post, api.delFolder, payload);
    },
    *listFolder({ payload }, { call, put }) {
      const response = yield call(get, api.listFolder, payload);
      const lists = response.costDetailVos.list || [];
      yield put({
        type: 'save',
        payload: {
          folderList: lists || [],
          total: response.costDetailVos.page.total || 1,
          page: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          }
        },
      });
    },
    *detailFolder({ payload }, { call, put }) {
      const response = yield call(get, api.detailFolder, payload);
      yield put({
        type: 'save',
        payload: {
          detailFolder: response || {},
        },
      });
    },
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.useExpense, payload);
      yield put({
        type: 'save',
        payload: {
          costCategoryList: response || [],
        },
      });
    },
    *addDraft({ payload }, { call }) {
      yield call(post, api.addDraft, payload);
    },
    *editDraft({ payload }, { call }) {
      yield call(post, api.editDraft, payload);
    },
    *delDraft({ payload }, { call }) {
      yield call(post, api.delDraft, payload);
    },
    *listDraft({ payload }, { call, put }) {
      const response = yield call(get, api.listDraft, payload);
      const lists = response.draftBoxPageResult.list || [];
      yield put({
        type: 'save',
        payload: {
          draftList: lists || [],
          total: response.draftBoxPageResult.page.total || 1,
          page: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          }
        },
      });
    },
    *detailDraft({ payload }, { call, put }) {
      const response = yield call(get, api.detailDraft, payload);
      yield put({
        type: 'save',
        payload: {
          detailDraft: response || {},
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
  },
};
