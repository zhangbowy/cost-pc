import constants from '@/utils/constants';

const { APP_API } = constants;

export default {
  list: `${APP_API}/cost/oneKeyDing/info`,
  add: `${APP_API}/cost/oneKeyDing/record`,
};
