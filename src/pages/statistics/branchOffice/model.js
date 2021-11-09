/* eslint-disable no-nested-ternary */
import { message } from 'antd';
import { post } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'branchOffice',
  state: {
    list: [],
    detailList: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE
    },
    total: 0,
    isNoRole: false,
  },
  effects: {
    *list({ payload }, { call, put }) {
      const responses = yield call(post, api.list, payload, { withCode: true });
      console.log('*list -> response', responses);
      let response = [];
      let isNoRole = false;
      if (responses.code === 200) {
        response = responses.result;
        if (response && response.length > 1) {
          const submitSum = response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumAll;
          }, 0) : 0;
          const submitSumAnnulus = response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumAnnulusAll;
          }, 0) : 0;
          const annuls = submitSumAnnulus ?
          Number(((((submitSum - submitSumAnnulus) / submitSumAnnulus).toFixed(2)) * 100).toFixed(0))
          : 0;
          const submitSumYear = response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumYearAll;
          }, 0) : 0;
          const yearOnYear = submitSumYear ?
          Number(((((submitSum - submitSumYear) / submitSumYear).toFixed(2)) * 100).toFixed(0))
          : 0;
          response.unshift({
            deptName: '合计',
            id: -1,
            'submitSum': submitSum,
            'submitSumAll': submitSum,
            'submitSumAnnulus': submitSumAnnulus,
            'submitSumAnnulusAll': 0,
            'submitSumYear': submitSumYear,
            'submitSumYearAll': 0,
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
            'yearOnYear': Math.abs(yearOnYear),
            'annulus': Math.abs(annuls),
            'yearOnYearSymbolType': submitSumYear === 0 ? null : yearOnYear > 0 ? 0 : 1,
            'annulusSymbolType': submitSumAnnulus === 0 ? null : annuls > 0 ? 0 : 1,
            children: [],
            childrens: [...response],
          });
        }
      } else if (responses.code === 90065) {
        isNoRole = true;
      } else {
        message.error(responses.message);
      }

      yield put({
        type: 'save',
        payload: {
          list: response || [],
          isNoRole,
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
      Object.assign(payload, { exportType:'export', fileName: '分公司支出表' });
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
