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
    isMenuReady: false, // 左侧单点数据获取标识
    isLogin: false, // 登录标识
    userInfo: {},
    status: 0,
  },
  effects: {
    * getLeftMenu({ payload }, { call, put }) {
      const response = yield call(
        get,
        api.getLeftMenu,
        payload,
      );
      // response.push({
      //   id: '4705310700739333467',
      //   icon: 'iconbaoxiaodanguanli',
      //   isAll:false,
      //   menuName:'批次管理',
      //   parentId:0,
      //   perms:'',
      //   sort:29,
      //   type:1,
      //   url:'batch'
      // });
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
    *login({ payload }, { call, put }) {
      const response = yield call(post, api.login, payload);
      Session.set('userInfo', JSON.stringify(response));
      localStorage.setItem('token', response.token);
      yield put({
        type: 'save',
        payload: {
          userInfo: response || {},
          status: response.costConfigCheckVo.status || 0,
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
