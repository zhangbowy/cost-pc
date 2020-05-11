/**
 * 数据请求
 *
 * @author Tan Wei <tanwei@jimistore.com>
 */
import { fetch } from 'dva';
import header from '@/utils/header';
import constants from '@/utils/constants';

function parseJSON(response) {
  return response.json();
}

// http请求状态校验
function checkStatus(response) {
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
    catche: 'no-cache', // 缓存
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
      },
    });
  } else {
    Object.assign(options, {
      headers: {
        ...options.headers,
        ...config.headers,
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
        if (Object.is(data.code, '200')) {
          return data.data;
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
  await window.APPSSO.authorize();
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
  await window.APPSSO.authorize();
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
