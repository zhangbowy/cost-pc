/* eslint-disable no-unused-vars */
import localMenu from '@/common/menu';
import { post, get } from '@/utils/request';
import api from '@/services/api';
import Session from '@/utils/session';
import { menuFilter } from '@/utils/authority';
import treeConvert from '@/utils/treeConvert';

export default {
  namespace: 'session',
  state: {
    userId: '', // 用户标识
    userName: '', // 账号
    realName: '', // 真实姓名
    phone: '',
    token: '',
    menus: [], // 左侧菜单
    BasicSettingMenus: [], // 设置菜单
    isMenuReady: false, // 左侧单点数据获取标识
    isLogin: false, // 登录标识
    userInfo: {},
    status: 0,
    approvalNum: 0,
  },
  effects: {
    * getLeftMenu({ payload }, { call, put }) {
      const response = yield call(
        get,
        api.getLeftMenu,
        payload,
      );
      const menus = treeConvert({
        rootId: 0,
        pId: 'parentId',
        name: 'menuName',
        tName: 'name',
        otherKeys: ['url'],
      }, response);
      yield put({
        type: 'save',
        payload: {
          // newmenus: response,
          menus: menuFilter(menus, localMenu),
          // menus: localMenu,
          isMenuReady: true,
        },
      });
    },
    * getApproval({ payload }, { call, put }) {
      const response = yield call(
        get,
        api.getApprovalNum,
        payload,
      );
      yield put({
        type: 'save',
        payload: {
          // newmenus: response,
          approvalNum: response || 0,
        },
      });
    },
    * getBasicSettingMenus({ payload }, { call, put }) {
      const response = yield call(
        get,
        api.BasicSettingMenus,
        payload,
      );
      yield put({
        type: 'save',
        payload: {
          // newmenus: response,
          BasicSettingMenus: response,
          // menus: localMenu,
          // isMenuReady: true,
        },
      });
    },
    *login({ payload }, { call, put }) {
      // const response = yield call(post, api.login, payload);
      Object.assign(payload, {
        corpId: 'dinge2a0bb32d9e9bc4affe93478753d9884',
        dingUserId: '316109440937756496'
      });
      const response = yield call(get, api.mockLogin, payload);
      Session.set('userInfo', JSON.stringify(response));
      localStorage.setItem('workbenchIsBoss', response.workbenchIsBoss);
      localStorage.setItem('isSetWorkbench', response.isSetWorkbench);
      localStorage.setItem('token', response.token);
      localStorage.setItem('statisticalDimension', response.statisticalDimension);
      localStorage.setItem('isAlitripAuth', response.isAlitripAuth ? 1 : 0);
      yield put({
        type: 'save',
        payload: {
          userInfo: response || {},
          status: response.costConfigCheckVo.status || 0,
          isLogin: true,
        }
      });
    },
    *setUserRole({ payload }, { call }) {
      yield call(get, api.setUserRole, payload);
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
