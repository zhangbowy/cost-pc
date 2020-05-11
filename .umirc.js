const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const AfterEmitWebpackPlugin = require('./webpackPlugin');
const constants = require('./constants');

const isInProd = process.env.SPD_ENV === 'production'; // 生产环境标识
let publicPath = '/';
if (isInProd) {
  if (constants.APP_BASE) {
    // 非根目录部署
    publicPath = `/${constants.APP_BASE}/${pkg.version}/`;
  } else {
    publicPath = `/${pkg.version}/`;
  }
}

// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      dynamicImport: {
        webpackChunkName: true,
      },
      title: pkg.description,
      dll: false,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  history: 'hash',
  hash: true,
  publicPath,
  outputPath: isInProd ? `./dist/${pkg.version}` : './dist',
  context: {
    name: pkg.description,
    version: pkg.version,
    // ssoUrl: common.getSsoConfig(constants.APP_ENV),
  },
  ignoreMomentLocale: true,
  targets: {
    ios: 8,
    android: 4,
    firefox: 17,
    ie: 9,
  },
  copy: [{
    from: './static',
    to: isInProd ? '../static' : './static',
  }],
  define: {
    APP_VER: pkg.version, // 版本号
    SPD_ENV: constants.APP_ENV, // 环境变量
    APP_API: constants.APP_API, // 接口网关
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  chainWebpack(config) {
    config
      .plugin('BannerPlugin')
      .use(new webpack.BannerPlugin({
        banner: `${pkg.version} | Copyright © ${new Date().getFullYear()} 鑫蜂维有限公司. All rights reserved.`,
      }));

    if (isInProd) {
      config
        .plugin('after-emit-webpack-plugin')
        .use(new AfterEmitWebpackPlugin());
    }
  },
}