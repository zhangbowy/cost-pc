/**
 * webpack资源输出监听【提取html文件，使用场景：项目打包按版本号归类】
 *
 */
const fs = require('fs');

const destSrc = process.env.SPD_ENV !== 'test' ? 'costhtml/index.html' : 'dist/index.html';

class AfterEmitWebpackPlugin {
  constructor({
    src = 'index.html',
    // dest = 'dist/index.html',
    dest = destSrc,
  } = {}) {
    this.name = 'after-emit-webpack-plugin';
    this.src = src;
    this.dest = dest;
  }

  apply(compiler) {
    // compiler.plugin('after-emit', (compilation, callback) => {
    compiler.hooks.afterEmit.tapAsync(this.name, (compilation, callback) => {
      const file = compilation.assets[this.src];
      if (file) {
        const source = file.source();
        fs.writeFileSync(this.dest, source, 'utf8');
        console.log(`[${this.name}] File copied: ${this.dest}`); // eslint-disable-line
      } else {
        console.log(`[${this.name}] File does not exist.`); // eslint-disable-line
      }
      callback();
    });
  }
}

module.exports = AfterEmitWebpackPlugin;
