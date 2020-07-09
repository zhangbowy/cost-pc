import { get, post } from '@/utils/request';
import api from '@/services/api';
import { ddConfig } from '@/utils/ddApi';

export default {
  namespace: 'global',
  state: {
    breadcrumbs: [], // 面包屑
    menuKey: '', // 导航选中标识
    payAccount: [], // 收款账号列表
    costCategoryList: [], // 费用类别列表
    jsApiAuth: {}, // jsApi
    invoiceDetail: {}, // 单据详情
    changeNodes: {}, // 审批流的节点
    approvedUrl: '', // 审批流的链接
    uploadSpace: '', // 上传文件授权
    deptInfo: [], // 获取部门
    expenseList: [], // 可用的列表
    lbDetail: {},// 类别详情
    djDetail: {}, // 单据详情
    receiptAcc: [],
    nodes: {}, // 获取流程节点
    detailReceipt: {}, // 收款账户详情
    userId: '', // 接收userId
    invoiceList: [], // 单据列表
    approvePersonList: [], // 审批模板列表
    approverRoleList: [], // 审批角色列表
  },
  effects: {
    *costList({ payload }, { call, put }) {
      const response = yield call(get, api.costCategoryList, payload);
      yield put({
        type: 'save',
        payload: {
          costCategoryList: response || [],
        },
      });
    },
    *invoiceList({ payload }, { call, put }) {
      const response = yield call(get, api.invoiceList, payload);
      yield put({
        type: 'save',
        payload: {
          invoiceList: response || [],
        },
      });
    },
    *approveList({ payload }, { call, put }) {
      const response = yield call(post, api.approveList, payload);
      yield put({
        type: 'save',
        payload: {
          nodes: response || {},
        },
      });
    },
    *users({ payload }, { call, put }) {
      const response = yield call(get, api.userInfo, payload);
      yield put({
        type: 'save',
        payload: {
          deptInfo: response.deptObject || [],
          userId: response.userId || '',
        },
      });
    },
    *expenseList({ payload }, { call, put }) {
      const response = yield call(get, api.expenseList, payload);
      yield put({
        type: 'save',
        payload: {
          expenseList: response || [],
        },
      });
    },
    *payAccount({ payload }, { call, put }) {
      const response = yield call(get, api.payAccount, payload);
      yield put({
        type: 'save',
        payload: {
          payAccount: response || [],
        },
      });
    },
    *receiptAcc({ payload }, { call, put }) {
      const response = yield call(get, api.receitAccount, payload);
      yield put({
        type: 'save',
        payload: {
          receiptAcc: response || [],
        },
      });
    },
    *jsApiAuth({ payload }, { call, put }) {
      const response = yield call(get, api.authApi, payload);
      console.log(response);
      const { agentId, corpId, timeStamp, nonceStr, signature } = response;
      ddConfig(agentId, corpId, timeStamp, nonceStr, signature);
      yield put({
        type: 'save',
        payload: {
          jsApiAuth: response || {},
        },
      });
    },
    *invoiceDetail({ payload }, { call, put }) {
      const response = yield call(get, api.invoiceDetail, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          invoiceDetail: response || {},
        },
      });
    },
    *djDetail({ payload }, { call, put }) {
      const response = yield call(get, api.invoiceDet, payload);
      yield put({
        type: 'save',
        payload: {
          djDetail: response || {},
        },
      });
    },
    *lbDetail({ payload }, { call, put }) {
      const response = yield call(post, api.cateDet, payload);
      yield put({
        type: 'save',
        payload: {
          lbDetail: response || {},
        }
      });
    },
    *grantDownload({ payload }, { call }) {
      yield call(post, api.grantDownload, payload);
    },
    *addInvoice({ payload }, { call }) {
      yield call(post, api.addInvoice, payload);
    },
    *addAcc({ payload }, { call }) {
      yield call(post, api.addReceipt, payload);
    },
    *print({ payload }, { call }) {
      yield call(get, api.print, payload);
    },
    *grantUpload({ payload }, { call, put }) {
      const response = yield call(post, api.grantUpload, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          uploadSpace: response.spaceId || '',
        }
      });
    },
    *detailAcc({ payload }, { call, put }) {
      const response = yield call(get, api.detailReceipt, payload);
      yield put({
        type: 'save',
        payload: {
          detailReceipt: response || {},
        },
      });
    },
    *approveUrl({ payload }, { call, put }) {
      const response = yield call(get, api.approvedUrl, payload);
      yield put({
        type: 'save',
        payload: {
          approvedUrl: response.approvedUrl || '',
        }
      });
    },
    *approverRole({ payload }, { call, put }) {
      const response = yield call(get, api.approverRoleList, payload);
      yield put({
        type: 'save',
        payload: {
          approverRoleList: response.list || [],
        },
      });
    },
    // 审批模版列表
    *approverPersonList({ payload }, { call, put }) {
      const response = yield call(get, api.approvePersonList, payload);
      yield put({
        type: 'save',
        payload: {
          approvePersonList: response || [],
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeBreadcrumb(state, { payload }) {
      return {
        ...state,
        breadcrumbs: payload,
      };
    },
    changeNodes(state, { payload }) {
      return {
        ...state,
        nodes: payload.nodes,
      };
    },
  },
};
