import { get, post } from '@/utils/request';
import constants from '@/utils/constants';
// import { ddOpenLink } from '@/utils/ddApi';
import api from './services';

const { PAGE_SIZE } = constants;
export default {
  namespace: 'batch',
  state: {
    list: [],
    query: {
      pageNo: 1,
      pageSize: PAGE_SIZE,
    },
    detailList: [],
    menuList: [],
    detailRoleList: [],
    UseTemplate: [], // 常用
    OftenTemplate: [], // 其他
    total: 0,
    batchDetails:{}
  },
  effects: {
    *list({ payload }, { call, put }) {
      console.log(call);
      console.log(23123123123,payload);
      const response = yield call(post, api.list, payload);
      // const response = {
      //   list:[
      //     {
      //       id:'469137540827451392',
      //       outBatchNo:'12345678',
      //       batchTransId:'qwqwq',
      //       totalTransAmount:23.32,
      //       totalCount:32,
      //       failTransAmount:23.32,
      //       failCount:32,
      //       status:1,
      //       createTime:1600838980921
      //     }
      //   ],
      //   page:{
      //     current_page:4,
      //     next_page:0,
      //     pre_page:3,
      //     total:1,
      //     total_page:4
      //   },
      // };
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          query: {
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          },
          total: response.page.total || 0,
        },
      });
    },
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.costCateList, payload);
      yield put({
        type: 'save',
        payload: {
          UseTemplate: response.UseTemplate || [],
          OftenTemplate: response.OftenTemplate || [],
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(get, api.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detailRoleList: response.rolePurviewOperateVOS || [],
          rolePurviewDataVos: response.rolePurviewDataVos || [],
        },
      });
    },
    *detailList({ payload }, { call, put }) {
      const response = yield call(get, api.detailList, payload);
      const data = response && response.map((item, index)=>{
        const obj = {...item};
        obj.xh = index+1;
        return obj;
      });
      yield put({
        type: 'save',
        payload: {
          detailList: data || [],
        },
      });
    },
    *del({ payload }, { call }) {
      yield call(get, api.del, payload);
    },
    *pay({ payload }, { call, put }) {
      const response = yield call(post, api.pay, payload);
      yield put({
        type: 'save',
        payload: {
          payData: response.result,
        },
      });
      if(response){
        window.location.href = response;
        // http://targetpage.com?ddtab=true&redirect=[要转码:http://www.zhifubao.com]
        // ddOpenLink('/redirect?ddtab=true&redirect='+response);
        // ddOpenLink(response);
      }
    },
    *close({ payload }, { call }) {
      yield call(get, api.close, payload);
    },
    *unRemind({ payload }, { call }) {
      yield call(get, api.unRemind, payload);
    },
    *ejectFrame({ payload }, { call, put }) {
      const response = yield call(get, api.ejectFrame, payload);
      yield put({
        type: 'save',
        payload: {
          huaVisible: response.type === 1,
        },
      });
    },
    *reCreate({ payload, callback }, { call, put }) {
      const response = yield call(get, api.reCreate, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'save',
        payload: {
          batchDetails: response,
        },
      });
    },
    *rePayment({ payload }, { call }) {
      yield call(post, api.rePayment, payload);
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
