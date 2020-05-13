/**
 * 配置文件
 */
/* eslint-disable no-undef */

/* ---------- System ----------*/
export default {
  // 分页每页条数
  PAGE_SIZE: 10,
  // appid
  APP_ID: 'framework',
  // sysId
  SYS_ID: 'framework',
  // 请求超时时间
  TIMEOUT: 30000,
  // 请求错误提示
  ERR_MSG: '系统错误，请稍后重试',
  // deviceId存储key
  DEVICEID_KEY: 'framework_deviceId',
  APP_API,
};

/* ---------- Layout ----------*/
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

/* ---------- Business ----------*/
/**
 * 变量值提取
 *
 * @param {String} value
 * @param {Array} source
 * @param {Object} attributes
 * @param {String} [attributes.origin='key'] 原始key
 * @param {String} [attributes.key='value'] 提取key
 * @param {String} [attributes.format='--'] 无匹配项格式化
 * @param {String} [format='--'] 无匹配项格式化
 * @return {String}
 * @example
 *
 * const source = [
 *   { key: 'male', value: '男'},
 *   { key: 'female', value: '女'}
 * ];
 * getMapValue('male', source);
 * // => 男
 * getMapValue('other', source);
 * // => --
 */
export function getMapValue(key, map = {}, format = '--') {
  return map[key] || format;
}

// 性别
export const sexMap = {
  male: '男',
  female: '女',
};
