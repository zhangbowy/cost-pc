import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/payment/payList`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  export: `${APP_API}/cost/invoice/payment/export`,
  detail: `${APP_API}/cost/account/receipt/detail`,
};
