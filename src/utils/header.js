/**
 * 请求头
 *
 * setPassword - 设置秘钥
 * setCommon - 设置公共请求参数
 * setCommons - 设置公共请求参数【批量】
 * getCommon - 获取公共请求参数
 * signature - 签名
 *
 */
import md5 from 'md5';
import { Base64 } from 'js-base64';

class Header {
  constructor() {
    this.common = {
      appId: '', // app唯一标识
      deviceId: '', // 设备唯一标识
      userId: '', // 用户唯一标识
      OSVersion: '', // 设备系统版本号
      timestamp: '', // 时间戳【秒】
      sign: '', // 签名
      token: '', // token【登录后设置】
    };
    this.password = ''; // 秘钥
  }

  // 设置秘钥
  setPassword = (v = '') => {
    this.password = v;
  };

  // 设置公共请求参数
  setCommon = (key, value = '') => {
    Object.assign(this.common, {
      [key]: value,
    });
  };

  // 设置公共请求参数【批量】
  setCommons = (params) => {
    // 没有值的属性默认设为空字符串，以防签名出现key=undefined，导致签名出错
    Object.keys(params).forEach((key) => {
      Object.assign(this.common, {
        [key]: params[key] || '',
      });
    });
  };

  // 获取公共请求参数
  getCommon = key => this.common[key];

  // 签名
  signature = (bodyStr) => {
    const { common } = this;
    const timestamp = (new Date().getTime() / 1000).toFixed();
    const signature = [
      `appId=${common.appId}`,
      `userId=${common.userId}`,
      `deviceId=${common.deviceId}`,
      `OSVersion=${common.OSVersion}`,
      `password=${this.password}`,
      `timestamp=${timestamp}`,
      `token=${common.token}`,
    ];
    if (bodyStr) {
      signature.push(`body=${Base64.encode(bodyStr)}`);
    }
    signature.sort();
    const sign = signature.join('&');
    Object.assign(common, {
      timestamp,
      sign: md5(sign),
    });
  };
}

export default new Header();
