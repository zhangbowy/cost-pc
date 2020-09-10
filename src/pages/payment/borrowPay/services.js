import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/payment/payList4Loan`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  payingExport: `${APP_API}/cost/export/paying`, // 待发放
  payedExport: `${APP_API}/cost/export/payed`, // 已发放
  detail: `${APP_API}/cost/account/receipt/detail`,
  refuse: `${APP_API}/cost/invoice/payment/reject`, // 拒绝
};
