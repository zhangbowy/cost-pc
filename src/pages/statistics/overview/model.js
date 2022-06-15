/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { message } from 'antd';
import { post, get } from '@/utils/request';
import constants from '@/utils/constants';
import api from './services';
import { filterData } from '@/utils/util';

const { PAGE_SIZE } = constants;
const exportObj = {
  0: {
    exportUrl: api.exports,
    fileName: '支出明细',
  },
  1: {
    exportUrl: api.deptExport,
    fileName: '部门支出'
  },
  2: {
    exportUrl: api.classifyExport,
    fileName: '类别支出'
  },
  3: {
    exportUrl: api.projectExport,
    fileName: '项目支出'
  },
  4: {
    exportUrl: api.peopleExport,
    fileName: '员工支出'
  },
  5: {
    exportUrl: api.supplierExport,
    fileName: '供应商支出'
  },
  6: {
    exportUrl: api.officeExport,
    fileName: '分公司支出'
  }
};
export default {
  namespace: 'overview',
  state: {
    list: [],
    total: 0,
    sum: 0,
    setDetail:{},
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
    chartList: [],
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
      let response = [];
      let isNoRole = false;
      if (responses.code === 200) {
        response = filterData(responses.result);
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
    *classify({ payload }, { call, put }) {
      const response = yield call(post, api.classify, payload);
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
        categoryName: '合计',
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
      yield put({
        type: 'save',
        payload: {
          list: response || [],
        },
      });
    },
    *project({ payload }, { call, put }) {
      const response = yield call(post, api.project, payload);
      if (response) {
        response.unshift({
          projectName: '合计',
          id: -1,
          'submitSum': response && response.length ?
          response.reduce((prev, next) => {
            return prev + next.submitSumAll;
          }, 0) : 0,
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
          children: []
        });
      }
      yield put({
        type: 'save',
        payload: {
          list: response ? response.map(it => { return { ...it, submitSum: it.submitSumAll }; }) : [],
        },
      });
    },
    *people({ payload }, { call, put }) {
      const response = yield call(post, api.people, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          queryPage: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize
          },
          total: response.page.total || 0,
        },
      });
    },
    *supplier({ payload }, { call, put }) {
      const response = yield call(post, api.supplier, payload);
      response.unshift({
        supplierName: '合计',
        id: -1,
        'submitSum': response && response.length ?
        response.reduce((prev, next) => {
          return prev + next.submitSumAll;
        }, 0) : 0,
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
        children: []
      });
      yield put({
        type: 'save',
        payload: {
          list: response || [],
        },
      });
    },
    *office({ payload }, { call, put }) {
      const responses = yield call(post, api.office, payload, { withCode: true });
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
            officeName: '合计',
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
      let url = api.deptDetail;
      switch(Number(payload.currentType)) {
        case 2:
          url = api.classifyDetail;
        break;
        case 3:
          url = api.projectDetail;
        break;
        case 4:
          url = api.peopleDetail;
        break;
        case 5:
          url = api.supplierDetail;
        break;
        case 6:
          url = api.officeDetail;
        break;
        default:
          break;
      }
      const response = yield call(post, url, payload);
      yield put({
        type: 'save',
        payload: {
          detailList: response.pageResult ? response.pageResult.list : [],
          listTotal: response.submitSum || 0,
          pieChartVos: response.pieChartVos || [],
          listQuery: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: response.pageResult && response.pageResult.page ? response.pageResult.page.total : 0,
          },
        },
      });
    },
    *pageDetail({ payload }, { call, put }) {
      const response = yield call(post, api.deptDetail, payload);
      yield put({
        type: 'save',
        payload: {
          detailList: response.pageResult ? response.pageResult.list : [],
          listQuery: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: response.pageResult && response.pageResult.page ? response.pageResult.page.total : 0,
          },
        },
      });
    },
    *export({ payload }, { call }) {
      const { exportUrl, fileName } = exportObj[payload.currentType];
      Object.assign(payload, { exportType:'export', fileName });
      yield call(post, exportUrl, payload);
    },
    *chart({ payload }, { call, put }) {
      let url = api.chart;
      if (payload.chartTypes === 'supplier') {
        url = api.supplierChart;
        delete payload.chartTypes;
      }
      const response = yield call(post, url, payload);
      yield put({
        type: 'save',
        payload: {
          chartList: response || [],
        },
      });
    },
    *setDetail({ payload }, { call, put }) {
      const response = yield call(get, api.setDetail, payload);
      yield put({
        type: 'save',
        payload: {
          setDetail: response || {},
        },
      });
    },
    *set({ payload }, { call }) {
      yield call(post, api.set, payload);
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
