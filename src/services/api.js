import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default {
  /* ---------- sso ----------*/
  // 获取左侧菜单
  getLeftMenu: `${APP_API}/cost/menu/nav`,
  login: `${APP_API}/cost/user/login`,

  /* ---------- 费用类别 ----------*/
  costCategoryList: `${APP_API}/cost/category/list`,
  authApi: `${APP_API}/cost/user/jsapiAuth`,
  payAccount: `${APP_API}/cost/account/payment/list/on`,
  invoiceDetail: `${APP_API}/cost/invoice/submit/detail`,
  nodeList: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  grantDownload: `${APP_API}/cost/space/grantDownload`,
  approvedUrl: `${APP_API}/cost/invoice/submit/selectApprovedUrl`,
  grantUpload: `${APP_API}/cost/space/grantUpload`,
  userInfo: `${APP_API}/cost/user/userInfo`,
  expenseList: `${APP_API}/cost/invoice/submit/expense/list`,
  invoiceDet: `${APP_API}/cost/invoice/template/detail`,
  cateDet: `${APP_API}/cost/category/detail`,
  receitAccount: `${APP_API}/cost/account/receipt/list/on`, // 收款账户
  approveList: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  addInvoice: `${APP_API}/cost/invoice/submit/add`,
  addReceipt: `${APP_API}/cost/account/receipt/add`,
  invoiceList: `${APP_API}/cost/invoice/template/list`,
  print: `${APP_API}/cost/export/pdfDetail`,
  approverRoleList: `${APP_API}/cost/approve/role/list`, // 审批角色
  approvePersonList: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`, // 获取所有的审批模版
  canDel: `${APP_API}/cost/supplier/delAccountCheck`,
  uploadSupplier: `${APP_API}/cost/supplier/import/projectExcel`,
  uploadProject: `${APP_API}/cost/project/import/projectExcel`,
};
