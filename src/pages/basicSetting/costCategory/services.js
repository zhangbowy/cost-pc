import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  list: `${APP_API}/cost/category/list`,
  addCostGroup: `${APP_API}/cost/category/add`,
  edit: `${APP_API}/cost/category/edit`,
  detailCost: `${APP_API}/cost/category/detail`,
  delCostGroup: `${APP_API}/cost/category/del`,
  check: `${APP_API}/cost/category/del/permit`,
  delPer: `${APP_API}/cost/category/del/permit`,
};
