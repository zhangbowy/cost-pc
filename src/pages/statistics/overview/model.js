/* eslint-disable no-nested-ternary */
import { post } from '@/utils/request';
import constants from '@/utils/constants';
import { message } from 'antd';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'overview',
  state: {
    list: [],
    total: 0,
    sum: 0,
    queryPage: {
      pageSize: PAGE_SIZE,
      pageNo: 1
    },
    listQuery: {
      pageSize: PAGE_SIZE,
      pageNo: 1,
    },
    listTotal: 0,
    pieChartVos: [], // 弹窗的饼图
    detailList: [], // 弹窗的列表
    subSum: 0, // 总金额
  },
  effects: {
    *detail({ payload }, { call, put }) {
      const response = yield call(post, api.detail, payload);
      // const newArr = response.list && response.list.map(it => { return { ...it, money: it.submitSum }; });
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          queryPage: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page ? response.page.total : 0,
          sum: response.page ? response.page.totalSum : 0
        },
      });
    },
    *dept({ payload }, { call, put }) {
      const responses = yield call(post, api.dept, payload, { withCode: true });
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
    *deptDetail({ payload }, { call, put }) {
      const response = yield call(post, api.deptDetail, payload);
      console.log('*list -> response', response);
      yield put({
        type: 'save',
        payload: {
          detailList: response.pageResult ? response.pageResult.list : [],
          listTotal: response.pageResult && response.pageResult.page ? response.pageResult.page.total : 0,
          pieChartVos: response.pieChartVos || [],
          subSum: response.submitSum || 0,
          listQuery: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
        },
      });
    },
    *pageDetail({ payload }, { call, put }) {
      const response = yield call(post, api.deptDetail, payload);
      console.log('*list -> response', response);
      yield put({
        type: 'save',
        payload: {
          detailList: response.pageResult ? response.pageResult.list : [],
          listQuery: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
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
