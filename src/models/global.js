import { get, post } from '@/utils/request';
import api from '@/services/api';
import treeConvert from '@/utils/treeConvert';
import { ddConfig } from '@/utils/ddApi';
// import { message } from 'antd';

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
    loanDetail: {}, // 借款单详情
    receiptAcc: [],
    nodes: {}, // 获取流程节点
    detailReceipt: {}, // 收款账户详情
    userId: '', // 接收userId
    invoiceList: [], // 单据列表
    approvePersonList: [], // 审批模板列表
    approverRoleList: [], // 审批角色列表
    uploadRes: {}, // 供应商项目批量上传结果
    usableProject: [], // 可用的项目列表
    usableSupplier: [], // 可用的供应商
    projectList: [], // 项目列表
    supplierList: [], // 供应商列表
    _projectList: [], // 项目列表
    _supplierList: [], // 供应商列表
    newDetail: {}, // 供应商/项目 详情
    accountCanDelRes: {}, // 供应商账户可否删除校验结果
    initNode: {}, // 初始化node节点
    initDetailNode: {},
    detailNode: {}, // 节点的详细信息
    getAliAccounts: [], // 签约账号
    batchDetails: {}, // 批次的详细信息
    alipayUrl: '', // 跳转支付宝链接地址
    serviceTime: ''
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
      // message.error(response);
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
    // 借款单详情
    *loanDetail({ payload }, { call, put }) {
      const response = yield call(get, api.loanDetail, payload);
      yield put({
        type: 'save',
        payload: {
          loanDetail: response || {},
        },
      });
    },
    *lbDetail({ payload }, { call, put }) {
      const response = yield call(get, api.cateDet, payload);
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
    /* -----------项目/供应商------------- */
    // 项目
    // 添加项目
    *project_add({ payload }, { call }) {
      yield call(post, api.addProject, payload);
    },
    // 删除项目
    *project_del({ payload }, { call }) {
      yield call(get, api.delProject, payload);
    },
    // 编辑项目
    *project_edit({ payload }, { call }) {
      yield call(post, api.editProject, payload);
    },
    // 获取项目列表
    *project_list({ payload }, { call, put }) {
      const response = yield call(get, api.projectList, payload);
      yield put({
        type: 'save',
        payload: {
          _projectList: response || [],
        },
      });
    },
    // 排序项目
    *project_sort({ payload }, { call }) {
      yield call(post, api.sortProject, payload);
    },
    // 项目详情
    *project_detail({ payload }, { call, put }) {
      const response = yield call(get, api.detailProject, payload);
      yield put({
        type: 'save',
        payload: {
          newDetail: response || []
        }
      });
    },
    // 批量上传项目
    *uploadProjectFile({ payload }, { call, put }) {
      const response = yield call(post, api.uploadProject, payload);
      yield put({
        type: 'save',
        payload: {
          uploadRes: response
        }
      });
    },

    // 供应商
    // 新增供应商
    *supplier_add({ payload }, { call }) {
      yield call(post, api.addSupplier, payload);
    },
    // 删除供应商
    *supplier_del({ payload }, { call }) {
      yield call(get, api.delSupplier, payload);
    },
    // 编辑供应商
    *supplier_edit({ payload }, { call }) {
      yield call(post, api.editSupplier, payload);
    },
    // 获取供应商列表
    *supplier_list({ payload }, { call, put }) {
      const response = yield call(get, api.supplierList, payload);
      yield put({
        type: 'save',
        payload: {
          _supplierList: response || [],
        },
      });
    },
    // 供应商排序
    *supplier_sort({ payload }, { call }) {
      yield call(post, api.sortSupplier, payload);
    },
    // 供应商详情
    *supplier_detail({ payload }, { call, put }) {
      const response = yield call(get, api.detailSupplier, payload);
      yield put({
        type: 'save',
        payload: {
          newDetail: response || []
        }
      });
    },
    // 批量上传供应商
    *uploadSupplierFile({ payload }, { call, put }) {
      const response = yield call(post, api.uploadSupplier, payload);
      yield put({
        type: 'save',
        payload: {
          uploadRes: response
        }
      });
    },
    // 供应商账户删除校验
    *accountCanDel({ payload }, { call, put }) {
      const response = yield call(get, api.accountCanDel, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          accountCanDelRes: response
        }
      });
    },

    // 获取可用的项目列表
    *usableProject({ payload }, { call, put }) {
      const response = yield call(get, api.usableProject, payload);
      yield put({
        type: 'save',
        payload: {
          usableProject: response || [],
        },
      });
    },
    // 获取可用的供应商
    *usableSupplier({ payload }, { call, put }) {
      const response = yield call(get, api.usableSupplier, payload);
      yield put({
        type: 'save',
        payload: {
          usableSupplier: response || [],
        },
      });
    },
    // 项目列表
    *projectList({ payload }, { call, put }) {
      const response = yield call(get, api.projectList, payload);
      yield put({
        type: 'save',
        payload: {
          projectList: response || [],
        },
      });
    },
    // 供应商列表
    *supplierList({ payload }, { call, put }) {
      const response = yield call(get, api.supplierList, payload);
      let arr = [];
      if(response && response.length > 0) {
        arr = treeConvert({
          rootId: 0,
          pId: 'parentId',
          tId: 'value',
          tName: 'title',
          otherKeys: ['type', 'supplierAccounts', 'parentId'],
        }, response);
      }
      yield put({
        type: 'save',
        payload: {
          supplierList: arr || [],
        },
      });
    },
    // 添加借款单(单据)
    *addLoan({ payload }, { call }) {
      yield call(post, api.addLoan, payload);
    },
    // 批量下单
    *addBatch({ payload }, { call, put }) {
      const response = yield call(post, api.addBatch, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          batchDetails: response || {},
        },
      });
    },
    // 重新下单
    *reCreate({ payload }, { call, put }) {
      const response = yield call(get, api.reCreate, payload);
      yield put({
        type: 'save',
        payload: {
          batchDetails: response || {},
        },
      });
    },
    // 发起支付
    *batchPay({ payload }, { call, put }) {
      const response = yield call(post, api.batchPay, payload);
      yield put({
        type: 'save',
        payload: {
          alipayUrl: response || '',
        }
      });
    },
    // 获取服务器时间
    *getServiceTime({ payload }, { call, put }) {
      const response = yield call(get, api.getServiceTime, payload);
      yield put({
        type: 'save',
        payload: {
          serviceTime: response || '',
        }
      });
    },
    // 审批流的节点信息的接口
    *nodeList({ payload }, { call, put }) {
      const response = yield call(post, api.nodeList, payload);
      yield put({
        type: 'save',
        payload: {
          nodes: response.node || {},
          detailNode: response || {},
        },
      });
    },
    *approvalList({ payload }, { call, put }) {
      const response = yield call(get, api.approvalList, payload);
      yield put({
        type: 'save',
        payload: {
          approveList: response || [],
        },
      });
    },
    *initNode({ payload }, { call, put }) {
      const response = yield call(get, api.initNodeList, payload);
      yield put({
        type: 'save',
        payload: {
          initNode: response.node || {},
          initDetailNode: response || {},
        },
      });
    },
    *addNode({ payload }, { call }) {
      yield call(post, api.addNode, payload);
    },
    *editNode({ payload }, { call }) {
      yield call(post, api.editNode, payload);
    },
    *send({ payload }, { call }) {
      yield call(post, api.send, payload);
    },
    *getAliAccounts({ payload }, { call, put }) {
      const response = yield call(get, api.getAliAccounts, payload);
      yield put({
        type: 'save',
        payload: {
          getAliAccounts: response || [],
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
