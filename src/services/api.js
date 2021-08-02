import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default {
  /* ---------- sso ----------*/
  // 获取左侧菜单
  getLeftMenu: `${APP_API}/cost/menu/v2/nav`,
  BasicSettingMenus: `${APP_API}/cost/menu/v2/navByParentId`,
  login: `${APP_API}/cost/user/login`,
  mockLogin: `${APP_API}/cost/user/mockLogin`,
  setUserRole: `${APP_API}/cost/user/workbench/set`,

  /* ---------- 支出类别 ----------*/
  costCategoryList: `${APP_API}/cost/category/list`,
  authApi: `${APP_API}/cost/user/jsapiAuth`,
  payAccount: `${APP_API}/cost/account/payment/list/on`,
  invoiceDetail: `${APP_API}/cost/invoice/submit/detail`,
  // 下载附件
  grantDownload: `${APP_API}/cost/space/grantDownload`,
  // 下载附件
  newGrantDownload: `${APP_API}/cost/space/grantDownload4Approval`,
  // newGrantDownload: `${APP_API}/cost/space/processDentryAuth`,
  // 判断附件
  isApproval: `${APP_API}/cost/space/isApproval`,

  // grantDownload: `${APP_API}/cost/space/grantUpload4Approval`,
  approvedUrl: `${APP_API}/cost/invoice/submit/selectApprovedUrl`,
  // grantUpload: `${APP_API}/cost/space/grantUpload`,
  // 上传附件
  grantUpload: `${APP_API}/cost/space/grantUpload4Approval`,
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
  applyList: `${APP_API}/cost/invoice/application/associate`, // 查询可关联的申请单
  addApply:  `${APP_API}/cost/invoice/application/add`, // 新增申请单（单据）
  addSalary: `${APP_API}/cost/invoice/salary/add`, //  新增薪资单
  // 汇率
  configuration: `${APP_API}/cost/currency/configuration`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`, // 常用单据
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
  /* ------------------------------ 审批流 ------------------------------*/
  nodeList: `${APP_API}/cost/approve/apProcessPerson/getApproveNodeInfo`,
  addNode: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`,
  editNode: `${APP_API}/cost/approve/apProcessPerson/saveApproveNodes`, // 修改模板名称
  approvalList: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`, // 审批流列表
  initNodeList: `${APP_API}/cost/approve/apProcessPerson/defaultProcess`, // 初始化
  getAliAccounts: `${APP_API}/cost/batch/getAliAccounts`, // 支付宝账户列表
  addBatch: `${APP_API}/cost/alipay/fundBatch/createOrder`, // 标记已付
  batchPay: `${APP_API}/cost/alipay/fundBatch/payOrder`, // 发起支付
  getServiceTime: `${APP_API}/cost/common/getServiceTime`, // 获取服务器时间
  reCreate: `${APP_API}/cost/alipay/fundBatch/reCreate`, // 重新下单
  /* ------------------------------ 账本 ---------------------------------*/
  addFolder: `${APP_API}/cost/cost/folder/add`, // 新增账本
  editFolder: `${APP_API}/cost/cost/folder/edit`, // 编辑账本
  delFolder: `${APP_API}/cost/cost/folder/del`, // 删除账本
  detailFolder: `${APP_API}/cost/cost/folder/detail`, // 账本详情
  listFolder: `${APP_API}/cost/cost/folder/list`, // 账本列表
  useExpense: `${APP_API}/cost/invoice/submit/allExpense/list`, // 获取可用的账本的费用
   /* ------------------------------ 草稿 ---------------------------------*/
   addDraft: `${APP_API}/cost/draft/add`, // 新增账本
   editDraft: `${APP_API}/cost/draft/edit`, // 编辑账本
   delDraft: `${APP_API}/cost/draft/del`, // 删除账本
   detailDraft: `${APP_API}/cost/draft/detail`, // 账本详情
   listDraft: `${APP_API}/cost/draft/list`, // 账本列表
   loanList: `${APP_API}/cost/invoice/base/loanList`,
   applyDetail: `${APP_API}/cost/invoice/application/detail`, // 申请单详情
   salaryDetail: `${APP_API}/cost/invoice/salary/detail`, // 薪资单详情
   userDep:  `${APP_API}/cost/user/userInfo4UserIds`,
   queryTemplateIds: `${APP_API}/cost/category/queryTemplateIds`, // 单据模板
   applyIds: `${APP_API}/cost/invoice/application/checkRelevance`,
   waitAssessIds: `${APP_API}/cost/invoice/loan/waitAssessListByIds`,
   folderIds: `${APP_API}/cost/cost/folder/listByIds`,
   invoicePrint: `${APP_API}/cost/pdf/batch/submit`,
   loanPrint: `${APP_API}/cost/pdf/batch/loan`,
   applicationPrint: `${APP_API}/cost/pdf/batch/application`,
   qrQuery: `${APP_API}/cost/qr/queryDetail`,
   /* ------------------------------ 报销单改单 ---------------------------------*/
   invoiceEdit: `${APP_API}/cost/invoice/submit/edit`,
   loanEdit: `${APP_API}/cost/invoice/loan/edit`,
   recordDetailInvoice: `${APP_API}/cost/invoice/submit/recordDetail`,
   recordDetailLoan: `${APP_API}/cost/invoice/loan/recordDetail`,
   waitList: `${APP_API}/cost/invoice/loan/waitAssessList`, // 我的待核销列表
   area: `${APP_API}/cost/aw/area`,
   checkTemplate: `${APP_API}/cost/invoice/template/checkTemplate`,
   queryModify: `${APP_API}/cost/manage/querySysSwitch`, // 查询改单
   delInvoice: `${APP_API}/cost/invoice/base/manageDel`, // 管理员删除单据
   recordList: `${APP_API}/cost/invoice/record/recordList`, // 删除的单据的记录
   getCondition: `${APP_API}/cost/approve/apProcessPerson/getCondition`, // 获取审批条件
   officeList: `${APP_API}/cost/branch/office/officeList`,
   officeTree: `${APP_API}/cost/branch/office/list`, // 分公司列表
   upload: `${APP_API}/cost/invoice/salary/import/costDetail/share`, // 分公司列表
   exportList: `${APP_API}/cost/invoice/salary/costDetail/share/detail`, // 分摊获取数据
   newProjectList: `${APP_API}/cost/project/list/v2`,
   roleStatics: `${APP_API}/cost/menu/v2/navByParentId`, // 支出分析表的权限
   getApprovalNum: `${APP_API}/cost/approve/instance/count`,
};
