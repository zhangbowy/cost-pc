import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/standard/list`,
  del: `${APP_API}/cost/standard/del`,
};
