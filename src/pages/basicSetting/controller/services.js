import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  getTime: `${APP_API}/cost/manage/query/time`,
  del: `${APP_API}/cost/manage/invoice/del`,
  delCompany: `${APP_API}/cost/manage/synCompany`,
};
