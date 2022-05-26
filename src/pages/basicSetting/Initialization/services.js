import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  getTime: `${APP_API}/cost/manage/query/time`,
  getTimeC: `${APP_API}/cost/manage/income/getClearTime`,
  del: `${APP_API}/cost/manage/invoice/del`,
  delC: `${APP_API}/cost/manage/income/del`,
  delCompany: `${APP_API}/cost/manage/synCompany`,
  queryUsers: `${APP_API}/cost/manage/queryUsers`,
  modifyGrant: `${APP_API}/cost/manage/modifyGrant`,
};
