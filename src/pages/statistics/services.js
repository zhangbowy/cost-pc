import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/pc/detail`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  exports: `${APP_API}/cost/export/statistics`,
  detail: `${APP_API}/cost/account/receipt/detail`,
};
