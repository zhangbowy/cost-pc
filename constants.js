/**
 * 配置文件
 */

// 基于根目录的项目路径
const APP_BASE = process.env.APP_BASE || 'dist';
// const APP_BASE = process.env.APP_BASE || 'costhtml';
// 环境变量
const SPD_ENV = process.env.SPD_ENV || 'dev';

const APP_NAME = '鑫支出';
// 接口网关
const APP_API = {
  // dev: 'http://framework-api.dev.jimistore.com',
  // dev: 'http://10.255.0.169:8080', // debug
  // dev: 'http://172.17.9.211',
  // dev: 'https://cost.forwe.store',
  dev: 'http://cost-pc.forwe.work',
  // dev: '/api',
  // dev: 'http://127.0.0.1:8083/api', // debug
  // dev: 'https://pretest.forwe.store',
  // test: 'http://172.17.9.211',
  // test: 'http://cost-pc.forwe.work',
  test: 'https://pretest.forwe.store',
  // pre: 'https://framework-api-sandbox.jimistore.com',
  pre: 'https://pretest.forwe.store',
  prod: 'https://cost.forwe.store',
}[SPD_ENV];

// 接口网关
const APPID = {
  // dev: 'http://framework-api.dev.jimistore.com',
  // dev: 'http://10.255.0.169:8080', // debug
  dev: '2021001161688157', // debug
  test: '2021001161688157',
  test2: 'http://framework-api.test2.jimistore.com',
  pre: 'https://framework-api-sandbox.jimistore.com',
  prod: '2021001164685655',
}[SPD_ENV];

module.exports = {
  APP_BASE,
  SPD_ENV,
  APP_API,
  APP_NAME,
  APPID,
};
