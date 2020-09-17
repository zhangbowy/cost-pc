import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/base/list`,
  myList: `${APP_API}/cost/invoice/template/listForUser`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`,
  del: `${APP_API}/cost/invoice/submit/del`,
  loanDel: `${APP_API}/cost/invoice/loan/del`, // 借款单删除
  waitList: `${APP_API}/cost/invoice/loan/waitAssessList`, // 我的待核销列表
  ejectFrame: `${APP_API}/cost/eject/frame`,
  unRemind: `${APP_API}/cost/eject/unRemind`,
};
