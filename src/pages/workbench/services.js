import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/invoice/submit/list`,
  myList: `${APP_API}/cost/invoice/template/listForUser`,
  costCateList: `${APP_API}/cost/invoice/template/listForUser`,
  del: `${APP_API}/cost/invoice/submit/del`,
  ejectFrame: `${APP_API}/cost/eject/frame`,
};
