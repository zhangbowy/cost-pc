import localMenu from '@/common/menu';
import { post } from '@/utils/request';
import api from '@/services/api';
import Session from '@/utils/session';
// import { menuFilter } from '@/utils/authority';

export default {
  namespace: 'session',
  state: {
    userId: '', // 用户标识
    userName: '', // 账号
    realName: '', // 真实姓名
    phone: '',
    token: '',
    menus: [], // 左侧菜单
    isMenuReady: false, // 左侧单点数据获取标识
    isLogin: false, // 登录标识
    userInfo: {},
  },
  effects: {
    * getLeftMenu( {  put }) {
      // const response = yield call(
      //   get,
      //   api.getLeftMenu,
      //   payload,
      // );
      yield put({
        type: 'save',
        payload: {
          // menus: menuFilter(response, localMenu),
          menus: localMenu,
          isMenuReady: true,
        },
      });
    },
    *login({ payload }, { call, put }) {
      console.log(api.login);
      const response = yield call(post, api.login, payload);
      Session.set('userInfo', JSON.stringify(response.result));
      yield put({
        type: 'save',
        payload: {
          userInfo: response.result,
          isLogin: true,
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
