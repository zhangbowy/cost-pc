/* eslint-disable no-undef */
import 'moment/locale/zh-cn';
// import header from '@/utils/header';
// import constants from '@/utils/constants';
import '@/assets/css/layout.scss';
import '@/assets/css/ant.scss';
import '@/assets/css/form.scss';
import '@/assets/iconfont/iconfont.scss';
import '@/assets/css/common.scss';
import '@/assets/css/node.scss';
import { includes } from 'lodash';
import { parse } from 'qs';

// import {
//   getQueryString
// } from '@/utils/util';
// import { message } from 'antd';
import ddConfig from './utils/dd.config';
import Session from './utils/session';
import constants from './utils/constants';


const { isInDingTalk } = constants;
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
if (isInDingTalk && (window.location.href.indexOf('transformPage') === -1)) {
  // 钉钉免登
  ddConfig.auth(corpId).then((res) => {
    // 用户信息存储
    window.g_app._store.dispatch({
      type: 'session/login',
      payload: {
        corpId,
        authCode: res.code,
        isLogin: true,
      }
    }).then(async() => {
      localStorage.removeItem('corpId');
      localStorage.removeItem('authCode');
      localStorage.setItem('corpId', corpId);
      localStorage.setItem('authCode', res.code);
      const userInfo = Session.get('userInfo');
      const urls = window.location.href.replace(/&v=2.0/, '');
      const index = urls.indexOf('#/');
      await window.g_app._store.dispatch({
        type: 'global/jsApiAuth',
        payload: {
          companyId: userInfo.companyId,
          corpId,
          url:  index > 0 ? urls.substring(0, index) : urls,
        },
      });
      // 左侧菜单请求
      await window.g_app._store.dispatch({
        type: 'session/getLeftMenu',
        payload: {},
      });
      await window.g_app._store.dispatch({
        type: 'session/getApproval',
        payload: {},
      });
    });

    // console.log(window.g_app._store);
  }).catch(e => {
    console.log(e);
  });
} else {
  console.log('不是钉钉');
}

