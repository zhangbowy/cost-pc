import 'moment/locale/zh-cn';
import header from '@/utils/header';
import constants from '@/utils/constants';
import '@/assets/css/layout.scss';
import '@/assets/css/ant.scss';
import '@/assets/css/form.scss';
import APPSSO from '../ssoMock'; // debug

console.log('初始化');
window.APPSSO = APPSSO; // debug

// 设置请求头
header.setPassword(constants.APP_PWD);
header.setCommons({
  appId: constants.APP_ID,
  OSVersion: `${parseFloat(navigator.appVersion)}`,
});

// sso接入
window.APPSSO.init({
  sysId: constants.SYS_ID,
  appId: constants.APP_ID,
  password: constants.APP_PWD,
  domain: constants.APP_API,
}).then((res) => {
  header.setCommons({
    userId: res.userResponse.userId,
    token: res.token,
  });
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
// window.g_app._store.dispatch({
//   type: 'session/getLeftMenu',
//   payload: {
//     sysId: constants.SYS_ID,
//   },
// });
