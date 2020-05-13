/* eslint-disable no-undef */
import 'moment/locale/zh-cn';
// import header from '@/utils/header';
// import constants from '@/utils/constants';
import '@/assets/css/layout.scss';
import '@/assets/css/ant.scss';
import '@/assets/css/form.scss';
import '@/assets/iconfont/iconfont.scss';
import '@/assets/css/common.scss';
import { includes } from 'lodash';
import { parse } from 'qs';
// import {
//   getQueryString
// } from '@/utils/util';
import ddConfig from './utils/dd.config';

 // 获取corpid
 function getCorpid () {
  const localval = localStorage.getItem('CORP_ID');
  const { search } = window.location;
  if (search) {
    if (includes(search, 'corpid=')) {
      return parse(search.slice(1)).corpid;
    } if (
      includes(search, '?') && !includes(search, '=')
    ) {
      return search.slice(1);
    }
      return localval;

  }
  return localval;
}

const corpId = getCorpid() || [];

// 钉钉免登
ddConfig.auth(corpId).then((res) => {
  console.log(window.g_app._store.dispatch);
  // 用户信息存储
  window.g_app._store.dispatch({
    type: 'session/login',
    payload: {
      corpId,
      authCode: res.code,
      isLogin: true,
    }
  });
  // 左侧菜单请求
  window.g_app._store.dispatch({
    type: 'session/getLeftMenu',
    payload: {},
  });
  console.log(window.g_app._store);
}).catch(e => {
  console.log(e);
});
