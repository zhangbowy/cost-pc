import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/office/pc`,
  detailList: `${APP_API}/cost/statistics/v2/office/list`,
  export: `${APP_API}/cost/export/office/pc`,
};
