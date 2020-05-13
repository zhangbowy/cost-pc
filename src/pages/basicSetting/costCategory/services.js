import constants from '@/utils/constants';

const {
  APP_API,
} = constants;

export default{
  costList: `${APP_API}/cost/group/list`,
  addCostGroup: `${APP_API}/cost/group/add`,
  edit: `${APP_API}/cost/group/edit`,
  detailCost: `${APP_API}/cost/group/detail`,
  delCostGroup: `${APP_API}/cost/group/del`,
};
