import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v3/pc/customQuery/list`,
  detailList: `${APP_API}/cost/statistics/v3/pc/customQuery/detail`,
  export: `${APP_API}/cost/export/supplier/pc`,
  chart: `${APP_API}/cost/statistics/v3/pc/customQuery/detail`,
};
