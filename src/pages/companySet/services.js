import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/alipay/fundBatch/list`,
  add: `${APP_API}`,
  del: `${APP_API}/cost/invoice/submit/del`,
};
