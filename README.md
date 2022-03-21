<div align="center">
<a href="#">
<img alt="const logo" width=“200” height=“200”  src="https://marketing-static.forwe.store/张博2022-03-21 11:49:17newLogo.png" />
</a>
<br>
<h1>鑫支出</h1>

</div>

<!-- > 鑫支出 -->

## 技术栈

- [React](https://reactjs.org) - UI 框架
- [Redux](http://redux.js.org) - 状态管理框架
- [dva](https://github.com/dvajs/dva) - 基于 `redux`、`redux-saga` 和 `react-router` 的轻量级前端框架
- [umi](https://umijs.org/zh) - 可插拔的企业级 `react` 应用框架
- [antd](https://ant.design/index-cn) - 基于 `react` 的组件库

## 项目目录
```
├── README.md
├── config-overrides.js
├── constants.js
├── jsconfig.json
├── mock
│   └── api.js
├── package.json
├── src
│   ├── app.js
│   ├── assets
│   │   ├── css
│   │   ├── iconfont
│   │   └── img
│   ├── common
│   │   └── menu.js
│   ├── components
│   │   ├── Account
│   │   ├── AccountSetting.js
│   │   ├── AddCategory
│   │   ├── AntdComp
│   │   ├── AutoHeight.js
│   │   ├── AutoTable
│   │   ├── BatchImport
│   │   ├── Chart
│   │   ├── ControllerCom
│   │   ├── DropBtn
│   │   ├── DropBtnList
│   │   ├── EditPrompt
│   │   ├── Exception.js
│   │   ├── FooterBar
│   │   ├── FormItems
│   │   ├── FormList
│   │   ├── FormRef
│   │   ├── ImportModal
│   │   ├── LabelLeft
│   │   ├── Layout
│   │   ├── LevelSearch
│   │   ├── LevelSearchNew
│   │   ├── LittleCmp
│   │   ├── Modal
│   │   ├── ModalTemp
│   │   ├── Modals
│   │   ├── NoData
│   │   ├── NoDing.js
│   │   ├── PrivateComponent.js
│   │   ├── PrivateRoute.js
│   │   ├── ProjectSupplier
│   │   ├── QrCodeModal
│   │   ├── QuarterPicker
│   │   ├── SearchCity
│   │   ├── SearchForm.js
│   │   ├── Setting.js
│   │   ├── Sort
│   │   ├── StaticChart
│   │   ├── Step
│   │   ├── StepShow
│   │   ├── StyleCom
│   │   ├── SubHeader
│   │   ├── TableBtn
│   │   ├── Tags
│   │   ├── Transform
│   │   ├── TreeSelectNew
│   │   ├── TreeSort
│   │   ├── UploadFile
│   │   ├── UploadFileMini
│   │   ├── UploadImg
│   │   ├── Welcome
│   │   ├── XfwProducts
│   │   ├── YearPicker
│   │   └── pageHead
│   ├── global.js
│   ├── global.scss
│   ├── layouts
│   │   ├── index.css
│   │   └── index.js
│   ├── models
│   │   ├── costGlobal.js
│   │   ├── global.js
│   │   └── session.js
│   ├── pages
│   │   ├── 404.js
│   │   ├── 505.js
│   │   ├── approvalList
│   │   ├── basicSetting
│   │   ├── basicSettings
│   │   ├── borrowering
│   │   ├── businessSet
│   │   ├── document.ejs
│   │   ├── index.js
│   │   ├── payment
│   │   ├── projectSupplier
│   │   ├── redirect
│   │   ├── statistics
│   │   ├── system
│   │   ├── upload
│   │   └── workbench
│   ├── services
│   │   └── api.js
│   └── utils
│       ├── api.js
│       ├── approve.js
│       ├── approve�\232\204�\211��\234�.js
│       ├── authority.js
│       ├── common.js
│       ├── constants.js
│       ├── cookie.js
│       ├── dd.config.js
│       ├── ddApi.js
│       ├── fields.js
│       ├── fileIcon.js
│       ├── float.js
│       ├── header.js
│       ├── jsapi-auth.js
│       ├── newRequest.js
│       ├── query.js
│       ├── request.js
│       ├── session.js
│       ├── tool.js
│       ├── treeConvert.js
│       ├── util.js
│       └── wave.js
├── static
│   ├── ie.html
│   └── upload.html
├── userInfoMock.js
├── webpackPlugin.js
└── yarn-error.log

```
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
