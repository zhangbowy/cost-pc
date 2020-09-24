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
      console.log(23123123123,payload);
      let isQuery = true;
      const obj = {...payload};
      if(payload.status === '1' || payload.status === '3'){
        obj.pageSize = 10000;
        obj.pageNo = 1;
        isQuery = false;
      }
      
      const response = yield call(post, api.list, obj);
      yield put({
        type: 'save',
        payload: {
          list: response.list || [],
          query: isQuery?{
            pageSize: payload.pageSize,
            pageNo: payload.pageNo,
          }:{},
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
