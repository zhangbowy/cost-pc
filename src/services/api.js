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
  grantDownload: `${APP_API}/cost/space/grantDownload`,
  approvedUrl: `${APP_API}/cost/invoice/submit/selectApprovedUrl`,
  grantUpload: `${APP_API}/cost/space/grantUpload`,
  userInfo: `${APP_API}/cost/user/userInfo`,
  expenseList: `${APP_API}/cost/invoice/submit/expense/list`,
  invoiceDet: `${APP_API}/cost/invoice/template/detail`,
  cateDet: `${APP_API}/cost/category/detail`,
  receitAccount: `${APP_API}/cost/account/receipt/list/on`, // 收款账户
  approveList: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  // 新增报销单单据
  addInvoice: `${APP_API}/cost/invoice/submit/add`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  // 新增借款单单据
  addLoan: `${APP_API}/cost/invoice/loan/add`,
  // 借款单详情
  loanDetail: `${APP_API}/cost/invoice/loan/detail`,
  addReceipt: `${APP_API}/cost/account/receipt/add`,
  invoiceList: `${APP_API}/cost/invoice/template/list`,
  print: `${APP_API}/cost/export/pdfDetail`,
  approverRoleList: `${APP_API}/cost/approve/role/list`, // 审批角色
  approvePersonList: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`, // 获取所有的审批模版
  /* ---------- 项目/供应商 ----------*/
  // 项目
  addProject: `${APP_API}/cost/project/add`, // 新增
  delProject: `${APP_API}/cost/project/del`, // 删除
  editProject: `${APP_API}/cost/project/edit`, // 编辑
  projectList: `${APP_API}/cost/project/list`, // 查询列表
  sortProject: `${APP_API}/cost/project/sort`, // 排序
  detailProject: `${APP_API}/cost/project/detail`, // 详情
  uploadProject: `${APP_API}/cost/project/import/projectExcel`, // 批量上传
  usableProject: `${APP_API}/cost/project/getUsableProject`, // 可用项目列表
  // 供应商
  addSupplier: `${APP_API}/cost/supplier/add`, // 新增
  delSupplier: `${APP_API}/cost/supplier/del`, // 删除
  editSupplier: `${APP_API}/cost/supplier/edit`, // 编辑
  supplierList: `${APP_API}/cost/supplier/list`, // 查询列表
  sortSupplier: `${APP_API}/cost/supplier/sort`, // 排序
  detailSupplier: `${APP_API}/cost/supplier/detail`, // 详情
  accountCanDel: `${APP_API}/cost/supplier/delAccountCheck`, // 账户是否可删除
  uploadSupplier: `${APP_API}/cost/supplier/import/supplierExcel`, // 批量上传
  usableSupplier: `${APP_API}/cost/supplier/getUsableSupplier`, // 可用供应商
  /* ---------- 审批流 ----------*/
  nodeList: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  addNode: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`,
  editNode: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`, // 修改模板名称
  approvalList: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`, // 审批流列表
  initNodeList: `${APP_API}/cost/approve/apProcessPerson/defaultProcess`, // 初始化
  getAliAccounts: `${APP_API}/cost/batch/getAliAccounts`, // 支付宝账户列表
  addBatch: `${APP_API}/cost/alipay/fundBatch/createOrder`, // 标记已付
  batchPay: `${APP_API}/cost/alipay/fundBatch/payOrder`, // 发起支付
  reCreate: `${APP_API}/cost/alipay/fundBatch/reCreate`, // 重新下单
};
