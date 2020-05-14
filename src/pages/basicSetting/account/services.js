import constants from '@/utils/constants';

const { APP_API } = constants;
export default {
  list: `${APP_API}/account/payment/list`,
  detail: `${APP_API}/account/payment/detail`,
  del: `${APP_API}/account/payment/del`,
  edit: `${APP_API}/account/payment/edit`,
  add: `${APP_API}/account/payment/add`,
};
