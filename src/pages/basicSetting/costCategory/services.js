import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/category/list`,
  incomeList: `${APP_API}/cost/income/category/getList`,
  addCostGroup: `${APP_API}/cost/category/add`,
  addIncomeGroup: `${APP_API}/cost/income/category/add`,
  edit: `${APP_API}/cost/category/edit`,
  copy: `${APP_API}/cost/category/copy`,
  copyIncomeGroup: `${APP_API}/cost/income/category/copy`,
  detailCost: `${APP_API}/cost/category/detail`,
  detailIncome: `${APP_API}/cost/income/category/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
  delCheck: `${APP_API}/cost/category/checkDelExpand`,
  expandLists: `${APP_API}/cost/category/queryExpand`,
  sorts: `${APP_API}/cost/category/sort`,
  sortIncome: `${APP_API}/cost/income/category/sort`,
};
