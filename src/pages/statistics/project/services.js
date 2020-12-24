import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/project/pc`,
  detailList: `${APP_API}/cost/statistics/v2/project/list`,
  export: `${APP_API}/cost/export/project/pc`,
  chart: `${APP_API}/cost/statistics/v2/project/category`,
};
