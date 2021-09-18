import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v3/pc/detail`,
  edit: `${APP_API}/cost/statistics/v3/modifyMonth`,
  exports: `${APP_API}/cost/export/v3/statistics`,
  detail: `${APP_API}/cost/account/receipt/detail`,
  recordList: `${APP_API}/cost/statistics/v3/modifyMonth/recordList`,
};
