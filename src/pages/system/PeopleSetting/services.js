import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  add: `${APP_API}/cost/config/add`,
  detail: `${APP_API}/cost/config/detail`,
  getTime: `${APP_API}/cost/manage/query/time`,
  del: `${APP_API}/cost/manage/invoice/del`,
  delCompany: `${APP_API}/cost/manage/synCompany`,
  queryUsers: `${APP_API}/cost/manage/queryUsers`,
  modifyGrant: `${APP_API}/cost/manage/modifyGrant`,
  modifyLoan: `${APP_API}/cost/manage/modifyLoanUser`,
};
