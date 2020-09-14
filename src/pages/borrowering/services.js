import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/loan/list`,
  send: `${APP_API}/cost/invoice/payment/payment`,
  payingExport: `${APP_API}/cost/export/paying`, // 待发放
  payedExport: `${APP_API}/cost/export/payed`, // 已发放
  detail: `${APP_API}/cost/account/receipt/detail`,
  refuse: `${APP_API}/cost/invoice/payment/reject`, // 拒绝
  repaySum: `${APP_API}/cost/invoice/loan/repaySum`,   // 手动还款
  repayRecord: `${APP_API}/cost/invoice/loan/repayRecord`,  // 借还记录
};
