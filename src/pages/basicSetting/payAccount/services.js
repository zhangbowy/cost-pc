import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  list: `${APP_API}/cost/account/payment/list`,
  detail: `${APP_API}/cost/account/payment/detail`,
  del: `${APP_API}/cost/account/payment/del`,
  edit: `${APP_API}/cost/account/payment/edit`,
  add: `${APP_API}/cost/account/payment/add`,
  delPer: `${APP_API}/cost/account/payment/del/permit`,
  sign: `${APP_API}/cost/batch/getSignLink`,
  amount: `${APP_API}/cost/account/payment/amount`
};
