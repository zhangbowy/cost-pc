import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/supplier/pc`,
  detailList: `${APP_API}/cost/statistics/v2/supplier/list`,
  export: `${APP_API}/cost/export/supplier/pc`,
  chart: `${APP_API}/cost/statistics/v2/supplier/pie/chart`,
};
