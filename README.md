> 鑫支出

## 技术栈

- [React](https://reactjs.org) - UI 框架
- [Redux](http://redux.js.org) - 状态管理框架
- [dva](https://github.com/dvajs/dva) - 基于 `redux`、`redux-saga` 和 `react-router` 的轻量级前端框架
- [umi](https://umijs.org/zh) - 可插拔的企业级 `react` 应用框架
- [antd](https://ant.design/index-cn) - 基于 `react` 的组件库


## 打包

- 测试

```bash
SPD_ENV=test npm run build
```
- 预发

```bash
SPD_ENV=pre APP_BASE={二级目录名} npm run build
```
- 正式

```bash
SPD_ENV=prod npm run build
```
