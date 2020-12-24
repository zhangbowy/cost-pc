import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/category/pc`,
  detailList: `${APP_API}/cost/statistics/v2/category/list`,
  export: `${APP_API}/cost/export/category/pc`,
};
