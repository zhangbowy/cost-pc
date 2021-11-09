/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import axios from 'axios';
import { stringify } from 'qs';
import jsMd5 from 'md5';
import { constants } from 'crypto';
import dd from '@/utils/dd.config';
import Cookie from '@/utils/cookie.js';
// 加密函数，直接修改对象，无返回
function encipher (data = {}, nature = '', target = 'sign') {
  const secret = 'sq2019';
  data[target] = jsMd5(data[nature] + secret);
}

const { APP_API } = constants;
// 默认请求格式
const DefaultContentType = 'application/x-www-form-urlencoded;charset=UTF-8';
const baseURL = `${APP_API}/cost`;

const instance = axios.create({
  baseURL,
  timeout: 20000, // 默认20s，对特定需要配置的接口只需要配置自定义字段
  withCredentials: false,
  responseType: 'json',
  headers: { 'Content-Type': DefaultContentType },
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus (status) {
    return status >= 200 && status < 300; // default
  }
});

// 添加一个请求拦截器
instance.interceptors.request.use(function (config) {
  // 配置 rap2 模拟数据, 配置请求参数
  if (config.method === 'post') {
    if (config.data) {
      if (config.data._baseUrl) {
        config.baseURL = config.data._baseUrl;
        delete config.data._baseUrl;
      }
      config.data.__platform = 'pc';
    } else {
      config.data = { __platform: 'pc' };
    }
  } else if (config.params) {
      if (config.params._baseUrl) {
        config.baseURL = config.params._baseUrl;
        delete config.params._baseUrl;
      }
      config.params.__platform = 'pc';
    } else {
      config.params = { __platform: 'pc' };
    }

  // 当且仅当请求类型为post并且请求格式为表单形式时将参数序列化
  if (config.method === 'post' &&
    config.headers['Content-Type'] === DefaultContentType &&
    config.data.constructor !== FormData
  ) {
    config.data = stringify(config.data);
  }
  // 添加头部字段customname
  if (!config.headers.customname && config.url !== `${baseURL}/user/login`) {
    const customname = localStorage.getItem('CUSTOM_NAME');
    config.headers.customname = customname;
  }
  if (!config.headers.token) {
    config.headers.token = localStorage.getItem('RETOKEN');
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加一个响应拦截器
instance.interceptors.response.use(function (response) {
  if (response.config.url === `${baseURL}/preferences/getPersonalization`) {
    // 设置页面title
    if (response.data && response.data.result) {
      const { data: { result: { communityName } } } = response;
      document.title = communityName || '云社区';
    }
  } else if (response.config.url === `${baseURL}/manage/getCorpInfo`) {
    // 设置页面title
    if (response.data && response.data.result) {
      const { data: { result: { personalization } } } = response;
      if (personalization && personalization.communityName) {
        document.title = personalization.communityName || '云社区';
      }
    }
  } else if (~response.config.url.indexOf('/user/login')) {
    const name = response.headers.customname;
    if (name) {
      Cookie.set('CUSTOM_NAME', name);
      localStorage.setItem('CUSTOM_NAME', name);
    }
  }
  if (response.headers.token) {
    const {token} = response.headers;
    Cookie.set('RETOKEN', token);
    localStorage.setItem('RETOKEN', token);
  }
  // 登录过期
  if (response.data && response.data.code === 1002) {
    window.location.reload();
    dd.toast('error', '获取数据失败，请重新登陆!');
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

// 将请求数据的方式包装成一个对象
const api = {};
const likeGet = ['delete', 'get', 'head', 'options'];
const likePost = ['post', 'put', 'patch'];

api.request = function () {
  const _arguments = Array.prototype.slice.call(arguments);
  const isPost = _arguments[0];
  const method = _arguments[1];
  const url = _arguments[2];
  const data = _arguments[3] || {};
  const other = _arguments[4] || {};
  const config = { method, url };
  if (typeof other === 'string') {
    encipher(data, other);
  } else {
    if (other.sign) {
      encipher(data, other.sign);
      delete other.sign;
    }
    Object.assign(config, other);
  }

  config[isPost ? 'data' : 'params'] = data;
  return new Promise(function (resolve, reject) {
    instance
      .request(config)
      .then(res => {
        if (res.data) {
          res.data.code === 200 ? resolve(res.data) : reject(res.data);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

likeGet.forEach(method => {
  api[method] = function () {
    return api.request(false, method, ...arguments);
  };
});

likePost.forEach(method => {
  api[method] = function () {
    return api.request(true, method, ...arguments);
  };
});

export default {
  post: api.post,
  get: api.get,
};
