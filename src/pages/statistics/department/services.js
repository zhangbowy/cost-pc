import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/statistics/v2/dept/pc`,
  detailList: `${APP_API}/cost/statistics/v2/dept/list`,
};
