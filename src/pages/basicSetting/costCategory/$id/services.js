import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/category/list`,
  incomeList: `${APP_API}/cost/income/category/getList`,
  addCost: `${APP_API}/cost/category/add`,
  addIncome: `${APP_API}/cost/income/category/add`,
  edit: `${APP_API}/cost/category/edit`,
  editIncome: `${APP_API}/cost/income/category/edit`,
  detailCost: `${APP_API}/cost/category/detail`,
  detailIncome: `${APP_API}/cost/income/category/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
  delPerIncome: `${APP_API}/cost/income/category/del/permit`,
  delCheck: `${APP_API}/cost/category/checkDelExpand`,
  expandLists: `${APP_API}/cost/category/queryExpand`,
  fieldList: `${APP_API}/cost/category/fieldList`,
  incomeFieldList: `${APP_API}/cost/income/category/fieldList`,
};
