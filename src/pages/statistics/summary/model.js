// import { post, get } from '@/utils/request';
// import constants from '@/utils/constants';
// import api from './services';

// const { PAGE_SIZE } = constants;
// export default {
//   namespace: 'summary',
//   state: {
//     list: [],
//     query: {
//       pageNo: 1,
//       pageSize: PAGE_SIZE,
//     },
//     menuList: [],
//     detailRoleList: [],
//     total: 0,
//     approveList: [],
//     approveQuery: {
//       pageNo: 1,
//       pageSize: PAGE_SIZE,
//     },
//     approveTotal: 0,
//   },
//   effects: {
//     *list({ payload }, { call, put }) {
//       const response = yield call(get, api.list, payload);
//       yield put({
//         type: 'save',
//         payload: {
//           list: response.list || [],
//           query: {
//             pageSize: payload.pageSize,
//             pageNo: payload.pageNo,
//           },
//           total: response.page ? response.page.total : 0,
//         },
//       });
//     },
//     *add({ payload }, { call }) {
//       yield call(post, api.add, payload);
//     },
//     *edit({ payload }, { call }) {
//       yield call(post, api.edit, payload);
//     },
//     *del({ payload }, { call }) {
//       yield call(get, api.del, payload);
//     },
//     *menu({ payload }, { call, put }) {
//       const response = yield call(get, api.menu, payload);
//       yield put({
//         type: 'save',
//         payload: {
//           menuList: response || [],
//         },
//       });
//     },
//     *detail({ payload }, { call, put }) {
//       const response = yield call(get, api.detail, payload);
//       yield put({
//         type: 'save',
//         payload: {
//           detailRoleList: response.rolePurviewOperateVOS || [],
//           rolePurviewDataVos: response.rolePurviewDataVos || [],
//         },
//       });
//     },
//     *approveList({ payload }, { call, put }) {
//       const response = yield call(get, api.approveList, payload);
//       yield put({
//         type: 'save',
//         payload: {
//           approveList: response.list || [],
//           query: {
//             pageSize: payload.pageSize,
//             pageNo: payload.pageNo,
//           },
//           approveTotal: response.page ? response.page.total : 0,
//         },
//       });
//     },
//     *approveDetail({ payload }, { call, put }) {
//       const response = yield call(get, api.approveDetail, payload);
//       yield put({
//         type: 'save',
//         payload: {
//           detailRoleList: response.rolePurviewOperateVOS || [],
//           rolePurviewDataVos: response.rolePurviewDataVos || [],
//         },
//       });
//     },
//     *approveDel({ payload }, { call }) {
//       yield call(get, api.approveDel, payload);
//     },
//     *approveAdd({ payload }, { call }) {
//       yield call(post, api.approveAdd, payload);
//     },
//     *approveEdit({ payload }, { call }) {
//       yield call(post, api.approveEdit, payload);
//     },
//   },
//   reducers: {
//     save(state, { payload }) {
//       return {
//         ...state,
//         ...payload,
//       };
//     },
//   }
// };
