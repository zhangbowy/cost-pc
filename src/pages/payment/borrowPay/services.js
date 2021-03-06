import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/payment/payList4Loan`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  payingExport: `${APP_API}/cost/export/paying4Loan`, // 待发放
  payedExport: `${APP_API}/cost/export/payed4Loan`, // 已发放
  detail: `${APP_API}/cost/account/receipt/detail`,
  refuse: `${APP_API}/cost/invoice/payment/reject`, // 拒绝
  operationSign: `${APP_API}/cost/invoice/payment/operationSign`,
  record: `${APP_API}/cost/invoice/payment/operationSign/record`,
  exportRefuse: `${APP_API}/cost/export/refusePay4Loan`,
};
