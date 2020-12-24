import { post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'department',
  state: {
    list: [],
    detailList: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE
    },
    total: 0,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(post, api.list, payload);
      if (response && response.length > 1) {
        response.unshift({
          deptName: '合计',
          id: -1,
          'submitSum': 0,
          'submitSumAll': response && response.length ? response.reduce((prev, next) => {
            return prev + next.submitSumAll;
          }, 0) : 0,
          'submitSumAnnulus': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumAnnulusAll;
          }, 0) : 0,
          'submitSumAnnulusAll': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumAnnulusAll;
          }, 0) : 0,
          'submitSumYear': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumYearAll;
          }, 0) : 0,
          'submitSumYearAll': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumYearAll;
          }, 0) : 0,
          'submitUserCount': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitUserCountAll;
          }, 0) : 0,
          'submitUserCountAll': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitUserCountAll;
          }, 0) : 0,
          'submitCount': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitCountAll;
          }, 0) : 0,
          'submitCountAll': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitCountAll;
          }, 0) : 0,
          'categoryCount': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.categoryCountAll;
          }, 0) : 0,
          'categoryCountAll': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.categoryCountAll;
          }, 0) : 0,
          'yearOnYear': response && response.length ?
          response[0].yearOnYear : 0,
          'annulus': response && response.length ?
          response[0].annulus : 0,
          'yearOnYearSymbolType': response && response.length ?
          response[0].yearOnYearSymbolType : 0,
          'annulusSymbolType': response && response.length ?
          response[0].annulusSymbolType : 0,
          children: [],
          childrens: [...response],
        });
      }
      yield put({
        type: 'save',
        payload: {
          list: response || [],
        },
      });
    },
    *detailList({ payload }, { call, put }) {
      const response = yield call(post, api.detailList, payload);
      console.log('*list -> response', response);
      yield put({
        type: 'save',
        payload: {
          detailList: response.list || [],
          total: response.page.total || 0,
          query: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
        },
      });
    },
    *export({ payload }, { call }) {
      Object.assign(payload, { exportType:'export', fileName: '部门支出表' });
      yield call(post, api.export, payload);
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
