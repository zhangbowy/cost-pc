/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/**
 * 数据请求
 *
 * @author Tan Wei <tanwei@jimistore.com>
 */
import { fetch } from 'dva';
import header from '@/utils/header';
import constants from '@/utils/constants';
import { includes } from 'lodash';
import { parse } from 'qs';
import moment from 'moment';
import ddConfig from '@/utils/dd.config';
// import Session from '@/utils/session';

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

function parseJSON(response) {
  return response.json();
}

// http请求状态校验
function checkStatus(response) {
  // console.log(response);
  if (response.headers.get('token')) {
    localStorage.removeItem('token');
    localStorage.setItem('token', response.headers.get('token'));
  }
  if (response.headers.get('repeat')) {
    localStorage.removeItem('repeat');
    localStorage.setItem('repeat', response.headers.get('repeat'));
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText || constants.ERR_MSG);
  error.code = response.status;
  throw error;
}

/**
 * get请求方式参数解析
 *
 * @param {Object|Array|String} data
 * @returns {String}
 */
function makeGetParams(data) {
  const type = Object.prototype.toString.call(data);
  switch (type) {
    case '[object Object]': {
      const paramsArr = [];
      Object.keys(data).forEach((key) => {
        paramsArr.push(`${key}=${encodeURIComponent(data[key])}`);
      });

      if (paramsArr.length > 0) {
        return paramsArr.join('&');
      }
      return '';
    }
    case '[object Array]':
      return data.join('&');
    case '[object String]':
      return data;
    default:
      return '';
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param {String} url - The URL we want to request
 * @param {Object} [config] - The options we want to pass to "fetch"
 * @returns {Object} An object containing either "data" or "err"
 */
function request(url, config) {
  let requestUrl = url;
  const options = {
    method: config.method || 'POST',
    mode: 'cors', // 请求模式
    catche: 'cache', // 缓存
  };

  /* ---------- 请求参数处理 ----------*/
  if (Object.is(config.method, 'GET')) {
    const params = makeGetParams(config.data);
    if (params !== '') {
      if (Object.is(requestUrl.indexOf('?'), -1)) {
        requestUrl += `?${params}`;
      } else {
        requestUrl += `&${params}`;
      }
    }
  } else if (Object.is(config.method, 'POST')) {
    if (config.data && !(config.data instanceof FormData)) {
      Object.assign(options, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
    }

    if (config.data) {
      if (typeof config.data !== 'string' && !(config.data instanceof FormData)) {
        options.body = JSON.stringify(config.data);
      } else {
        options.body = config.data;
      }
    }
  }

  /* ---------- 请求头处理 ----------*/
  if (config.standard) {
    // 约定请求
    if (config.method === 'POST' && config.data) {
      header.signature(options.body, config.data.id);
    } else {
      header.signature(null, config.data.id);
    }
    Object.assign(options, {
      headers: {
        ...options.headers,
        ...header.common,
        ...config.headers,
        token: (url.indexOf('/login') === -1 && localStorage.getItem('token')) || '',
        repeat: localStorage.getItem('repeat') || ''
      },
    });
  } else {
    Object.assign(options, {
      headers: {
        ...options.headers,
        ...config.headers,
        token: (url.indexOf('/login') === -1 && localStorage.getItem('token')) || '',
        repeat: localStorage.getItem('repeat') || ''
      },
    });
  }
  if(config.data.type === 'export') {
    return Promise.race([
      fetch(requestUrl, options),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), constants.TIMEOUT);
      }),
    ])
      .then(checkStatus)
      .then(res => res.blob())
      .then(blob => {
          const urls = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = urls;
          a.download = `${config.data.fileName}-${moment(new Date()).format('YYYY-MM-DD')}.xls`;
          a.click();
       });
  }
  return Promise.race([
    fetch(requestUrl, options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), constants.TIMEOUT);
    }),
  ])
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      // console.log(data);
      if (Object.is(data.code, 30002)) {
        // console.log(url, config);
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
          }).then(() => {
            // console.log(url, config);
          });
        }).catch(e => {
          console.log(e);
        });
      }
      if (config.standard) {
        // 约定请求
        if (config.withCode) {
          // 返回所有数据【code+data/code+message】
          return data;
        }
        if (Object.is(data.code, 200) || Object.is(data.code, 500000)) {
          return data.result;
        }
        const error = new Error(data.message || constants.ERR_MSG);
        error.code = data.code;
        throw error;
      }
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

// get请求
async function get(url, data, config) {
  // console.log(55555555+"get",url);
  return request(url, {
    data,
    method: 'GET',
    standard: true, // 约定请求：特殊请求头【加签名】，统一的返回格式【code+data/code+message】
    withCode: false, // 返回值是否包含code【默认只返回data】
    ...config,
  });
}

// post请求
async function post(url, data, config) {
  // console.log(55555555+"post",url);
  return request(url, {
    data,
    method: 'POST',
    standard: true,
    withCode: false,
    ...config,
  });
}

export {
  get,
  post,
};



