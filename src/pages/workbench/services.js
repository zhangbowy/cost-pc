import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/submit/list`,
  myList: `${APP_API}/cost/invoice/template/listForUser`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`,
  del: `${APP_API}/cost/invoice/submit/del`,
  waitList: `${APP_API}/cost/invoice/loan/waitAssessList`, // 我的待核销列表
};
