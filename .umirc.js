const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const AfterEmitWebpackPlugin = require('./webpackPlugin');
const constants = require('./constants');

// const isInProd = process.env.SPD_ENV === 'production'; // 生产环境标识
const isInProd = process.env.SPD_ENV === 'prod' || process.env.SPD_ENV === 'test'; // 生产环境标识
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
  theme: {
    "@primary-color": "rgba(0, 199, 149, 1)",
    "@link-color": "rgba(0, 199, 149, 1)", // 链接色
  },
  history: 'hash',
  hash: true,
  publicPath,
  outputPath: isInProd ? `./costhtml/${pkg.version}` : './costhtml',
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
    APP_NAME: constants.APP_NAME, // 名称
    APPID: constants.APPID, // appId
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  proxy: {
    '/api': {
      target: `http://172.17.9.120`,
      //target: `https://pretest.forwe.store`,
      pathRewrite: { '^/api': '' },
      changeOrigin:true,
    }
  },
  chainWebpack(config) {
    config
      .plugin('BannerPlugin')
      .use(new webpack.BannerPlugin({
        banner: `${pkg.version} | Copyright © ${new Date().getFullYear()} 鑫蜂维有限公司. All rights reserved.`,
      }));
    // config.module.test(/\.(less|css)$/)
    // .use(['style-loader', 'css-loader'])
    // .loader('less-loader', { javascriptEnabled: true });

    if (isInProd) {
      config
        .plugin('after-emit-webpack-plugin')
        .use(new AfterEmitWebpackPlugin());
    }
  },
}
