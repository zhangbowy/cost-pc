import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/alipay/fundBatch/list`,
  myList: `${APP_API}/cost/invoice/template/listForUser`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`,
  del: `${APP_API}/cost/invoice/submit/del`,
  ejectFrame: `${APP_API}/cost/eject/frame`,
  unRemind: `${APP_API}/cost/eject/unRemind`,
  detailList: `${APP_API}/cost/alipay/fundBatch/detailList`,
  close: `${APP_API}/cost/alipay/fundBatch/close`,
  getSignedAccounts: `${APP_API}/cost/batch/getSignedAccounts`,
  pay: `${APP_API}/cost/alipay/fundBatch/payOrder`,
  reCreate: `${APP_API}/cost/alipay/fundBatch/reCreate`,
  rePayment: `${APP_API}/cost/alipay/fundBatch/rePayment`,
};
