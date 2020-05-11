import localMenu from '@/common/menu';
import { get } from '@/utils/request';
import api from '@/services/api';
import { menuFilter } from '@/utils/authority';

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
  },
  effects: {
    * getLeftMenu({ payload }, { call, put }) {
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
