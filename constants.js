/**
 * 配置文件
 */

// 基于根目录的项目路径
const APP_BASE = process.env.APP_BASE || 'costhtml';
// 环境变量
const SPD_ENV = process.env.SPD_ENV || 'dev';

const APP_NAME = '鑫支出';
// 接口网关
const APP_API = {
  // dev: 'http://framework-api.dev.jimistore.com',
  // dev: 'http://10.255.0.169:8080', // debug
  dev: 'http://127.0.0.1:8084/api', // debug
  test: 'http://172.17.9.120',
  test2: 'http://framework-api.test2.jimistore.com',
  pre: 'https://framework-api-sandbox.jimistore.com',
  prod: 'https://cost.forwe.store',
}[SPD_ENV];

module.exports = {
  APP_BASE,
  SPD_ENV,
  APP_API,
  APP_NAME,
};
