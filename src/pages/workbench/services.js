import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/base/v2/list`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`,
  del: `${APP_API}/cost/invoice/base/del`,
  loanDel: `${APP_API}/cost/invoice/loan/del`, // 借款单删除
  waitList: `${APP_API}/cost/invoice/loan/waitAssessList`, // 我的待核销列表
  ejectFrame: `${APP_API}/cost/eject/frame`,
  unRemind: `${APP_API}/cost/eject/unRemind`,
  personal:  `${APP_API}/cost/invoice/base/personal`,
  associateLists: `${APP_API}/cost/invoice/application/associate`, // 申请单
  setUser: `${APP_API}/cost/user/workbench/set`,
  submitReport: `${APP_API}/cost/statistics/v3/amoeba/pc`,
  submitReportDetail: `${APP_API}/cost/statistics/v3/base/loan/detail`,
  brokenLine: `${APP_API}/cost/user/workbench/category/broken`,
  chartPie: `${APP_API}/cost/user/workbench/get/chart`,
  deptTree: `${APP_API}/cost/dept/list`,
};
