import 'moment/locale/zh-cn';
// import header from '@/utils/header';
import constants from '@/utils/constants';
import '@/assets/css/layout.scss';
import '@/assets/css/ant.scss';
import '@/assets/css/form.scss';
import {
  requestAuth
} from '@/utils/ddApi';
import {
  getQueryString
} from '@/utils/util';
import APPSSO from '../userInfoMock'; // debug

const id = getQueryString('corpid');
// console.log(window);
window.APPSSO = APPSSO;

// 钉钉免登
requestAuth(id, () => {
  console.log('初始化登陆完成');
  console.log(window);
  // 用户信息存储
}).then(res => {
  console.log(res);
  console.log('登陆完成了～');
  console.log(window.g_app._store);
  // window.g_app._store.dispatch({
  //   type: 'session/save',
  //   payload: {
  //     isLogin: true,
  //   },
  // });
  // // 左侧菜单请求
  // window.g_app._store.dispatch({
  //   type: 'session/getLeftMenu',
  //   payload: {
  //     sysId: constants.SYS_ID,
  //   },
  // });
});
// sso接入
window.APPSSO.init({
  sysId: constants.SYS_ID,
  appId: constants.APP_ID,
  password: constants.APP_PWD,
  domain: constants.APP_API,
}).then((res) => {
  console.log(window.g_app._store);
  // 用户信息存储
  window.g_app._store.dispatch({
    type: 'session/save',
    payload: {
      userId: res.userResponse.userId,
      userName: res.userResponse.userName,
      realName: res.userResponse.realName,
      phone: res.userResponse.phone,
      isLogin: true,
    },
  });
  // 左侧菜单请求
  window.g_app._store.dispatch({
    type: 'session/getLeftMenu',
    payload: {
      sysId: constants.SYS_ID,
    },
  });
});
