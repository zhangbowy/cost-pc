import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/category/list`,
  addCostGroup: `${APP_API}/cost/category/add`,
  edit: `${APP_API}/cost/category/edit`,
  copy: `${APP_API}/cost/category/copy`,
  detailCost: `${APP_API}/cost/category/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
  delCheck: `${APP_API}/cost/category/checkDelExpand`,
  expandLists: `${APP_API}/cost/category/queryExpand`,
  sorts: `${APP_API}/cost/category/sort`,
};
