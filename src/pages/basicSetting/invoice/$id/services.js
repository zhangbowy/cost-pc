import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/invoice/template/list`,
  addCost: `${APP_API}/cost/invoice/template/add`,
  addIncome: `${APP_API}/cost/income/template/add`,
  edit: `${APP_API}/cost/invoice/template/edit`,
  editIncome: `${APP_API}/cost/income/template/edit`,
  detailCost: `${APP_API}/cost/invoice/template/detail`,
  detailIncome: `${APP_API}/cost/income/template/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
  delCheck: `${APP_API}/cost/category/checkDelExpand`,
  expandLists: `${APP_API}/cost/category/queryExpand`,
  fieldList: `${APP_API}/cost/invoice/template/fieldList`,
  incomeFieldList: `${APP_API}/cost/income/template/fieldList`,
  approve: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`,
  isOpenProject: `${APP_API}/cost/category/isOpenProject`,
};
