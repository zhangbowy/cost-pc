import { post, get } from './request';
import constants from './constants';

const { APP_API } = constants;


export const _authentication = (data) => post(`${APP_API}/user/jsapiAuth`, data); // 钉钉jsapi权限验证
export const _userAuthenticationReset = data => post(`${APP_API}/user/authenticationReset`, data); // 鉴权失败清空缓存
export const _spaceGrantAuthorization = params => get(`${APP_API}/space/grantAuthorization`, params); // 获取spaceId
export const _spaceGrantCorpSpaceView = params => post(`${APP_API}/space/grantCorpSpaceView`, params); // 授权用户访问空间文件
