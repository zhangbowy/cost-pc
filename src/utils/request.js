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


function parseJSON(response) {
  response.headers.forEach((key, value) => {
    console.log(key, value);
  });
  return response.json();
}

// http请求状态校验
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    console.log(response.headers.get('token'));
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
    catche: 'no-cache', // 缓存
    token: 'ad8ba887-83a4-4aad-b41d-357d9607116b',
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
    Object.assign(options, {
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
        token: 'ad8ba887-83a4-4aad-b41d-357d9607116b',
      },
    });
    if (config.data) {
      if (typeof config.data !== 'string') {
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
      header.signature(options.body);
    } else {
      header.signature();
    }
    Object.assign(options, {
      headers: {
        ...options.headers,
        ...header.common,
        ...config.headers,
        token: 'ad8ba887-83a4-4aad-b41d-357d9607116b',
      },
    });
  } else {
    Object.assign(options, {
      headers: {
        ...options.headers,
        ...config.headers,
        token: 'ad8ba887-83a4-4aad-b41d-357d9607116b',
      },
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
      if (config.standard) {
        // 约定请求
        if (config.withCode) {
          // 返回所有数据【code+data/code+message】
          return data;
        }
        if (Object.is(data.code, 200)) {
          return data.result;
        }
        console.log(data);
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


// import axios from 'axios';
// import { stringify } from 'qs';
// import dd from '@/utils/dd.config';
// import Cookie from '@/utils/cookie.js';
// import jsMd5 from 'md5';
// import constants from '@/utils/constants';

// const {
//   APP_API,
// } = constants;
// // 加密函数，直接修改对象，无返回
// function encipher (data = {}, nature = '', target = 'sign') {
//   const secret = 'sq2019';
//   // eslint-disable-next-line no-param-reassign
//   data[target] = jsMd5(data[nature] + secret);
// }

// // 默认请求格式
// console.log(`${APP_API}`);
// const DefaultContentType = 'application/x-www-form-urlencoded;charset=UTF-8';
// const baseURL = `${APP_API}`;

// const instance = axios.create({
//   baseURL,
//   timeout: 20000, // 默认20s，对特定需要配置的接口只需要配置自定义字段
//   withCredentials: false,
//   responseType: 'json',
//   headers: { 'Content-Type': DefaultContentType },
//   // 定义可获得的http响应状态码
//   // return true、设置为null或者undefined，promise将resolved,否则将rejected
//   validateStatus (status) {
//     return status >= 200 && status < 300; // default
//   }
// });

// // 添加一个请求拦截器
// // eslint-disable-next-line func-names
// instance.interceptors.request.use(function (config) {
//   // 配置 rap2 模拟数据, 配置请求参数
//   if (config.method === 'post') {
//     if (config.data) {
//       if (config.data._baseUrl) {
//         config.baseURL = config.data._baseUrl;
//         delete config.data._baseUrl;
//       }
//       config.data.__platform = 'pc';
//     } else {
//       config.data = { __platform: 'pc' };
//     }
//   } else if (config.params) {
//       if (config.params._baseUrl) {
//         config.baseURL = config.params._baseUrl;
//         delete config.params._baseUrl;
//       }
//       config.params.__platform = 'pc';
//     } else {
//       config.params = { __platform: 'pc' };
//     }

//   // 当且仅当请求类型为post并且请求格式为表单形式时将参数序列化
//   if (config.method === 'post' &&
//     config.headers['Content-Type'] === DefaultContentType &&
//     config.data.constructor !== FormData
//   ) {
//     config.data = stringify(config.data);
//   }
//   // 添加头部字段customname
//   if (!config.headers.customname && config.url !== `${baseURL}/user/login`) {
//     const customname = localStorage.getItem('CUSTOM_NAME');
//     config.headers.customname = customname;
//   }
//   if (!config.headers.token) {
//     config.headers.token = localStorage.getItem('RETOKEN');
//   }
//   return config;
// }, function (error) {
//   return Promise.reject(error);
// });

// // 添加一个响应拦截器
// instance.interceptors.response.use(function (response) {
//   if (response.config.url === `${baseURL}/preferences/getPersonalization`) {
//     // 设置页面title
//     if (response.data && response.data.result) {
//       const { data: { result: { communityName } } } = response;
//       document.title = communityName || '云社区';
//     }
//   } else if (response.config.url === `${baseURL}/manage/getCorpInfo`) {
//     // 设置页面title
//     if (response.data && response.data.result) {
//       const { data: { result: { personalization } } } = response;
//       if (personalization && personalization.communityName) {
//         document.title = personalization.communityName || '云社区';
//       }
//     }
//   // eslint-disable-next-line no-bitwise
//   } else if (~response.config.url.indexOf('/user/login')) {
//     const name = response.headers.customname;
//     if (name) {
//       Cookie.set('CUSTOM_NAME', name);
//       localStorage.setItem('CUSTOM_NAME', name);
//     }
//   }
//   if (response.headers.token) {
//     const {token} = response.headers;
//     Cookie.set('RETOKEN', token);
//     localStorage.setItem('RETOKEN', token);
//   }
//   // 登录过期
//   if (response.data && response.data.code === 1002) {
//     window.location.reload();
//     dd.toast('error', '获取数据失败，请重新登陆!');
//   }
//   return response;
// }, function (error) {
//   return Promise.reject(error);
// });

// // 将请求数据的方式包装成一个对象
// const api = {};
// const likeGet = ['delete', 'get', 'head', 'options'];
// const likePost = ['post', 'put', 'patch'];

// api.request = function () {
//   const _arguments = Array.prototype.slice.call(arguments);
//   const isPost = _arguments[0];
//   const method = _arguments[1];
//   const url = _arguments[2];
//   const data = _arguments[3] || {};
//   const other = _arguments[4] || {};
//   const config = { method, url };
//   if (typeof other === 'string') {
//     encipher(data, other);
//   } else {
//     if (other.sign) {
//       encipher(data, other.sign);
//       delete other.sign;
//     }
//     Object.assign(config, other);
//   }

//   config[isPost ? 'data' : 'params'] = data;
//   return new Promise(function (resolve, reject) {
//     instance
//       .request(config)
//       .then(res => {
//         if (res.data) {
//           res.data.code === 200 ? resolve(res.data) : reject(res.data);
//         } else {
//           reject(res);
//         }
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// };

// likeGet.forEach(method => {
//   api[method] = function () {
//     return api.request(false, method, ...arguments);
//   };
// });

// likePost.forEach(method => {
//   api[method] = function () {
//     return api.request(true, method, ...arguments);
//   };
// });

// export default api;
