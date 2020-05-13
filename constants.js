/**
 * 配置文件
 */

// 基于根目录的项目路径
const APP_BASE = process.env.APP_BASE || '';
// 环境变量
const SPD_ENV = process.env.SPD_ENV || 'dev';
// 接口网关
const APP_API = {
  // dev: 'http://framework-api.dev.jimistore.com',
  dev: 'http://172.17.9.107:8080', // debug
  test: 'http://framework-api.test.jimistore.com',
  test2: 'http://framework-api.test2.jimistore.com',
  pre: 'https://framework-api-sandbox.jimistore.com',
  prod: 'https://framework-api.jimistore.com',
}[SPD_ENV];

module.exports = {
  APP_BASE,
  SPD_ENV,
  APP_API,
};
