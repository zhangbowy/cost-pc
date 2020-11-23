import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/invoice/template/list`,
  addCost: `${APP_API}/cost/invoice/template/add`,
  edit: `${APP_API}/cost/invoice/template/edit`,
  detailCost: `${APP_API}/cost/invoice/template/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
  delCheck: `${APP_API}/cost/category/checkDelExpand`,
  expandLists: `${APP_API}/cost/category/queryExpand`,
  fieldList: `${APP_API}/cost/invoice/template/fieldList`,
  approve: `${APP_API}/cost/approve/apProcessPerson/getApproveProcessPersonList`,
};
