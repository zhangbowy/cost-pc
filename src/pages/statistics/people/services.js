import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/staff/pc`,
  detailList: `${APP_API}/cost/statistics/v2/staff/list`,
  export: `${APP_API}/cost/export/staff/pc`,
};
