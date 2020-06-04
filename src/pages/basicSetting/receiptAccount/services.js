import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  list: `${APP_API}/cost/account/receipt/list`,
  detail: `${APP_API}/cost/account/receipt/detail`,
  del: `${APP_API}/cost/account/receipt/del`,
  edit: `${APP_API}/cost/account/receipt/edit`,
  add: `${APP_API}/cost/account/receipt/add`,
  delPer: `${APP_API}/cost/account/receipt/del/permit`,
};
